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
import type { VxeGridInstance, VxeGridDefines } from '../../../types/components/grid'

export function getRowUniqueId () {
  return XEUtils.uniqueId('row_')
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
    size: {
      type: String as PropType<VxeTableSelectPropTypes.Size>,
      default: () => getConfig().select.size || getConfig().size
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
      fullRowMaps: {},
      panelIndex: 0,
      panelStyle: {},
      panelPlacement: null,
      triggerFocusPanel: false,
      visiblePanel: false,
      isAniVisible: false,
      isActivated: false
    }

    const internalData: TableSelectInternalData = {
      // hpTimeout: undefined,
      // vpTimeout: undefined
    }

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

      return Object.assign({}, getConfig().tableSelect.gridConfig, props.gridConfig, { data: undefined, columns: undefined }) as VxeTableSelectPropTypes.GridConfig
    },
    computeSelectLabel () {
      const $xeTableSelect = this
      const props = $xeTableSelect
      const reactData = ($xeTableSelect as any).reactData as TableSelectReactData

      const { value } = props
      const { fullRowMaps } = reactData
      const labelField = $xeTableSelect.computeLabelField as string
      return (XEUtils.isArray(value) ? value : [value]).map(val => {
        const cacheItem = fullRowMaps[val]
        return cacheItem ? cacheItem.item[labelField] : val
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
      const reactData = $xeTableSelect.reactData

      const { fullRowMaps } = reactData
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
    loadTableColumn (columns: VxeTableSelectPropTypes.Columns) {
      const $xeTableSelect = this
      const props = $xeTableSelect
      const reactData = $xeTableSelect.reactData

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
          errLog('vxe.error.reqProp', ['{ type: "checkbox" }'])
        }
        tableCols.unshift({
          type: 'checkbox',
          width: 70
        })
      } else {
        if (!hasRadioCol) {
          errLog('vxe.error.reqProp', ['{ type: "radio" }'])
        }
        tableCols.unshift({
          type: 'radio',
          width: 70
        })
      }
      reactData.tableColumns = tableCols
    },
    cacheDataMap () {
      const $xeTableSelect = this
      const props = $xeTableSelect
      const reactData = $xeTableSelect.reactData

      const { options } = props
      const rowKeyField = $xeTableSelect.computeRowKeyField
      const valueField = $xeTableSelect.computeValueField
      const gridOpts = $xeTableSelect.computeGridOpts
      const { treeConfig } = gridOpts
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
        XEUtils.arrayEach(options || [], (item, index, items) => {
          let rowid = $xeTableSelect.getRowid(item)
          if (!rowid) {
            rowid = getRowUniqueId()
          }
          if (keyMaps[rowid]) {
            errLog('vxe.error.repeatKey', [rowKeyField, rowid])
          }
          keyMaps[rowid] = true
          const value = item[valueField]
          if (rowMaps[value]) {
            errLog('vxe.error.repeatKey', [valueField, value])
          }
          rowMaps[value] = { item, index, items, parent: null, nodes: [] }
        })
      }
      reactData.fullOptionList = options || []
      reactData.fullRowMaps = rowMaps
      $xeTableSelect.updateModel(props.value)
    },
    updateZindex () {
      const $xeTableSelect = this
      const reactData = $xeTableSelect.reactData

      if (reactData.panelIndex < getLastZIndex()) {
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
      const handleStyle = () => {
        const ppObj = updatePanelPlacement(targetElem, panelElem, {
          placement,
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
    changeEvent (evnt: Event, selectValue: any) {
      const $xeTableSelect = this
      const props = $xeTableSelect
      const reactData = $xeTableSelect.reactData
      const $xeForm = $xeTableSelect.$xeForm
      const formItemInfo = $xeTableSelect.formItemInfo

      const { fullRowMaps } = reactData
      $xeTableSelect.emitModel(selectValue)
      if (selectValue !== props.value) {
        const cacheItem = fullRowMaps[selectValue]
        $xeTableSelect.dispatchEvent('change', { value: selectValue, row: cacheItem ? cacheItem.item : null }, evnt)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, selectValue)
        }
      }
    },
    clearValueEvent (evnt: Event, selectValue: any) {
      const $xeTableSelect = this

      $xeTableSelect.changeEvent(evnt, selectValue)
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
      $xeTableSelect.changeEvent($event, value)
      $xeTableSelect.hideOptionPanel()
    },
    checkboxChangeEvent (params: VxeGridDefines.CheckboxChangeEventParams) {
      const $xeTableSelect = this

      const { $grid, $event } = params
      const valueField = $xeTableSelect.computeValueField
      if ($grid) {
        const checkboxRecords = $grid.getCheckboxRecords()
        const value = checkboxRecords.map(row => {
          return row[valueField]
        })
        $xeTableSelect.changeEvent($event, value)
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
      const { className: popupClassName } = popupOpts
      const gridOpts = $xeTableSelect.computeGridOpts
      const rowOpts = $xeTableSelect.computeRowOpts
      const popupWrapperStyle = $xeTableSelect.computePopupWrapperStyle
      const headerSlot = slots.header
      const footerSlot = slots.footer
      const prefixSlot = slots.prefix

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
          class: ['vxe-table--ignore-clear vxe-table-select--panel', popupClassName ? (XEUtils.isFunction(popupClassName) ? popupClassName({ $tableSelect: $xeTableSelect }) : popupClassName) : '', {
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
                          ...gridOpts,
                          rowConfig: rowOpts,
                          data: options,
                          columns: tableColumns,
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

      $xeTableSelect.loadTableColumn(val || [])
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

    $xeTableSelect.loadTableColumn(props.columns || [])
    $xeTableSelect.cacheDataMap()
  },
  mounted () {
    const $xeTableSelect = this

    const VxeTableGridComponent = VxeUI.getComponent('vxe-grid')
    $xeTableSelect.$nextTick(() => {
      if (!VxeTableGridComponent) {
        errLog('vxe.error.reqComp', ['vxe-grid'])
      }
    })

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
