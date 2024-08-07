import { defineComponent, ref, PropType, h, reactive, provide, watch, nextTick, computed } from 'vue'
import { VxeUI, getConfig, createEvent } from '../../ui'
import { errLog } from '../../ui/src/log'
import { toCssUnit } from '../../ui/src/dom'
import { getSlotVNs } from '../../ui/src/vn'
import VxeLoadingComponent from '../../loading/src/loading'
import XEUtils from 'xe-utils'

import type { ListViewReactData, ListViewPrivateRef, VxeListViewPropTypes, VxeGridComponent, VxeGridInstance, VxeGridPropTypes, VxeGridProps, VxeListViewEmits, VxeListViewPrivateComputed, VxeListViewConstructor, VxeListDesignDefines, ListViewMethods, ListViewPrivateMethods, VxeListViewPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeListView',
  props: {
    config: Object as PropType<VxeListViewPropTypes.Config>,
    height: {
      type: [String, Number] as PropType<VxeListViewPropTypes.Height>,
      default: () => getConfig().listView.height
    },
    loading: Boolean as PropType<VxeListViewPropTypes.Loading>,
    gridOptions: Object as PropType<VxeListViewPropTypes.GridOptions>,
    gridEvents: Object as PropType<VxeListViewPropTypes.GridEvents>,
    viewRender: Object as PropType<VxeListViewPropTypes.ViewRender>
  },
  emits: [
  ] as VxeListViewEmits,
  setup (props, context) {
    const VxeTableGridComponent = VxeUI.getComponent<VxeGridComponent>('VxeGrid')

    const { emit, slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()
    const refGrid = ref<VxeGridInstance>()

    const reactData = reactive<ListViewReactData>({
      searchFormItems: [],
      listTableColumns: []
    })

    const computeGridOptions = computed<VxeGridProps>(() => {
      const { gridOptions } = props
      const { listTableColumns } = reactData
      const gridOpts = gridOptions || {}
      const columnOpts = Object.assign({
        minWidth: 80
      }, gridOpts.columnConfig)
      let proxyOpts: VxeGridPropTypes.ProxyConfig | undefined
      if (gridOpts.proxyConfig) {
        proxyOpts = Object.assign({ autoLoad: false }, gridOpts.proxyConfig)
      }
      return Object.assign({}, gridOpts, {
        columns: listTableColumns,
        columnConfig: columnOpts,
        proxyConfig: proxyOpts
      })
    })

    const computeGridEvents = computed<VxeGridProps>(() => {
      const { gridEvents } = props
      const ons: Record<string, any> = {}
      XEUtils.each(gridEvents, (fn, key) => {
        ons[XEUtils.camelCase(`on-${key}`)] = fn
      })
      return ons
    })

    const refMaps: ListViewPrivateRef = {
      refElem,
      refGrid
    }

    const computeMaps: VxeListViewPrivateComputed = {
    }

    const $xeListView = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeListViewConstructor & VxeListViewPrivateMethods

    const configToSearchItems = (searchItems: VxeListDesignDefines.SearchItemObjItem[]): VxeListDesignDefines.SearchItemObjItem[] => {
      if (searchItems) {
        return searchItems.map(item => {
          return {
            field: item.field,
            title: item.title
          }
        })
      }
      return []
    }

    const configToListColumns = (listColumns: VxeListDesignDefines.ListColumnObjItem[]): VxeListDesignDefines.ListColumnObjItem[] => {
      if (listColumns) {
        return listColumns.map(item => {
          return {
            field: item.field,
            title: item.title,
            visible: !!item.visible
          }
        })
      }
      return []
    }

    const clearConfig = () => {
      reactData.searchFormItems = []
      reactData.listTableColumns = []
      return nextTick()
    }

    const loadConfig = (config: Partial<VxeListDesignDefines.ListDesignConfig> | null) => {
      if (config) {
        const { formConfig, searchItems, listColumns } = config
        setSearchItems(searchItems || [])
        loadListColumns(listColumns || [], formConfig || {})
      }
      return nextTick()
    }

    const parseFormItems = (searchItems: VxeListDesignDefines.SearchItemObjItem[]) => {
      const formItems = configToSearchItems(searchItems || [])
      return formItems
    }

    const parseTableColumn = (listColumns: VxeListDesignDefines.ListColumnObjItem[], formConfig?: VxeListDesignDefines.DefaultSettingFormDataObjVO) => {
      const formOpts = Object.assign({}, formConfig)
      const columns: VxeGridPropTypes.Columns = configToListColumns(listColumns || [])
      if (formOpts.showSeq) {
        columns.unshift({
          type: 'seq',
          width: 70
        })
      }
      return columns
    }

    const parseConfig = (config: Partial<VxeListDesignDefines.ListDesignConfig> | null) => {
      const { formConfig, searchItems, listColumns } = config || {}
      return {
        formItems: parseFormItems(searchItems || []),
        tableColumns: parseTableColumn(listColumns || [], formConfig)
      }
    }

    const commitProxy = (code: string, ...args: any[]) => {
      const $grid = refGrid.value
      if ($grid) {
        return $grid.commitProxy(code, ...args)
      }
      return Promise.resolve()
    }

    const loadListColumns = (listColumns: VxeListDesignDefines.ListColumnObjItem[], formConfig: any) => {
      reactData.listTableColumns = parseTableColumn(listColumns || [], formConfig)
      nextTick(() => {
        const gridOptions = computeGridOptions.value
        if (gridOptions.proxyConfig) {
          commitProxy('reload')
        }
      })
    }

    const setSearchItems = (searchItems: VxeListDesignDefines.SearchItemObjItem[]) => {
      reactData.searchFormItems = configToSearchItems(searchItems)
      return nextTick()
    }

    const listViewMethods: ListViewMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, createEvent(evnt, { $listView: $xeListView }, params))
      },
      clearConfig,
      loadConfig,
      parseConfig,
      commitProxy
    }

    const listViewPrivateMethods: ListViewPrivateMethods = {
    }

    Object.assign($xeListView, listViewMethods, listViewPrivateMethods)

    const renderVN = () => {
      const { height, loading } = props
      const gridSlot = slots.grid
      const gridOptions = computeGridOptions.value
      const gridEvents = computeGridEvents.value

      return h('div', {
        ref: refElem,
        class: ['vxe-list-view', {
          'is--loading': loading
        }],
        style: height
          ? {
              height: toCssUnit(height)
            }
          : null
      }, [
        h('div', {
          class: 'vxe-list-view--body'
        }, [
          gridSlot
            ? h('div', {
              class: 'vxe-list-view--grid-wrapper'
            }, getSlotVNs(gridSlot({ $listView: $xeListView })))
            : h(VxeTableGridComponent, Object.assign({}, gridOptions, gridEvents, {
              ref: refGrid
            }), Object.assign({}, slots, {
              default: undefined
            }))
        ]),
        /**
         * 加载中
         */
        h(VxeLoadingComponent, {
          class: 'vxe-list-view--loading',
          modelValue: loading
        })
      ])
    }

    $xeListView.renderVN = renderVN

    watch(() => props.config, (value) => {
      loadConfig(value || {})
    })

    if (props.config) {
      loadConfig(props.config)
    }

    provide('$xeListView', $xeListView)

    if (process.env.VUE_APP_VXE_ENV === 'development') {
      nextTick(() => {
        if (!VxeTableGridComponent) {
          errLog('vxe.error.reqComp', ['vxe-grid'])
        }
      })
    }

    return $xeListView
  },
  render () {
    return this.renderVN()
  }
})
