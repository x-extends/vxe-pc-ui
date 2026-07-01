import { ref, computed, h, PropType, nextTick, inject, provide, reactive, Teleport, onMounted, onBeforeUnmount, watch, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { getConfig, getI18n, getIcon, globalEvents, createEvent, useSize, renderEmptyElement } from '../../ui'
import { getEventTargetNode, updatePanelPlacement, toCssUnit } from '../../ui/src/dom'
import { getLastZIndex, nextZIndex, deModelValue } from '../../ui/src/utils'
import { createComponentLog } from '../../ui/src/log'
import { getSlotVNs } from '../../ui/src/vn'
import XEUtils from 'xe-utils'
import VxeInputComponent from '../../input'
import VxeButtonComponent from '../../button'
import VxeTreeComponent from '../../tree'

import type { TreeSelectReactData, VxeTreeSelectEmits, TreeSelectInternalData, VxeButtonEvents, VxeInputEvents, ValueOf, VxeComponentStyleType, TreeSelectPrivateRef, TreeSelectPrivateMethods, TreeSelectMethods, VxeTreeSelectPrivateComputed, VxeTreeSelectPropTypes, VxeTreeSelectConstructor, VxeFormDefines, VxeDrawerConstructor, VxeDrawerMethods, VxeTreeSelectPrivateMethods, VxeFormConstructor, VxeFormPrivateMethods, VxeInputConstructor, VxeModalConstructor, VxeModalMethods, VxeTreeConstructor, VxeTreeEvents, VxeTreeSelectDefines } from '../../../types'
import type { VxeTableConstructor, VxeTablePrivateMethods } from '../../../types/components/table'

const { warnLog, errLog } = createComponentLog('tree-select')

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
    isActivated: false,
    fullOptFlag: 1,
    lazyOptFlag: 1
  }
}

function createInternalData (): TreeSelectInternalData {
  return {
    // hpTimeout: undefined,
    fullOptionList: [],
    fullNodeMaps: {},
    lazyNodeMaps: {}
  }
}

export default defineVxeComponent({
  name: 'VxeTreeSelect',
  props: {
    modelValue: [String, Number, Array] as PropType<VxeTreeSelectPropTypes.ModelValue>,
    clearable: {
      type: Boolean as PropType<VxeTreeSelectPropTypes.Clearable>,
      default: () => getConfig().treeSelect.clearable
    },
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
    showFullLabel: {
      type: Boolean as PropType<VxeTreeSelectPropTypes.ShowFullLabel>,
      default: () => getConfig().treeSelect.showFullLabel
    },
    separator: {
      type: String as PropType<VxeTreeSelectPropTypes.Separator>,
      default: () => getConfig().treeSelect.separator
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
    showRadio: {
      type: Boolean as PropType<VxeTreeSelectPropTypes.ShowRadio>,
      default: () => getConfig().treeSelect.showRadio
    },
    radioConfig: Object as PropType<VxeTreeSelectPropTypes.RadioConfig>,
    showCheckbox: {
      type: Boolean as PropType<VxeTreeSelectPropTypes.ShowCheckbox>,
      default: () => getConfig().treeSelect.showCheckbox
    },
    checkboxConfig: Object as PropType<VxeTreeSelectPropTypes.CheckboxConfig>,
    popupConfig: Object as PropType<VxeTreeSelectPropTypes.PopupConfig>,
    treeConfig: Object as PropType<VxeTreeSelectPropTypes.TreeConfig>,
    menuConfig: Object as PropType<VxeTreeSelectPropTypes.MenuConfig>,
    virtualYConfig: Object as PropType<VxeTreeSelectPropTypes.VirtualYConfig>,
    /**
     * 已废弃，被 checked-closable, clear-closable 替换
     * @deprecated
     */
    autoClose: {
      type: Boolean as PropType<VxeTreeSelectPropTypes.AutoClose>,
      default: () => getConfig().treeSelect.autoClose
    },
    checkedClosable: {
      type: Boolean as PropType<VxeTreeSelectPropTypes.CheckedClosable>,
      default: () => getConfig().treeSelect.checkedClosable
    },
    clearClosable: {
      type: Boolean as PropType<VxeTreeSelectPropTypes.ClearClosable>,
      default: () => getConfig().treeSelect.clearClosable
    },
    showCloseButton: {
      type: Boolean as PropType<VxeTreeSelectPropTypes.ShowCloseButton>,
      default: () => getConfig().treeSelect.showCloseButton
    },
    showTotalButton: {
      type: Boolean as PropType<VxeTreeSelectPropTypes.ShowTotalButton>,
      default: () => getConfig().treeSelect.showTotalButton
    },
    showCheckedButton: {
      type: Boolean as PropType<VxeTreeSelectPropTypes.ShowCheckedButton>,
      default: () => getConfig().treeSelect.showCheckedButton
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
  emits: [
    'update:modelValue',
    'change',
    'all-change',
    'clear',
    'blur',
    'focus',
    'click',
    'node-click',
    'visible-change'
  ] as VxeTreeSelectEmits,
  setup (props, context) {
    const { emit, slots } = context

    const $xeModal = inject<(VxeModalConstructor & VxeModalMethods)| null>('$xeModal', null)
    const $xeDrawer = inject<(VxeDrawerConstructor & VxeDrawerMethods) | null>('$xeDrawer', null)
    const $xeTable = inject<(VxeTableConstructor & VxeTablePrivateMethods) | null>('$xeTable', null)
    const $xeForm = inject<(VxeFormConstructor & VxeFormPrivateMethods) | null>('$xeForm', null)
    const formItemInfo = inject<VxeFormDefines.ProvideItemInfo | null>('xeFormItemInfo', null)

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const refElem = ref<HTMLDivElement>()
    const refInput = ref<VxeInputConstructor>()
    const refInpSearch = ref<VxeInputConstructor>()
    const refTreeWrapper = ref<HTMLDivElement>()
    const refOptionPanel = ref<HTMLDivElement>()
    const refTree = ref<VxeTreeConstructor>()

    const reactData = reactive(createReactData())

    const internalData = createInternalData()

    const refMaps: TreeSelectPrivateRef = {
      refElem
    }

    const computeFormReadonly = computed(() => {
      const { readonly } = props
      if (readonly === null) {
        if ($xeForm) {
          return $xeForm.props.readonly
        }
        return false
      }
      return readonly
    })

    const computeIsDisabled = computed(() => {
      const { disabled } = props
      if (disabled === null) {
        if ($xeForm) {
          return $xeForm.props.disabled
        }
        return false
      }
      return disabled
    })

    const computeBtnTransfer = computed(() => {
      const popupOpts = computePopupOpts.value
      const { transfer } = popupOpts
      if (XEUtils.isBoolean(transfer)) {
        return transfer
      }
      if (props.transfer === null) {
        const globalTransfer = getConfig().treeSelect.transfer
        if (XEUtils.isBoolean(globalTransfer)) {
          return globalTransfer
        }
        if ($xeTable || $xeModal || $xeDrawer || $xeForm) {
          return true
        }
      }
      return props.transfer
    })

    const computePopupOpts = computed(() => {
      return Object.assign({}, getConfig().treeSelect.popupConfig, props.popupConfig)
    })

    const computeTreeOpts = computed(() => {
      return Object.assign({}, getConfig().treeSelect.treeConfig, props.treeConfig, { data: undefined })
    })

    const computeMenuOpts = computed(() => {
      return Object.assign({}, getConfig().treeSelect.menuConfig, props.menuConfig)
    })

    const computeTreeNodeOpts = computed(() => {
      const treeOpts = computeTreeOpts.value
      return Object.assign({ isHover: true }, treeOpts.nodeConfig)
    })

    const computeTreeCheckboxOpts = computed(() => {
      const { showCheckbox, checkboxConfig } = props
      const treeOpts = computeTreeOpts.value
      return Object.assign({
        showIcon: XEUtils.isBoolean(showCheckbox) ? showCheckbox : !!treeOpts.showCheckbox
      }, treeOpts.checkboxConfig, checkboxConfig, {
        trigger: 'node'
      })
    })

    const computeTreeRadioOpts = computed(() => {
      const { showRadio, radioConfig } = props
      const treeOpts = computeTreeOpts.value
      return Object.assign({
        showIcon: XEUtils.isBoolean(showRadio) ? showRadio : !!treeOpts.showRadio
      }, treeOpts.radioConfig, radioConfig, {
        trigger: 'node'
      })
    })

    const computePropsOpts = computed(() => {
      return props.optionProps || {}
    })

    const computeNodeKeyField = computed(() => {
      const treeOpts = computeTreeOpts.value
      return treeOpts.keyField || 'id'
    })

    const computeLabelField = computed(() => {
      const propsOpts = computePropsOpts.value
      return propsOpts.label || 'label'
    })

    const computeValueField = computed(() => {
      const propsOpts = computePropsOpts.value
      return propsOpts.value || 'value'
    })

    const computeChildrenField = computed(() => {
      const propsOpts = computePropsOpts.value
      return propsOpts.children || 'children'
    })

    const computeNodeParentField = computed(() => {
      const propsOpts = computePropsOpts.value
      const treeOpts = computeTreeOpts.value
      return propsOpts.parent || treeOpts.parentField || 'parentId'
    })

    const computeHasChildField = computed(() => {
      const propsOpts = computePropsOpts.value
      return propsOpts.hasChild || 'hasChild'
    })

    const computeVirtualYOpts = computed(() => {
      return Object.assign({} as { gt: number }, getConfig().treeSelect.virtualYConfig, props.virtualYConfig)
    })

    const computeRemoteOpts = computed(() => {
      return Object.assign({}, getConfig().treeSelect.remoteConfig, props.remoteConfig)
    })

    const computeFilterOpts = computed(() => {
      const treeOpts = computeTreeOpts.value
      return Object.assign({}, treeOpts.filterConfig, props.filterConfig)
    })

    const computeSelectVals = computed(() => {
      const { modelValue } = props
      return XEUtils.eqNull(modelValue) ? [] : (XEUtils.isArray(modelValue) ? modelValue : [modelValue])
    })

    const computeSelectLabel = computed(() => {
      const { showFullLabel } = props
      const { fullOptFlag, lazyOptFlag } = reactData
      const { fullNodeMaps, lazyNodeMaps } = internalData
      const labelField = computeLabelField.value
      const selectVals = computeSelectVals.value
      return selectVals.map(val => {
        const cacheItem = fullNodeMaps[val]
        if (fullOptFlag && cacheItem) {
          return showFullLabel ? cacheItem.fullLabel : cacheItem.item[labelField]
        }
        if (lazyOptFlag) {
          const lazyCacheItem = lazyNodeMaps[val]
          if (lazyCacheItem) {
            return showFullLabel ? lazyCacheItem.fullLabel : lazyCacheItem.item[labelField]
          }
        }
        return val
      }).join(', ')
    })

    const computePopupWrapperStyle = computed(() => {
      const popupOpts = computePopupOpts.value
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
    })

    const computeMaps: VxeTreeSelectPrivateComputed = {
    }

    const $xeTreeSelect = {
      xID,
      props,
      context,
      reactData,
      internalData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeTreeSelectConstructor & VxeTreeSelectPrivateMethods

    const dispatchEvent = (type: ValueOf<VxeTreeSelectEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $treeSelect: $xeTreeSelect }, params))
    }

    const emitModel = (value: any) => {
      emit('update:modelValue', value)
    }

    const callSlot = (slotFunc: ((params: any) => any) | string | null, params: any) => {
      if (slotFunc) {
        if (XEUtils.isString(slotFunc)) {
          slotFunc = slots[slotFunc] || null
        }
        if (XEUtils.isFunction(slotFunc)) {
          return getSlotVNs(slotFunc(params))
        }
      }
      return []
    }

    const treeSelectMethods: TreeSelectMethods = {
      dispatchEvent
    }

    const getNodeid = (option: any) => {
      const nodeKeyField = computeNodeKeyField.value
      const nodeid = option[nodeKeyField]
      return nodeid ? encodeURIComponent(nodeid) : ''
    }

    const handleCacheMap = (optList: VxeTreeSelectPropTypes.Options) => {
      const { separator } = props
      const treeOpts = computeTreeOpts.value
      const nodeKeyField = computeNodeKeyField.value
      const nodeParentField = computeNodeParentField.value
      const childrenField = computeChildrenField.value
      const valueField = computeValueField.value
      const labelField = computeLabelField.value
      const { transform } = treeOpts
      const nodeMaps: Record<string, VxeTreeSelectDefines.NodeCacheObj> = {}
      const keyMaps: Record<string, boolean> = {}
      const handleOptNode = (item: any, index: number, items: any[], path: string[], parentItem: any, nodes: any[]) => {
        let nodeid = getNodeid(item)
        if (!nodeid) {
          nodeid = getOptUniqueId()
        }
        if (keyMaps[nodeid]) {
          errLog('vxe.error.repeatKey', [nodeKeyField, nodeid])
        }
        keyMaps[nodeid] = true
        const value = item[valueField]
        if (nodeMaps[value]) {
          errLog('vxe.error.repeatKey', [valueField, value])
        }
        nodeMaps[value] = {
          item,
          index,
          items,
          parent: parentItem,
          nodes,
          fullLabel: nodes.map(item => item[labelField]).join((separator || ' / '))
        }
      }
      if (optList) {
        if (transform) {
          // if (showFullLabel) {
          const treeList = XEUtils.toArrayTree(optList, {
            key: nodeKeyField,
            parentKey: nodeParentField,
            mapChildren: childrenField,
            rootParentValue: treeOpts.rootParentValue,
            rootValues: treeOpts.rootValues
          })
          XEUtils.eachTree(treeList, handleOptNode, { children: childrenField })
          // } else {
          //   optList.forEach((item, index, items) => {
          //     handleOptNode(item, index, items, [], null, [])
          //   })
          // }
        } else {
          XEUtils.eachTree(optList, handleOptNode, { children: childrenField })
        }
      }
      return nodeMaps
    }

    const cacheDataMap = () => {
      const { options } = props
      internalData.fullNodeMaps = handleCacheMap(options || [])
      internalData.fullOptionList = options || []
      reactData.fullOptFlag++
    }

    const cacheLazyDataMap = () => {
      const { lazyOptions } = props
      internalData.lazyNodeMaps = handleCacheMap(lazyOptions || [])
      reactData.lazyOptFlag++
    }

    const updateZindex = () => {
      const popupOpts = computePopupOpts.value
      const customZIndex = popupOpts.zIndex || props.zIndex
      if (customZIndex) {
        reactData.panelIndex = XEUtils.toNumber(customZIndex)
      } else if (reactData.panelIndex < getLastZIndex()) {
        reactData.panelIndex = nextZIndex()
      }
    }

    const updatePlacement = () => {
      const { placement } = props
      const { panelIndex } = reactData
      const targetElem = refElem.value
      const panelElem = refOptionPanel.value
      const btnTransfer = computeBtnTransfer.value
      const popupOpts = computePopupOpts.value
      const handleStyle = () => {
        const ppObj = updatePanelPlacement(targetElem, panelElem, {
          placement: popupOpts.placement || placement,
          defaultPlacement: popupOpts.defaultPlacement,
          teleportTo: btnTransfer
        })
        const panelStyle: { [key: string]: string | number } = Object.assign(ppObj.style, {
          zIndex: panelIndex
        })
        reactData.panelStyle = panelStyle
        reactData.panelPlacement = ppObj.placement
      }
      handleStyle()
      return nextTick().then(handleStyle)
    }

    const showOptionPanel = (evnt?: Event) => {
      const { loading, remote, filterable } = props
      const { fullOptionList } = internalData
      const isDisabled = computeIsDisabled.value
      const remoteOpts = computeRemoteOpts.value
      if (!loading && !isDisabled) {
        clearTimeout(internalData.hpTimeout)
        if (!reactData.initialized) {
          reactData.initialized = true
        }
        reactData.isActivated = true
        reactData.isAniVisible = true
        if (filterable) {
          if (remote && remoteOpts.enabled && remoteOpts.autoLoad && !fullOptionList.length) {
            handleSearchEvent()
          }
        }
        setTimeout(() => {
          reactData.visiblePanel = true
          handleFocusSearch()
          updatePlacement()
        }, 10)
        updateZindex()
        updatePlacement()
        dispatchEvent('visible-change', { visible: true }, evnt || null)
      }
    }

    const hideOptionPanel = (evnt?: Event) => {
      reactData.visiblePanel = false
      internalData.hpTimeout = setTimeout(() => {
        reactData.isAniVisible = false
      }, 350)
      dispatchEvent('visible-change', { visible: false }, evnt || null)
    }

    const changeEvent = (evnt: Event, selectValue: any, node: any) => {
      const value = XEUtils.isArray(selectValue) ? selectValue.map(deModelValue) : deModelValue(selectValue)
      emitModel(value)
      if (value !== props.modelValue) {
        dispatchEvent('change', { value, node, option: node }, evnt)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
        }
      }
    }

    const clearValueEvent = (evnt: Event, selectValue: any) => {
      changeEvent(evnt, selectValue, null)
      dispatchEvent('clear', { value: selectValue }, evnt)
    }

    const clearEvent: VxeInputEvents.Clear = (params) => {
      const { $event } = params
      clearValueEvent($event, null)
      hideOptionPanel($event)
    }

    const allCheckedPanelEvent: VxeButtonEvents.Click = (params) => {
      const { $event } = params
      const { multiple, autoClose, checkedClosable } = props
      const $tree = refTree.value
      if (multiple) {
        if ($tree) {
          $tree.setAllCheckboxNode(true).then(({ checkNodeKeys, checkNodes }) => {
            changeEvent($event, checkNodeKeys, checkNodes[0])
            dispatchEvent('all-change', { value: checkNodeKeys }, $event)
            if (XEUtils.isBoolean(checkedClosable) ? checkedClosable : autoClose) {
              hideOptionPanel($event)
            }
          })
        }
      }
    }

    const clearCheckedPanelEvent: VxeButtonEvents.Click = (params) => {
      const { $event } = params
      const { multiple, autoClose, clearClosable } = props
      const $tree = refTree.value
      if ($tree) {
        const value = multiple ? [] : null
        $tree.clearCheckboxNode().then(() => {
          if (XEUtils.isBoolean(clearClosable) ? clearClosable : autoClose) {
            hideOptionPanel($event)
          }
        })
        changeEvent($event, value, null)
        dispatchEvent('clear', { value }, $event)
      }
    }

    const closePanelEvent: VxeButtonEvents.Click = (params) => {
      const { $event } = params
      hideOptionPanel($event)
    }

    const allExpandPanelEvent: VxeButtonEvents.Click = () => {
      const $tree = refTree.value
      if ($tree) {
        $tree.setAllExpandNode(true)
      }
    }

    const clearExpandPanelEvent: VxeButtonEvents.Click = () => {
      const $tree = refTree.value
      if ($tree) {
        $tree.clearAllExpandNode()
      }
    }

    const handleGlobalMousewheelEvent = (evnt: MouseEvent) => {
      const { visiblePanel } = reactData
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        if (visiblePanel) {
          const panelElem = refOptionPanel.value
          if (getEventTargetNode(evnt, panelElem).flag) {
            updatePlacement()
          } else {
            hideOptionPanel(evnt)
          }
        }
      }
    }

    const handleGlobalMousedownEvent = (evnt: MouseEvent) => {
      const { visiblePanel } = reactData
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        const el = refElem.value
        const panelElem = refOptionPanel.value
        reactData.isActivated = getEventTargetNode(evnt, el).flag || getEventTargetNode(evnt, panelElem).flag
        if (visiblePanel && !reactData.isActivated) {
          hideOptionPanel(evnt)
        }
      }
    }

    const handleGlobalBlurEvent = (evnt: Event) => {
      const { visiblePanel, isActivated } = reactData
      if (visiblePanel) {
        hideOptionPanel(evnt)
      }
      if (isActivated) {
        reactData.isActivated = false
      }
      if (visiblePanel || isActivated) {
        const $input = refInput.value
        if ($input) {
          $input.blur()
        }
      }
    }

    const handleGlobalResizeEvent = () => {
      const { visiblePanel } = reactData
      if (visiblePanel) {
        updatePlacement()
      }
    }

    const handleFocusSearch = () => {
      if (props.filterable) {
        nextTick(() => {
          const inpSearch = refInpSearch.value
          if (inpSearch) {
            inpSearch.focus()
          }
        })
      }
    }

    const focusEvent = (evnt: FocusEvent) => {
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        if (!reactData.visiblePanel) {
          reactData.triggerFocusPanel = true
          showOptionPanel(evnt)
          setTimeout(() => {
            reactData.triggerFocusPanel = false
          }, 150)
        }
      }
      dispatchEvent('focus', {}, evnt)
    }

    const clickEvent = (evnt: MouseEvent) => {
      togglePanelEvent(evnt)
      dispatchEvent('click', {}, evnt)
    }

    const blurEvent = (evnt: FocusEvent) => {
      reactData.isActivated = false
      dispatchEvent('blur', {}, evnt)
    }

    const modelSearchEvent = (value: string) => {
      reactData.searchValue = value
    }

    const handleSearchEvent = () => {
      const { modelValue, remote, remoteMethod } = props
      const { searchValue } = reactData
      const remoteOpts = computeRemoteOpts.value
      const queryMethod = remoteOpts.queryMethod || remoteMethod
      if (remote && queryMethod && remoteOpts.enabled) {
        reactData.searchLoading = true
        Promise.resolve(
          queryMethod({ $treeSelect: $xeTreeSelect, searchValue, value: modelValue })
        ).then(() => nextTick())
          .catch(() => nextTick())
          .finally(() => {
            reactData.searchLoading = false
          })
      }
    }

    const togglePanelEvent = (params: any) => {
      const { $event } = params
      $event.preventDefault()
      if (reactData.triggerFocusPanel) {
        reactData.triggerFocusPanel = false
      } else {
        if (reactData.visiblePanel) {
          hideOptionPanel($event)
        } else {
          showOptionPanel($event)
        }
      }
    }

    const nodeExpandEvent = () => {
      updatePlacement()
    }

    const nodeClickEvent: VxeTreeEvents.NodeClick = (params) => {
      const { $event } = params
      dispatchEvent('node-click', params, $event)
    }

    const radioChangeEvent: VxeTreeEvents.RadioChange = (params) => {
      const { value, $event, node } = params
      changeEvent($event, value, node)
      hideOptionPanel($event)
    }

    const checkboxChangeEvent: VxeTreeEvents.CheckboxChange = (params) => {
      const { value, $event, node } = params
      changeEvent($event, value, node)
    }

    const loadSuccessEvent = () => {
      cacheDataMap()
    }

    const treeSelectPrivateMethods: TreeSelectPrivateMethods = {
    }

    Object.assign($xeTreeSelect, treeSelectMethods, treeSelectPrivateMethods)

    const renderVN = () => {
      const { className, modelValue, multiple, options, loading, menuConfig, filterable, showTotalButton, showCheckedButton, showClearButton, showExpandButton, showCloseButton } = props
      const { initialized, isActivated, isAniVisible, visiblePanel, searchValue } = reactData
      const vSize = computeSize.value
      const isDisabled = computeIsDisabled.value
      const selectLabel = computeSelectLabel.value
      const btnTransfer = computeBtnTransfer.value
      const formReadonly = computeFormReadonly.value
      const popupWrapperStyle = computePopupWrapperStyle.value
      const headerSlot = slots.header
      const footerSlot = slots.footer
      const prefixSlot = slots.prefix
      const popupOpts = computePopupOpts.value
      const ppClassName = popupOpts.className || props.popupClassName

      if (formReadonly) {
        return h('div', {
          ref: refElem,
          class: ['vxe-tree-select--readonly', className]
        }, [
          h('span', {
            class: 'vxe-tree-select-label'
          }, selectLabel)
        ])
      }
      const treeOpts = computeTreeOpts.value
      const menuOpts = computeMenuOpts.value
      const treeNodeOpts = computeTreeNodeOpts.value
      const treeCheckboxOpts = computeTreeCheckboxOpts.value
      const treeRadioOpts = computeTreeRadioOpts.value
      const nodeKeyField = computeNodeKeyField.value
      const labelField = computeLabelField.value
      const valueField = computeValueField.value
      const childrenField = computeChildrenField.value
      const nodeParentField = computeNodeParentField.value
      const hasChildField = computeHasChildField.value
      const virtualYOpts = computeVirtualYOpts.value
      const filterOpts = computeFilterOpts.value
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
          treeScopedSlots.icon = (slotParams) => callSlot(treeIconSlot, slotParams) as VNode[]
        }
        if (treeTitleSlot) {
          treeScopedSlots.title = (slotParams) => callSlot(treeTitleSlot, slotParams) as VNode[]
        }
        if (treeExtraSlot) {
          treeScopedSlots.extra = (slotParams) => callSlot(treeExtraSlot, slotParams) as VNode[]
        }
      }
      return h('div', {
        ref: refElem,
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
          ref: refInput,
          clearable: props.clearable,
          placeholder: loading ? getI18n('vxe.select.loadingText') : props.placeholder,
          editable: false,
          disabled: isDisabled,
          type: 'text',
          prefixIcon: props.prefixIcon,
          suffixIcon: loading ? getIcon().TREE_SELECT_LOADED : (visiblePanel ? getIcon().TREE_SELECT_OPEN : getIcon().TREE_SELECT_CLOSE),
          modelValue: loading ? '' : selectLabel,
          title: selectLabel,
          onClear: clearEvent,
          onClick: clickEvent,
          onFocus: focusEvent,
          onBlur: blurEvent,
          onSuffixClick: togglePanelEvent
        }, prefixSlot
          ? {
              prefix: () => prefixSlot({})
            }
          : {}),
        h(Teleport, {
          to: 'body',
          disabled: btnTransfer ? !initialized : true
        }, [
          h('div', {
            ref: refOptionPanel,
            class: ['vxe-table--ignore-clear vxe-tree-select--panel', ppClassName ? (XEUtils.isFunction(ppClassName) ? ppClassName({ $treeSelect: $xeTreeSelect }) : ppClassName) : '', {
              [`size--${vSize}`]: vSize,
              'is--transfer': btnTransfer,
              'ani--leave': !loading && isAniVisible,
              'ani--enter': !loading && visiblePanel
            }],
            placement: reactData.panelPlacement,
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
                        ref: refInpSearch,
                        class: 'vxe-tree-select-search--input',
                        modelValue: searchValue,
                        clearable: true,
                        disabled: false,
                        readonly: false,
                        placeholder: getI18n('vxe.treeSelect.search'),
                        prefixIcon: getIcon().INPUT_SEARCH,
                        'onUpdate:modelValue': modelSearchEvent
                      })
                    ])
                    : renderEmptyElement($xeTreeSelect),
                  (showCheckedButton && multiple) || showClearButton || showExpandButton || headerSlot
                    ? h('div', {
                      class: 'vxe-tree-select--panel-header'
                    }, headerSlot
                      ? headerSlot({})
                      : [
                          h('div', {
                            class: 'vxe-tree-select--header-button'
                          }, [
                            (showCheckedButton && multiple) || showClearButton
                              ? h('div', {
                                class: 'vxe-tree-select--selected-btns'
                              }, [
                                (showCheckedButton && multiple)
                                  ? h(VxeButtonComponent, {
                                    content: getI18n('vxe.treeSelect.allChecked'),
                                    mode: 'text',
                                    onClick: allCheckedPanelEvent
                                  })
                                  : renderEmptyElement($xeTreeSelect),
                                showClearButton
                                  ? h(VxeButtonComponent, {
                                    content: getI18n('vxe.treeSelect.clearChecked'),
                                    mode: 'text',
                                    onClick: clearCheckedPanelEvent
                                  })
                                  : renderEmptyElement($xeTreeSelect)
                              ])
                              : renderEmptyElement($xeTreeSelect),
                            showExpandButton
                              ? h('div', {
                                class: 'vxe-tree-select--expand-btns'
                              }, [
                                h(VxeButtonComponent, {
                                  content: getI18n('vxe.treeSelect.allExpand'),
                                  mode: 'text',
                                  onClick: allExpandPanelEvent
                                }),
                                h(VxeButtonComponent, {
                                  content: getI18n('vxe.treeSelect.clearExpand'),
                                  mode: 'text',
                                  onClick: clearExpandPanelEvent
                                })
                              ])
                              : renderEmptyElement($xeTreeSelect)
                          ])
                        ])
                    : renderEmptyElement($xeTreeSelect),
                  h('div', {
                    class: 'vxe-tree-select--panel-body'
                  }, [
                    h('div', {
                      ref: refTreeWrapper,
                      class: 'vxe-tree-select-tree--wrapper',
                      style: popupWrapperStyle
                    }, [
                      h(VxeTreeComponent, {
                        ref: refTree,
                        class: 'vxe-tree-select--tree',
                        height: popupOpts.height ? '100%' : treeOpts.height,
                        minHeight: treeOpts.minHeight,
                        maxHeight: popupOpts.height ? '' : treeOpts.maxHeight,
                        autoResize: true,
                        data: options,
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
                        parentField: nodeParentField,
                        hasChildField: treeOpts.hasChildField || hasChildField,
                        accordion: treeOpts.accordion,
                        expandAll: treeOpts.expandAll,
                        expandNodeKeys: treeOpts.expandNodeKeys,
                        nodeConfig: treeNodeOpts,
                        lazy: treeOpts.lazy,
                        loadMethod: treeOpts.loadMethod,
                        toggleMethod: treeOpts.toggleMethod,
                        transform: treeOpts.transform,
                        rootParentValue: treeOpts.rootParentValue,
                        rootValues: treeOpts.rootValues,
                        trigger: treeOpts.trigger,
                        showIcon: treeOpts.showIcon,
                        showLine: treeOpts.showLine,
                        iconOpen: treeOpts.iconOpen,
                        iconLoaded: treeOpts.iconLoaded,
                        iconClose: treeOpts.iconClose,
                        filterValue: searchValue,
                        filterConfig: filterOpts,
                        menuConfig: menuConfig ? menuOpts : undefined,
                        virtualYConfig: virtualYOpts,
                        onNodeExpand: nodeExpandEvent,
                        onNodeClick: nodeClickEvent,
                        onRadioChange: radioChangeEvent,
                        onCheckboxChange: checkboxChangeEvent,
                        onLoadSuccess: loadSuccessEvent
                      }, treeScopedSlots)
                    ])
                  ]),
                  footerSlot || showTotalButton || showCloseButton
                    ? h('div', {
                      class: 'vxe-tree-select--panel-footer'
                    }, footerSlot
                      ? footerSlot({})
                      : [
                          h('div', {
                            class: 'vxe-tree-select--footer-button'
                          }, [
                            showTotalButton
                              ? h('div', {
                                class: 'vxe-tree-select--total-btns'
                              }, getI18n('vxe.treeSelect.total', [selectVals.length]))
                              : renderEmptyElement($xeTreeSelect),
                            showCloseButton
                              ? h('div', {
                                class: 'vxe-tree-select--oper-btns'
                              }, [
                                h(VxeButtonComponent, {
                                  content: getI18n('vxe.select.close'),
                                  mode: 'text',
                                  onClick: closePanelEvent
                                })
                              ])
                              : renderEmptyElement($xeTreeSelect)
                          ])
                        ])
                    : renderEmptyElement($xeTreeSelect)
                ])
              ]
            : [])
        ])
      ])
    }

    const optFlag = ref(0)
    watch(() => props.options ? props.options.length : -1, () => {
      optFlag.value++
    })
    watch(() => props.options, () => {
      optFlag.value++
    })
    watch(optFlag, () => {
      cacheDataMap()
    })

    const lazyOptFlag = ref(0)
    watch(() => props.lazyOptions ? props.lazyOptions.length : -1, () => {
      lazyOptFlag.value++
    })
    watch(() => props.lazyOptions, () => {
      lazyOptFlag.value++
    })
    watch(lazyOptFlag, () => {
      cacheLazyDataMap()
    })

    cacheDataMap()
    cacheLazyDataMap()

    onMounted(() => {
      if (XEUtils.isBoolean(props.autoClose)) {
        warnLog('vxe.error.delProp', ['auto-close', 'checked-closable | clear-closable'])
      }
      globalEvents.on($xeTreeSelect, 'mousewheel', handleGlobalMousewheelEvent)
      globalEvents.on($xeTreeSelect, 'mousedown', handleGlobalMousedownEvent)
      globalEvents.on($xeTreeSelect, 'blur', handleGlobalBlurEvent)
      globalEvents.on($xeTreeSelect, 'resize', handleGlobalResizeEvent)
    })

    onBeforeUnmount(() => {
      globalEvents.off($xeTreeSelect, 'mousewheel')
      globalEvents.off($xeTreeSelect, 'mousedown')
      globalEvents.off($xeTreeSelect, 'blur')
      globalEvents.off($xeTreeSelect, 'resize')
      XEUtils.assign(reactData, createReactData())
      XEUtils.assign(internalData, createInternalData())
    })

    provide('$xeTreeSelect', $xeTreeSelect)

    $xeTreeSelect.renderVN = renderVN

    return $xeTreeSelect
  },
  render () {
    return this.renderVN()
  }
})
