import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getI18n, getIcon, globalEvents, createEvent, globalMixins, renderEmptyElement } from '../../ui'
import { getEventTargetNode, updatePanelPlacement, toCssUnit } from '../../ui/src/dom'
import { getLastZIndex, nextZIndex } from '../../ui/src/utils'
import { deNodeValue } from '../../tree/src/util'
import { errLog } from '../../ui/src/log'
import VxeInputComponent from '../../input/src/input'
import VxeButtonComponent from '../../button/src/button'

import type { CascaderReactData, VxeCascaderEmits, CascaderInternalData, VxeComponentSizeType, VxeButtonDefines, VxeTreeDefines, ValueOf, VxeComponentStyleType, VxeCascaderPropTypes, VxeFormDefines, VxeDrawerConstructor, VxeDrawerMethods, VxeFormConstructor, VxeFormPrivateMethods, VxeModalConstructor, VxeModalMethods, VxeInputConstructor, VxeTreeConstructor } from '../../../types'
import type { VxeTableConstructor, VxeTablePrivateMethods } from '../../../types/components/table'

function getOptUniqueId () {
  return XEUtils.uniqueId('node_')
}

function createInternalData (): CascaderInternalData {
  return {
    // hpTimeout: undefined,
    fullOptionList: [],
    fullNodeMaps: {}
  }
}

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeCascader',
  mixins: [
    globalMixins.sizeMixin
  ],
  model: {
    prop: 'value',
    event: 'modelValue'
  },
  props: {
    value: [String, Number, Array] as PropType<VxeCascaderPropTypes.ModelValue>,
    clearable: Boolean as PropType<VxeCascaderPropTypes.Clearable>,
    placeholder: {
      type: String as PropType<VxeCascaderPropTypes.Placeholder>,
      default: () => XEUtils.eqNull(getConfig().cascader.placeholder) ? getI18n('vxe.base.pleaseSelect') : getConfig().cascader.placeholder
    },
    readonly: {
      type: Boolean as PropType<VxeCascaderPropTypes.Readonly>,
      default: null
    },
    loading: Boolean as PropType<VxeCascaderPropTypes.Loading>,
    disabled: {
      type: Boolean as PropType<VxeCascaderPropTypes.Disabled>,
      default: null
    },
    filterable: Boolean as PropType<VxeCascaderPropTypes.Filterable>,
    filterConfig: Object as PropType<VxeCascaderPropTypes.FilterConfig>,
    multiple: Boolean as PropType<VxeCascaderPropTypes.Multiple>,
    className: [String, Function] as PropType<VxeCascaderPropTypes.ClassName>,
    prefixIcon: String as PropType<VxeCascaderPropTypes.PrefixIcon>,
    placement: String as PropType<VxeCascaderPropTypes.Placement>,
    transform: Boolean as PropType<VxeCascaderPropTypes.Transform>,
    lazyOptions: Array as PropType<VxeCascaderPropTypes.LazyOptions>,
    options: Array as PropType<VxeCascaderPropTypes.Options>,
    optionProps: Object as PropType<VxeCascaderPropTypes.OptionProps>,
    zIndex: Number as PropType<VxeCascaderPropTypes.ZIndex>,
    size: {
      type: String as PropType<VxeCascaderPropTypes.Size>,
      default: () => getConfig().cascader.size || getConfig().size
    },
    remote: Boolean as PropType<VxeCascaderPropTypes.Remote>,
    remoteConfig: Function as PropType<VxeCascaderPropTypes.RemoteConfig>,
    popupConfig: Object as PropType<VxeCascaderPropTypes.PopupConfig>,
    treeConfig: Object as PropType<VxeCascaderPropTypes.TreeConfig>,
    autoClose: {
      type: Boolean as PropType<VxeCascaderPropTypes.AutoClose>,
      default: () => getConfig().cascader.autoClose
    },
    showTotalButoon: {
      type: Boolean as PropType<VxeCascaderPropTypes.ShowTotalButoon>,
      default: () => getConfig().cascader.showTotalButoon
    },
    showCheckedButoon: {
      type: Boolean as PropType<VxeCascaderPropTypes.ShowCheckedButoon>,
      default: () => getConfig().cascader.showCheckedButoon
    },
    showClearButton: {
      type: Boolean as PropType<VxeCascaderPropTypes.ShowClearButton>,
      default: () => getConfig().cascader.showClearButton
    },
    transfer: {
      type: Boolean as PropType<VxeCascaderPropTypes.Transfer>,
      default: null
    },

    /**
     * 已废弃，被 remote-config.queryMethod 替换
     * @deprecated
     */
    remoteMethod: Function as PropType<VxeCascaderPropTypes.RemoteMethod>
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
    const $xeCascader = this
    return {
      $xeCascader
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: CascaderReactData = {
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
      const $xeCascader = this
      const props = $xeCascader
      const $xeForm = $xeCascader.$xeForm

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
      const $xeCascader = this
      const props = $xeCascader
      const $xeForm = $xeCascader.$xeForm

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
      const $xeCascader = this
      const props = $xeCascader
      const $xeTable = $xeCascader.$xeTable
      const $xeModal = $xeCascader.$xeModal
      const $xeDrawer = $xeCascader.$xeDrawer
      const $xeForm = $xeCascader.$xeForm

      const { transfer } = props
      if (transfer === null) {
        const globalTransfer = getConfig().cascader.transfer
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
      const $xeCascader = this
      const props = $xeCascader

      return Object.assign({}, getConfig().cascader.popupConfig, props.popupConfig)
    },
    computeTreeOpts () {
      const $xeCascader = this
      const props = $xeCascader

      return Object.assign({}, getConfig().cascader.treeConfig, props.treeConfig)
    },
    computeTreeNodeOpts () {
      const $xeCascader = this

      const treeOpts = $xeCascader.computeTreeOpts as VxeCascaderPropTypes.TreeConfig
      return Object.assign({ isHover: true }, treeOpts.nodeConfig)
    },
    computeTreeCheckboxOpts () {
      const $xeCascader = this

      const treeOpts = $xeCascader.computeTreeOpts as VxeCascaderPropTypes.TreeConfig
      return Object.assign({
        showIcon: !!treeOpts.showCheckbox
      }, treeOpts.checkboxConfig, {
        trigger: 'node'
      })
    },
    computeTreeRadioOpts () {
      const $xeCascader = this

      const treeOpts = $xeCascader.computeTreeOpts as VxeCascaderPropTypes.TreeConfig
      return Object.assign({
        showIcon: !!treeOpts.showRadio
      }, treeOpts.radioConfig, {
        trigger: 'node'
      })
    },
    computePropsOpts () {
      const $xeCascader = this
      const props = $xeCascader

      return Object.assign({}, props.optionProps)
    },
    computeNodeKeyField () {
      const $xeCascader = this

      const valueField = $xeCascader.computeValueField as string
      return valueField
    },
    computeLabelField () {
      const $xeCascader = this

      const propsOpts = $xeCascader.computePropsOpts as VxeCascaderPropTypes.OptionProps
      return propsOpts.label || 'label'
    },
    computeValueField () {
      const $xeCascader = this

      const propsOpts = $xeCascader.computePropsOpts as VxeCascaderPropTypes.OptionProps
      return propsOpts.value || 'value'
    },
    computeChildrenField () {
      const $xeCascader = this

      const propsOpts = $xeCascader.computePropsOpts as VxeCascaderPropTypes.OptionProps
      return propsOpts.children || 'children'
    },
    computeParentField () {
      const $xeCascader = this

      const propsOpts = $xeCascader.computePropsOpts as VxeCascaderPropTypes.OptionProps
      return propsOpts.parent || 'parentField'
    },
    computeHasChildField () {
      const $xeCascader = this

      const propsOpts = $xeCascader.computePropsOpts as VxeCascaderPropTypes.OptionProps
      return propsOpts.hasChild || 'hasChild'
    },
    computeRemoteOpts () {
      const $xeCascader = this
      const props = $xeCascader

      return Object.assign({}, getConfig().cascader.remoteConfig, props.remoteConfig)
    },
    computeFilterOpts () {
      const $xeCascader = this
      const props = $xeCascader

      const treeOpts = $xeCascader.computeTreeOpts as VxeCascaderPropTypes.TreeConfig
      return Object.assign({}, treeOpts.filterConfig, props.filterConfig)
    },
    computeSelectLabel () {
      const $xeCascader = this
      const props = $xeCascader
      const internalData = ($xeCascader as any).internalData as CascaderInternalData

      const { value: modelValue, lazyOptions } = props
      const { fullNodeMaps } = internalData
      const valueField = $xeCascader.computeValueField as string
      const labelField = $xeCascader.computeLabelField as string
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
      const $xeCascader = this

      const popupOpts = $xeCascader.computePopupOpts
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
    dispatchEvent (type: ValueOf<VxeCascaderEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeCascader = this
      $xeCascader.$emit(type, createEvent(evnt, { $cascader: $xeCascader }, params))
    },
    emitModel  (value: any) {
      const $xeCascader = this

      const { _events } = $xeCascader as any
      if (_events && _events.modelValue) {
        $xeCascader.$emit('modelValue', value)
      } else {
        $xeCascader.$emit('model-value', value)
      }
    },
    getNodeid (option: any) {
      const $xeCascader = this

      const nodeKeyField = $xeCascader.computeNodeKeyField
      const nodeid = option[nodeKeyField]
      return nodeid ? encodeURIComponent(nodeid) : ''
    },
    cacheDataMap  () {
      const $xeCascader = this
      const props = $xeCascader
      const internalData = $xeCascader.internalData

      const { options } = props
      const nodeKeyField = $xeCascader.computeNodeKeyField
      const childrenField = $xeCascader.computeChildrenField
      const valueField = $xeCascader.computeValueField
      const nodeMaps: Record<string, {
        item: any
        index: number
        items: any[]
        parent: any
        nodes: any[]
      }> = {}
      const keyMaps: Record<string, boolean> = {}
      XEUtils.eachTree(options, (item, index, items, path, parent, nodes) => {
        let nodeid = $xeCascader.getNodeid(item)
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
      const $xeCascader = this
      const props = $xeCascader
      const reactData = $xeCascader.reactData

      const { zIndex } = props
      if (zIndex) {
        reactData.panelIndex = zIndex
      } else if (reactData.panelIndex < getLastZIndex()) {
        reactData.panelIndex = nextZIndex()
      }
    },
    updatePlacement  () {
      const $xeCascader = this
      const props = $xeCascader
      const reactData = $xeCascader.reactData

      const { placement } = props
      const { panelIndex } = reactData
      const targetElem = $xeCascader.$refs.refElem as HTMLElement
      const panelElem = $xeCascader.$refs.refOptionPanel as HTMLDivElement
      const btnTransfer = $xeCascader.computeBtnTransfer
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
      return $xeCascader.$nextTick().then(handleStyle)
    },
    showOptionPanel  () {
      const $xeCascader = this
      const props = $xeCascader
      const reactData = $xeCascader.reactData
      const internalData = $xeCascader.internalData

      const { loading, remote, filterable } = props
      const { fullOptionList } = internalData
      const isDisabled = $xeCascader.computeIsDisabled
      const remoteOpts = $xeCascader.computeRemoteOpts
      if (!loading && !isDisabled) {
        if (internalData.hpTimeout) {
          clearTimeout(internalData.hpTimeout)
        }
        if (!reactData.initialized) {
          reactData.initialized = true
          const btnTransfer = $xeCascader.computeBtnTransfer
          const panelElem = $xeCascader.$refs.refOptionPanel as HTMLElement
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
            $xeCascader.handleSearchEvent()
          }
        }
        setTimeout(() => {
          reactData.visiblePanel = true
          $xeCascader.handleFocusSearch()
        }, 10)
        $xeCascader.updateZindex()
        $xeCascader.updatePlacement()
      }
    },
    hideOptionPanel () {
      const $xeCascader = this
      const reactData = $xeCascader.reactData
      const internalData = $xeCascader.internalData

      reactData.visiblePanel = false
      internalData.hpTimeout = setTimeout(() => {
        reactData.isAniVisible = false
      }, 350)
    },
    changeEvent (evnt: Event, selectValue: any, node: any) {
      const $xeCascader = this
      const props = $xeCascader
      const $xeForm = $xeCascader.$xeForm
      const formItemInfo = $xeCascader.formItemInfo

      const value = XEUtils.isArray(selectValue) ? selectValue.map(deNodeValue) : deNodeValue(selectValue)
      $xeCascader.emitModel(value)
      if (value !== props.value) {
        $xeCascader.dispatchEvent('change', { value, node, option: node }, evnt)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
        }
      }
    },
    clearValueEvent  (evnt: Event, selectValue: any) {
      const $xeCascader = this

      $xeCascader.changeEvent(evnt, selectValue, null)
      $xeCascader.dispatchEvent('clear', { value: selectValue }, evnt)
    },
    clearEvent  (params: any, evnt: Event) {
      const $xeCascader = this

      $xeCascader.clearValueEvent(evnt, null)
      $xeCascader.hideOptionPanel()
    },
    allCheckedPanelEvent (params: VxeButtonDefines.ClickEventParams) {
      const $xeCascader = this
      const props = $xeCascader

      const { $event } = params
      const { multiple, autoClose } = props
      const $tree = $xeCascader.$refs.refTree as VxeTreeConstructor
      if (multiple) {
        if ($tree) {
          $tree.setAllCheckboxNode(true).then(({ checkNodeKeys, checkNodes }) => {
            $xeCascader.changeEvent($event, checkNodeKeys, checkNodes[0])
            $xeCascader.dispatchEvent('all-change', { value: checkNodeKeys }, $event)
            if (autoClose) {
              $xeCascader.hideOptionPanel()
            }
          })
        }
      }
    },
    clearCheckedPanelEvent (params: VxeButtonDefines.ClickEventParams) {
      const $xeCascader = this
      const props = $xeCascader

      const { $event } = params
      const { multiple, autoClose } = props
      const $tree = $xeCascader.$refs.refTree as VxeTreeConstructor
      if ($tree) {
        const value = multiple ? [] : null
        $tree.clearCheckboxNode().then(() => {
          if (autoClose) {
            $xeCascader.hideOptionPanel()
          }
        })
        $xeCascader.changeEvent($event, value, null)
        $xeCascader.dispatchEvent('clear', { value }, $event)
      }
    },
    allExpandPanelEvent () {
      const $xeCascader = this

      const $tree = $xeCascader.$refs.refTree as VxeTreeConstructor
      if ($tree) {
        $tree.setAllExpandNode(true)
      }
    },
    clearExpandPanelEvent () {
      const $xeCascader = this

      const $tree = $xeCascader.$refs.refTree as VxeTreeConstructor
      if ($tree) {
        $tree.clearAllExpandNode()
      }
    },
    handleGlobalMousewheelEvent (evnt: MouseEvent) {
      const $xeCascader = this
      const reactData = $xeCascader.reactData

      const { visiblePanel } = reactData
      const isDisabled = $xeCascader.computeIsDisabled
      if (!isDisabled) {
        if (visiblePanel) {
          const panelElem = $xeCascader.$refs.refOptionPanel as HTMLElement
          if (getEventTargetNode(evnt, panelElem).flag) {
            $xeCascader.updatePlacement()
          } else {
            $xeCascader.hideOptionPanel()
          }
        }
      }
    },
    handleGlobalMousedownEvent  (evnt: MouseEvent) {
      const $xeCascader = this
      const reactData = $xeCascader.reactData

      const { visiblePanel } = reactData
      const isDisabled = $xeCascader.computeIsDisabled
      if (!isDisabled) {
        const el = $xeCascader.$refs.refElem as HTMLElement
        const panelElem = $xeCascader.$refs.refOptionPanel as HTMLElement
        reactData.isActivated = getEventTargetNode(evnt, el).flag || getEventTargetNode(evnt, panelElem).flag
        if (visiblePanel && !reactData.isActivated) {
          $xeCascader.hideOptionPanel()
        }
      }
    },
    handleGlobalBlurEvent () {
      const $xeCascader = this
      const reactData = $xeCascader.reactData

      const { visiblePanel, isActivated } = reactData
      if (visiblePanel) {
        $xeCascader.hideOptionPanel()
      }
      if (isActivated) {
        reactData.isActivated = false
      }
      if (visiblePanel || isActivated) {
        const $input = $xeCascader.$refs.refInput as VxeInputConstructor
        if ($input) {
          $input.blur()
        }
      }
    },
    handleGlobalResizeEvent () {
      const $xeCascader = this
      const reactData = $xeCascader.reactData

      const { visiblePanel } = reactData
      if (visiblePanel) {
        $xeCascader.updatePlacement()
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
      const $xeCascader = this
      const reactData = $xeCascader.reactData

      const isDisabled = $xeCascader.computeIsDisabled
      if (!isDisabled) {
        if (!reactData.visiblePanel) {
          reactData.triggerFocusPanel = true
          $xeCascader.showOptionPanel()
          setTimeout(() => {
            reactData.triggerFocusPanel = false
          }, 150)
        }
      }
      $xeCascader.dispatchEvent('focus', {}, evnt)
    },
    clickEvent  (evnt: MouseEvent) {
      const $xeCascader = this

      $xeCascader.togglePanelEvent(evnt)
      $xeCascader.dispatchEvent('click', {}, evnt)
    },
    blurEvent (evnt: FocusEvent) {
      const $xeCascader = this
      const reactData = $xeCascader.reactData

      reactData.isActivated = false
      $xeCascader.dispatchEvent('blur', {}, evnt)
    },
    modelSearchEvent (value: string) {
      const $xeCascader = this
      const reactData = $xeCascader.reactData

      reactData.searchValue = value
    },
    handleSearchEvent () {
      const $xeCascader = this
      const props = $xeCascader
      const reactData = $xeCascader.reactData

      const { value: modelValue, remote, remoteMethod } = props
      const { searchValue } = reactData
      const remoteOpts = $xeCascader.computeRemoteOpts
      const queryMethod = remoteOpts.queryMethod || remoteMethod
      if (remote && queryMethod && remoteOpts.enabled) {
        reactData.searchLoading = true
        Promise.resolve(
          queryMethod({ $cascader: $xeCascader, searchValue, value: modelValue })
        ).then(() => $xeCascader.$nextTick())
          .catch(() => $xeCascader.$nextTick())
          .finally(() => {
            reactData.searchLoading = false
          })
      }
    },
    togglePanelEvent  (params: any) {
      const $xeCascader = this
      const reactData = $xeCascader.reactData

      const { $event } = params
      $event.preventDefault()
      if (reactData.triggerFocusPanel) {
        reactData.triggerFocusPanel = false
      } else {
        if (reactData.visiblePanel) {
          $xeCascader.hideOptionPanel()
        } else {
          $xeCascader.showOptionPanel()
        }
      }
    },
    nodeClickEvent  (params: VxeTreeDefines.NodeClickEventParams) {
      const $xeCascader = this

      const { $event } = params
      $xeCascader.dispatchEvent('node-click', params, $event)
    },
    radioChangeEvent  (params: VxeTreeDefines.RadioChangeEventParams) {
      const $xeCascader = this

      const { value, $event, node } = params
      $xeCascader.changeEvent($event, value, node)
      $xeCascader.hideOptionPanel()
    },
    checkboxChangeEvent (params: VxeTreeDefines.CheckboxChangeEventParams) {
      const $xeCascader = this

      const { value, $event, node } = params
      $xeCascader.changeEvent($event, value, node)
    },
    loadSuccessEvent () {
      const $xeCascader = this

      $xeCascader.cacheDataMap()
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeCascader = this
      const props = $xeCascader
      const slots = $xeCascader.$scopedSlots
      const reactData = $xeCascader.reactData

      const { className, value: modelValue, multiple, loading, filterable, showTotalButoon, showCheckedButoon, showClearButton } = props
      const { initialized, isActivated, isAniVisible, visiblePanel, searchValue } = reactData
      const vSize = $xeCascader.computeSize
      const isDisabled = $xeCascader.computeIsDisabled
      const selectLabel = $xeCascader.computeSelectLabel
      const btnTransfer = $xeCascader.computeBtnTransfer
      const formReadonly = $xeCascader.computeFormReadonly
      const popupWrapperStyle = $xeCascader.computePopupWrapperStyle
      const headerSlot = slots.header
      const footerSlot = slots.footer
      const prefixSlot = slots.prefix
      const popupOpts = $xeCascader.computePopupOpts
      const popupClassName = popupOpts.className

      if (formReadonly) {
        return h('div', {
          ref: 'refElem',
          class: ['vxe-cascader--readonly', className]
        }, [
          h('span', {
            class: 'vxe-cascader-label'
          }, selectLabel)
        ])
      }
      const selectVals = XEUtils.eqNull(modelValue) ? [] : (XEUtils.isArray(modelValue) ? modelValue : [modelValue])
      return h('div', {
        ref: 'refElem',
        class: ['vxe-cascader', className ? (XEUtils.isFunction(className) ? className({ $cascader: $xeCascader }) : className) : '', {
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
            clear: $xeCascader.clearEvent,
            click: $xeCascader.clickEvent,
            focus: $xeCascader.focusEvent,
            blur: $xeCascader.blurEvent,
            'suffix-click': $xeCascader.togglePanelEvent
          },
          scopedSlots: prefixSlot
            ? {
                prefix: () => prefixSlot({})
              }
            : {}
        }),
        h('div', {
          ref: 'refOptionPanel',
          class: ['vxe-table--ignore-clear vxe-cascader--panel', popupClassName ? (XEUtils.isFunction(popupClassName) ? popupClassName({ $cascader: $xeCascader }) : popupClassName) : '', {
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
                class: 'vxe-cascader--panel-wrapper'
              }, [
                filterable
                  ? h('div', {
                    class: 'vxe-cascader--panel-search'
                  }, [
                    h(VxeInputComponent, {
                      ref: 'refInpSearch',
                      class: 'vxe-cascader-search--input',
                      props: {
                        value: searchValue,
                        title: selectLabel,
                        clearable: true,
                        disabled: false,
                        readonly: false,
                        placeholder: getI18n('vxe.cascader.search'),
                        prefixIcon: getIcon().INPUT_SEARCH
                      },
                      on: {
                        'model-value': $xeCascader.modelSearchEvent
                      }
                    })
                  ])
                  : renderEmptyElement($xeCascader),
                showTotalButoon || (showCheckedButoon && multiple) || showClearButton || headerSlot
                  ? h('div', {
                    class: 'vxe-cascader--panel-header'
                  }, headerSlot
                    ? headerSlot({})
                    : [
                        h('div', {
                          class: 'vxe-cascader--header-button'
                        }, [
                          showTotalButoon
                            ? h('div', {
                              class: 'vxe-cascader--header-total'
                            }, getI18n('vxe.cascader.total', [selectVals.length]))
                            : renderEmptyElement($xeCascader),
                          h('div', {
                            class: 'vxe-cascader--header-btns'
                          }, [
                            (showCheckedButoon && multiple)
                              ? h(VxeButtonComponent, {
                                props: {
                                  content: getI18n('vxe.cascader.allChecked'),
                                  mode: 'text'
                                },
                                on: {
                                  click: $xeCascader.allCheckedPanelEvent
                                }
                              })
                              : renderEmptyElement($xeCascader),
                            showClearButton
                              ? h(VxeButtonComponent, {
                                props: {
                                  content: getI18n('vxe.cascader.clearChecked'),
                                  mode: 'text'
                                },
                                on: {
                                  click: $xeCascader.clearCheckedPanelEvent
                                }
                              })
                              : renderEmptyElement($xeCascader)
                          ])
                        ])
                      ])
                  : renderEmptyElement($xeCascader),
                h('div', {
                  class: 'vxe-cascader--panel-body'
                }, [
                  h('div', {
                    ref: 'refTreeWrapper',
                    class: 'vxe-cascader-tree--wrapper',
                    style: popupWrapperStyle
                  }, [])
                ]),
                footerSlot
                  ? h('div', {
                    class: 'vxe-cascader--panel-footer'
                  }, footerSlot({}))
                  : renderEmptyElement($xeCascader)
              ])
            ]
          : [])
      ])
    }
  },
  watch: {
    options () {
      const $xeCascader = this

      $xeCascader.cacheDataMap()
    }
  },
  created () {
    const $xeCascader = this

    $xeCascader.cacheDataMap()
  },
  mounted () {
    const $xeCascader = this

    globalEvents.on($xeCascader, 'mousewheel', $xeCascader.handleGlobalMousewheelEvent)
    globalEvents.on($xeCascader, 'mousedown', $xeCascader.handleGlobalMousedownEvent)
    globalEvents.on($xeCascader, 'blur', $xeCascader.handleGlobalBlurEvent)
    globalEvents.on($xeCascader, 'resize', $xeCascader.handleGlobalResizeEvent)
  },
  beforeDestroy () {
    const $xeCascader = this

    const panelElem = $xeCascader.$refs.refOptionPanel as HTMLElement | undefined
    if (panelElem && panelElem.parentNode) {
      panelElem.parentNode.removeChild(panelElem)
    }
    globalEvents.off($xeCascader, 'mousewheel')
    globalEvents.off($xeCascader, 'mousedown')
    globalEvents.off($xeCascader, 'blur')
    globalEvents.off($xeCascader, 'resize')
  },
  destroyed () {
    const $xeCascader = this
    const internalData = $xeCascader.internalData

    XEUtils.assign(internalData, createInternalData())
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
