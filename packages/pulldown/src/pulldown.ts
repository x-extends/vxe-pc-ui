import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, globalEvents, createEvent, globalMixins, VxeComponentStyleType, ValueOf, renderEmptyElement } from '../../ui'
import { getAbsolutePos, getEventTargetNode } from '../../ui/src/dom'
import { getLastZIndex, nextZIndex } from '../../ui/src/utils'

import type { PulldownInternalData, VxePulldownPropTypes, VxePulldownEmits, VxeComponentSizeType, PulldownReactData, VxeTableConstructor, VxeTablePrivateMethods, VxeFormConstructor, VxeFormPrivateMethods, VxeModalConstructor, VxeDrawerConstructor, VxeDrawerMethods, VxeModalMethods } from '../../../types'

export default defineVxeComponent({
  name: 'VxePulldown',
  model: {
    prop: 'value',
    event: 'modelValue'
  },
  mixins: [
    globalMixins.sizeMixin,
    globalMixins.permissionMixin
  ],
  props: {
    value: Boolean as PropType<VxePulldownPropTypes.ModelValue>,
    disabled: Boolean as PropType<VxePulldownPropTypes.Disabled>,
    placement: String as PropType<VxePulldownPropTypes.Placement>,
    trigger: {
      type: String as PropType<VxePulldownPropTypes.Trigger>,
      default: getConfig().pulldown.trigger
    },
    size: { type: String as PropType<VxePulldownPropTypes.Size>, default: () => getConfig().size },
    options: Array as PropType<VxePulldownPropTypes.Options>,
    className: {
      type: [String, Function] as PropType<VxePulldownPropTypes.ClassName>,
      default: getConfig().pulldown.className
    },
    popupClassName: [String, Function] as PropType<VxePulldownPropTypes.PopupClassName>,
    showPopupShadow: Boolean as PropType<VxePulldownPropTypes.ShowPopupShadow>,
    destroyOnClose: {
      type: Boolean as PropType<VxePulldownPropTypes.DestroyOnClose>,
      default: getConfig().pulldown.destroyOnClose
    },
    transfer: {
      type: Boolean as PropType<VxePulldownPropTypes.Transfer>,
      default: null
    }
  },
  inject: {
    $xeModal: {
      default: null
    },
    $xeTable: {
      default: null
    },
    $xeForm: {
      default: null
    }
  },
  data () {
    const reactData: PulldownReactData = {
      initialized: false,
      panelIndex: 0,
      panelStyle: {},
      panelPlacement: null,
      visiblePanel: false,
      visibleAnimate: false,
      isActivated: false
    }
    const internalData: PulldownInternalData = {
      hpTimeout: undefined
    }
    return {
      xID: XEUtils.uniqueId(),
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
    }),
    computeBtnTransfer  () {
      const $xePulldown = this
      const props = $xePulldown
      const $xeModal = $xePulldown.$xeModal
      const $xeDrawer = $xePulldown.$xeDrawer
      const $xeTable = $xePulldown.$xeTable
      const $xeForm = $xePulldown.$xeForm

      const { transfer } = props
      if (transfer === null) {
        const globalTransfer = getConfig().pulldown.transfer
        if (XEUtils.isBoolean(globalTransfer)) {
          return globalTransfer
        }
        if ($xeTable || $xeModal || $xeDrawer || $xeForm) {
          return true
        }
      }
      return transfer
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxePulldownEmits>, params: Record<string, any>, evnt: Event) {
      const $xePulldown = this
      $xePulldown.$emit(type, createEvent(evnt, { $pulldown: $xePulldown }, params))
    },
    updateZindex () {
      const $xePulldown = this
      const reactData = $xePulldown.reactData

      if (reactData.panelIndex < getLastZIndex()) {
        reactData.panelIndex = nextZIndex()
      }
    },
    isPanelVisible () {
      const $xePulldown = this
      const reactData = $xePulldown.reactData

      return reactData.visiblePanel
    },
    /**
     * 手动更新位置
     */
    updatePlacement  () {
      const $xePulldown = this
      const props = $xePulldown
      const reactData = $xePulldown.reactData

      return $xePulldown.$nextTick().then(() => {
        const { placement } = props
        const { panelIndex, visiblePanel } = reactData
        const btnTransfer = $xePulldown.computeBtnTransfer
        if (visiblePanel) {
          const targetElem = $xePulldown.$refs.refPulldownContent as HTMLElement
          const panelElem = $xePulldown.$refs.refPulldownPanel as HTMLElement
          if (panelElem && targetElem) {
            const targetHeight = targetElem.offsetHeight
            const targetWidth = targetElem.offsetWidth
            const panelHeight = panelElem.offsetHeight
            const panelWidth = panelElem.offsetWidth
            const marginSize = 5
            const panelStyle: VxeComponentStyleType = {
              zIndex: panelIndex
            }
            const { boundingTop, boundingLeft, visibleHeight, visibleWidth } = getAbsolutePos(targetElem)
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
          }
        }
        return $xePulldown.$nextTick()
      })
    },
    /**
     * 显示下拉面板
     */
    showPanel () {
      const $xePulldown = this
      const props = $xePulldown
      const reactData = $xePulldown.reactData
      const internalData = $xePulldown.internalData

      const btnTransfer = $xePulldown.computeBtnTransfer
      const panelElem = $xePulldown.$refs.refPulldownPanel as HTMLElement
      if (!reactData.initialized) {
        reactData.initialized = true
        if (btnTransfer) {
          if (panelElem) {
            document.body.appendChild(panelElem)
          }
        }
      }
      return new Promise<void>(resolve => {
        if (!props.disabled) {
          if (internalData.hpTimeout) {
            clearTimeout(internalData.hpTimeout)
          }
          reactData.isActivated = true
          reactData.visibleAnimate = true
          setTimeout(() => {
            reactData.visiblePanel = true
            $xePulldown.$emit('modelValue', true)
            $xePulldown.updatePlacement()
            setTimeout(() => {
              resolve($xePulldown.updatePlacement())
            }, 40)
          }, 10)
          $xePulldown.updateZindex()
        } else {
          $xePulldown.$nextTick(() => {
            resolve()
          })
        }
      })
    },
    /**
     * 隐藏下拉面板
     */
    hidePanel () {
      const $xePulldown = this
      const reactData = $xePulldown.reactData
      const internalData = $xePulldown.internalData

      reactData.visiblePanel = false
      $xePulldown.$emit('modelValue', false)
      return new Promise<void>(resolve => {
        if (reactData.visibleAnimate) {
          internalData.hpTimeout = window.setTimeout(() => {
            reactData.visibleAnimate = false
            $xePulldown.$nextTick(() => {
              resolve()
            })
          }, 350)
        } else {
          $xePulldown.$nextTick(() => {
            resolve()
          })
        }
      })
    },
    /**
     * 切换下拉面板
     */
    togglePanel () {
      const $xePulldown = this
      const reactData = $xePulldown.reactData

      if (reactData.visiblePanel) {
        return $xePulldown.hidePanel()
      }
      return $xePulldown.showPanel()
    },
    handleOptionEvent (evnt: Event, option: VxePulldownPropTypes.Option) {
      const $xePulldown = this

      if (!option.disabled) {
        $xePulldown.hidePanel()
        $xePulldown.dispatchEvent('option-click', { option }, evnt)
      }
    },
    clickTargetEvent  (evnt: MouseEvent) {
      const $xePulldown = this
      const props = $xePulldown
      const reactData = $xePulldown.reactData

      const { trigger } = props
      if (trigger === 'click') {
        if (reactData.visiblePanel) {
          $xePulldown.hidePanel()
        } else {
          $xePulldown.showPanel()
        }
      }
      $xePulldown.dispatchEvent('click', { $pulldown: $xePulldown }, evnt)
    },
    handleGlobalMousewheelEvent (evnt: Event) {
      const $xePulldown = this
      const props = $xePulldown
      const reactData = $xePulldown.reactData

      const { disabled } = props
      const { visiblePanel } = reactData
      const panelElem = $xePulldown.$refs.refPulldownPanel as HTMLElement
      if (!disabled) {
        if (visiblePanel) {
          if (getEventTargetNode(evnt, panelElem).flag) {
            $xePulldown.updatePlacement()
          } else {
            $xePulldown.hidePanel()
            $xePulldown.dispatchEvent('hide-panel', {}, evnt)
          }
        }
      }
    },
    handleGlobalMousedownEvent  (evnt: Event) {
      const $xePulldown = this
      const props = $xePulldown
      const reactData = $xePulldown.reactData

      const { disabled } = props
      const { visiblePanel } = reactData
      const el = $xePulldown.$refs.refElem as HTMLElement
      const panelElem = $xePulldown.$refs.refPulldownPanel as HTMLElement
      if (!disabled) {
        reactData.isActivated = getEventTargetNode(evnt, el).flag || getEventTargetNode(evnt, panelElem).flag
        if (visiblePanel && !reactData.isActivated) {
          $xePulldown.hidePanel()
          $xePulldown.dispatchEvent('hide-panel', {}, evnt)
        }
      }
    },
    handleGlobalBlurEvent  (evnt: Event) {
      const $xePulldown = this
      const reactData = $xePulldown.reactData

      if (reactData.visiblePanel) {
        reactData.isActivated = false
        $xePulldown.hidePanel()
        $xePulldown.dispatchEvent('hide-panel', {}, evnt)
      }
    },

    //
    // Render
    //
    renderDefaultPanel  (h: CreateElement, options?: VxePulldownPropTypes.Options) {
      const $xePulldown = this
      const slots = $xePulldown.$scopedSlots

      const optionSlot = slots.option
      return h('div', {
        class: 'vxe-pulldown--panel-list'
      }, options
        ? options.map(item => {
          return h('div', {
            class: 'vxe-pulldown--panel-item',
            on: {
              click (evnt: Event) {
                $xePulldown.handleOptionEvent(evnt, item)
              }
            }
          }, optionSlot ? optionSlot({ $pulldown: $xePulldown, option: item }) : `${item.label || ''}`)
        })
        : []
      )
    },
    renderVN (h: CreateElement): VNode {
      const $xePulldown = this
      const props = $xePulldown
      const slots = $xePulldown.$scopedSlots
      const reactData = $xePulldown.reactData

      const { className, options, popupClassName, showPopupShadow, destroyOnClose, disabled } = props
      const { initialized, isActivated, visibleAnimate, visiblePanel, panelStyle, panelPlacement } = reactData
      const btnTransfer = $xePulldown.computeBtnTransfer
      const vSize = $xePulldown.computeSize
      const defaultSlot = slots.default
      const headerSlot = slots.header
      const footerSlot = slots.footer
      const dropdownSlot = slots.dropdown

      return h('div', {
        ref: 'refElem',
        class: ['vxe-pulldown', className ? (XEUtils.isFunction(className) ? className({ $pulldown: $xePulldown }) : className) : '', {
          [`size--${vSize}`]: vSize,
          'is--visible': visiblePanel,
          'is--disabled': disabled,
          'is--active': isActivated
        }]
      }, [
        h('div', {
          ref: 'refPulldownContent',
          class: 'vxe-pulldown--content',
          on: {
            click: $xePulldown.clickTargetEvent
          }
        }, defaultSlot ? defaultSlot({ $pulldown: $xePulldown }) : []),
        h('div', {
          ref: 'refPulldownPanel',
          class: ['vxe-table--ignore-clear vxe-pulldown--panel', popupClassName ? (XEUtils.isFunction(popupClassName) ? popupClassName({ $pulldown: $xePulldown }) : popupClassName) : '', {
            [`size--${vSize}`]: vSize,
            'is--shadow': showPopupShadow,
            'is--transfer': btnTransfer,
            'ani--leave': visibleAnimate,
            'ani--enter': visiblePanel
          }],
          attrs: {
            placement: panelPlacement
          },
          style: panelStyle
        }, initialized
          ? [
              h('div', {
                class: 'vxe-pulldown--panel-wrapper'
              }, !initialized || (destroyOnClose && !visiblePanel && !visibleAnimate)
                ? []
                : [
                    headerSlot
                      ? h('div', {
                        class: 'vxe-pulldown--panel-header'
                      }, headerSlot({ $pulldown: $xePulldown }))
                      : renderEmptyElement($xePulldown),
                    h('div', {
                      class: 'vxe-pulldown--panel-body'
                    }, dropdownSlot
                      ? dropdownSlot({ $pulldown: $xePulldown })
                      : [
                          $xePulldown.renderDefaultPanel(h, options)
                        ]),
                    footerSlot
                      ? h('div', {
                        class: 'vxe-pulldown--panel-footer'
                      }, footerSlot({ $pulldown: $xePulldown }))
                      : renderEmptyElement($xePulldown)
                  ])
            ]
          : [])
      ])
    }
  },
  watch: {
    value (val) {
      const $xePulldown = this

      if (val) {
        $xePulldown.showPanel()
      } else {
        $xePulldown.hidePanel()
      }
    }
  },
  created () {
    const $xePulldown = this

    globalEvents.on($xePulldown, 'mousewheel', $xePulldown.handleGlobalMousewheelEvent)
    globalEvents.on($xePulldown, 'mousedown', $xePulldown.handleGlobalMousedownEvent)
    globalEvents.on($xePulldown, 'blur', $xePulldown.handleGlobalBlurEvent)
  },
  beforeDestroy () {
    const $xePulldown = this

    const panelElem = $xePulldown.$refs.refPulldownPanel as HTMLElement | undefined
    if (panelElem && panelElem.parentNode) {
      panelElem.parentNode.removeChild(panelElem)
    }
    globalEvents.off($xePulldown, 'mousewheel')
    globalEvents.off($xePulldown, 'mousedown')
    globalEvents.off($xePulldown, 'blur')
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
