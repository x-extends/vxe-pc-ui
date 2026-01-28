import { CreateElement, PropType, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI, getConfig, getIcon, globalEvents, getI18n, createEvent, renderEmptyElement, globalMixins } from '../../ui'
import { getEventTargetNode, updatePanelPlacement, toCssUnit } from '../../ui/src/dom'
import { getOnName } from '../../ui/src/vn'
import { getLastZIndex, nextZIndex } from '../../ui/src/utils'
import { errLog } from '../../ui/src/log'
import VxeInputComponent from '../../input/src/input'

import type { TableSelectReactData, VxeTableSelectPropTypes, TableSelectInternalData, VxeTableSelectEmits, VxeInputConstructor, VxeFormDefines, ValueOf, VxeComponentStyleType, VxeComponentSizeType, VxeModalConstructor, VxeModalMethods, VxeDrawerConstructor, VxeDrawerMethods, VxeFormConstructor, VxeFormPrivateMethods } from '../../../types'
import type { VxeTableConstructor, VxeTablePrivateMethods, VxeTablePropTypes } from '../../../types/components/table'
import type { VxeGridInstance, VxeGridDefines, VxeGridPropTypes } from '../../../types/components/grid'

export function getRowUniqueId () {
  return XEUtils.uniqueId('row_')
}

function createInternalData (): TableSelectInternalData {
  return {
    // hpTimeout: undefined,
    // vpTimeout: undefined,
    fullRowMaps: {}
  }
}

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeTableSelect',
  mixins: [
    globalMixins.sizeMixin
  ],
  model: {
    prop: 'value',
    event: 'modelValue'
  },
  props: {
    value: [String, Number, Array] as PropType<VxeTableSelectPropTypes.ModelValue>,
    clearable: Boolean as PropType<VxeTableSelectPropTypes.Clearable>,
    placeholder: {
      type: String as PropType<VxeTableSelectPropTypes.Placeholder>,
      default: () => XEUtils.eqNull(getConfig().tableSelect.placeholder) ? getI18n('vxe.base.pleaseSelect') : getConfig().tableSelect.placeholder
    },
    readonly: {
      type: Boolean as PropType<VxeTableSelectPropTypes.Readonly>,
      default: null
    },
    loading: Boolean as PropType<VxeTableSelectPropTypes.Loading>,
    disabled: {
      type: Boolean as PropType<VxeTableSelectPropTypes.Disabled>,
      default: null
    },
    multiple: Boolean as PropType<VxeTableSelectPropTypes.Multiple>,
    className: [String, Function] as PropType<VxeTableSelectPropTypes.ClassName>,
    prefixIcon: String as PropType<VxeTableSelectPropTypes.PrefixIcon>,
    placement: String as PropType<VxeTableSelectPropTypes.Placement>,
    columns: Array as PropType<VxeTableSelectPropTypes.Columns>,
    options: Array as PropType<VxeTableSelectPropTypes.Options>,
    optionProps: Object as PropType<VxeTableSelectPropTypes.OptionProps>,
    lazyOptions: Array as PropType<VxeTableSelectPropTypes.LazyOptions>,
    zIndex: Number as PropType<VxeTableSelectPropTypes.ZIndex>,
    size: {
      type: String as PropType<VxeTableSelectPropTypes.Size>,
      default: () => getConfig().tableSelect.size || getConfig().size
    },
    popupConfig: Object as PropType<VxeTableSelectPropTypes.PopupConfig>,
    gridConfig: Object as PropType<VxeTableSelectPropTypes.GridConfig>,
    transfer: {
      type: Boolean as PropType<VxeTableSelectPropTypes.Transfer>,
      default: null
    }
  },
  inject: {
    $xeModal: {
      default: null
    },
    $xeDrawer: {
      default: null
    },
    $xeTable: {
      default: null
    },
    $xeForm: {
      default: null
    },
    formItemInfo: {
      from: 'xeFormItemInfo',
      default: null
    }
  },
  provide () {
    const $xeTableSelect = this
    return {
      $xeTableSelect
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: TableSelectReactData = {
      initialized: false,
      tableColumns: [],
      fullOptionList: [],
      panelIndex: 0,
      panelStyle: {},
      panelPlacement: null,
      triggerFocusPanel: false,
      visiblePanel: false,
      isAniVisible: false,
      isActivated: false
    }

    const internalData: TableSelectInternalData = createInternalData()

    const gridEvents: Record<string, any> = {}

    return {
      xID,
      reactData,
      internalData,
      gridEvents
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
      $xeModal(): (VxeModalConstructor & VxeModalMethods) | null
      $xeDrawer(): (VxeDrawerConstructor & VxeDrawerMethods) | null
      $xeTable(): (VxeTableConstructor & VxeTablePrivateMethods) | null
      $xeForm(): (VxeFormConstructor & VxeFormPrivateMethods) | null
      formItemInfo(): VxeFormDefines.ProvideItemInfo | null
    }),
    computeFormReadonly () {
      const $xeTableSelect = this
      const props = $xeTableSelect
      const $xeForm = $xeTableSelect.$xeForm

      const { readonly } = props
      if (readonly === null) {
        if ($xeForm) {
          return $xeForm.readonly
        }
        return false
      }
      return readonly
    },
    computeIsDisabled () {
      const $xeTableSelect = this
      const props = $xeTableSelect
      const $xeForm = $xeTableSelect.$xeForm

      const { disabled } = props
      if (disabled === null) {
        if ($xeForm) {
          return $xeForm.disabled
        }
        return false
      }
      return disabled
    },
    computeBtnTransfer () {
      const $xeTableSelect = this
      const props = $xeTableSelect
      const $xeForm = $xeTableSelect.$xeForm
      const $xeTable = $xeTableSelect.$xeTable
      const $xeModal = $xeTableSelect.$xeModal
      const $xeDrawer = $xeTableSelect.$xeDrawer

      const { transfer } = props
      const popupOpts = $xeTableSelect.computePopupOpts as VxeTableSelectPropTypes.PopupConfig
      if (XEUtils.isBoolean(popupOpts.transfer)) {
        return popupOpts.transfer
      }
      if (transfer === null) {
        const globalTransfer = getConfig().tableSelect.transfer
        if (XEUtils.isBoolean(globalTransfer)) {
          return globalTransfer
        }
        if ($xeTable || $xeModal || $xeDrawer || $xeForm) {
          return true
        }
      }
      return transfer
    },
    computePropsOpts () {
      const $xeTableSelect = this
      const props = $xeTableSelect

      return props.optionProps || {} as VxeTableSelectPropTypes.OptionProps
    },
    computeRowOpts () {
      const $xeTableSelect = this

      const gridOpts = $xeTableSelect.computeGridOpts as VxeTableSelectPropTypes.GridConfig
      return Object.assign({}, gridOpts.rowConfig, {
        isCurrent: true
      }) as VxeTablePropTypes.RowConfig
    },
    computeRowKeyField () {
      const $xeTableSelect = this

      const rowOpts = $xeTableSelect.computeRowOpts as VxeTablePropTypes.RowConfig
      return rowOpts.keyField || '_X_ROW_KEY'
    },
    computeLabelField () {
      const $xeTableSelect = this

      const propsOpts = $xeTableSelect.computePropsOpts as VxeTableSelectPropTypes.OptionProps
      return propsOpts.label || 'label'
    },
    computeValueField () {
      const $xeTableSelect = this

      const propsOpts = $xeTableSelect.computePropsOpts as VxeTableSelectPropTypes.OptionProps
      return propsOpts.value || 'value'
    },
    computePopupOpts () {
      const $xeTableSelect = this
      const props = $xeTableSelect

      return Object.assign({}, getConfig().tableSelect.popupConfig, props.popupConfig)
    },
    computeGridOpts () {
      const $xeTableSelect = this
      const props = $xeTableSelect

      return Object.assign({}, getConfig().tableSelect.gridConfig, props.gridConfig, {
        data: undefined
      })
    },
    computeSelectGridOpts () {
      const $xeTableSelect = this

      const gridOpts = $xeTableSelect.computeGridOpts as VxeTableSelectPropTypes.GridConfig
      const { pagerConfig, proxyConfig } = gridOpts
      if (proxyConfig) {
        const proxyAjax = proxyConfig.ajax
        if (proxyAjax && proxyAjax.query) {
          const newProxyConfig = XEUtils.clone(proxyConfig, true) as Required<VxeGridPropTypes.ProxyConfig>
          const ajaxMethods = proxyAjax.query
          if (ajaxMethods) {
            const resConfigs = proxyConfig.response || proxyConfig.props || {}
            Object.assign(newProxyConfig.ajax, {
              query (params: VxeGridPropTypes.ProxyAjaxQueryParams, ...args: any[]) {
                return Promise.resolve(ajaxMethods(params, ...args)).then(rest => {
                  let tableData = []
                  if (pagerConfig) {
                    const resultProp = resConfigs.result
                    tableData = (XEUtils.isFunction(resultProp) ? resultProp({ data: rest, $table: null as any, $grid: null, $gantt: null }) : XEUtils.get(rest, resultProp || 'result')) || []
                  } else {
                    const listProp = resConfigs.list
                    tableData = (listProp ? (XEUtils.isFunction(listProp) ? listProp({ data: rest, $table: null as any, $grid: null, $gantt: null }) : XEUtils.get(rest, listProp)) : rest) || []
                  }
                  $xeTableSelect.cacheDataMap(tableData || [])
                  return rest
                })
              }
            })
          }
          return Object.assign({}, gridOpts, { proxyConfig: newProxyConfig })
        }
      }
      return gridOpts
    },
    computeSelectLabel () {
      const $xeTableSelect = this
      const props = $xeTableSelect
      const reactData = ($xeTableSelect as any).reactData as TableSelectReactData
      const internalData = ($xeTableSelect as any).internalData as TableSelectInternalData

      const { value, lazyOptions } = props
      const { fullOptionList } = reactData
      const { fullRowMaps } = internalData
      const valueField = $xeTableSelect.computeValueField as string
      const labelField = $xeTableSelect.computeLabelField as string
      if (!fullOptionList) {
        return ''
      }
      return (XEUtils.isArray(value) ? value : [value]).map(val => {
        const cacheItem = fullRowMaps[val]
        if (cacheItem) {
          return cacheItem.item[labelField]
        }
        if (lazyOptions) {
          const lazyItem = lazyOptions.find(item => item[valueField] === val)
          if (lazyItem) {
            return lazyItem[labelField]
          }
        }
        return val
      }).join(', ')
    },
    computePopupWrapperStyle () {
      const $xeTableSelect = this

      const popupOpts = $xeTableSelect.computePopupOpts
      const { height, width } = popupOpts
      const stys: VxeComponentStyleType = {}
      if (width) {
        stys.width = toCssUnit(width)
      }
      if (height) {
        stys.height = toCssUnit(height)
      }
      return stys
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeTableSelectEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeTableSelect = this
      $xeTableSelect.$emit(type, createEvent(evnt, { $tableSelect: $xeTableSelect }, params))
    },
    emitModel  (value: any) {
      const $xeTableSelect = this

      const { _events } = $xeTableSelect as any
      if (_events && _events.modelValue) {
        $xeTableSelect.$emit('modelValue', value)
      } else {
        $xeTableSelect.$emit('model-value', value)
      }
    },
    getRowid (option: any) {
      const $xeTableSelect = this

      const nodeKeyField = $xeTableSelect.computeRowKeyField
      const rowid = option[nodeKeyField]
      return rowid ? encodeURIComponent(rowid) : ''
    },
    getRowsByValue (modelValue: VxeTableSelectPropTypes.ModelValue) {
      const $xeTableSelect = this
      const internalData = $xeTableSelect.internalData

      const { fullRowMaps } = internalData
      const rows: any[] = []
      const vals = XEUtils.eqNull(modelValue) ? [] : (XEUtils.isArray(modelValue) ? modelValue : [modelValue])
      vals.forEach(val => {
        const cacheItem = fullRowMaps[val]
        if (cacheItem) {
          rows.push(cacheItem.item)
        }
      })
      return rows
    },
    updateModel (modelValue: VxeTableSelectPropTypes.ModelValue) {
      const $xeTableSelect = this
      const props = $xeTableSelect

      const { multiple } = props
      $xeTableSelect.$nextTick(() => {
        const $grid = $xeTableSelect.$refs.refGrid as VxeGridInstance
        if ($grid) {
          const selectList = $xeTableSelect.getRowsByValue(modelValue)
          if (selectList.length) {
            if (multiple) {
              $grid.setCheckboxRow(selectList, true)
            } else {
              $grid.setRadioRow(selectList[0])
            }
          }
        }
      })
    },
    loadTableColumn (columns?: VxeTableSelectPropTypes.Columns) {
      const $xeTableSelect = this
      const props = $xeTableSelect
      const reactData = $xeTableSelect.reactData

      if (!columns || !columns.length) {
        return
      }
      const { multiple } = props
      const tableCols: VxeTableSelectPropTypes.Columns = []
      let hasRadioCol = false
      let hasCheckboxCol = false
      columns.forEach(column => {
        if (!hasRadioCol && column.type === 'radio') {
          hasRadioCol = true
        } else if (!hasCheckboxCol && column.type === 'checkbox') {
          hasCheckboxCol = true
        }
        tableCols.push(column)
      })
      if (multiple) {
        if (!hasCheckboxCol) {
          tableCols.unshift({
            type: 'checkbox',
            width: 70
          })
        }
      } else {
        if (!hasRadioCol) {
          tableCols.unshift({
            type: 'radio',
            width: 70
          })
        }
      }
      reactData.tableColumns = tableCols
    },
    cacheDataMap (dataList?: any[]) {
      const $xeTableSelect = this
      const props = $xeTableSelect
      const reactData = $xeTableSelect.reactData
      const internalData = $xeTableSelect.internalData

      const { options } = props
      const rowKeyField = $xeTableSelect.computeRowKeyField
      const valueField = $xeTableSelect.computeValueField
      const gridOpts = $xeTableSelect.computeGridOpts
      const { treeConfig, pagerConfig } = gridOpts
      const rowMaps: Record<string, {
        item: any
        index: number
        items: any[]
        parent: any
        nodes: any[]
      }> = {}
      const keyMaps: Record<string, boolean> = {}
      if (treeConfig) {
        // x
      } else {
        XEUtils.arrayEach(dataList || options || [], (item, index, items) => {
          let rowid = $xeTableSelect.getRowid(item)
          if (!rowid) {
            rowid = getRowUniqueId()
          }
          if (keyMaps[rowid]) {
            errLog('vxe.error.repeatKey', [`[table-select] ${rowKeyField}`, rowid])
          }
          keyMaps[rowid] = true
          const value = item[valueField]
          if (rowMaps[value]) {
            errLog('vxe.error.repeatKey', [`[table-select] ${valueField}`, value])
          }
          rowMaps[value] = { item, index, items, parent: null, nodes: [] }
        })
      }
      reactData.fullOptionList = dataList || options || []
      internalData.fullRowMaps = pagerConfig ? Object.assign({}, internalData.fullRowMaps, rowMaps) : rowMaps
      $xeTableSelect.updateModel(props.value)
    },
    updateZindex () {
      const $xeTableSelect = this
      const props = $xeTableSelect
      const reactData = $xeTableSelect.reactData

      const popupOpts = $xeTableSelect.computePopupOpts
      const customZIndex = popupOpts.zIndex || props.zIndex
      if (customZIndex) {
        reactData.panelIndex = XEUtils.toNumber(customZIndex)
      } else if (reactData.panelIndex < getLastZIndex()) {
        reactData.panelIndex = nextZIndex()
      }
    },
    updatePlacement () {
      const $xeTableSelect = this
      const props = $xeTableSelect
      const reactData = $xeTableSelect.reactData

      const { placement } = props
      const { panelIndex } = reactData
      const targetElem = $xeTableSelect.$refs.refElem as HTMLElement
      const panelElem = $xeTableSelect.$refs.refOptionPanel as HTMLDivElement
      const btnTransfer = $xeTableSelect.computeBtnTransfer
      const popupOpts = $xeTableSelect.computePopupOpts
      const handleStyle = () => {
        const ppObj = updatePanelPlacement(targetElem, panelElem, {
          placement: popupOpts.placement || placement,
          teleportTo: btnTransfer
        })
        const panelStyle: { [key: string]: string | number } = Object.assign(ppObj.style, {
          zIndex: panelIndex
        })
        reactData.panelStyle = panelStyle
        reactData.panelPlacement = ppObj.placement
      }
      handleStyle()
      return $xeTableSelect.$nextTick().then(handleStyle)
    },
    showOptionPanel () {
      const $xeTableSelect = this
      const props = $xeTableSelect
      const reactData = $xeTableSelect.reactData
      const internalData = $xeTableSelect.internalData

      const { loading } = props
      const isDisabled = $xeTableSelect.computeIsDisabled
      if (!loading && !isDisabled) {
        if (internalData.vpTimeout) {
          clearTimeout(internalData.vpTimeout)
        }
        if (internalData.hpTimeout) {
          clearTimeout(internalData.hpTimeout)
        }
        if (!reactData.initialized) {
          reactData.initialized = true
          const btnTransfer = $xeTableSelect.computeBtnTransfer
          const panelElem = $xeTableSelect.$refs.refOptionPanel as HTMLElement
          if (btnTransfer) {
            if (panelElem) {
              document.body.appendChild(panelElem)
            }
          }
        }
        reactData.isActivated = true
        reactData.isAniVisible = true
        internalData.vpTimeout = setTimeout(() => {
          reactData.visiblePanel = true
          $xeTableSelect.updateModel(props.value)
          internalData.vpTimeout = undefined
          $xeTableSelect.updatePlacement()
        }, 10)
        $xeTableSelect.updateZindex()
        $xeTableSelect.updatePlacement()
      }
    },
    hideOptionPanel () {
      const $xeTableSelect = this
      const reactData = $xeTableSelect.reactData
      const internalData = $xeTableSelect.internalData

      reactData.visiblePanel = false
      internalData.hpTimeout = setTimeout(() => {
        reactData.isAniVisible = false
      }, 350)
    },
    changeEvent (evnt: Event, selectValue: any, row: any) {
      const $xeTableSelect = this
      const props = $xeTableSelect
      const $xeForm = $xeTableSelect.$xeForm
      const formItemInfo = $xeTableSelect.formItemInfo

      $xeTableSelect.emitModel(selectValue)
      if (selectValue !== props.value) {
        $xeTableSelect.dispatchEvent('change', { value: selectValue, row, option: row }, evnt)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, selectValue)
        }
      }
    },
    clearValueEvent (evnt: Event, selectValue: any) {
      const $xeTableSelect = this

      $xeTableSelect.changeEvent(evnt, selectValue, null)
      $xeTableSelect.dispatchEvent('clear', { value: selectValue }, evnt)
    },
    clearEvent (params: any, evnt: Event) {
      const $xeTableSelect = this

      $xeTableSelect.clearValueEvent(evnt, null)
      $xeTableSelect.hideOptionPanel()
    },
    handleGlobalMousewheelEvent (evnt: MouseEvent) {
      const $xeTableSelect = this
      const reactData = $xeTableSelect.reactData

      const { visiblePanel } = reactData
      const isDisabled = $xeTableSelect.computeIsDisabled
      if (!isDisabled) {
        if (visiblePanel) {
          const panelElem = $xeTableSelect.$refs.refOptionPanel as HTMLDivElement
          if (getEventTargetNode(evnt, panelElem).flag) {
            $xeTableSelect.updatePlacement()
          } else {
            $xeTableSelect.hideOptionPanel()
          }
        }
      }
    },
    handleGlobalMousedownEvent (evnt: MouseEvent) {
      const $xeTableSelect = this
      const reactData = $xeTableSelect.reactData

      const { visiblePanel } = reactData
      const isDisabled = $xeTableSelect.computeIsDisabled
      if (!isDisabled) {
        const el = $xeTableSelect.$refs.refElem as HTMLDivElement
        const panelElem = $xeTableSelect.$refs.refOptionPanel as HTMLDivElement
        reactData.isActivated = getEventTargetNode(evnt, el).flag || getEventTargetNode(evnt, panelElem).flag
        if (visiblePanel && !reactData.isActivated) {
          $xeTableSelect.hideOptionPanel()
        }
      }
    },
    handleGlobalBlurEvent () {
      const $xeTableSelect = this
      const reactData = $xeTableSelect.reactData

      const { visiblePanel, isActivated } = reactData
      if (visiblePanel) {
        $xeTableSelect.hideOptionPanel()
      }
      if (isActivated) {
        reactData.isActivated = false
      }
      if (visiblePanel || isActivated) {
        const $input = $xeTableSelect.$refs.refInput as VxeInputConstructor
        if ($input) {
          $input.blur()
        }
      }
    },
    handleGlobalResizeEvent () {
      const $xeTableSelect = this
      const reactData = $xeTableSelect.reactData

      const { visiblePanel } = reactData
      if (visiblePanel) {
        $xeTableSelect.updatePlacement()
      }
    },
    focusEvent (evnt: FocusEvent) {
      const $xeTableSelect = this
      const reactData = $xeTableSelect.reactData

      const isDisabled = $xeTableSelect.computeIsDisabled
      if (!isDisabled) {
        if (!reactData.visiblePanel) {
          reactData.triggerFocusPanel = true
          $xeTableSelect.showOptionPanel()
          setTimeout(() => {
            reactData.triggerFocusPanel = false
          }, 150)
        }
      }
      $xeTableSelect.dispatchEvent('focus', {}, evnt)
    },
    clickEvent (evnt: MouseEvent) {
      const $xeTableSelect = this

      $xeTableSelect.togglePanelEvent(evnt)
      $xeTableSelect.dispatchEvent('click', {}, evnt)
    },
    blurEvent (evnt: FocusEvent) {
      const $xeTableSelect = this
      const reactData = $xeTableSelect.reactData

      reactData.isActivated = false
      $xeTableSelect.dispatchEvent('blur', {}, evnt)
    },
    togglePanelEvent (params: any) {
      const $xeTableSelect = this
      const reactData = $xeTableSelect.reactData

      const { $event } = params
      $event.preventDefault()
      if (reactData.triggerFocusPanel) {
        reactData.triggerFocusPanel = false
      } else {
        if (reactData.visiblePanel) {
          $xeTableSelect.hideOptionPanel()
        } else {
          $xeTableSelect.showOptionPanel()
        }
      }
    },
    radioChangeEvent (params: VxeGridDefines.RadioChangeEventParams) {
      const $xeTableSelect = this

      const { $event, row } = params
      const valueField = $xeTableSelect.computeValueField
      const value = row[valueField]
      $xeTableSelect.changeEvent($event, value, row)
      $xeTableSelect.hideOptionPanel()
    },
    checkboxChangeEvent (params: VxeGridDefines.CheckboxChangeEventParams) {
      const $xeTableSelect = this

      const { $grid, $event, row } = params
      const valueField = $xeTableSelect.computeValueField
      if ($grid) {
        const checkboxRecords = $grid.getCheckboxRecords()
        const value = checkboxRecords.map(row => {
          return row[valueField]
        })
        $xeTableSelect.changeEvent($event, value, row)
      }
    },
    checkboxAllEvent (params: VxeGridDefines.CheckboxAllEventParams) {
      const $xeTableSelect = this

      $xeTableSelect.checkboxChangeEvent(params)
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const VxeTableGridComponent = VxeUI.getComponent('vxe-grid')

      const $xeTableSelect = this
      const props = $xeTableSelect
      const slots = $xeTableSelect.$scopedSlots
      const reactData = $xeTableSelect.reactData

      const { className, options, loading } = props
      const { initialized, isActivated, isAniVisible, visiblePanel, tableColumns } = reactData
      const vSize = $xeTableSelect.computeSize
      const isDisabled = $xeTableSelect.computeIsDisabled
      const selectLabel = $xeTableSelect.computeSelectLabel
      const btnTransfer = $xeTableSelect.computeBtnTransfer
      const formReadonly = $xeTableSelect.computeFormReadonly
      const popupOpts = $xeTableSelect.computePopupOpts
      const selectGridOpts = $xeTableSelect.computeSelectGridOpts
      const rowOpts = $xeTableSelect.computeRowOpts
      const popupWrapperStyle = $xeTableSelect.computePopupWrapperStyle
      const headerSlot = slots.header
      const footerSlot = slots.footer
      const prefixSlot = slots.prefix
      const ppClassName = popupOpts.className

      if (formReadonly) {
        return h('div', {
          ref: 'refElem',
          class: ['vxe-table-select--readonly', className]
        }, [
          h('span', {
            class: 'vxe-table-select-label'
          }, selectLabel)
        ])
      }
      return h('div', {
        ref: 'refElem',
        class: ['vxe-table-select', className ? (XEUtils.isFunction(className) ? className({ $tableSelect: $xeTableSelect }) : className) : '', {
          [`size--${vSize}`]: vSize,
          'is--visible': visiblePanel,
          'is--disabled': isDisabled,
          'is--loading': loading,
          'is--active': isActivated
        }]
      }, [
        h(VxeInputComponent, {
          ref: 'refInput',
          props: {
            clearable: props.clearable,
            placeholder: props.placeholder,
            readonly: true,
            disabled: isDisabled,
            type: 'text',
            prefixIcon: props.prefixIcon,
            suffixIcon: loading ? getIcon().TABLE_SELECT_LOADED : (visiblePanel ? getIcon().TABLE_SELECT_OPEN : getIcon().TABLE_SELECT_CLOSE),
            value: loading ? getI18n('vxe.select.loadingText') : selectLabel
          },
          on: {
            clear: $xeTableSelect.clearEvent,
            click: $xeTableSelect.clickEvent,
            focus: $xeTableSelect.focusEvent,
            blur: $xeTableSelect.blurEvent,
            'suffix-click': $xeTableSelect.togglePanelEvent
          },
          scopedSlots: prefixSlot
            ? {
                prefix: () => prefixSlot({})
              }
            : {}
        }),
        h('div', {
          ref: 'refOptionPanel',
          class: ['vxe-table--ignore-clear vxe-table-select--panel', ppClassName ? (XEUtils.isFunction(ppClassName) ? ppClassName({ $tableSelect: $xeTableSelect }) : ppClassName) : '', {
            [`size--${vSize}`]: vSize,
            'is--transfer': btnTransfer,
            'ani--leave': !loading && isAniVisible,
            'ani--enter': !loading && visiblePanel
          }],
          attrs: {
            placement: reactData.panelPlacement
          },
          style: reactData.panelStyle
        }, initialized
          ? [
              h('div', {
                class: 'vxe-table-select--panel-wrapper'
              }, [
                headerSlot
                  ? h('div', {
                    class: 'vxe-table-select--panel-header'
                  }, headerSlot({}))
                  : renderEmptyElement($xeTableSelect),
                h('div', {
                  class: 'vxe-table-select--panel-body'
                }, [
                  h('div', {
                    ref: 'refGridWrapper',
                    class: 'vxe-table-select-grid--wrapper',
                    style: popupWrapperStyle
                  }, [
                    VxeTableGridComponent
                      ? h(VxeTableGridComponent, {
                        ref: 'refGrid',
                        class: 'vxe-table-select--grid',
                        props: {
                          ...selectGridOpts,
                          rowConfig: rowOpts,
                          data: options,
                          columns: tableColumns.length ? tableColumns : selectGridOpts.columns,
                          height: '100%',
                          autoResize: true
                        },
                        on: {
                          ...$xeTableSelect.gridEvents,
                          'radio-change': $xeTableSelect.radioChangeEvent,
                          'checkbox-change': $xeTableSelect.checkboxChangeEvent,
                          'checkbox-all': $xeTableSelect.checkboxAllEvent
                        },
                        scopedSlots: Object.assign({}, slots, {
                          header: undefined,
                          footer: undefined,
                          prefixSlot: undefined
                        })
                      })
                      : renderEmptyElement($xeTableSelect)
                  ])
                ]),
                footerSlot
                  ? h('div', {
                    class: 'vxe-table-select--panel-footer'
                  }, footerSlot({}))
                  : renderEmptyElement($xeTableSelect)
              ])
            ]
          : [])
      ])
    }
  },
  watch: {
    options () {
      const $xeTableSelect = this

      $xeTableSelect.cacheDataMap()
    },
    columns (val) {
      const $xeTableSelect = this

      $xeTableSelect.loadTableColumn(val)
    },
    value (val) {
      const $xeTableSelect = this

      $xeTableSelect.updateModel(val)
    }
  },
  created () {
    const $xeTableSelect = this
    const props = $xeTableSelect

    const gridEventKeys: ValueOf<VxeTableSelectEmits>[] = [
      'form-submit',
      'form-reset',
      'form-collapse',
      'page-change'
    ]
    const { gridEvents } = $xeTableSelect
    gridEventKeys.forEach(name => {
      gridEvents[getOnName(name)] = (params: any) => {
        $xeTableSelect.dispatchEvent(name, params, params.$event)
      }
    })

    $xeTableSelect.loadTableColumn(props.columns)
    $xeTableSelect.cacheDataMap()
  },
  mounted () {
    const $xeTableSelect = this
    const props = $xeTableSelect
    const reactData = $xeTableSelect.reactData

    const VxeTableGridComponent = VxeUI.getComponent('vxe-grid')
    $xeTableSelect.$nextTick(() => {
      if (!VxeTableGridComponent) {
        errLog('vxe.error.reqComp', ['[table-select] vxe-grid'])
      }
    })

    const { gridConfig } = props
    if (gridConfig && gridConfig.proxyConfig) {
      if (gridConfig.proxyConfig.autoLoad !== false) {
        reactData.initialized = true
      }
    }
    globalEvents.on($xeTableSelect, 'mousewheel', $xeTableSelect.handleGlobalMousewheelEvent)
    globalEvents.on($xeTableSelect, 'mousedown', $xeTableSelect.handleGlobalMousedownEvent)
    globalEvents.on($xeTableSelect, 'blur', $xeTableSelect.handleGlobalBlurEvent)
    globalEvents.on($xeTableSelect, 'resize', $xeTableSelect.handleGlobalResizeEvent)
  },
  beforeDestroy () {
    const $xeTableSelect = this

    const panelElem = $xeTableSelect.$refs.refOptionPanel as HTMLElement | undefined
    if (panelElem && panelElem.parentNode) {
      panelElem.parentNode.removeChild(panelElem)
    }
    globalEvents.off($xeTableSelect, 'mousewheel')
    globalEvents.off($xeTableSelect, 'mousedown')
    globalEvents.off($xeTableSelect, 'blur')
    globalEvents.off($xeTableSelect, 'resize')
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
