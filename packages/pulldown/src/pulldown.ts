import { h, Teleport, ref, Ref, onUnmounted, reactive, inject, computed, nextTick, PropType, watch } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, globalEvents, createEvent, useSize, renderEmptyElement } from '../../ui'
import { getEventTargetNode, updatePanelPlacement } from '../../ui/src/dom'
import { getLastZIndex, nextZIndex } from '../../ui/src/utils'

import type { VxePulldownConstructor, VxePulldownPropTypes, PulldownInternalData, VxePulldownEmits, PulldownReactData, ValueOf, PulldownMethods, PulldownPrivateRef, VxePulldownMethods, VxeDrawerConstructor, VxeDrawerMethods, VxeFormConstructor, VxeFormPrivateMethods, VxeModalConstructor, VxeModalMethods } from '../../../types'
import type { VxeTableConstructor, VxeTablePrivateMethods } from '../../../types/components/table'

export default defineVxeComponent({
  name: 'VxePulldown',
  props: {
    modelValue: Boolean as PropType<VxePulldownPropTypes.ModelValue>,
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
  emits: [
    'update:modelValue',
    'click',
    'option-click',
    'show-panel',
    'hide-panel',
    'visible-change'
  ] as VxePulldownEmits,
  setup (props, context) {
    const { slots, emit } = context

    const $xeModal = inject<(VxeModalConstructor & VxeModalMethods) | null>('$xeModal', null)
    const $xeDrawer = inject<(VxeDrawerConstructor & VxeDrawerMethods) | null>('$xeDrawer', null)
    const $xeTable = inject<(VxeTableConstructor & VxeTablePrivateMethods) | null>('$xeTable', null)
    const $xeForm = inject<(VxeFormConstructor & VxeFormPrivateMethods) | null>('$xeForm', null)

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const reactData = reactive<PulldownReactData>({
      initialized: false,
      panelIndex: 0,
      panelStyle: {},
      panelPlacement: null,
      visiblePanel: false,
      isAniVisible: false,
      isActivated: false
    })

    const internalData: PulldownInternalData = {
      hpTimeout: undefined
    }

    const refElem = ref() as Ref<HTMLDivElement>
    const refPulldownContent = ref() as Ref<HTMLDivElement>
    const refPulldownPanel = ref() as Ref<HTMLDivElement>

    const computeBtnTransfer = computed(() => {
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
    })

    const refMaps: PulldownPrivateRef = {
      refElem
    }

    const $xePulldown = {
      xID,
      props,
      context,
      reactData,
      internalData,
      getRefMaps: () => refMaps
    } as unknown as VxePulldownConstructor & VxePulldownMethods

    let pulldownMethods = {} as PulldownMethods

    const updateZindex = () => {
      if (reactData.panelIndex < getLastZIndex()) {
        reactData.panelIndex = nextZIndex()
      }
    }

    const isPanelVisible = () => {
      return reactData.visiblePanel
    }

    /**
     * 手动更新位置
     */
    const updatePlacement = () => {
      const { placement } = props
      const { panelIndex } = reactData
      const targetElem = refPulldownContent.value
      const panelElem = refPulldownPanel.value
      const btnTransfer = computeBtnTransfer.value
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
      return nextTick().then(handleStyle)
    }

    /**
     * 显示下拉面板
     */
    const showPanel = () => {
      if (!reactData.initialized) {
        reactData.initialized = true
      }
      return new Promise<void>(resolve => {
        if (!props.disabled) {
          if (internalData.hpTimeout) {
            clearTimeout(internalData.hpTimeout)
          }
          reactData.isActivated = true
          reactData.isAniVisible = true
          setTimeout(() => {
            reactData.visiblePanel = true
            emit('update:modelValue', true)
            updatePlacement()
            setTimeout(() => {
              resolve(updatePlacement())
            }, 40)
          }, 10)
          updateZindex()
          dispatchEvent('visible-change', { visible: true }, null)
        } else {
          nextTick(() => {
            resolve()
          })
        }
      })
    }

    /**
     * 隐藏下拉面板
     */
    const hidePanel = () => {
      reactData.visiblePanel = false
      dispatchEvent('visible-change', { visible: false }, null)
      emit('update:modelValue', false)
      return new Promise<void>(resolve => {
        if (reactData.isAniVisible) {
          internalData.hpTimeout = setTimeout(() => {
            reactData.isAniVisible = false
            nextTick(() => {
              resolve()
            })
          }, 350)
        } else {
          nextTick(() => {
            resolve()
          })
        }
      })
    }

    /**
     * 切换下拉面板
     */
    const togglePanel = () => {
      if (reactData.visiblePanel) {
        return hidePanel()
      }
      return showPanel()
    }

    const handleOptionEvent = (evnt: Event, option: VxePulldownPropTypes.Option) => {
      if (!option.disabled) {
        if (reactData.visiblePanel) {
          hidePanel()
          dispatchEvent('hide-panel', {}, evnt)
        }
        dispatchEvent('option-click', { option }, evnt)
      }
    }

    const clickTargetEvent = (evnt: MouseEvent) => {
      const { trigger } = props
      if (trigger === 'click') {
        if (reactData.visiblePanel) {
          hidePanel()
          dispatchEvent('hide-panel', {}, evnt)
        } else {
          showPanel()
          dispatchEvent('show-panel', {}, evnt)
        }
      }
      dispatchEvent('click', { $pulldown: $xePulldown }, evnt)
    }

    const handleGlobalMousewheelEvent = (evnt: Event) => {
      const { disabled } = props
      const { visiblePanel } = reactData
      const panelElem = refPulldownPanel.value
      if (!disabled) {
        if (visiblePanel) {
          if (getEventTargetNode(evnt, panelElem).flag) {
            updatePlacement()
          } else {
            hidePanel()
            dispatchEvent('hide-panel', {}, evnt)
          }
        }
      }
    }

    const handleGlobalMousedownEvent = (evnt: Event) => {
      const { disabled } = props
      const { visiblePanel } = reactData
      const el = refElem.value
      const panelElem = refPulldownPanel.value
      if (!disabled) {
        reactData.isActivated = getEventTargetNode(evnt, el).flag || getEventTargetNode(evnt, panelElem).flag
        if (visiblePanel && !reactData.isActivated) {
          hidePanel()
          dispatchEvent('hide-panel', {}, evnt)
        }
      }
    }

    const handleGlobalBlurEvent = (evnt: Event) => {
      if (reactData.visiblePanel) {
        reactData.isActivated = false
        hidePanel()
        dispatchEvent('hide-panel', {}, evnt)
      }
    }

    const handleGlobalResizeEvent = () => {
      const { visiblePanel } = reactData
      if (visiblePanel) {
        updatePlacement()
      }
    }

    const dispatchEvent = (type: ValueOf<VxePulldownEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $pulldown: $xePulldown }, params))
    }

    pulldownMethods = {
      dispatchEvent,
      isPanelVisible,
      togglePanel,
      showPanel,
      hidePanel
    }

    Object.assign($xePulldown, pulldownMethods)

    watch(() => props.modelValue, (value) => {
      reactData.isActivated = !!value
      if (value) {
        showPanel()
      } else {
        hidePanel()
      }
    })

    nextTick(() => {
      if (props.modelValue) {
        showPanel()
      }
      globalEvents.on($xePulldown, 'mousewheel', handleGlobalMousewheelEvent)
      globalEvents.on($xePulldown, 'mousedown', handleGlobalMousedownEvent)
      globalEvents.on($xePulldown, 'blur', handleGlobalBlurEvent)
      globalEvents.on($xePulldown, 'resize', handleGlobalResizeEvent)
    })

    onUnmounted(() => {
      globalEvents.off($xePulldown, 'mousewheel')
      globalEvents.off($xePulldown, 'mousedown')
      globalEvents.off($xePulldown, 'blur')
      globalEvents.off($xePulldown, 'resize')
    })

    const renderDefaultPanel = (options?: VxePulldownPropTypes.Options) => {
      const optionSlot = slots.option
      return h('div', {
        class: 'vxe-pulldown--panel-list'
      }, options
        ? options.map(item => {
          return h('div', {
            class: 'vxe-pulldown--panel-item',
            onClick (evnt: Event) {
              handleOptionEvent(evnt, item)
            }
          }, optionSlot ? optionSlot({ $pulldown: $xePulldown, option: item }) : `${item.label || ''}`)
        })
        : []
      )
    }

    const renderVN = () => {
      const { className, options, popupClassName, showPopupShadow, destroyOnClose, disabled } = props
      const { initialized, isActivated, isAniVisible, visiblePanel, panelStyle, panelPlacement } = reactData
      const btnTransfer = computeBtnTransfer.value
      const vSize = computeSize.value
      const defaultSlot = slots.default
      const headerSlot = slots.header
      const footerSlot = slots.footer
      const dropdownSlot = slots.dropdown

      return h('div', {
        ref: refElem,
        class: ['vxe-pulldown', className ? (XEUtils.isFunction(className) ? className({ $pulldown: $xePulldown }) : className) : '', {
          [`size--${vSize}`]: vSize,
          'is--visible': visiblePanel,
          'is--disabled': disabled,
          'is--active': isActivated
        }]
      }, [
        h('div', {
          ref: refPulldownContent,
          class: 'vxe-pulldown--content',
          onClick: clickTargetEvent
        }, defaultSlot ? defaultSlot({ $pulldown: $xePulldown }) : []),
        h(Teleport, {
          to: 'body',
          disabled: btnTransfer ? !initialized : true
        }, [
          h('div', {
            ref: refPulldownPanel,
            class: ['vxe-table--ignore-clear vxe-pulldown--panel', popupClassName ? (XEUtils.isFunction(popupClassName) ? popupClassName({ $pulldown: $xePulldown }) : popupClassName) : '', {
              [`size--${vSize}`]: vSize,
              'is--transfer': btnTransfer,
              'ani--leave': isAniVisible,
              'ani--enter': visiblePanel
            }],
            placement: panelPlacement,
            style: panelStyle
          }, [
            h('div', {
              class: ['vxe-pulldown--panel-wrapper', {
                'is--shadow': showPopupShadow
              }]
            }, initialized && (destroyOnClose ? (visiblePanel || isAniVisible) : true)
              ? [
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
                        renderDefaultPanel(options)
                      ]),
                  footerSlot
                    ? h('div', {
                      class: 'vxe-pulldown--panel-footer'
                    }, footerSlot({ $pulldown: $xePulldown }))
                    : renderEmptyElement($xePulldown)
                ]
              : [])
          ])
        ])
      ])
    }

    $xePulldown.renderVN = renderVN

    return $xePulldown
  },
  render () {
    return this.renderVN()
  }
})
