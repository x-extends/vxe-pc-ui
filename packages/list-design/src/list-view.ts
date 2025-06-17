import { ref, PropType, h, reactive, provide, watch, nextTick, computed } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { VxeUI, getConfig, createEvent, getI18n, renderer, useSize, renderEmptyElement } from '../../ui'
import { errLog } from '../../ui/src/log'
import { toCssUnit } from '../../ui/src/dom'
import { getSlotVNs } from '../../ui/src/vn'
import { createListDesignActionButton } from '../render/util'
import VxeLoadingComponent from '../../loading/src/loading'
import XEUtils from 'xe-utils'

import type { ListViewReactData, ListViewPrivateRef, VxeListViewPropTypes, VxeListViewDefines, VxeListViewEmits, VxeListViewPrivateComputed, VxeListViewConstructor, VxeListDesignDefines, ListViewMethods, ListViewPrivateMethods, VxeGlobalRendererHandles, VxeListViewPrivateMethods, VxeButtonGroupDefines, VxeButtonGroupPropTypes, ValueOf } from '../../../types'
import type { VxeGridComponent, VxeGridInstance, VxeGridPropTypes, VxeGridProps } from '../../../types/components/grid'
import type { VxeTableDefines } from '../../../types/components/table'

export default defineVxeComponent({
  name: 'VxeListView',
  props: {
    size: {
      type: String as PropType<VxeListViewPropTypes.Size>,
      default: () => getConfig().listView.size || getConfig().size
    },
    config: Object as PropType<VxeListViewPropTypes.Config>,
    height: {
      type: [String, Number] as PropType<VxeListViewPropTypes.Height>,
      default: () => getConfig().listView.height
    },
    loading: Boolean as PropType<VxeListViewPropTypes.Loading>,
    formData: Object as PropType<VxeListViewPropTypes.FormData>,
    actionButtons: Array as PropType<VxeListViewPropTypes.ActionButtons>,
    gridOptions: Object as PropType<VxeListViewPropTypes.GridOptions>,
    gridEvents: Object as PropType<VxeListViewPropTypes.GridEvents>,
    viewRender: Object as PropType<VxeListViewPropTypes.ViewRender>
  },
  emits: [
    'cell-action',
    'update:formData',
    'update:actionButtons'
  ] as VxeListViewEmits,
  setup (props, context) {
    const VxeTableGridComponent = VxeUI.getComponent<VxeGridComponent>('VxeGrid')

    const { emit, slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()
    const refGrid = ref<VxeGridInstance>()

    const { computeSize } = useSize(props)

    const reactData = reactive<ListViewReactData>({
      formConfig: {} as VxeListDesignDefines.DefaultSettingFormDataObjVO,
      searchFormData: {},
      searchFormItems: [],
      listTableColumns: [],
      tableColumns: [],
      footerData: [
        {} // 默认一行合计
      ]
    })

    const computeGridOptions = computed<VxeGridProps>(() => {
      const { gridOptions } = props
      const { formConfig, tableColumns, searchFormData, searchFormItems, footerData } = reactData
      const { showStatistics } = formConfig
      const gridOpts = gridOptions || {}
      const columnOpts = Object.assign({
        minWidth: 120
      }, gridOpts.columnConfig)
      let proxyOpts: VxeGridPropTypes.ProxyConfig | undefined
      if (gridOpts.proxyConfig) {
        proxyOpts = Object.assign({ autoLoad: false }, gridOpts.proxyConfig)
      }
      return Object.assign({}, gridOpts, {
        columns: tableColumns,
        columnConfig: columnOpts,
        showFooter: showStatistics,
        footerData: showStatistics ? footerData : null,
        formConfig: {
          data: searchFormData,
          items: searchFormItems
        },
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
      computeSize
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

    const configToSearchItems = (searchItems: VxeListDesignDefines.SearchItemObjItem[]): {
      data: Record<string, any>
      items: VxeListDesignDefines.SearchItemObjItem[]
    } => {
      if (searchItems && searchItems.length) {
        const data: Record<string, any> = {}
        const items: VxeListDesignDefines.SearchItemObjItem[] = searchItems.map(item => {
          data[item.field] = null
          return {
            field: item.field,
            title: item.title,
            folding: item.folding,
            itemRender: item.itemRender
          }
        })
        items.push({
          field: 'active',
          title: '',
          folding: false,
          collapseNode: searchItems.some(item => item.folding),
          itemRender: {
            name: 'VxeButtonGroup',
            options: [
              { content: '查询', icon: 'vxe-icon-search', status: 'primary', type: 'submit' },
              { content: '重置', icon: 'vxe-icon-repeat', type: 'reset' }
            ]
          }
        })
        return {
          items,
          data
        }
      }
      return { items: [], data: {} }
    }

    const configToListColumns = (listColumns: VxeListDesignDefines.ListColumnObjItem[]): VxeListDesignDefines.ListColumnObjItem[] => {
      if (listColumns) {
        return listColumns.map(item => {
          return {
            field: item.field,
            title: item.title,
            visible: !!item.visible,
            width: item.width,
            cellRender: XEUtils.clone(item.cellRender)
          }
        })
      }
      return []
    }

    const clearConfig = () => {
      emit('update:formData', {})
      Object.assign(reactData, {
        formConfig: {} as VxeListDesignDefines.DefaultSettingFormDataObjVO,
        searchFormData: {},
        searchFormItems: [],
        listTableColumns: [],
        tableColumns: [],
        footerData: [
          {} // 默认一行合计
        ]
      })
      return nextTick()
    }

    const loadConfig = (config: Partial<VxeListDesignDefines.ListDesignConfig> | null) => {
      if (config) {
        const { formConfig, searchItems, listColumns } = config
        reactData.formConfig = formConfig || {} as VxeListDesignDefines.DefaultSettingFormDataObjVO
        setSearchItems(searchItems || [])
        loadListColumns(listColumns || [])
      }
      return nextTick()
    }

    const parseForm = (searchItems: VxeListDesignDefines.SearchItemObjItem[]) => {
      return configToSearchItems(searchItems || [])
    }

    const parseTableColumn = (listColumns: VxeListDesignDefines.ListColumnObjItem[], formConfig: VxeListDesignDefines.DefaultSettingFormDataObjVO) => {
      const formOpts = Object.assign({}, formConfig)
      const { showSeq, actionButtonList } = formOpts
      const columns: VxeGridPropTypes.Columns = []
      const rowRecord: Record<string, any> = {}
      const cellActionSlot = slots.cellAction
      const footerCellSlot = slots.footerCell

      if (showSeq) {
        columns.push({
          type: 'seq',
          field: '_seq',
          fixed: 'left',
          width: 70
        })
      }

      configToListColumns(listColumns || []).forEach(conf => {
        const columnConf: VxeTableDefines.ColumnOptions = { ...conf }
        if (formOpts.showStatistics && footerCellSlot) {
          columnConf.slots = {
            footer: (params) => {
              return footerCellSlot({ ...params })
            }
          }
        }
        if (columnConf.field) {
          rowRecord[columnConf.field] = null
        }
        columns.push(columnConf)
      })

      if (actionButtonList && actionButtonList.length) {
        const actionColumn: VxeTableDefines.ColumnOptions = {
          field: '_active',
          title: getI18n('vxe.table.actionTitle'),
          fixed: 'right',
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
      return { rowRecord, columns, actionButtons: actionButtonList }
    }

    const parseConfig = (config: Partial<VxeListDesignDefines.ListDesignConfig> | null) => {
      const { formConfig, searchItems, listColumns } = config || {}
      const { columns, rowRecord, actionButtons } = parseTableColumn(listColumns || [], formConfig || reactData.formConfig)
      const { data, items } = parseForm(searchItems || [])
      return {
        formData: data,
        formItems: items,
        tableColumns: columns,
        tableRecord: rowRecord,
        actionButtons
      }
    }

    const getTableRecord = (configOrListColumns: Partial<VxeListDesignDefines.ListDesignConfig> | VxeListDesignDefines.ListColumnObjItem[] | null | undefined) => {
      if (XEUtils.isArray(configOrListColumns)) {
        const { rowRecord } = parseTableColumn(configOrListColumns, reactData.formConfig)
        return rowRecord
      }
      if (configOrListColumns) {
        const { formConfig, listColumns } = configOrListColumns
        const { rowRecord } = parseTableColumn(listColumns || [], formConfig || reactData.formConfig)
        return rowRecord
      }
      return {}
    }

    const getQueryFilter = () => {
      const { searchFormData, searchFormItems } = reactData
      const items: VxeListViewDefines.QueryFilterItem[] = []
      const rest: VxeListViewDefines.QueryFilterResult = {
        items,
        type: 'and'
      }
      const $grid = refGrid.value
      if (!$grid) {
        return rest
      }
      searchFormItems.forEach(item => {
        const { field } = item
        const itemValue = searchFormData[field]
        if (itemValue) {
          const condition: VxeListViewDefines.QueryFilterCondition[] = []
          condition.push({
            field,
            value: itemValue,
            match: 'exact',
            type: XEUtils.isArray(itemValue) ? 'array' : ''
          })
          items.push({
            condition,
            type: 'and'
          })
        }
      })
      return rest
    }

    const commitProxy = (code: string, ...args: any[]) => {
      const $grid = refGrid.value
      if ($grid) {
        return $grid.commitProxy(code, ...args)
      }
      return Promise.resolve()
    }

    const loadListColumns = (listColumns: VxeListDesignDefines.ListColumnObjItem[]) => {
      const { formConfig } = reactData
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
      const { data, items } = configToSearchItems(searchItems)
      reactData.searchFormData = data
      reactData.searchFormItems = items
      emit('update:formData', data)
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
      getTableRecord,
      getQueryFilter,
      commitProxy
    }

    const listViewPrivateMethods: ListViewPrivateMethods = {
    }

    Object.assign($xeListView, listViewMethods, listViewPrivateMethods)

    const renderVN = () => {
      const { height, loading } = props
      const vSize = computeSize.value
      const gridSlot = slots.grid
      const gridOptions = computeGridOptions.value
      const gridEvents = computeGridEvents.value

      return h('div', {
        ref: refElem,
        class: ['vxe-list-view', {
          [`size--${vSize}`]: vSize,
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
                : renderEmptyElement($xeListView))
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

    watch(() => props.config, (value) => {
      loadConfig(value || {})
    })

    if (props.config) {
      loadConfig(props.config)
    }

    provide('$xeListView', $xeListView)

    nextTick(() => {
      if (!VxeTableGridComponent) {
        errLog('vxe.error.reqComp', ['vxe-grid'])
      }
    })

    $xeListView.renderVN = renderVN

    return $xeListView
  },
  render () {
    return this.renderVN()
  }
})
