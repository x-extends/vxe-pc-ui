import { h, ref, computed, Teleport, resolveComponent, VNode, onUnmounted, reactive, nextTick, PropType, onMounted, inject } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, globalEvents, getIcon, createEvent, useSize, usePermission, permission, renderEmptyElement } from '../../ui'
import { getEventTargetNode, updatePanelPlacement } from '../../ui/src/dom'
import { getFuncText, getLastZIndex, nextZIndex } from '../../ui/src/utils'
import { warnLog } from '../../ui/src/log'
import VxeTooltipComponent from '../../tooltip/src/tooltip'

import type { VxeButtonConstructor, VxeButtonPropTypes, VxeButtonEmits, ButtonReactData, ButtonMethods, VxeButtonDefines, ButtonPrivateRef, ButtonInternalData, VxeButtonGroupConstructor, VxeButtonGroupPrivateMethods, VxeDrawerConstructor, VxeDrawerMethods, VxeFormConstructor, VxeFormPrivateMethods, VxeModalConstructor, VxeModalMethods, ValueOf } from '../../../types'
import type { VxeTableConstructor, VxeTablePrivateMethods } from '../../../types/components/table'

const VxeButtonComponent = defineVxeComponent({
  name: 'VxeButton',
  props: {
    /**
     * 按钮类型
     */
    type: String as PropType<VxeButtonPropTypes.Type>,
    mode: String as PropType<VxeButtonPropTypes.Mode>,
    className: [String, Function] as PropType<VxeButtonPropTypes.ClassName>,
    popupClassName: [String, Function] as PropType<VxeButtonPropTypes.PopupClassName>,
    /**
     * 按钮尺寸
     */
    size: {
      type: String as PropType<VxeButtonPropTypes.Size>,
      default: () => getConfig().button.size || getConfig().size
    },
    /**
     * 用来标识这一项
     */
    name: [String, Number] as PropType<VxeButtonPropTypes.Name>,
    routerLink: Object as PropType<VxeButtonPropTypes.RouterLink>,
    /**
     * 权限码
     */
    permissionCode: [String, Number] as PropType<VxeButtonPropTypes.PermissionCode>,
    /**
     * 按钮内容
     */
    content: String as PropType<VxeButtonPropTypes.Content>,
    /**
     * 固定显示下拉面板的方向
     */
    placement: String as PropType<VxeButtonPropTypes.Placement>,
    /**
     * 按钮状态
     */
    status: String as PropType<VxeButtonPropTypes.Status>,
    /**
     * 标题
     */
    title: String as PropType<VxeButtonPropTypes.Title>,
    /**
     * 按钮的图标
     */
    icon: String as PropType<VxeButtonPropTypes.Icon>,
    /**
     * 圆角边框
     */
    round: Boolean as PropType<VxeButtonPropTypes.Round>,
    /**
     * 圆角按钮
     */
    circle: Boolean as PropType<VxeButtonPropTypes.Circle>,
    /**
     * 是否禁用
     */
    disabled: Boolean as PropType<VxeButtonPropTypes.Disabled>,
    /**
     * 是否加载中
     */
    loading: Boolean as PropType<VxeButtonPropTypes.Loading>,
    trigger: {
      type: String as PropType<VxeButtonPropTypes.Trigger>,
      default: () => getConfig().button.trigger
    },
    align: String as PropType<VxeButtonPropTypes.Align>,
    prefixTooltip: Object as PropType<VxeButtonPropTypes.PrefixTooltip>,
    suffixTooltip: Object as PropType<VxeButtonPropTypes.SuffixTooltip>,
    options: Array as PropType<VxeButtonPropTypes.Options>,
    /**
     * 在下拉面板关闭时销毁内容
     */
    destroyOnClose: {
      type: Boolean as PropType<VxeButtonPropTypes.DestroyOnClose>,
      default: () => getConfig().button.destroyOnClose
    },
    /**
     * 是否将弹框容器插入于 body 内
     */
    transfer: {
      type: Boolean as PropType<VxeButtonPropTypes.Transfer>,
      default: null
    }
  },
  emits: [
    'click',
    'mouseenter',
    'mouseleave',
    'dropdown-click',
    'dropdownClick'
  ] as VxeButtonEmits,
  setup (props, context) {
    const { slots, emit } = context

    const $xeModal = inject<(VxeModalConstructor & VxeModalMethods)| null>('$xeModal', null)
    const $xeDrawer = inject<(VxeDrawerConstructor & VxeDrawerMethods) | null>('$xeDrawer', null)
    const $xeTable = inject<(VxeTableConstructor & VxeTablePrivateMethods) | null>('$xeTable', null)
    const $xeForm = inject<(VxeFormConstructor & VxeFormPrivateMethods)| null>('$xeForm', null)
    const $xeButtonGroup = inject<(VxeButtonGroupConstructor & VxeButtonGroupPrivateMethods) | null>('$xeButtonGroup', null)

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const { computePermissionInfo } = usePermission(props)

    const reactData = reactive<ButtonReactData>({
      initialized: false,
      visiblePanel: false,
      isAniVisible: false,
      isActivated: false,
      panelIndex: 0,
      panelStyle: {},
      panelPlacement: ''
    })

    const internalData: ButtonInternalData = {
      showTime: undefined,
      tooltipTimeout: undefined
    }

    const refElem = ref<HTMLDivElement>()
    const refButton = ref<HTMLButtonElement>()
    const refBtnPanel = ref<HTMLDivElement>()

    const refMaps: ButtonPrivateRef = {
      refElem
    }

    const $xeButton = {
      xID,
      props,
      context,
      reactData,
      internalData,
      getRefMaps: () => refMaps
    } as unknown as VxeButtonConstructor

    let buttonMethods = {} as ButtonMethods

    const computeBtnTransfer = computed(() => {
      const { transfer } = props
      if (transfer === null) {
        const globalTransfer = getConfig().button.transfer
        if (XEUtils.isBoolean(globalTransfer)) {
          return globalTransfer
        }
        if ($xeTable || $xeModal || $xeDrawer || $xeForm) {
          return true
        }
      }
      return transfer
    })

    const computeBtnDisabled = computed(() => {
      const { disabled } = props
      const permissionInfo = computePermissionInfo.value
      return disabled || permissionInfo.disabled
    })

    const computeIsFormBtn = computed(() => {
      const { type } = props
      if (type) {
        return ['submit', 'reset', 'button'].indexOf(type) > -1
      }
      return false
    })

    const computeBtnMode = computed(() => {
      const { type, mode } = props
      if (mode === 'text' || type === 'text' || ($xeButtonGroup && $xeButtonGroup.props.mode === 'text')) {
        return 'text'
      }
      return 'button'
    })

    const computeBtnStatus = computed(() => {
      const { status } = props
      if (status) {
        return status
      }
      if ($xeButtonGroup) {
        return $xeButtonGroup.props.status
      }
      return ''
    })

    const computeBtnAlign = computed(() => {
      const { align } = props
      if (align) {
        return align
      }
      if ($xeButtonGroup) {
        return $xeButtonGroup.props.align
      }
      return false
    })

    const computeBtnRound = computed(() => {
      const { round } = props
      if (round) {
        return round
      }
      if ($xeButtonGroup) {
        return $xeButtonGroup.props.round
      }
      return false
    })

    const computeBtnCircle = computed(() => {
      const { circle } = props
      if (circle) {
        return circle
      }
      if ($xeButtonGroup) {
        return $xeButtonGroup.props.circle
      }
      return false
    })

    const computeDownBtnList = computed(() => {
      const { options } = props
      if (options) {
        return options.filter(item => {
          const { permissionCode } = item
          return !permissionCode || permission.checkVisible(permissionCode)
        })
      }
      return []
    })

    const computePrefixTipOpts = computed(() => {
      return Object.assign({}, props.prefixTooltip)
    })

    const computeSuffixTipOpts = computed(() => {
      return Object.assign({}, props.suffixTooltip)
    })

    const updateZindex = () => {
      if (reactData.panelIndex < getLastZIndex()) {
        reactData.panelIndex = nextZIndex()
      }
    }

    const updatePlacement = () => {
      const { placement } = props
      const { panelIndex } = reactData
      const targetElem = refButton.value
      const panelElem = refBtnPanel.value
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

    const clickEvent = (evnt: Event) => {
      if ($xeButtonGroup) {
        $xeButtonGroup.handleClick({ name: props.name }, evnt)
      }
      dispatchEvent('click', { $event: evnt }, evnt)
    }

    const downBtnClickEvent = (params: VxeButtonDefines.ClickEventParams, option: VxeButtonDefines.DownButtonOption) => {
      const { $event } = params
      hidePanel()
      dispatchEvent('dropdown-click', { name: option.name, option }, $event)
    }

    const mousedownDropdownEvent = (evnt: MouseEvent) => {
      const isLeftBtn = evnt.button === 0
      if (isLeftBtn) {
        evnt.stopPropagation()
      }
    }

    const clickDropdownEvent = (evnt: Event) => {
      const dropdownElem = evnt.currentTarget
      const panelElem = refBtnPanel.value
      const { flag, targetElem } = getEventTargetNode(evnt, dropdownElem, 'vxe-button')
      if (flag) {
        if (panelElem) {
          panelElem.dataset.active = 'N'
        }
        reactData.visiblePanel = false
        setTimeout(() => {
          if (!panelElem || panelElem.dataset.active !== 'Y') {
            reactData.isAniVisible = false
          }
        }, 350)
        dispatchEvent('dropdown-click', { name: targetElem.getAttribute('name'), option: null }, evnt)
      }
    }

    const mouseenterDropdownEvent = () => {
      const panelElem = refBtnPanel.value
      if (panelElem) {
        panelElem.dataset.active = 'Y'
        reactData.isAniVisible = true
        setTimeout(() => {
          if (panelElem.dataset.active === 'Y') {
            reactData.visiblePanel = true
            updateZindex()
            updatePlacement()
            setTimeout(() => {
              if (reactData.visiblePanel) {
                updatePlacement()
              }
            }, 50)
          }
        }, 20)
      }
    }

    const mouseenterTargetEvent = (evnt: MouseEvent) => {
      const { loading } = props
      const btnDisabled = computeBtnDisabled.value
      if (!(btnDisabled || loading)) {
        openPanel()
        mouseenterEvent(evnt)
      }
    }

    const mouseleaveTargetEvent = (evnt: MouseEvent) => {
      hidePanel()
      mouseleaveEvent(evnt)
    }

    const mouseenterEvent = (evnt: MouseEvent) => {
      dispatchEvent('mouseenter', {}, evnt)
    }

    const mouseleaveEvent = (evnt: MouseEvent) => {
      dispatchEvent('mouseleave', {}, evnt)
    }

    const clickTargetEvent = (evnt: MouseEvent) => {
      const { loading, trigger } = props
      const btnDisabled = computeBtnDisabled.value
      if (!(btnDisabled || loading)) {
        if (trigger === 'click') {
          if (reactData.visiblePanel) {
            hidePanel()
          } else {
            openPanel()
          }
        }
        clickEvent(evnt)
      }
    }

    const openPanel = () => {
      const { trigger } = props
      const panelElem = refBtnPanel.value
      if (panelElem) {
        panelElem.dataset.active = 'Y'
        if (!reactData.initialized) {
          reactData.initialized = true
        }
        internalData.showTime = setTimeout(() => {
          if (panelElem.dataset.active === 'Y') {
            mouseenterDropdownEvent()
          } else {
            reactData.isAniVisible = false
          }
        }, trigger === 'click' ? 50 : 250)
      }
      return nextTick()
    }

    const hidePanel = () => {
      const panelElem = refBtnPanel.value
      clearTimeout(internalData.showTime)
      if (panelElem) {
        panelElem.dataset.active = 'N'
        setTimeout(() => {
          if (panelElem.dataset.active !== 'Y') {
            reactData.visiblePanel = false
            setTimeout(() => {
              if (panelElem.dataset.active !== 'Y') {
                reactData.isAniVisible = false
              }
            }, 350)
          }
        }, 100)
      } else {
        reactData.isAniVisible = false
        reactData.visiblePanel = false
      }
      return nextTick()
    }

    const mouseleaveDropdownEvent = () => {
      hidePanel()
    }

    const renderTooltipIcon = (tipOpts: VxeButtonPropTypes.PrefixTooltip | VxeButtonPropTypes.SuffixTooltip, type: 'prefix' | 'suffix') => {
      return h(VxeTooltipComponent, {
        useHTML: tipOpts.useHTML,
        content: tipOpts.content,
        enterable: tipOpts.enterable,
        theme: tipOpts.theme
      }, {
        default () {
          return h('i', {
            class: [`vxe-button--tooltip-${type}-icon`, tipOpts.icon || getIcon().BUTTON_TOOLTIP_ICON]
          })
        }
      })
    }

    const renderContent = () => {
      const { content, icon, loading, prefixTooltip, suffixTooltip } = props
      const prefixTipOpts = computePrefixTipOpts.value
      const suffixTipOpts = computeSuffixTipOpts.value
      const iconSlot = slots.icon
      const defaultSlot = slots.default
      const contVNs: VNode[] = []
      if (prefixTooltip) {
        contVNs.push(
          renderTooltipIcon(prefixTipOpts, 'prefix')
        )
      }
      if (loading) {
        contVNs.push(
          h('i', {
            class: ['vxe-button--loading-icon', getIcon().BUTTON_LOADING]
          })
        )
      } else if (iconSlot) {
        contVNs.push(
          h('span', {
            class: 'vxe-button--custom-icon'
          }, iconSlot({}))
        )
      } else if (icon) {
        contVNs.push(
          h('i', {
            class: ['vxe-button--icon', icon]
          })
        )
      }
      if (defaultSlot) {
        contVNs.push(
          h('span', {
            class: 'vxe-button--content'
          }, defaultSlot({}))
        )
      } else if (content) {
        contVNs.push(
          h('span', {
            class: 'vxe-button--content'
          }, getFuncText(content))
        )
      }
      if (suffixTooltip) {
        contVNs.push(
          renderTooltipIcon(suffixTipOpts, 'suffix')
        )
      }
      return contVNs
    }

    const dispatchEvent = (type: ValueOf<VxeButtonEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $button: $xeButton }, params))
    }

    buttonMethods = {
      dispatchEvent,
      openPanel,
      closePanel: hidePanel,
      focus () {
        const btnElem = refButton.value
        if (btnElem) {
          btnElem.focus()
        }
        return nextTick()
      },
      blur () {
        const btnElem = refButton.value
        if (btnElem) {
          btnElem.blur()
        }
        return nextTick()
      }
    }

    const handleGlobalMousewheelEvent = (evnt: Event) => {
      const panelElem = refBtnPanel.value
      if (reactData.visiblePanel && !getEventTargetNode(evnt, panelElem).flag) {
        hidePanel()
      }
    }

    const handleGlobalMousedownEvent = (evnt: MouseEvent) => {
      const btnDisabled = computeBtnDisabled.value
      const { visiblePanel } = reactData
      if (!btnDisabled) {
        const el = refElem.value
        const panelElem = refBtnPanel.value
        reactData.isActivated = getEventTargetNode(evnt, el).flag || getEventTargetNode(evnt, panelElem).flag
        if (visiblePanel && !reactData.isActivated) {
          hidePanel()
        }
      }
    }

    const handleGlobalResizeEvent = () => {
      const { visiblePanel } = reactData
      if (visiblePanel) {
        updatePlacement()
      }
    }

    Object.assign($xeButton, buttonMethods)

    const renderVN = () => {
      const { className, popupClassName, trigger, title, routerLink, type, destroyOnClose, name, loading } = props
      const { initialized, isAniVisible, visiblePanel } = reactData
      const isFormBtn = computeIsFormBtn.value
      const btnMode = computeBtnMode.value
      const btnStatus = computeBtnStatus.value
      const btnRound = computeBtnRound.value
      const btnAlign = computeBtnAlign.value
      const btnCircle = computeBtnCircle.value
      const btnTransfer = computeBtnTransfer.value
      const btnDisabled = computeBtnDisabled.value
      const permissionInfo = computePermissionInfo.value
      const downBtnList = computeDownBtnList.value
      const vSize = computeSize.value
      const dropdownsSlot = slots.dropdowns

      if (!permissionInfo.visible) {
        return renderEmptyElement($xeButton)
      }
      if (dropdownsSlot || downBtnList.length) {
        const btnOns: Record<string, any> = {}
        const panelOns: Record<string, any> = {}
        if (trigger === 'hover') {
          // hover 触发
          btnOns.onMouseenter = mouseenterTargetEvent
          btnOns.onMouseleave = mouseleaveTargetEvent

          panelOns.onMouseenter = mouseenterDropdownEvent
          panelOns.onMouseleave = mouseleaveDropdownEvent
        }
        return h('div', {
          ref: refElem,
          class: ['vxe-button--dropdown', className ? (XEUtils.isFunction(className) ? className({ $button: $xeButton }) : className) : '', {
            [`size--${vSize}`]: vSize,
            'is--active': visiblePanel
          }]
        }, [
          routerLink
            ? h(resolveComponent('router-link'), {
              ref: refButton,
              class: ['vxe-button', 'vxe-button--link', `type--${btnMode}`, btnAlign ? `align--${btnAlign}` : '', className ? (XEUtils.isFunction(className) ? className({ $button: $xeButton }) : className) : '', {
                [`size--${vSize}`]: vSize,
                [`theme--${btnStatus}`]: btnStatus,
                'is--round': btnRound,
                'is--circle': btnCircle,
                'is--disabled': btnDisabled || loading,
                'is--loading': loading
              }],
              title,
              name,
              type: isFormBtn ? type : 'button',
              disabled: btnDisabled || loading,
              to: routerLink,
              onClick: clickTargetEvent,
              ...btnOns
            }, {
              default () {
                return renderContent().concat([
                  h('i', {
                    class: `vxe-button--dropdown-arrow ${getIcon().BUTTON_DROPDOWN}`
                  })
                ])
              }
            })
            : h('button', {
              ref: refButton,
              class: ['vxe-button', `type--${btnMode}`, btnAlign ? `align--${btnAlign}` : '', className ? (XEUtils.isFunction(className) ? className({ $button: $xeButton }) : className) : '', {
                [`size--${vSize}`]: vSize,
                [`theme--${btnStatus}`]: btnStatus,
                'is--round': btnRound,
                'is--circle': btnCircle,
                'is--disabled': btnDisabled || loading,
                'is--loading': loading
              }],
              title,
              name,
              type: isFormBtn ? type : 'button',
              disabled: btnDisabled || loading,
              onClick: clickTargetEvent,
              ...btnOns
            }, renderContent().concat([
              h('i', {
                class: `vxe-button--dropdown-arrow ${getIcon().BUTTON_DROPDOWN}`
              })
            ])),
          h(Teleport, {
            to: 'body',
            disabled: btnTransfer ? !initialized : true
          }, [
            h('div', {
              ref: refBtnPanel,
              class: ['vxe-button--dropdown-panel', popupClassName ? (XEUtils.isFunction(popupClassName) ? popupClassName({ $button: $xeButton }) : popupClassName) : '', {
                [`size--${vSize}`]: vSize,
                'is--transfer': btnTransfer,
                'ani--leave': isAniVisible,
                'ani--enter': visiblePanel
              }],
              placement: reactData.panelPlacement,
              style: reactData.panelStyle,
              ...panelOns
            }, initialized && (visiblePanel || isAniVisible)
              ? [
                  dropdownsSlot
                    ? h('div', {
                      class: 'vxe-button--dropdown-wrapper',
                      onMousedown: mousedownDropdownEvent,
                      onClick: clickDropdownEvent
                    }, initialized && (destroyOnClose ? (visiblePanel || isAniVisible) : true) ? dropdownsSlot({}) : [])
                    : h('div', {
                      class: 'vxe-button--dropdown-wrapper'
                    }, initialized && (destroyOnClose ? (visiblePanel || isAniVisible) : true)
                      ? downBtnList.map((option, i) => {
                        return h(VxeButtonComponent, {
                          key: i,
                          type: option.type,
                          mode: option.mode || btnMode,
                          className: option.className,
                          name: option.name,
                          routerLink: option.routerLink,
                          permissionCode: option.permissionCode,
                          title: option.title,
                          content: option.content,
                          status: option.status,
                          icon: option.icon,
                          round: XEUtils.isBoolean(option.round) ? option.round : (btnMode === 'text' ? false : btnRound),
                          circle: XEUtils.isBoolean(option.circle) ? option.circle : (btnMode === 'text' ? false : btnCircle),
                          disabled: option.disabled,
                          loading: option.loading,
                          align: option.align,
                          onClick (params: VxeButtonDefines.ClickEventParams) {
                            downBtnClickEvent(params, option)
                          }
                        })
                      })
                      : [])
                ]
              : [])
          ])
        ])
      }
      if (routerLink) {
        return h(resolveComponent('router-link'), {
          ref: refButton,
          class: ['vxe-button', 'vxe-button--link', `type--${btnMode}`, btnAlign ? `align--${btnAlign}` : '', className ? (XEUtils.isFunction(className) ? className({ $button: $xeButton }) : className) : '', {
            [`size--${vSize}`]: vSize,
            [`theme--${btnStatus}`]: btnStatus,
            'is--round': btnRound,
            'is--circle': btnCircle,
            'is--disabled': btnDisabled || loading,
            'is--loading': loading
          }],
          title,
          name,
          type: isFormBtn ? type : 'button',
          disabled: btnDisabled || loading,
          to: routerLink,
          onClick: clickEvent,
          onMouseenter: mouseenterEvent,
          onMouseleave: mouseleaveEvent
        }, {
          default () {
            return renderContent()
          }
        })
      }
      return h('button', {
        ref: refButton,
        class: ['vxe-button', `type--${btnMode}`, btnAlign ? `align--${btnAlign}` : '', className ? (XEUtils.isFunction(className) ? className({ $button: $xeButton }) : className) : '', {
          [`size--${vSize}`]: vSize,
          [`theme--${btnStatus}`]: btnStatus,
          'is--round': btnRound,
          'is--circle': btnCircle,
          'is--disabled': btnDisabled || loading,
          'is--loading': loading
        }],
        title,
        name,
        type: isFormBtn ? type : 'button',
        disabled: btnDisabled || loading,
        onClick: clickEvent,
        onMouseenter: mouseenterEvent,
        onMouseleave: mouseleaveEvent
      }, renderContent())
    }

    $xeButton.renderVN = renderVN

    onMounted(() => {
      if (props.type === 'text') {
        warnLog('vxe.error.delProp', ['type=text', 'mode=text'])
      }

      globalEvents.on($xeButton, 'mousewheel', handleGlobalMousewheelEvent)
      globalEvents.on($xeButton, 'mousedown', handleGlobalMousedownEvent)
      globalEvents.on($xeButton, 'resize', handleGlobalResizeEvent)
    })

    onUnmounted(() => {
      globalEvents.off($xeButton, 'mousewheel')
      globalEvents.off($xeButton, 'mousedown')
      globalEvents.off($xeButton, 'resize')
    })

    return $xeButton
  },
  render () {
    return this.renderVN()
  }
})

export default VxeButtonComponent
