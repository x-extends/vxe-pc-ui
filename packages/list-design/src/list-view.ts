import { defineComponent, ref, PropType, h, reactive, provide, watch, nextTick, computed, createCommentVNode } from 'vue'
import { VxeUI, getConfig, createEvent, getI18n, renderer } from '../../ui'
import { errLog } from '../../ui/src/log'
import { toCssUnit } from '../../ui/src/dom'
import { getSlotVNs } from '../../ui/src/vn'
import { createListDesignActionButton } from '../render/util'
import VxeLoadingComponent from '../../loading/src/loading'
import XEUtils from 'xe-utils'

import type { ListViewReactData, ListViewPrivateRef, VxeListViewPropTypes, VxeGridComponent, VxeGridInstance, VxeGridPropTypes, VxeGridProps, VxeListViewEmits, VxeListViewPrivateComputed, VxeListViewConstructor, VxeListDesignDefines, ListViewMethods, ListViewPrivateMethods, VxeGlobalRendererHandles, VxeTableDefines, VxeListViewPrivateMethods, VxeButtonGroupDefines, VxeButtonGroupPropTypes, ValueOf } from '../../../types'

export default defineComponent({
  name: 'VxeListView',
  props: {
    config: Object as PropType<VxeListViewPropTypes.Config>,
    height: {
      type: [String, Number] as PropType<VxeListViewPropTypes.Height>,
      default: () => getConfig().listView.height
    },
    loading: Boolean as PropType<VxeListViewPropTypes.Loading>,
    actionButtons: Array as PropType<VxeListViewPropTypes.ActionButtons>,
    gridOptions: Object as PropType<VxeListViewPropTypes.GridOptions>,
    gridEvents: Object as PropType<VxeListViewPropTypes.GridEvents>,
    viewRender: Object as PropType<VxeListViewPropTypes.ViewRender>
  },
  emits: [
    'cell-action',
    'update:actionButtons'
  ] as VxeListViewEmits,
  setup (props, context) {
    const VxeTableGridComponent = VxeUI.getComponent<VxeGridComponent>('VxeGrid')

    const { emit, slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()
    const refGrid = ref<VxeGridInstance>()

    const reactData = reactive<ListViewReactData>({
      searchFormItems: [],
      listTableColumns: [],
      tableColumns: []
    })

    const computeGridOptions = computed<VxeGridProps>(() => {
      const { gridOptions } = props
      const { tableColumns } = reactData
      const gridOpts = gridOptions || {}
      const columnOpts = Object.assign({
        minWidth: 80
      }, gridOpts.columnConfig)
      let proxyOpts: VxeGridPropTypes.ProxyConfig | undefined
      if (gridOpts.proxyConfig) {
        proxyOpts = Object.assign({ autoLoad: false }, gridOpts.proxyConfig)
      }
      return Object.assign({}, gridOpts, {
        columns: tableColumns,
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

    const systemConfigList: VxeGlobalRendererHandles.CreateListDesignSettingActionButtonConfigResult[] = []
    const customConfigList: VxeGlobalRendererHandles.CreateListDesignSettingActionButtonConfigResult[] = []
    renderer.forEach((item, name) => {
      const { createListDesignSettingActionButtonConfig } = item
      if (createListDesignSettingActionButtonConfig) {
        const params = { name }
        const btnConfig = Object.assign(createListDesignActionButton({ code: name }), createListDesignSettingActionButtonConfig(params))
        if (btnConfig.type === 'custom') {
          customConfigList.push(btnConfig)
        } else {
          systemConfigList.push(btnConfig)
        }
      }
    })

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
            widgetName: item.widgetName,
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
      reactData.tableColumns = []
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
      const { showSeq, actionButtonList } = formOpts
      const columns: VxeGridPropTypes.Columns = configToListColumns(listColumns || [])
      const cellActionSlot = slots.cellAction

      if (showSeq) {
        columns.unshift({
          type: 'seq',
          field: '_seq',
          width: 70
        })
      }
      if (actionButtonList && actionButtonList.length) {
        const actionColumn: VxeTableDefines.ColumnOptions = {
          field: '_active',
          title: getI18n('vxe.table.actionTitle'),
          width: 'auto'
        }

        const btnOptions: VxeButtonGroupPropTypes.Options = []
        actionButtonList.forEach(btnItem => {
          if (btnItem.type === 'custom') {
            return {
              content: btnItem.name,
              name: btnItem.code,
              icon: btnItem.icon
            }
          }
          const btnConfig = systemConfigList.find(item => item.code === btnItem.code)
          let btnName = btnItem.name
          let btnIcon = btnItem.icon
          let btnStatus = btnItem.status
          let btnPermissionCode = btnItem.permissionCode
          let btnClassify = btnItem.classify
          if (btnConfig) {
            const nameConfig = btnConfig.name
            btnIcon = btnConfig.icon || ''
            btnStatus = btnConfig.status || ''
            btnPermissionCode = btnConfig.permissionCode || ''
            btnClassify = btnConfig.classify || ''
            btnName = XEUtils.toValueString(XEUtils.isFunction(nameConfig) ? nameConfig({ name: btnConfig.code || '' }) : nameConfig)
          }
          if (!btnClassify || btnClassify === 'cellButton') {
            btnOptions.push({
              content: btnName,
              name: btnItem.code,
              icon: btnIcon,
              status: btnStatus,
              permissionCode: btnPermissionCode
            })
          }
        })

        if (cellActionSlot) {
          actionColumn.slots = {
            default (params) {
              return cellActionSlot({ ...params, buttons: btnOptions })
            }
          }
        } else {
          actionColumn.cellRender = {
            name: 'VxeButtonGroup',
            props: {
              mode: 'text'
            },
            options: btnOptions,
            events: {
              click (params, btnParams: VxeButtonGroupDefines.ClickEventParams) {
                const { option } = btnParams
                dispatchEvent('cell-action', { ...params, button: option }, btnParams.$event)
              }
            }
          }
        }
        columns.push(actionColumn)
      }
      return { columns, actionButtons: actionButtonList }
    }

    const parseConfig = (config: Partial<VxeListDesignDefines.ListDesignConfig> | null) => {
      const { formConfig, searchItems, listColumns } = config || {}
      const { columns, actionButtons } = parseTableColumn(listColumns || [], formConfig)
      return {
        formItems: parseFormItems(searchItems || []),
        tableColumns: columns,
        actionButtons
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
      const listTableColumns = listColumns || []
      const { columns, actionButtons } = parseTableColumn(listTableColumns, formConfig)
      reactData.listTableColumns = listTableColumns
      reactData.tableColumns = columns
      emit('update:actionButtons', actionButtons)
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

    const dispatchEvent = (type: ValueOf<VxeListViewEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $listView: $xeListView }, params))
    }

    const listViewMethods: ListViewMethods = {
      dispatchEvent,
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
            : (VxeTableGridComponent
                ? h(VxeTableGridComponent, Object.assign({}, gridOptions, gridEvents, {
                  ref: refGrid
                }), Object.assign({}, slots, {
                  default: undefined
                }))
                : createCommentVNode())
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
