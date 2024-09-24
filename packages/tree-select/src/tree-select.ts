import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getI18n, getIcon, globalEvents, createEvent, globalMixins, renderEmptyElement } from '../../ui'
import { getEventTargetNode, getAbsolutePos } from '../../ui/src/dom'
import { getLastZIndex, nextZIndex } from '../../ui/src/utils'

import VxeInputComponent from '../../input/src/input'
import VxeTreeComponent from '../../tree/src/tree'

import type { TreeSelectReactData, VxeTreeSelectEmits, TreeSelectInternalData, VxeComponentSizeType, ValueOf, VxeTreeSelectPropTypes, VxeFormDefines, VxeDrawerConstructor, VxeDrawerMethods, VxeTableConstructor, VxeTablePrivateMethods, VxeFormConstructor, VxeFormPrivateMethods, VxeModalConstructor, VxeModalMethods } from '../../../types'

function getOptUniqueId () {
  return XEUtils.uniqueId('node_')
}

export default defineVxeComponent({
  name: 'VxeTreeSelect',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    value: [String, Number, Array] as PropType<VxeTreeSelectPropTypes.ModelValue>,
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
    size: {
      type: String as PropType<VxeTreeSelectPropTypes.Size>,
      default: () => getConfig().select.size || getConfig().size
    },
    remote: Boolean as PropType<VxeTreeSelectPropTypes.Remote>,
    remoteMethod: Function as PropType<VxeTreeSelectPropTypes.RemoteMethod>,
    treeConfig: Object as PropType<VxeTreeSelectPropTypes.TreeConfig>,
    transfer: {
      type: Boolean as PropType<VxeTreeSelectPropTypes.Transfer>,
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
    const $xeTreeSelect = this
    return {
      $xeTreeSelect
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: TreeSelectReactData = {
      initialized: false,
      fullOptionList: [],
      fullNodeMaps: {},
      visibleOptionList: [],
      panelIndex: 0,
      panelStyle: {},
      panelPlacement: null,
      triggerFocusPanel: false,
      visiblePanel: false,
      isAniVisible: false,
      isActivated: false
    }
    const internalData: TreeSelectInternalData = {
      hpTimeout: undefined
    }
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
    },
    computeTreeOpts () {
      const $xeTreeSelect = this
      const props = $xeTreeSelect

      return Object.assign({}, getConfig().treeSelect.treeConfig, props.treeConfig)
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
    computeSelectLabel (this: any) {
      const $xeTreeSelect = this
      const props = $xeTreeSelect
      const reactData = $xeTreeSelect.reactData

      const { value } = props
      const { fullNodeMaps } = reactData
      const labelField = $xeTreeSelect.computeLabelField
      return (XEUtils.isArray(value) ? value : [value]).map(value => {
        const cacheItem = fullNodeMaps[value]
        return cacheItem ? cacheItem.item[labelField] : value
      }).join(', ')
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

      $xeTreeSelect.$emit('input', value)
      $xeTreeSelect.$emit('modelValue', value)
    },
    getOptid (option: any) {
      const $xeTreeSelect = this

      const valueField = $xeTreeSelect.computeValueField
      const optid = option[valueField]
      return optid ? encodeURIComponent(optid) : ''
    },
    /**
     * 刷新选项，当选项被动态显示/隐藏时可能会用到
     */
    refreshOption  () {
      const $xeTreeSelect = this

      return $xeTreeSelect.$nextTick()
    },
    cacheItemMap  () {
      const $xeTreeSelect = this
      const props = $xeTreeSelect
      const reactData = $xeTreeSelect.reactData

      const { options } = props
      const valueField = $xeTreeSelect.computeValueField
      const childrenField = $xeTreeSelect.computeChildrenField
      const nodeMaps: Record<string, {
        item: any
        index: number
        items: any[]
        parent: any
        nodes: any[]
      }> = {}
      XEUtils.eachTree(options, (item, index, items, path, parent, nodes) => {
        let nodeid = $xeTreeSelect.getOptid(item)
        if (!nodeid) {
          nodeid = getOptUniqueId()
          item[valueField] = nodeid
        }
        nodeMaps[nodeid] = { item, index, items, parent, nodes }
      }, { children: childrenField })
      reactData.fullOptionList = options || []
      reactData.fullNodeMaps = nodeMaps
      $xeTreeSelect.refreshOption()
    },
    updateZindex () {
      const $xeTreeSelect = this
      const reactData = $xeTreeSelect.reactData

      if (reactData.panelIndex < getLastZIndex()) {
        reactData.panelIndex = nextZIndex()
      }
    },
    updatePlacement  () {
      const $xeTreeSelect = this
      const props = $xeTreeSelect
      const reactData = $xeTreeSelect.reactData

      return $xeTreeSelect.$nextTick().then(() => {
        const { placement } = props
        const { panelIndex } = reactData
        const el = $xeTreeSelect.$refs.refElem as HTMLElement
        const panelElem = $xeTreeSelect.$refs.refOptionPanel as HTMLDivElement
        const btnTransfer = $xeTreeSelect.computeBtnTransfer
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
          return $xeTreeSelect.$nextTick()
        }
      })
    },
    showOptionPanel  () {
      const $xeTreeSelect = this
      const props = $xeTreeSelect
      const reactData = $xeTreeSelect.reactData
      const internalData = $xeTreeSelect.internalData

      const { loading } = props
      const isDisabled = $xeTreeSelect.computeIsDisabled
      if (!loading && !isDisabled) {
        clearTimeout(internalData.hpTimeout)
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
        setTimeout(() => {
          reactData.visiblePanel = true
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
      internalData.hpTimeout = window.setTimeout(() => {
        reactData.isAniVisible = false
      }, 350)
    },
    changeEvent (evnt: Event, selectValue: any) {
      const $xeTreeSelect = this
      const props = $xeTreeSelect
      const reactData = $xeTreeSelect.reactData
      const $xeForm = $xeTreeSelect.$xeForm
      const formItemInfo = $xeTreeSelect.formItemInfo

      const { fullNodeMaps } = reactData
      $xeTreeSelect.emitModel(selectValue)
      if (selectValue !== props.value) {
        const cacheItem = fullNodeMaps[selectValue]
        $xeTreeSelect.dispatchEvent('change', { value: selectValue, option: cacheItem ? cacheItem.item : null }, evnt)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, selectValue)
        }
      }
    },
    clearValueEvent  (evnt: Event, selectValue: any) {
      const $xeTreeSelect = this

      $xeTreeSelect.changeEvent(evnt, selectValue)
      $xeTreeSelect.dispatchEvent('clear', { value: selectValue }, evnt)
    },
    clearEvent  (params: any, evnt: Event) {
      const $xeTreeSelect = this

      $xeTreeSelect.clearValueEvent(evnt, null)
      $xeTreeSelect.hideOptionPanel()
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

      $xeTreeSelect.hideOptionPanel()
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
    nodeClickEvent  (params: any) {
      const $xeTreeSelect = this

      const { $event } = params
      $xeTreeSelect.dispatchEvent('node-click', params, $event)
    },
    radioChangeEvent  (params: any) {
      const $xeTreeSelect = this

      const { value, $event } = params
      $xeTreeSelect.changeEvent($event, value)
      $xeTreeSelect.hideOptionPanel()
    },
    checkboxChangeEvent (params: any) {
      const $xeTreeSelect = this

      const { value, $event } = params
      $xeTreeSelect.changeEvent($event, value)
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeTreeSelect = this
      const props = $xeTreeSelect
      const slots = $xeTreeSelect.$scopedSlots
      const reactData = $xeTreeSelect.reactData

      const { className, value, multiple, options, popupClassName, loading } = props
      const { initialized, isActivated, isAniVisible, visiblePanel } = reactData
      const vSize = $xeTreeSelect.computeSize
      const isDisabled = $xeTreeSelect.computeIsDisabled
      const selectLabel = $xeTreeSelect.computeSelectLabel
      const btnTransfer = $xeTreeSelect.computeBtnTransfer
      const formReadonly = $xeTreeSelect.computeFormReadonly
      const defaultSlot = slots.default
      const headerSlot = slots.header
      const footerSlot = slots.footer
      const prefixSlot = slots.prefix
      const treeOpts = $xeTreeSelect.computeTreeOpts
      const treeNodeOpts = $xeTreeSelect.computeTreeNodeOpts
      const treeCheckboxOpts = $xeTreeSelect.computeTreeCheckboxOpts
      const treeRadioOpts = $xeTreeSelect.computeTreeRadioOpts
      const labelField = $xeTreeSelect.computeLabelField
      const valueField = $xeTreeSelect.computeValueField
      const childrenField = $xeTreeSelect.computeChildrenField
      const parentField = $xeTreeSelect.computeParentField
      const hasChildField = $xeTreeSelect.computeHasChildField

      if (formReadonly) {
        return h('div', {
          ref: 'refElem',
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
        ref: 'refElem',
        class: ['vxe-tree-select', className ? (XEUtils.isFunction(className) ? className({ $treeSelect: $xeTreeSelect }) : className) : '', {
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
            suffixIcon: loading ? getIcon().TREE_SELECT_LOADED : (visiblePanel ? getIcon().TREE_SELECT_OPEN : getIcon().TREE_SELECT_CLOSE),
            value: selectLabel
          },
          on: {
            clear: $xeTreeSelect.clearEvent,
            click: $xeTreeSelect.clickEvent,
            focus: $xeTreeSelect.focusEvent,
            blur: $xeTreeSelect.blurEvent,
            suffixClick: $xeTreeSelect.togglePanelEvent
          },
          scopedSlots: prefixSlot
            ? {
                prefix: () => prefixSlot({})
              }
            : {}
        }),
        h('div', {
          ref: 'refOptionPanel',
          class: ['vxe-table--ignore-clear vxe-tree-select--panel', popupClassName ? (XEUtils.isFunction(popupClassName) ? popupClassName({ $treeSelect: $xeTreeSelect }) : popupClassName) : '', {
            [`size--${vSize}`]: vSize,
            'is--transfer': btnTransfer,
            'ani--leave': !loading && isAniVisible,
            'ani--enter': !loading && visiblePanel
          }],
          attrs: {
            placement: reactData.panelPlacement
          },
          style: reactData.panelStyle
        }, initialized && (visiblePanel || isAniVisible)
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
                    ref: 'refOptionWrapper',
                    class: 'vxe-tree-select-option--wrapper'
                  }, [
                    h(VxeTreeComponent, {
                      class: 'vxe-tree-select--tree',
                      props: {
                        data: options,
                        indent: treeOpts.indent,
                        showRadio: !multiple,
                        radioConfig: treeRadioOpts,
                        checkNodeKey: multiple ? null : value,
                        showCheckbox: !!multiple,
                        checkNodeKeys: multiple ? value : null,
                        checkboxConfig: treeCheckboxOpts,
                        titleField: labelField,
                        valueField: valueField,
                        keyField: treeOpts.keyField,
                        childrenField: treeOpts.childrenField || childrenField,
                        parentField: treeOpts.parentField || parentField,
                        hasChildField: treeOpts.hasChildField || hasChildField,
                        accordion: treeOpts.accordion,
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
                        iconClose: treeOpts.iconClose
                      },
                      on: {
                        'node-click': $xeTreeSelect.nodeClickEvent,
                        'radio-change': $xeTreeSelect.radioChangeEvent,
                        'checkbox-change': $xeTreeSelect.checkboxChangeEvent
                      }
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

      $xeTreeSelect.cacheItemMap()
    }
  },
  created () {
    const $xeTreeSelect = this

    $xeTreeSelect.cacheItemMap()
  },
  mounted () {
    const $xeTreeSelect = this

    globalEvents.on($xeTreeSelect, 'mousewheel', $xeTreeSelect.handleGlobalMousewheelEvent)
    globalEvents.on($xeTreeSelect, 'mousedown', $xeTreeSelect.handleGlobalMousedownEvent)
    globalEvents.on($xeTreeSelect, 'blur', $xeTreeSelect.handleGlobalBlurEvent)
  },
  beforeDestroy () {
    const $xeTreeSelect = this

    const panelElem = $xeTreeSelect.$refs.refOptionPanel as HTMLElement | undefined
    if (panelElem && panelElem.parentNode) {
      panelElem.parentNode.removeChild(panelElem)
    }
    globalEvents.off($xeTreeSelect, 'mousewheel')
    globalEvents.off($xeTreeSelect, 'mousedown')
    globalEvents.off($xeTreeSelect, 'blur')
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
