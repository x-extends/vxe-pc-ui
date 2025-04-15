import { defineComponent, ref, computed, h, PropType, nextTick, inject, provide, reactive, Teleport, onMounted, onUnmounted, watch } from 'vue'
import { getConfig, getI18n, getIcon, globalEvents, createEvent, useSize, renderEmptyElement } from '../../ui'
import { getEventTargetNode, getAbsolutePos, toCssUnit } from '../../ui/src/dom'
import { getLastZIndex, nextZIndex } from '../../ui/src/utils'
import { errLog } from '../../ui/src/log'
import XEUtils from 'xe-utils'
import VxeInputComponent from '../../input/src/input'
import VxeTreeComponent from '../../tree/src/tree'

import type { TreeSelectReactData, VxeTreeSelectEmits, TreeSelectInternalData, ValueOf, VxeComponentStyleType, TreeSelectPrivateRef, TreeSelectPrivateMethods, TreeSelectMethods, VxeTreeSelectPrivateComputed, VxeTreeSelectPropTypes, VxeTreeSelectConstructor, VxeFormDefines, VxeDrawerConstructor, VxeDrawerMethods, VxeTreeSelectPrivateMethods, VxeFormConstructor, VxeFormPrivateMethods, VxeInputConstructor, VxeModalConstructor, VxeModalMethods } from '../../../types'
import type { VxeTableConstructor, VxeTablePrivateMethods } from '../../../types/components/table'

function getOptUniqueId () {
  return XEUtils.uniqueId('node_')
}

export default defineComponent({
  name: 'VxeTreeSelect',
  props: {
    modelValue: [String, Number, Array] as PropType<VxeTreeSelectPropTypes.ModelValue>,
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
    multiple: Boolean as PropType<VxeTreeSelectPropTypes.Multiple>,
    className: [String, Function] as PropType<VxeTreeSelectPropTypes.ClassName>,
    popupClassName: [String, Function] as PropType<VxeTreeSelectPropTypes.PopupClassName>,
    prefixIcon: String as PropType<VxeTreeSelectPropTypes.PrefixIcon>,
    placement: String as PropType<VxeTreeSelectPropTypes.Placement>,
    options: Array as PropType<VxeTreeSelectPropTypes.Options>,
    optionProps: Object as PropType<VxeTreeSelectPropTypes.OptionProps>,
    size: {
      type: String as PropType<VxeTreeSelectPropTypes.Size>,
      default: () => getConfig().select.size || getConfig().size
    },
    remote: Boolean as PropType<VxeTreeSelectPropTypes.Remote>,
    remoteMethod: Function as PropType<VxeTreeSelectPropTypes.RemoteMethod>,
    popupConfig: Object as PropType<VxeTreeSelectPropTypes.PopupConfig>,
    treeConfig: Object as PropType<VxeTreeSelectPropTypes.TreeConfig>,
    transfer: {
      type: Boolean as PropType<VxeTreeSelectPropTypes.Transfer>,
      default: null
    }
  },
  emits: [
    'update:modelValue',
    'change',
    'clear',
    'blur',
    'focus',
    'click',
    'node-click'
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
    const refTreeWrapper = ref<HTMLDivElement>()
    const refOptionPanel = ref<HTMLDivElement>()

    const reactData = reactive<TreeSelectReactData>({
      initialized: false,
      fullOptionList: [],
      fullNodeMaps: {},
      panelIndex: 0,
      panelStyle: {},
      panelPlacement: null,
      triggerFocusPanel: false,
      visiblePanel: false,
      isAniVisible: false,
      isActivated: false
    })

    const internalData: TreeSelectInternalData = {
      hpTimeout: undefined
    }

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
      const { transfer } = props
      if (transfer === null) {
        const globalTransfer = getConfig().select.transfer
        if (XEUtils.isBoolean(globalTransfer)) {
          return globalTransfer
        }
        if ($xeTable || $xeModal || $xeDrawer || $xeForm) {
          return true
        }
      }
      return transfer
    })

    const computePopupOpts = computed(() => {
      return Object.assign({}, getConfig().treeSelect.popupConfig, props.popupConfig)
    })

    const computeTreeOpts = computed(() => {
      return Object.assign({}, getConfig().treeSelect.treeConfig, props.treeConfig, { data: undefined })
    })

    const computeTreeNodeOpts = computed(() => {
      const treeOpts = computeTreeOpts.value
      return Object.assign({ isHover: true }, treeOpts.nodeConfig)
    })

    const computeTreeCheckboxOpts = computed(() => {
      const treeOpts = computeTreeOpts.value
      return Object.assign({
        showIcon: !!treeOpts.showCheckbox
      }, treeOpts.checkboxConfig, {
        trigger: 'node'
      })
    })

    const computeTreeRadioOpts = computed(() => {
      const treeOpts = computeTreeOpts.value
      return Object.assign({
        showIcon: !!treeOpts.showRadio
      }, treeOpts.radioConfig, {
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

    const computeParentField = computed(() => {
      const propsOpts = computePropsOpts.value
      return propsOpts.parent || 'parentField'
    })

    const computeHasChildField = computed(() => {
      const propsOpts = computePropsOpts.value
      return propsOpts.hasChild || 'hasChild'
    })

    const computeSelectLabel = computed(() => {
      const { modelValue } = props
      const { fullNodeMaps } = reactData
      const labelField = computeLabelField.value
      return (XEUtils.isArray(modelValue) ? modelValue : [modelValue]).map(val => {
        const cacheItem = fullNodeMaps[val]
        return cacheItem ? cacheItem.item[labelField] : val
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

    const treeSelectMethods: TreeSelectMethods = {
      dispatchEvent
    }

    const getNodeid = (option: any) => {
      const nodeKeyField = computeNodeKeyField.value
      const nodeid = option[nodeKeyField]
      return nodeid ? encodeURIComponent(nodeid) : ''
    }

    const cacheDataMap = () => {
      const { options } = props
      const nodeKeyField = computeNodeKeyField.value
      const childrenField = computeChildrenField.value
      const valueField = computeValueField.value
      const nodeMaps: Record<string, {
        item: any
        index: number
        items: any[]
        parent: any
        nodes: any[]
      }> = {}
      const keyMaps: Record<string, boolean> = {}
      XEUtils.eachTree(options, (item, index, items, path, parent, nodes) => {
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
        nodeMaps[value] = { item, index, items, parent, nodes }
      }, { children: childrenField })
      reactData.fullOptionList = options || []
      reactData.fullNodeMaps = nodeMaps
    }

    const updateZindex = () => {
      if (reactData.panelIndex < getLastZIndex()) {
        reactData.panelIndex = nextZIndex()
      }
    }

    const updatePlacement = () => {
      return nextTick().then(() => {
        const { placement } = props
        const { panelIndex } = reactData
        const el = refElem.value
        const panelElem = refOptionPanel.value
        const btnTransfer = computeBtnTransfer.value
        if (panelElem && el) {
          const targetHeight = el.offsetHeight
          const targetWidth = el.offsetWidth
          const panelHeight = panelElem.offsetHeight
          const panelWidth = panelElem.offsetWidth
          const marginSize = 5
          const panelStyle: { [key: string]: any } = {
            zIndex: panelIndex
          }
          const { boundingTop, boundingLeft, visibleHeight, visibleWidth } = getAbsolutePos(el)
          let panelPlacement = 'bottom'
          if (btnTransfer) {
            let left = boundingLeft
            let top = boundingTop + targetHeight
            if (placement === 'top') {
              panelPlacement = 'top'
              top = boundingTop - panelHeight
            } else if (!placement) {
              // 如果下面不够放，则向上
              if (top + panelHeight + marginSize > visibleHeight) {
                panelPlacement = 'top'
                top = boundingTop - panelHeight
              }
              // 如果上面不够放，则向下（优先）
              if (top < marginSize) {
                panelPlacement = 'bottom'
                top = boundingTop + targetHeight
              }
            }
            // 如果溢出右边
            if (left + panelWidth + marginSize > visibleWidth) {
              left -= left + panelWidth + marginSize - visibleWidth
            }
            // 如果溢出左边
            if (left < marginSize) {
              left = marginSize
            }
            Object.assign(panelStyle, {
              left: `${left}px`,
              top: `${top}px`,
              minWidth: `${targetWidth}px`
            })
          } else {
            if (placement === 'top') {
              panelPlacement = 'top'
              panelStyle.bottom = `${targetHeight}px`
            } else if (!placement) {
              // 如果下面不够放，则向上
              if (boundingTop + targetHeight + panelHeight > visibleHeight) {
                // 如果上面不够放，则向下（优先）
                if (boundingTop - targetHeight - panelHeight > marginSize) {
                  panelPlacement = 'top'
                  panelStyle.bottom = `${targetHeight}px`
                }
              }
            }
          }
          reactData.panelStyle = panelStyle
          reactData.panelPlacement = panelPlacement
          return nextTick()
        }
      })
    }

    const showOptionPanel = () => {
      const { loading } = props
      const isDisabled = computeIsDisabled.value
      if (!loading && !isDisabled) {
        clearTimeout(internalData.hpTimeout)
        if (!reactData.initialized) {
          reactData.initialized = true
        }
        reactData.isActivated = true
        reactData.isAniVisible = true
        setTimeout(() => {
          reactData.visiblePanel = true
        }, 10)
        updateZindex()
        updatePlacement()
      }
    }

    const hideOptionPanel = () => {
      reactData.visiblePanel = false
      internalData.hpTimeout = setTimeout(() => {
        reactData.isAniVisible = false
      }, 350)
    }

    const changeEvent = (evnt: Event, selectValue: any) => {
      const { fullNodeMaps } = reactData
      emitModel(selectValue)
      if (selectValue !== props.modelValue) {
        const cacheItem = fullNodeMaps[selectValue]
        dispatchEvent('change', { value: selectValue, option: cacheItem ? cacheItem.item : null }, evnt)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, selectValue)
        }
      }
    }

    const clearValueEvent = (evnt: Event, selectValue: any) => {
      changeEvent(evnt, selectValue)
      dispatchEvent('clear', { value: selectValue }, evnt)
    }

    const clearEvent = (params: any, evnt: Event) => {
      clearValueEvent(evnt, null)
      hideOptionPanel()
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
            hideOptionPanel()
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
          hideOptionPanel()
        }
      }
    }

    const handleGlobalBlurEvent = () => {
      hideOptionPanel()
    }

    const focusEvent = (evnt: FocusEvent) => {
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        if (!reactData.visiblePanel) {
          reactData.triggerFocusPanel = true
          showOptionPanel()
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

    const togglePanelEvent = (params: any) => {
      const { $event } = params
      $event.preventDefault()
      if (reactData.triggerFocusPanel) {
        reactData.triggerFocusPanel = false
      } else {
        if (reactData.visiblePanel) {
          hideOptionPanel()
        } else {
          showOptionPanel()
        }
      }
    }

    const nodeClickEvent = (params: any) => {
      const { $event } = params
      dispatchEvent('node-click', params, $event)
    }

    const radioChangeEvent = (params: any) => {
      const { value, $event } = params
      changeEvent($event, value)
      hideOptionPanel()
    }

    const checkboxChangeEvent = (params: any) => {
      const { value, $event } = params
      changeEvent($event, value)
    }

    const loadSuccessEvent = () => {
      cacheDataMap()
    }

    const treeSelectPrivateMethods: TreeSelectPrivateMethods = {
    }

    Object.assign($xeTreeSelect, treeSelectMethods, treeSelectPrivateMethods)

    const renderVN = () => {
      const { className, modelValue, multiple, options, loading } = props
      const { initialized, isActivated, isAniVisible, visiblePanel } = reactData
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
      const popupClassName = popupOpts.className || props.popupClassName
      const treeOpts = computeTreeOpts.value
      const treeNodeOpts = computeTreeNodeOpts.value
      const treeCheckboxOpts = computeTreeCheckboxOpts.value
      const treeRadioOpts = computeTreeRadioOpts.value
      const nodeKeyField = computeNodeKeyField.value
      const labelField = computeLabelField.value
      const valueField = computeValueField.value
      const childrenField = computeChildrenField.value
      const parentField = computeParentField.value
      const hasChildField = computeHasChildField.value

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
      return h('div', {
        ref: refElem,
        class: ['vxe-tree-select', className ? (XEUtils.isFunction(className) ? className({ $treeSelect: $xeTreeSelect }) : className) : '', {
          [`size--${vSize}`]: vSize,
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
          readonly: true,
          disabled: isDisabled,
          type: 'text',
          prefixIcon: props.prefixIcon,
          suffixIcon: loading ? getIcon().TREE_SELECT_LOADED : (visiblePanel ? getIcon().TREE_SELECT_OPEN : getIcon().TREE_SELECT_CLOSE),
          modelValue: loading ? '' : selectLabel,
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
            class: ['vxe-table--ignore-clear vxe-tree-select--panel', popupClassName ? (XEUtils.isFunction(popupClassName) ? popupClassName({ $treeSelect: $xeTreeSelect }) : popupClassName) : '', {
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
                  headerSlot
                    ? h('div', {
                      class: 'vxe-tree-select--panel-header'
                    }, headerSlot({}))
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
                        class: 'vxe-tree-select--tree',
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
                        parentField: treeOpts.parentField || parentField,
                        hasChildField: treeOpts.hasChildField || hasChildField,
                        accordion: treeOpts.accordion,
                        expandAll: treeOpts.expandAll,
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
                        onNodeClick: nodeClickEvent,
                        onRadioChange: radioChangeEvent,
                        onCheckboxChange: checkboxChangeEvent,
                        onLoadSuccess: loadSuccessEvent
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
      ])
    }

    watch(() => props.options, () => {
      cacheDataMap()
    })

    cacheDataMap()

    onMounted(() => {
      globalEvents.on($xeTreeSelect, 'mousewheel', handleGlobalMousewheelEvent)
      globalEvents.on($xeTreeSelect, 'mousedown', handleGlobalMousedownEvent)
      globalEvents.on($xeTreeSelect, 'blur', handleGlobalBlurEvent)
    })

    onUnmounted(() => {
      globalEvents.off($xeTreeSelect, 'mousewheel')
      globalEvents.off($xeTreeSelect, 'mousedown')
      globalEvents.off($xeTreeSelect, 'blur')
    })

    provide('$xeTreeSelect', $xeTreeSelect)

    $xeTreeSelect.renderVN = renderVN

    return $xeTreeSelect
  },
  render () {
    return this.renderVN()
  }
})
