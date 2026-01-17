import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getI18n, getIcon, globalEvents, createEvent, globalMixins, renderEmptyElement } from '../../ui'
import { getEventTargetNode, updatePanelPlacement, toCssUnit } from '../../ui/src/dom'
import { getLastZIndex, nextZIndex } from '../../ui/src/utils'
import { deNodeValue } from '../../tree/src/util'
import { errLog } from '../../ui/src/log'
import VxeInputComponent from '../../input'
import VxeButtonComponent from '../../button'
import VxeTreeComponent from '../../tree'
import { getSlotVNs } from '../../ui/src/vn'

import type { TreeSelectReactData, VxeTreeSelectEmits, TreeSelectInternalData, VxeComponentSizeType, VxeButtonDefines, VxeTreeDefines, ValueOf, VxeComponentStyleType, VxeTreeSelectPropTypes, VxeFormDefines, VxeDrawerConstructor, VxeDrawerMethods, VxeFormConstructor, VxeFormPrivateMethods, VxeModalConstructor, VxeModalMethods, VxeInputConstructor, VxeTreeConstructor } from '../../../types'
import type { VxeTableConstructor, VxeTablePrivateMethods } from '../../../types/components/table'

function getOptUniqueId () {
  return XEUtils.uniqueId('node_')
}

function createReactData (): TreeSelectReactData {
  return {
    initialized: false,
    searchValue: '',
    searchLoading: false,
    panelIndex: 0,
    panelStyle: {},
    panelPlacement: null,
    triggerFocusPanel: false,
    visiblePanel: false,
    isAniVisible: false,
    isActivated: false
  }
}

function createInternalData (): TreeSelectInternalData {
  return {
    // hpTimeout: undefined,
    fullOptionList: [],
    fullNodeMaps: {}
  }
}

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeTreeSelect',
  mixins: [
    globalMixins.sizeMixin
  ],
  model: {
    prop: 'value',
    event: 'modelValue'
  },
  props: {
    value: [String, Number, Array] as PropType<VxeTreeSelectPropTypes.ModelValue>,
    clearable: Boolean as PropType<VxeTreeSelectPropTypes.Clearable>,
    placeholder: {
      type: String as PropType<VxeTreeSelectPropTypes.Placeholder>,
      default: () => XEUtils.eqNull(getConfig().treeSelect.placeholder) ? getI18n('vxe.base.pleaseSelect') : getConfig().treeSelect.placeholder
    },
    readonly: {
      type: Boolean as PropType<VxeTreeSelectPropTypes.Readonly>,
      default: null
    },
    loading: Boolean as PropType<VxeTreeSelectPropTypes.Loading>,
    disabled: {
      type: Boolean as PropType<VxeTreeSelectPropTypes.Disabled>,
      default: null
    },
    filterable: Boolean as PropType<VxeTreeSelectPropTypes.Filterable>,
    filterConfig: Object as PropType<VxeTreeSelectPropTypes.FilterConfig>,
    multiple: Boolean as PropType<VxeTreeSelectPropTypes.Multiple>,
    className: [String, Function] as PropType<VxeTreeSelectPropTypes.ClassName>,
    /**
     * 已废弃，请使用 popupConfig.className
     * @deprecated
     */
    popupClassName: [String, Function] as PropType<VxeTreeSelectPropTypes.PopupClassName>,
    prefixIcon: String as PropType<VxeTreeSelectPropTypes.PrefixIcon>,
    placement: String as PropType<VxeTreeSelectPropTypes.Placement>,
    lazyOptions: Array as PropType<VxeTreeSelectPropTypes.LazyOptions>,
    options: Array as PropType<VxeTreeSelectPropTypes.Options>,
    optionProps: Object as PropType<VxeTreeSelectPropTypes.OptionProps>,
    /**
     * 已废弃，请使用 popupConfig.zIndex
     * @deprecated
     */
    zIndex: Number as PropType<VxeTreeSelectPropTypes.ZIndex>,
    size: {
      type: String as PropType<VxeTreeSelectPropTypes.Size>,
      default: () => getConfig().treeSelect.size || getConfig().size
    },
    remote: Boolean as PropType<VxeTreeSelectPropTypes.Remote>,
    remoteConfig: Function as PropType<VxeTreeSelectPropTypes.RemoteConfig>,
    popupConfig: Object as PropType<VxeTreeSelectPropTypes.PopupConfig>,
    treeConfig: Object as PropType<VxeTreeSelectPropTypes.TreeConfig>,
    menuConfig: Object as PropType<VxeTreeSelectPropTypes.MenuConfig>,
    virtualYConfig: Object as PropType<VxeTreeSelectPropTypes.VirtualYConfig>,
    autoClose: {
      type: Boolean as PropType<VxeTreeSelectPropTypes.AutoClose>,
      default: () => getConfig().treeSelect.autoClose
    },
    showTotalButoon: {
      type: Boolean as PropType<VxeTreeSelectPropTypes.ShowTotalButoon>,
      default: () => getConfig().treeSelect.showTotalButoon
    },
    showCheckedButoon: {
      type: Boolean as PropType<VxeTreeSelectPropTypes.ShowCheckedButoon>,
      default: () => getConfig().treeSelect.showCheckedButoon
    },
    showClearButton: {
      type: Boolean as PropType<VxeTreeSelectPropTypes.ShowClearButton>,
      default: () => getConfig().treeSelect.showClearButton
    },
    showExpandButton: {
      type: Boolean as PropType<VxeTreeSelectPropTypes.ShowExpandButton>,
      default: () => getConfig().treeSelect.showExpandButton
    },
    transfer: {
      type: Boolean as PropType<VxeTreeSelectPropTypes.Transfer>,
      default: null
    },

    /**
     * 已废弃，被 remote-config.queryMethod 替换
     * @deprecated
     */
    remoteMethod: Function as PropType<VxeTreeSelectPropTypes.RemoteMethod>
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
    const $xeTreeSelect = this
    return {
      $xeTreeSelect
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData = createReactData()
    const internalData = createInternalData()
    return {
      xID,
      reactData,
      internalData
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
      const $xeTreeSelect = this
      const props = $xeTreeSelect
      const $xeForm = $xeTreeSelect.$xeForm

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
      const $xeTreeSelect = this
      const props = $xeTreeSelect
      const $xeForm = $xeTreeSelect.$xeForm

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
      const $xeTreeSelect = this
      const props = $xeTreeSelect
      const $xeTable = $xeTreeSelect.$xeTable
      const $xeModal = $xeTreeSelect.$xeModal
      const $xeDrawer = $xeTreeSelect.$xeDrawer
      const $xeForm = $xeTreeSelect.$xeForm

      const { transfer } = props
      const popupOpts = $xeTreeSelect.computePopupOpts as VxeTreeSelectPropTypes.PopupConfig
      if (XEUtils.isBoolean(popupOpts.transfer)) {
        return popupOpts.transfer
      }
      if (transfer === null) {
        const globalTransfer = getConfig().treeSelect.transfer
        if (XEUtils.isBoolean(globalTransfer)) {
          return globalTransfer
        }
        if ($xeTable || $xeModal || $xeDrawer || $xeForm) {
          return true
        }
      }
      return transfer
    },
    computePopupOpts () {
      const $xeTreeSelect = this
      const props = $xeTreeSelect

      return Object.assign({}, getConfig().treeSelect.popupConfig, props.popupConfig)
    },
    computeTreeOpts () {
      const $xeTreeSelect = this
      const props = $xeTreeSelect

      return Object.assign({}, getConfig().treeSelect.treeConfig, props.treeConfig)
    },
    computeMenuOpts () {
      const $xeTreeSelect = this
      const props = $xeTreeSelect

      return Object.assign({}, getConfig().treeSelect.menuConfig, props.menuConfig)
    },
    computeTreeNodeOpts () {
      const $xeTreeSelect = this

      const treeOpts = $xeTreeSelect.computeTreeOpts as VxeTreeSelectPropTypes.TreeConfig
      return Object.assign({ isHover: true }, treeOpts.nodeConfig)
    },
    computeTreeCheckboxOpts () {
      const $xeTreeSelect = this

      const treeOpts = $xeTreeSelect.computeTreeOpts as VxeTreeSelectPropTypes.TreeConfig
      return Object.assign({
        showIcon: !!treeOpts.showCheckbox
      }, treeOpts.checkboxConfig, {
        trigger: 'node'
      })
    },
    computeTreeRadioOpts () {
      const $xeTreeSelect = this

      const treeOpts = $xeTreeSelect.computeTreeOpts as VxeTreeSelectPropTypes.TreeConfig
      return Object.assign({
        showIcon: !!treeOpts.showRadio
      }, treeOpts.radioConfig, {
        trigger: 'node'
      })
    },
    computePropsOpts () {
      const $xeTreeSelect = this
      const props = $xeTreeSelect

      return Object.assign({}, props.optionProps)
    },
    computeNodeKeyField () {
      const $xeTreeSelect = this

      const treeOpts = $xeTreeSelect.computeTreeOpts as VxeTreeSelectPropTypes.TreeConfig
      return treeOpts.keyField || 'id'
    },
    computeLabelField () {
      const $xeTreeSelect = this

      const propsOpts = $xeTreeSelect.computePropsOpts as VxeTreeSelectPropTypes.OptionProps
      return propsOpts.label || 'label'
    },
    computeValueField () {
      const $xeTreeSelect = this

      const propsOpts = $xeTreeSelect.computePropsOpts as VxeTreeSelectPropTypes.OptionProps
      return propsOpts.value || 'value'
    },
    computeChildrenField () {
      const $xeTreeSelect = this

      const propsOpts = $xeTreeSelect.computePropsOpts as VxeTreeSelectPropTypes.OptionProps
      return propsOpts.children || 'children'
    },
    computeParentField () {
      const $xeTreeSelect = this

      const propsOpts = $xeTreeSelect.computePropsOpts as VxeTreeSelectPropTypes.OptionProps
      return propsOpts.parent || 'parentField'
    },
    computeHasChildField () {
      const $xeTreeSelect = this

      const propsOpts = $xeTreeSelect.computePropsOpts as VxeTreeSelectPropTypes.OptionProps
      return propsOpts.hasChild || 'hasChild'
    },
    computeVirtualYOpts () {
      const $xeTreeSelect = this
      const props = $xeTreeSelect

      return Object.assign({} as { gt: number }, getConfig().treeSelect.virtualYConfig, props.virtualYConfig)
    },
    computeRemoteOpts () {
      const $xeTreeSelect = this
      const props = $xeTreeSelect

      return Object.assign({}, getConfig().treeSelect.remoteConfig, props.remoteConfig)
    },
    computeFilterOpts () {
      const $xeTreeSelect = this
      const props = $xeTreeSelect

      const treeOpts = $xeTreeSelect.computeTreeOpts as VxeTreeSelectPropTypes.TreeConfig
      return Object.assign({}, treeOpts.filterConfig, props.filterConfig)
    },
    computeSelectLabel () {
      const $xeTreeSelect = this
      const props = $xeTreeSelect
      const internalData = ($xeTreeSelect as any).internalData as TreeSelectInternalData

      const { value: modelValue, lazyOptions } = props
      const { fullNodeMaps } = internalData
      const valueField = $xeTreeSelect.computeValueField as string
      const labelField = $xeTreeSelect.computeLabelField as string
      const selectVals = XEUtils.eqNull(modelValue) ? [] : (XEUtils.isArray(modelValue) ? modelValue : [modelValue])
      return selectVals.map(val => {
        const cacheItem = fullNodeMaps[val]
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
      const $xeTreeSelect = this

      const popupOpts = $xeTreeSelect.computePopupOpts
      const { height, width } = popupOpts
      const stys: VxeComponentStyleType = {}
      if (width) {
        stys.width = toCssUnit(width)
      }
      if (height) {
        stys.height = toCssUnit(height)
        stys.maxHeight = toCssUnit(height)
      }
      return stys
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeTreeSelectEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeTreeSelect = this
      $xeTreeSelect.$emit(type, createEvent(evnt, { $treeSelect: $xeTreeSelect }, params))
    },
    emitModel  (value: any) {
      const $xeTreeSelect = this

      const { _events } = $xeTreeSelect as any
      if (_events && _events.modelValue) {
        $xeTreeSelect.$emit('modelValue', value)
      } else {
        $xeTreeSelect.$emit('model-value', value)
      }
    },
    callSlot (slotFunc: ((params: any, h: CreateElement) => any) | string | null, params: any, h: CreateElement) {
      const $xeTreeSelect = this
      const slots = $xeTreeSelect.$scopedSlots

      if (slotFunc) {
        if (XEUtils.isString(slotFunc)) {
          slotFunc = slots[slotFunc] || null
        }
        if (XEUtils.isFunction(slotFunc)) {
          return getSlotVNs(slotFunc.call($xeTreeSelect, params, h))
        }
      }
      return []
    },
    getNodeid (option: any) {
      const $xeTreeSelect = this

      const nodeKeyField = $xeTreeSelect.computeNodeKeyField
      const nodeid = option[nodeKeyField]
      return nodeid ? encodeURIComponent(nodeid) : ''
    },
    cacheDataMap  () {
      const $xeTreeSelect = this
      const props = $xeTreeSelect
      const internalData = $xeTreeSelect.internalData

      const { options } = props
      const nodeKeyField = $xeTreeSelect.computeNodeKeyField
      const childrenField = $xeTreeSelect.computeChildrenField
      const valueField = $xeTreeSelect.computeValueField
      const nodeMaps: Record<string, {
        item: any
        index: number
        items: any[]
        parent: any
        nodes: any[]
      }> = {}
      const keyMaps: Record<string, boolean> = {}
      XEUtils.eachTree(options, (item, index, items, path, parent, nodes) => {
        let nodeid = $xeTreeSelect.getNodeid(item)
        if (!nodeid) {
          nodeid = getOptUniqueId()
        }
        if (keyMaps[nodeid]) {
          errLog('vxe.error.repeatKey', [`[tree-select] ${nodeKeyField}`, nodeid])
        }
        keyMaps[nodeid] = true
        const value = item[valueField]
        if (nodeMaps[value]) {
          errLog('vxe.error.repeatKey', [`[tree-select] ${valueField}`, value])
        }
        nodeMaps[value] = { item, index, items, parent, nodes }
      }, { children: childrenField })
      internalData.fullOptionList = options || []
      internalData.fullNodeMaps = nodeMaps
    },
    updateZindex () {
      const $xeTreeSelect = this
      const props = $xeTreeSelect
      const reactData = $xeTreeSelect.reactData

      const popupOpts = $xeTreeSelect.computePopupOpts
      const customZIndex = popupOpts.zIndex || props.zIndex
      if (customZIndex) {
        reactData.panelIndex = XEUtils.toNumber(customZIndex)
      } else if (reactData.panelIndex < getLastZIndex()) {
        reactData.panelIndex = nextZIndex()
      }
    },
    updatePlacement  () {
      const $xeTreeSelect = this
      const props = $xeTreeSelect
      const reactData = $xeTreeSelect.reactData

      const { placement } = props
      const { panelIndex } = reactData
      const targetElem = $xeTreeSelect.$refs.refElem as HTMLElement
      const panelElem = $xeTreeSelect.$refs.refOptionPanel as HTMLDivElement
      const btnTransfer = $xeTreeSelect.computeBtnTransfer
      const popupOpts = $xeTreeSelect.computePopupOpts
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
      return $xeTreeSelect.$nextTick().then(handleStyle)
    },
    showOptionPanel  () {
      const $xeTreeSelect = this
      const props = $xeTreeSelect
      const reactData = $xeTreeSelect.reactData
      const internalData = $xeTreeSelect.internalData

      const { loading, remote, filterable } = props
      const { fullOptionList } = internalData
      const isDisabled = $xeTreeSelect.computeIsDisabled
      const remoteOpts = $xeTreeSelect.computeRemoteOpts
      if (!loading && !isDisabled) {
        if (internalData.hpTimeout) {
          clearTimeout(internalData.hpTimeout)
        }
        if (!reactData.initialized) {
          reactData.initialized = true
          const btnTransfer = $xeTreeSelect.computeBtnTransfer
          const panelElem = $xeTreeSelect.$refs.refOptionPanel as HTMLElement
          if (btnTransfer) {
            if (panelElem) {
              document.body.appendChild(panelElem)
            }
          }
        }
        reactData.isActivated = true
        reactData.isAniVisible = true
        if (filterable) {
          if (remote && remoteOpts.enabled && remoteOpts.autoLoad && !fullOptionList.length) {
            $xeTreeSelect.handleSearchEvent()
          }
        }
        setTimeout(() => {
          reactData.visiblePanel = true
          $xeTreeSelect.handleFocusSearch()
        }, 10)
        $xeTreeSelect.updateZindex()
        $xeTreeSelect.updatePlacement()
      }
    },
    hideOptionPanel () {
      const $xeTreeSelect = this
      const reactData = $xeTreeSelect.reactData
      const internalData = $xeTreeSelect.internalData

      reactData.visiblePanel = false
      internalData.hpTimeout = setTimeout(() => {
        reactData.isAniVisible = false
      }, 350)
    },
    changeEvent (evnt: Event, selectValue: any, node: any) {
      const $xeTreeSelect = this
      const props = $xeTreeSelect
      const $xeForm = $xeTreeSelect.$xeForm
      const formItemInfo = $xeTreeSelect.formItemInfo

      const value = XEUtils.isArray(selectValue) ? selectValue.map(deNodeValue) : deNodeValue(selectValue)
      $xeTreeSelect.emitModel(value)
      if (value !== props.value) {
        $xeTreeSelect.dispatchEvent('change', { value, node, option: node }, evnt)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
        }
      }
    },
    clearValueEvent  (evnt: Event, selectValue: any) {
      const $xeTreeSelect = this

      $xeTreeSelect.changeEvent(evnt, selectValue, null)
      $xeTreeSelect.dispatchEvent('clear', { value: selectValue }, evnt)
    },
    clearEvent  (params: any, evnt: Event) {
      const $xeTreeSelect = this

      $xeTreeSelect.clearValueEvent(evnt, null)
      $xeTreeSelect.hideOptionPanel()
    },
    allCheckedPanelEvent (params: VxeButtonDefines.ClickEventParams) {
      const $xeTreeSelect = this
      const props = $xeTreeSelect

      const { $event } = params
      const { multiple, autoClose } = props
      const $tree = $xeTreeSelect.$refs.refTree as VxeTreeConstructor
      if (multiple) {
        if ($tree) {
          $tree.setAllCheckboxNode(true).then(({ checkNodeKeys, checkNodes }) => {
            $xeTreeSelect.changeEvent($event, checkNodeKeys, checkNodes[0])
            $xeTreeSelect.dispatchEvent('all-change', { value: checkNodeKeys }, $event)
            if (autoClose) {
              $xeTreeSelect.hideOptionPanel()
            }
          })
        }
      }
    },
    clearCheckedPanelEvent (params: VxeButtonDefines.ClickEventParams) {
      const $xeTreeSelect = this
      const props = $xeTreeSelect

      const { $event } = params
      const { multiple, autoClose } = props
      const $tree = $xeTreeSelect.$refs.refTree as VxeTreeConstructor
      if ($tree) {
        const value = multiple ? [] : null
        $tree.clearCheckboxNode().then(() => {
          if (autoClose) {
            $xeTreeSelect.hideOptionPanel()
          }
        })
        $xeTreeSelect.changeEvent($event, value, null)
        $xeTreeSelect.dispatchEvent('clear', { value }, $event)
      }
    },
    allExpandPanelEvent () {
      const $xeTreeSelect = this

      const $tree = $xeTreeSelect.$refs.refTree as VxeTreeConstructor
      if ($tree) {
        $tree.setAllExpandNode(true)
      }
    },
    clearExpandPanelEvent () {
      const $xeTreeSelect = this

      const $tree = $xeTreeSelect.$refs.refTree as VxeTreeConstructor
      if ($tree) {
        $tree.clearAllExpandNode()
      }
    },
    handleGlobalMousewheelEvent (evnt: MouseEvent) {
      const $xeTreeSelect = this
      const reactData = $xeTreeSelect.reactData

      const { visiblePanel } = reactData
      const isDisabled = $xeTreeSelect.computeIsDisabled
      if (!isDisabled) {
        if (visiblePanel) {
          const panelElem = $xeTreeSelect.$refs.refOptionPanel as HTMLElement
          if (getEventTargetNode(evnt, panelElem).flag) {
            $xeTreeSelect.updatePlacement()
          } else {
            $xeTreeSelect.hideOptionPanel()
          }
        }
      }
    },
    handleGlobalMousedownEvent  (evnt: MouseEvent) {
      const $xeTreeSelect = this
      const reactData = $xeTreeSelect.reactData

      const { visiblePanel } = reactData
      const isDisabled = $xeTreeSelect.computeIsDisabled
      if (!isDisabled) {
        const el = $xeTreeSelect.$refs.refElem as HTMLElement
        const panelElem = $xeTreeSelect.$refs.refOptionPanel as HTMLElement
        reactData.isActivated = getEventTargetNode(evnt, el).flag || getEventTargetNode(evnt, panelElem).flag
        if (visiblePanel && !reactData.isActivated) {
          $xeTreeSelect.hideOptionPanel()
        }
      }
    },
    handleGlobalBlurEvent () {
      const $xeTreeSelect = this
      const reactData = $xeTreeSelect.reactData

      const { visiblePanel, isActivated } = reactData
      if (visiblePanel) {
        $xeTreeSelect.hideOptionPanel()
      }
      if (isActivated) {
        reactData.isActivated = false
      }
      if (visiblePanel || isActivated) {
        const $input = $xeTreeSelect.$refs.refInput as VxeInputConstructor
        if ($input) {
          $input.blur()
        }
      }
    },
    handleGlobalResizeEvent () {
      const $xeTreeSelect = this
      const reactData = $xeTreeSelect.reactData

      const { visiblePanel } = reactData
      if (visiblePanel) {
        $xeTreeSelect.updatePlacement()
      }
    },
    handleFocusSearch  () {
      const $xeSelect = this
      const props = $xeSelect

      if (props.filterable) {
        $xeSelect.$nextTick(() => {
          const inpSearch = $xeSelect.$refs.refInpSearch as VxeInputConstructor
          if (inpSearch) {
            inpSearch.focus()
          }
        })
      }
    },
    focusEvent  (evnt: FocusEvent) {
      const $xeTreeSelect = this
      const reactData = $xeTreeSelect.reactData

      const isDisabled = $xeTreeSelect.computeIsDisabled
      if (!isDisabled) {
        if (!reactData.visiblePanel) {
          reactData.triggerFocusPanel = true
          $xeTreeSelect.showOptionPanel()
          setTimeout(() => {
            reactData.triggerFocusPanel = false
          }, 150)
        }
      }
      $xeTreeSelect.dispatchEvent('focus', {}, evnt)
    },
    clickEvent  (evnt: MouseEvent) {
      const $xeTreeSelect = this

      $xeTreeSelect.togglePanelEvent(evnt)
      $xeTreeSelect.dispatchEvent('click', {}, evnt)
    },
    blurEvent (evnt: FocusEvent) {
      const $xeTreeSelect = this
      const reactData = $xeTreeSelect.reactData

      reactData.isActivated = false
      $xeTreeSelect.dispatchEvent('blur', {}, evnt)
    },
    modelSearchEvent (value: string) {
      const $xeTreeSelect = this
      const reactData = $xeTreeSelect.reactData

      reactData.searchValue = value
    },
    handleSearchEvent () {
      const $xeTreeSelect = this
      const props = $xeTreeSelect
      const reactData = $xeTreeSelect.reactData

      const { value: modelValue, remote, remoteMethod } = props
      const { searchValue } = reactData
      const remoteOpts = $xeTreeSelect.computeRemoteOpts
      const queryMethod = remoteOpts.queryMethod || remoteMethod
      if (remote && queryMethod && remoteOpts.enabled) {
        reactData.searchLoading = true
        Promise.resolve(
          queryMethod({ $treeSelect: $xeTreeSelect, searchValue, value: modelValue })
        ).then(() => $xeTreeSelect.$nextTick())
          .catch(() => $xeTreeSelect.$nextTick())
          .finally(() => {
            reactData.searchLoading = false
          })
      }
    },
    togglePanelEvent  (params: any) {
      const $xeTreeSelect = this
      const reactData = $xeTreeSelect.reactData

      const { $event } = params
      $event.preventDefault()
      if (reactData.triggerFocusPanel) {
        reactData.triggerFocusPanel = false
      } else {
        if (reactData.visiblePanel) {
          $xeTreeSelect.hideOptionPanel()
        } else {
          $xeTreeSelect.showOptionPanel()
        }
      }
    },
    nodeExpandEvent () {
      const $xeTreeSelect = this

      $xeTreeSelect.updatePlacement()
    },
    nodeClickEvent  (params: VxeTreeDefines.NodeClickEventParams) {
      const $xeTreeSelect = this

      const { $event } = params
      $xeTreeSelect.dispatchEvent('node-click', params, $event)
    },
    radioChangeEvent  (params: VxeTreeDefines.RadioChangeEventParams) {
      const $xeTreeSelect = this

      const { value, $event, node } = params
      $xeTreeSelect.changeEvent($event, value, node)
      $xeTreeSelect.hideOptionPanel()
    },
    checkboxChangeEvent (params: VxeTreeDefines.CheckboxChangeEventParams) {
      const $xeTreeSelect = this

      const { value, $event, node } = params
      $xeTreeSelect.changeEvent($event, value, node)
    },
    loadSuccessEvent () {
      const $xeTreeSelect = this

      $xeTreeSelect.cacheDataMap()
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeTreeSelect = this
      const props = $xeTreeSelect
      const slots = $xeTreeSelect.$scopedSlots
      const reactData = $xeTreeSelect.reactData

      const { className, value: modelValue, multiple, options, loading, menuConfig, filterable, showTotalButoon, showCheckedButoon, showClearButton, showExpandButton } = props
      const { initialized, isActivated, isAniVisible, visiblePanel, searchValue } = reactData
      const vSize = $xeTreeSelect.computeSize
      const isDisabled = $xeTreeSelect.computeIsDisabled
      const selectLabel = $xeTreeSelect.computeSelectLabel
      const btnTransfer = $xeTreeSelect.computeBtnTransfer
      const formReadonly = $xeTreeSelect.computeFormReadonly
      const popupWrapperStyle = $xeTreeSelect.computePopupWrapperStyle
      const headerSlot = slots.header
      const footerSlot = slots.footer
      const prefixSlot = slots.prefix
      const popupOpts = $xeTreeSelect.computePopupOpts
      const ppClassName = popupOpts.className || props.popupClassName
      if (formReadonly) {
        return h('div', {
          ref: 'refElem',
          class: ['vxe-tree-select--readonly', className]
        }, [
          h('span', {
            class: 'vxe-tree-select-label'
          }, selectLabel)
        ])
      }
      const treeOpts = $xeTreeSelect.computeTreeOpts
      const menuOpts = $xeTreeSelect.computeMenuOpts
      const treeNodeOpts = $xeTreeSelect.computeTreeNodeOpts
      const treeCheckboxOpts = $xeTreeSelect.computeTreeCheckboxOpts
      const treeRadioOpts = $xeTreeSelect.computeTreeRadioOpts
      const nodeKeyField = $xeTreeSelect.computeNodeKeyField
      const labelField = $xeTreeSelect.computeLabelField
      const valueField = $xeTreeSelect.computeValueField
      const childrenField = $xeTreeSelect.computeChildrenField
      const parentField = $xeTreeSelect.computeParentField
      const hasChildField = $xeTreeSelect.computeHasChildField
      const virtualYOpts = $xeTreeSelect.computeVirtualYOpts
      const filterOpts = $xeTreeSelect.computeFilterOpts
      const { slots: treeSlots } = treeOpts
      const selectVals = XEUtils.eqNull(modelValue) ? [] : (XEUtils.isArray(modelValue) ? modelValue : [modelValue])
      const treeScopedSlots: {
        icon?: (params: any) => VNode[]
        title?: (params: any) => VNode[]
        extra?: (params: any) => VNode[]
      } = {}
      if (treeSlots) {
        const { icon: treeIconSlot, title: treeTitleSlot, extra: treeExtraSlot } = treeSlots
        if (treeIconSlot) {
          treeScopedSlots.icon = (slotParams) => $xeTreeSelect.callSlot(treeIconSlot, slotParams, h) as VNode[]
        }
        if (treeTitleSlot) {
          treeScopedSlots.title = (slotParams) => $xeTreeSelect.callSlot(treeTitleSlot, slotParams, h) as VNode[]
        }
        if (treeExtraSlot) {
          treeScopedSlots.extra = (slotParams) => $xeTreeSelect.callSlot(treeExtraSlot, slotParams, h) as VNode[]
        }
      }
      return h('div', {
        ref: 'refElem',
        class: ['vxe-tree-select', className ? (XEUtils.isFunction(className) ? className({ $treeSelect: $xeTreeSelect }) : className) : '', {
          [`size--${vSize}`]: vSize,
          'is--filterable': filterable,
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
            suffixIcon: loading ? getIcon().TREE_SELECT_LOADED : (visiblePanel ? getIcon().TREE_SELECT_OPEN : getIcon().TREE_SELECT_CLOSE),
            value: loading ? getI18n('vxe.select.loadingText') : selectLabel,
            title: selectLabel
          },
          on: {
            clear: $xeTreeSelect.clearEvent,
            click: $xeTreeSelect.clickEvent,
            focus: $xeTreeSelect.focusEvent,
            blur: $xeTreeSelect.blurEvent,
            'suffix-click': $xeTreeSelect.togglePanelEvent
          },
          scopedSlots: prefixSlot
            ? {
                prefix: () => prefixSlot({})
              }
            : {}
        }),
        h('div', {
          ref: 'refOptionPanel',
          class: ['vxe-table--ignore-clear vxe-tree-select--panel', ppClassName ? (XEUtils.isFunction(ppClassName) ? ppClassName({ $treeSelect: $xeTreeSelect }) : ppClassName) : '', {
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
                class: 'vxe-tree-select--panel-wrapper'
              }, [
                filterable
                  ? h('div', {
                    class: 'vxe-tree-select--panel-search'
                  }, [
                    h(VxeInputComponent, {
                      ref: 'refInpSearch',
                      class: 'vxe-tree-select-search--input',
                      props: {
                        value: searchValue,
                        title: selectLabel,
                        clearable: true,
                        disabled: false,
                        readonly: false,
                        placeholder: getI18n('vxe.treeSelect.search'),
                        prefixIcon: getIcon().INPUT_SEARCH
                      },
                      on: {
                        'model-value': $xeTreeSelect.modelSearchEvent
                      }
                    })
                  ])
                  : renderEmptyElement($xeTreeSelect),
                showTotalButoon || (showCheckedButoon && multiple) || showClearButton || showExpandButton || headerSlot
                  ? h('div', {
                    class: 'vxe-tree-select--panel-header'
                  }, headerSlot
                    ? headerSlot({})
                    : [
                        h('div', {
                          class: 'vxe-tree-select--header-button'
                        }, [
                          showTotalButoon
                            ? h('div', {
                              class: 'vxe-tree-select--header-total'
                            }, getI18n('vxe.treeSelect.total', [selectVals.length]))
                            : renderEmptyElement($xeTreeSelect),
                          h('div', {
                            class: 'vxe-tree-select--header-btns'
                          }, [
                            (showCheckedButoon && multiple)
                              ? h(VxeButtonComponent, {
                                props: {
                                  content: getI18n('vxe.treeSelect.allChecked'),
                                  mode: 'text'
                                },
                                on: {
                                  click: $xeTreeSelect.allCheckedPanelEvent
                                }
                              })
                              : renderEmptyElement($xeTreeSelect),
                            showClearButton
                              ? h(VxeButtonComponent, {
                                props: {
                                  content: getI18n('vxe.treeSelect.clearChecked'),
                                  mode: 'text'
                                },
                                on: {
                                  click: $xeTreeSelect.clearCheckedPanelEvent
                                }
                              })
                              : renderEmptyElement($xeTreeSelect),
                            showExpandButton
                              ? h(VxeButtonComponent, {
                                props: {
                                  content: getI18n('vxe.treeSelect.allExpand'),
                                  mode: 'text'
                                },
                                on: {
                                  click: $xeTreeSelect.allExpandPanelEvent
                                }
                              })
                              : renderEmptyElement($xeTreeSelect),
                            showExpandButton
                              ? h(VxeButtonComponent, {
                                props: {
                                  content: getI18n('vxe.treeSelect.clearExpand'),
                                  mode: 'text'
                                },
                                on: {
                                  click: $xeTreeSelect.clearExpandPanelEvent
                                }
                              })
                              : renderEmptyElement($xeTreeSelect)
                          ])
                        ])
                      ])
                  : renderEmptyElement($xeTreeSelect),
                h('div', {
                  class: 'vxe-tree-select--panel-body'
                }, [
                  h('div', {
                    ref: 'refTreeWrapper',
                    class: 'vxe-tree-select-tree--wrapper',
                    style: popupWrapperStyle
                  }, [
                    h(VxeTreeComponent, {
                      ref: 'refTree',
                      class: 'vxe-tree-select--tree',
                      props: {
                        data: options,
                        height: popupOpts.height ? '100%' : treeOpts.height,
                        minHeight: treeOpts.minHeight,
                        maxHeight: popupOpts.height ? '' : treeOpts.maxHeight,
                        autoResize: true,
                        indent: treeOpts.indent,
                        showRadio: !multiple,
                        radioConfig: treeRadioOpts,
                        checkNodeKey: multiple ? null : modelValue,
                        showCheckbox: !!multiple,
                        checkNodeKeys: multiple ? modelValue : null,
                        checkboxConfig: treeCheckboxOpts,
                        titleField: labelField,
                        valueField: valueField,
                        keyField: nodeKeyField,
                        childrenField: treeOpts.childrenField || childrenField,
                        parentField: treeOpts.parentField || parentField,
                        hasChildField: treeOpts.hasChildField || hasChildField,
                        accordion: treeOpts.accordion,
                        expandAll: treeOpts.expandAll,
                        expandNodeKeys: treeOpts.expandNodeKeys,
                        nodeConfig: treeNodeOpts,
                        lazy: treeOpts.lazy,
                        loadMethod: treeOpts.loadMethod,
                        toggleMethod: treeOpts.toggleMethod,
                        transform: treeOpts.transform,
                        trigger: treeOpts.trigger,
                        showIcon: treeOpts.showIcon,
                        showLine: treeOpts.showLine,
                        iconOpen: treeOpts.iconOpen,
                        iconLoaded: treeOpts.iconLoaded,
                        iconClose: treeOpts.iconClose,
                        filterValue: searchValue,
                        filterConfig: filterOpts,
                        menuConfig: menuConfig ? menuOpts : undefined,
                        virtualYConfig: virtualYOpts
                      },
                      on: {
                        'node-expand': $xeTreeSelect.nodeExpandEvent,
                        'node-click': $xeTreeSelect.nodeClickEvent,
                        'radio-change': $xeTreeSelect.radioChangeEvent,
                        'checkbox-change': $xeTreeSelect.checkboxChangeEvent,
                        'load-success': $xeTreeSelect.loadSuccessEvent
                      },
                      scopedSlots: treeScopedSlots
                    })
                  ])
                ]),
                footerSlot
                  ? h('div', {
                    class: 'vxe-tree-select--panel-footer'
                  }, footerSlot({}))
                  : renderEmptyElement($xeTreeSelect)
              ])
            ]
          : [])
      ])
    }
  },
  watch: {
    options () {
      const $xeTreeSelect = this

      $xeTreeSelect.cacheDataMap()
    }
  },
  created () {
    const $xeTreeSelect = this

    $xeTreeSelect.cacheDataMap()
  },
  mounted () {
    const $xeTreeSelect = this

    globalEvents.on($xeTreeSelect, 'mousewheel', $xeTreeSelect.handleGlobalMousewheelEvent)
    globalEvents.on($xeTreeSelect, 'mousedown', $xeTreeSelect.handleGlobalMousedownEvent)
    globalEvents.on($xeTreeSelect, 'blur', $xeTreeSelect.handleGlobalBlurEvent)
    globalEvents.on($xeTreeSelect, 'resize', $xeTreeSelect.handleGlobalResizeEvent)
  },
  beforeDestroy () {
    const $xeTreeSelect = this
    const reactData = $xeTreeSelect.reactData
    const internalData = $xeTreeSelect.internalData

    const panelElem = $xeTreeSelect.$refs.refOptionPanel as HTMLElement | undefined
    if (panelElem && panelElem.parentNode) {
      panelElem.parentNode.removeChild(panelElem)
    }
    globalEvents.off($xeTreeSelect, 'mousewheel')
    globalEvents.off($xeTreeSelect, 'mousedown')
    globalEvents.off($xeTreeSelect, 'blur')
    globalEvents.off($xeTreeSelect, 'resize')
    XEUtils.assign(reactData, createReactData())
    XEUtils.assign(internalData, createInternalData())
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
