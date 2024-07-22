import { defineComponent, ref, computed, h, PropType, Ref, nextTick, inject, reactive, Teleport, createCommentVNode, onMounted, onUnmounted, watch } from 'vue'
import { getConfig, getI18n, getIcon, globalEvents, createEvent, useSize } from '../../ui'
import { getEventTargetNode, getAbsolutePos } from '../../ui/src/dom'
import { getLastZIndex, nextZIndex } from '../../ui/src/utils'
import XEUtils from 'xe-utils'
import VxeInputComponent from '../../input/src/input'
import VxeTreeComponent from '../../tree/src/tree'

import type { TreeSelectReactData, VxeTreeSelectEmits, TreeSelectPrivateRef, TreeSelectPrivateMethods, TreeSelectMethods, VxeTreeSelectPrivateComputed, VxeTreeSelectPropTypes, VxeTreeSelectConstructor, VxeFormDefines, VxeTreeSelectPrivateMethods, VxeTableConstructor, VxeTablePrivateMethods, VxeFormConstructor, VxeFormPrivateMethods, VxeInputConstructor } from '../../../types'

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
      default: () => XEUtils.eqNull(getConfig().select.placeholder) ? getI18n('vxe.base.pleaseSelect') : getConfig().select.placeholder
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
    size: { type: String as PropType<VxeTreeSelectPropTypes.Size>, default: () => getConfig().select.size || getConfig().size },
    remote: Boolean as PropType<VxeTreeSelectPropTypes.Remote>,
    remoteMethod: Function as PropType<VxeTreeSelectPropTypes.RemoteMethod>,
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
    'focus'
  ] as VxeTreeSelectEmits,
  setup (props, context) {
    const { emit, slots } = context

    const $xeTable = inject<VxeTableConstructor & VxeTablePrivateMethods | null>('$xeTable', null)
    const $xeForm = inject<VxeFormConstructor & VxeFormPrivateMethods | null>('$xeForm', null)
    const formItemInfo = inject<VxeFormDefines.ProvideItemInfo | null>('xeFormItemInfo', null)

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const refElem = ref<HTMLDivElement>()
    const refInput = ref() as Ref<VxeInputConstructor>
    const refOptionWrapper = ref() as Ref<HTMLDivElement>
    const refOptionPanel = ref() as Ref<HTMLDivElement>

    const reactData = reactive<TreeSelectReactData>({
      initialized: false,
      fullOptionList: [],
      fullNodeMaps: {},
      visibleOptionList: [],
      panelIndex: 0,
      panelStyle: {},
      panelPlacement: null,
      visiblePanel: false,
      animatVisible: false,
      isActivated: false
    })

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

    const computeTransfer = computed(() => {
      const { transfer } = props
      if (transfer === null) {
        const globalTransfer = getConfig().select.transfer
        if (XEUtils.isBoolean(globalTransfer)) {
          return globalTransfer
        }
        if ($xeTable || $xeForm) {
          return true
        }
      }
      return transfer
    })

    const computeTreeOpts = computed(() => {
      return Object.assign({}, getConfig().treeSelect.treeConfig, props.treeConfig)
    })

    const computeTreeCheckboxOpts = computed(() => {
      const treeOpts = computeTreeOpts.value
      return Object.assign({}, treeOpts.checkboxConfig, {
        trigger: 'node'
      })
    })

    const computeTreeRadioOpts = computed(() => {
      const treeOpts = computeTreeOpts.value
      return Object.assign({}, treeOpts.radioConfig, {
        trigger: 'node'
      })
    })

    const computePropsOpts = computed(() => {
      return props.optionProps || {}
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
      return (XEUtils.isArray(modelValue) ? modelValue : [modelValue]).map(value => {
        const cacheItem = fullNodeMaps[value]
        const labelField = computeLabelField.value
        return cacheItem ? cacheItem.item[labelField] : value
      }).join(', ')
    })

    const computeMaps: VxeTreeSelectPrivateComputed = {
    }

    const $xeTreeSelect = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeTreeSelectConstructor & VxeTreeSelectPrivateMethods

    const treeSelectMethods: TreeSelectMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, createEvent(evnt, { $treeSelect: $xeTreeSelect }, params))
      }
    }

    const getOptid = (option: any) => {
      const valueField = computeValueField.value
      const optid = option[valueField]
      return optid ? encodeURIComponent(optid) : ''
    }

    /**
     * 刷新选项，当选项被动态显示/隐藏时可能会用到
     */
    const refreshOption = () => {
      return nextTick()
    }

    const cacheItemMap = () => {
      const { options } = props
      const valueField = computeValueField.value
      const childrenField = computeChildrenField.value
      const nodeMaps: Record<string, {
        item: any
        index: number
        items: any[]
        parent: any
        nodes: any[]
      }> = {}
      XEUtils.eachTree(options, (item, index, items, parent, nodes) => {
        let nodeid = getOptid(item)
        if (!nodeid) {
          nodeid = getOptUniqueId()
          item[valueField] = nodeid
        }
        nodeMaps[nodeid] = { item, index, items, parent, nodes }
      }, { children: childrenField })
      reactData.fullOptionList = options || []
      reactData.fullNodeMaps = nodeMaps
      refreshOption()
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
        const transfer = computeTransfer.value
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
          if (transfer) {
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

    let hidePanelTimeout: number

    const showOptionPanel = () => {
      const { loading } = props
      const isDisabled = computeIsDisabled.value
      if (!loading && !isDisabled) {
        clearTimeout(hidePanelTimeout)
        if (!reactData.initialized) {
          reactData.initialized = true
        }
        reactData.isActivated = true
        reactData.animatVisible = true
        setTimeout(() => {
          reactData.visiblePanel = true
        }, 10)
        updateZindex()
        updatePlacement()
      }
    }

    const hideOptionPanel = () => {
      reactData.visiblePanel = false
      hidePanelTimeout = window.setTimeout(() => {
        reactData.animatVisible = false
      }, 350)
    }

    const changeEvent = (evnt: Event, selectValue: any) => {
      if (selectValue !== props.modelValue) {
        emit('update:modelValue', selectValue)
        treeSelectMethods.dispatchEvent('change', { value: selectValue }, evnt)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, selectValue)
        }
      }
    }

    const clearValueEvent = (evnt: Event, selectValue: any) => {
      changeEvent(evnt, selectValue)
      treeSelectMethods.dispatchEvent('clear', { value: selectValue }, evnt)
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
        reactData.isActivated = true
      }
      treeSelectMethods.dispatchEvent('focus', {}, evnt)
    }

    const blurEvent = (evnt: FocusEvent) => {
      reactData.isActivated = false
      treeSelectMethods.dispatchEvent('blur', {}, evnt)
    }

    const togglePanelEvent = (params: any) => {
      const { $event } = params
      $event.preventDefault()
      if (reactData.visiblePanel) {
        hideOptionPanel()
      } else {
        showOptionPanel()
      }
    }

    const nodeClickEvent = () => {
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

    const treeSelectPrivateMethods: TreeSelectPrivateMethods = {
    }

    Object.assign($xeTreeSelect, treeSelectMethods, treeSelectPrivateMethods)

    const renderVN = () => {
      const { className, modelValue, multiple, options, popupClassName, loading } = props
      const { initialized, isActivated, visiblePanel } = reactData
      const vSize = computeSize.value
      const isDisabled = computeIsDisabled.value
      const selectLabel = computeSelectLabel.value
      const transfer = computeTransfer.value
      const formReadonly = computeFormReadonly.value
      const defaultSlot = slots.default
      const headerSlot = slots.header
      const footerSlot = slots.footer
      const prefixSlot = slots.prefix
      const treeOpts = computeTreeOpts.value
      const treeCheckboxOpts = computeTreeCheckboxOpts.value
      const treeRadioOpts = computeTreeRadioOpts.value
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
          h('div', {
            class: 'vxe-tree-select-slots',
            ref: 'hideOption'
          }, defaultSlot ? defaultSlot({}) : []),
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
          placeholder: props.placeholder,
          readonly: true,
          disabled: isDisabled,
          type: 'text',
          prefixIcon: props.prefixIcon,
          suffixIcon: loading ? getIcon().TREE_SELECT_LOADED : (visiblePanel ? getIcon().TREE_SELECT_OPEN : getIcon().TREE_SELECT_CLOSE),
          modelValue: selectLabel,
          onClear: clearEvent,
          onClick: togglePanelEvent,
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
          disabled: transfer ? !initialized : true
        }, [
          h('div', {
            ref: refOptionPanel,
            class: ['vxe-table--ignore-clear vxe-tree-select--panel', popupClassName ? (XEUtils.isFunction(popupClassName) ? popupClassName({ $treeSelect: $xeTreeSelect }) : popupClassName) : '', {
              [`size--${vSize}`]: vSize,
              'is--transfer': transfer,
              'animat--leave': !loading && reactData.animatVisible,
              'animat--enter': !loading && visiblePanel
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
                    : createCommentVNode(),
                  h('div', {
                    class: 'vxe-tree-select--panel-body'
                  }, [
                    h('div', {
                      ref: refOptionWrapper,
                      class: 'vxe-tree-select-option--wrapper'
                    }, [
                      h(VxeTreeComponent, {
                        class: 'vxe-tree-select--tree',
                        isHover: treeOpts.isHover,
                        data: options,
                        indent: treeOpts.indent,
                        showRadio: !multiple,
                        radioConfig: treeRadioOpts,
                        showCheckbox: !!multiple,
                        checkboxCheckNodeKeys: multiple ? modelValue : null,
                        checkboxConfig: treeCheckboxOpts,
                        titleField: labelField,
                        keyField: valueField,
                        childrenField: childrenField,
                        parentField: parentField,
                        hasChildField: hasChildField,
                        accordion: treeOpts.accordion,
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
                        onCheckboxChange: checkboxChangeEvent
                      })
                    ])
                  ]),
                  footerSlot
                    ? h('div', {
                      class: 'vxe-tree-select--panel-footer'
                    }, footerSlot({}))
                    : createCommentVNode()
                ])
              ]
            : [])
        ])
      ])
    }

    $xeTreeSelect.renderVN = renderVN

    watch(() => props.options, () => {
      cacheItemMap()
    })

    cacheItemMap()

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

    return $xeTreeSelect
  },
  render () {
    return this.renderVN()
  }
})
