import { CreateElement, VNode, PropType } from 'vue'
import XEUtils from 'xe-utils'
import { getConfig, globalEvents, getIcon, createEvent, globalMixins, permission, renderEmptyElement } from '../../ui'
import { getEventCaseName } from '../../ui/src/vn'
import { defineVxeComponent } from '../../ui/src/comp'
import { getEventTargetNode, updatePanelPlacement } from '../../ui/src/dom'
import { getFuncText, getLastZIndex, nextZIndex } from '../../ui/src/utils'
import { warnLog } from '../../ui/src/log'
import VxeTooltipComponent from '../../tooltip/src/tooltip'

import type { VxeButtonPropTypes, VxeButtonEmits, ButtonReactData, VxeButtonGroupConstructor, ButtonInternalData, VxeButtonDefines, VxeButtonGroupPrivateMethods, VxeFormConstructor, VxeDrawerConstructor, VxeDrawerMethods, VxeFormPrivateMethods, VxeModalConstructor, VxeModalMethods, VxeComponentPermissionInfo, VxeComponentSizeType, ValueOf } from '../../../types'
import type { VxeTableConstructor, VxeTablePrivateMethods } from '../../../types/components/table'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeButton',
  mixins: [
    globalMixins.sizeMixin,
    globalMixins.permissionMixin
  ],
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
    $xeButtonGroup: {
      default: null
    }
  },
  data () {
    const reactData: ButtonReactData = {
      initialized: false,
      visiblePanel: false,
      isAniVisible: false,
      isActivated: false,
      panelIndex: 0,
      panelStyle: {},
      panelPlacement: ''
    }
    const internalData: ButtonInternalData = {
      showTime: undefined
    }
    return {
      xID: XEUtils.uniqueId(),
      reactData,
      internalData
    }
  },
  computed: {
    ...({} as {
      computePermissionInfo(): VxeComponentPermissionInfo
      computeSize(): VxeComponentSizeType
      $xeModal(): (VxeModalConstructor & VxeModalMethods) | null
      $xeDrawer(): (VxeDrawerConstructor & VxeDrawerMethods) | null
      $xeForm(): (VxeFormConstructor & VxeFormPrivateMethods) | null
      $xeTable(): (VxeTableConstructor & VxeTablePrivateMethods) | null
      $xeButtonGroup(): (VxeButtonGroupConstructor & VxeButtonGroupPrivateMethods)| null
    }),
    computeBtnTransfer () {
      const $xeButton = this
      const props = $xeButton

      const { transfer } = props
      const $xeTable = $xeButton.$xeTable
      const $xeModal = $xeButton.$xeModal
      const $xeDrawer = $xeButton.$xeDrawer
      const $xeForm = $xeButton.$xeForm
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
    },
    computeBtnDisabled () {
      const $xeButton = this
      const props = $xeButton

      const { disabled } = props
      const permissionInfo = $xeButton.computePermissionInfo
      return disabled || permissionInfo.disabled
    },
    computeIsFormBtn () {
      const $xeButton = this
      const props = $xeButton

      const { type } = props
      if (type) {
        return ['submit', 'reset', 'button'].indexOf(type) > -1
      }
      return false
    },
    computeBtnMode () {
      const $xeButton = this
      const props = $xeButton

      const { type, mode } = props
      const $xeButtonGroup = $xeButton.$xeButtonGroup
      if (mode === 'text' || type === 'text' || ($xeButtonGroup && $xeButtonGroup.mode === 'text')) {
        return 'text'
      }
      return 'button'
    },
    computeBtnStatus () {
      const $xeButton = this
      const props = $xeButton

      const { status } = props
      const $xeButtonGroup = $xeButton.$xeButtonGroup
      if (status) {
        return status
      }
      if ($xeButtonGroup) {
        return $xeButtonGroup.status
      }
      return ''
    },
    computeBtnRound () {
      const $xeButton = this
      const props = $xeButton

      const { round } = props
      const $xeButtonGroup = $xeButton.$xeButtonGroup
      if (round) {
        return round
      }
      if ($xeButtonGroup) {
        return $xeButtonGroup.round
      }
      return false
    },
    computeBtnAlign () {
      const $xeButton = this
      const props = $xeButton

      const { align } = props
      const $xeButtonGroup = $xeButton.$xeButtonGroup
      if (align) {
        return align
      }
      if ($xeButtonGroup) {
        return $xeButtonGroup.align
      }
      return false
    },
    computeBtnCircle () {
      const $xeButton = this
      const props = $xeButton

      const { circle } = props
      const $xeButtonGroup = $xeButton.$xeButtonGroup
      if (circle) {
        return circle
      }
      if ($xeButtonGroup) {
        return $xeButtonGroup.circle
      }
      return false
    },
    computeDownBtnList () {
      const $xeButton = this
      const props = $xeButton

      const { options } = props
      if (options) {
        return options.filter(item => {
          const { permissionCode } = item
          return !permissionCode || permission.checkVisible(permissionCode)
        })
      }
      return []
    },
    computePrefixTipOpts () {
      const $xeButton = this
      const props = $xeButton

      return Object.assign({}, props.prefixTooltip)
    },
    computeSuffixTipOpts () {
      const $xeButton = this
      const props = $xeButton

      return Object.assign({}, props.suffixTooltip)
    }
  },
  methods: {
    //
    // methods
    //
    dispatchEvent (type: ValueOf<VxeButtonEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeButton = this
      $xeButton.$emit(getEventCaseName($xeButton, type), createEvent(evnt, { $button: $xeButton }, params))
    },
    openPanel () {
      const $xeButton = this
      const props = $xeButton
      const reactData = $xeButton.reactData
      const internalData = $xeButton.internalData

      const { trigger } = props
      const btnTransfer = $xeButton.computeBtnTransfer
      const panelElem = $xeButton.$refs.refBtnPanel as HTMLElement | undefined
      if (panelElem) {
        panelElem.dataset.active = 'Y'
        if (!reactData.initialized) {
          reactData.initialized = true
          if (btnTransfer) {
            document.body.appendChild(panelElem)
          }
        }
        internalData.showTime = setTimeout(() => {
          if (panelElem.dataset.active === 'Y') {
            this.mouseenterDropdownEvent()
          } else {
            reactData.isAniVisible = false
          }
        }, trigger === 'click' ? 50 : 250)
      }
      return $xeButton.$nextTick()
    },
    closePanel () {
      const $xeButton = this

      return $xeButton.hidePanel()
    },
    hidePanel () {
      const $xeButton = this
      const reactData = $xeButton.reactData
      const internalData = $xeButton.internalData

      const panelElem = $xeButton.$refs.refBtnPanel as HTMLElement | undefined
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
      return this.$nextTick()
    },
    focus () {
      const $xeButton = this

      const btnElem = $xeButton.$refs.refButton as HTMLElement | undefined
      if (btnElem) {
        btnElem.focus()
      }
      return $xeButton.$nextTick()
    },
    blur () {
      const $xeButton = this

      const btnElem = $xeButton.$refs.refButton as HTMLElement | undefined
      if (btnElem) {
        btnElem.blur()
      }
      return this.$nextTick()
    },

    //
    // privateMethods
    //
    updateZindex () {
      const $xeButton = this
      const reactData = $xeButton.reactData

      if (reactData.panelIndex < getLastZIndex()) {
        reactData.panelIndex = nextZIndex()
      }
    },
    updatePlacement  () {
      const $xeButton = this
      const props = $xeButton
      const reactData = $xeButton.reactData

      const { placement } = props
      const { panelIndex } = reactData
      const targetElem = $xeButton.$refs.refButton as HTMLElement | undefined
      const panelElem = $xeButton.$refs.refBtnPanel as HTMLElement | undefined
      const btnTransfer = $xeButton.computeBtnTransfer
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
      return $xeButton.$nextTick().then(handleStyle)
    },
    clickEvent (evnt: Event) {
      const $xeButton = this
      const $xeButtonGroup = $xeButton.$xeButtonGroup

      if ($xeButtonGroup) {
        $xeButtonGroup.handleClick({ name: this.name }, evnt)
      }
      this.dispatchEvent('click', { $event: evnt }, evnt)
    },
    downBtnClickEvent (params: VxeButtonDefines.ClickEventParams, option: VxeButtonDefines.DownButtonOption) {
      const $xeButton = this

      const { $event } = params
      $xeButton.hidePanel()
      $xeButton.dispatchEvent('dropdown-click', { name: option.name, option }, $event)
    },
    mousedownDropdownEvent (evnt: MouseEvent) {
      const isLeftBtn = evnt.button === 0
      if (isLeftBtn) {
        evnt.stopPropagation()
      }
    },
    clickDropdownEvent (evnt: Event) {
      const $xeButton = this
      const reactData = $xeButton.reactData

      const dropdownElem = evnt.currentTarget
      const panelElem = this.$refs.refBtnPanel as HTMLElement | undefined
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
        this.dispatchEvent('dropdown-click', { name: targetElem.getAttribute('name'), option: null, $event: evnt }, evnt)
      }
    },
    mouseenterDropdownEvent () {
      const $xeButton = this
      const reactData = $xeButton.reactData

      const panelElem = this.$refs.refBtnPanel as HTMLElement | undefined
      if (panelElem) {
        panelElem.dataset.active = 'Y'
        reactData.isAniVisible = true
        setTimeout(() => {
          if (panelElem.dataset.active === 'Y') {
            reactData.visiblePanel = true
            this.updateZindex()
            this.updatePlacement()
            setTimeout(() => {
              if (reactData.visiblePanel) {
                this.updatePlacement()
              }
            }, 50)
          }
        }, 20)
      }
    },
    mouseenterTargetEvent  (evnt: MouseEvent) {
      const $xeButton = this
      const props = $xeButton

      const { loading } = props
      const btnDisabled = $xeButton.computeBtnDisabled
      if (!(btnDisabled || loading)) {
        this.openPanel()
        this.mouseenterEvent(evnt)
      }
    },
    mouseleaveTargetEvent  (evnt: MouseEvent) {
      this.hidePanel()
      this.mouseleaveEvent(evnt)
    },
    mouseenterEvent  (evnt: MouseEvent) {
      this.dispatchEvent('mouseenter', {}, evnt)
    },
    mouseleaveEvent (evnt: MouseEvent) {
      this.dispatchEvent('mouseleave', {}, evnt)
    },
    clickTargetEvent (evnt: MouseEvent) {
      const $xeButton = this
      const props = $xeButton
      const reactData = $xeButton.reactData

      const { loading } = props
      const btnDisabled = $xeButton.computeBtnDisabled
      if (!(btnDisabled || loading)) {
        const { trigger } = props
        if (trigger === 'click') {
          if (reactData.visiblePanel) {
            this.hidePanel()
          } else {
            this.openPanel()
          }
        }
        this.clickEvent(evnt)
      }
    },
    mouseleaveDropdownEvent  () {
      this.hidePanel()
    },
    handleGlobalMousewheelEvent  (evnt: Event) {
      const $xeButton = this
      const reactData = $xeButton.reactData

      const panelElem = this.$refs.refBtnPanel as HTMLElement | undefined
      if (reactData.visiblePanel && !getEventTargetNode(evnt, panelElem).flag) {
        this.hidePanel()
      }
    },
    handleGlobalMousedownEvent  (evnt: MouseEvent) {
      const $xeButton = this
      const reactData = $xeButton.reactData

      const btnDisabled = this.computeBtnDisabled
      const { visiblePanel } = reactData
      if (!btnDisabled) {
        const el = this.$refs.refElem
        const panelElem = this.$refs.refBtnPanel as HTMLElement | undefined
        reactData.isActivated = getEventTargetNode(evnt, el).flag || getEventTargetNode(evnt, panelElem).flag
        if (visiblePanel && !reactData.isActivated) {
          this.hidePanel()
        }
      }
    },

    //
    // Render
    //
    renderTooltipIcon (h: CreateElement, tipOpts: VxeButtonPropTypes.PrefixTooltip | VxeButtonPropTypes.SuffixTooltip, type: 'prefix' | 'suffix') {
      return h(VxeTooltipComponent, {
        props: {
          useHTML: tipOpts.useHTML,
          content: tipOpts.content,
          enterable: tipOpts.enterable,
          theme: tipOpts.theme
        },
        scopedSlots: {
          default: () => {
            return h('i', {
              class: [`vxe-button--tooltip-${type}-icon`, tipOpts.icon || getIcon().BUTTON_TOOLTIP_ICON]
            })
          }
        }
      })
    },
    renderContent  (h: CreateElement) {
      const $xeButton = this
      const props = $xeButton
      const slots = $xeButton.$scopedSlots

      const { content, icon, loading, prefixTooltip, suffixTooltip } = props
      const prefixTipOpts = $xeButton.computePrefixTipOpts
      const suffixTipOpts = $xeButton.computeSuffixTipOpts
      const iconSlot = slots.icon
      const defaultSlot = slots.default
      const contVNs: VNode[] = []

      if (prefixTooltip) {
        contVNs.push(
          $xeButton.renderTooltipIcon(h, prefixTipOpts, 'prefix')
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
          }, iconSlot.call(this, {}))
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
          }, defaultSlot.call(this, {}))
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
          $xeButton.renderTooltipIcon(h, suffixTipOpts, 'suffix')
        )
      }
      return contVNs
    },
    renderVN (h: CreateElement): VNode {
      const $xeButton = this
      const props = $xeButton
      const slots = $xeButton.$scopedSlots
      const reactData = $xeButton.reactData

      const { className, popupClassName, trigger, title, routerLink, type, destroyOnClose, name, loading } = props
      const { initialized, isAniVisible, visiblePanel } = reactData
      const isFormBtn = $xeButton.computeIsFormBtn
      const btnMode = $xeButton.computeBtnMode
      const btnStatus = $xeButton.computeBtnStatus
      const btnRound = $xeButton.computeBtnRound
      const btnCircle = $xeButton.computeBtnCircle
      const btnTransfer = $xeButton.computeBtnTransfer
      const btnAlign = $xeButton.computeBtnAlign
      const btnDisabled = $xeButton.computeBtnDisabled
      const permissionInfo = $xeButton.computePermissionInfo
      const downBtnList = $xeButton.computeDownBtnList
      const vSize = $xeButton.computeSize
      const dropdownsSlot = slots.dropdowns

      if (!permissionInfo.visible) {
        return renderEmptyElement($xeButton)
      }
      if (dropdownsSlot || downBtnList.length) {
        const btnOns: Record<string, any> = {}
        const panelOns: Record<string, any> = {}
        if (trigger === 'hover') {
        // hover 触发
          btnOns.mouseenter = $xeButton.mouseenterTargetEvent
          btnOns.mouseleave = $xeButton.mouseleaveTargetEvent

          panelOns.mouseenter = $xeButton.mouseenterDropdownEvent
          panelOns.mouseleave = $xeButton.mouseleaveDropdownEvent
        }
        return h('div', {
          ref: 'refElem',
          class: ['vxe-button--dropdown', className ? (XEUtils.isFunction(className) ? className({ $button: $xeButton }) : className) : '', {
            [`size--${vSize}`]: vSize,
            'is--active': visiblePanel
          }]
        }, [
          routerLink
            ? h('router-link', {
              ref: 'refButton',
              class: ['vxe-button', 'vxe-button--link', `type--${btnMode}`, btnAlign ? `align--${btnAlign}` : '', className ? (XEUtils.isFunction(className) ? className({ $button: $xeButton }) : className) : '', {
                [`size--${vSize}`]: vSize,
                [`theme--${btnStatus}`]: btnStatus,
                'is--round': btnRound,
                'is--circle': btnCircle,
                'is--disabled': btnDisabled || loading,
                'is--loading': loading
              }],
              attrs: {
                title,
                name,
                type: isFormBtn ? type : 'button',
                disabled: btnDisabled || loading,
                custom: true,
                to: routerLink
              },
              on: {
                click: $xeButton.clickTargetEvent,
                ...btnOns
              }
            },
            $xeButton.renderContent(h).concat([
              h('i', {
                class: `vxe-button--dropdown-arrow ${getIcon().BUTTON_DROPDOWN}`
              })
            ])
            )
            : h('button', {
              ref: 'refButton',
              class: ['vxe-button', `type--${btnMode}`, btnAlign ? `align--${btnAlign}` : '', className ? (XEUtils.isFunction(className) ? className({ $button: $xeButton }) : className) : '', {
                [`size--${vSize}`]: vSize,
                [`theme--${btnStatus}`]: btnStatus,
                'is--round': btnRound,
                'is--circle': btnCircle,
                'is--disabled': btnDisabled || loading,
                'is--loading': loading
              }],
              attrs: {
                title,
                name,
                type: isFormBtn ? type : 'button',
                disabled: btnDisabled || loading
              },
              on: {
                click: $xeButton.clickTargetEvent,
                ...btnOns
              }
            }, $xeButton.renderContent(h).concat([
              h('i', {
                class: `vxe-button--dropdown-arrow ${getIcon().BUTTON_DROPDOWN}`
              })
            ])),
          h('div', {
            ref: 'refBtnPanel',
            class: ['vxe-button--dropdown-panel', popupClassName ? (XEUtils.isFunction(popupClassName) ? popupClassName({ $button: $xeButton }) : popupClassName) : '', {
              [`size--${vSize}`]: vSize,
              'is--transfer': btnTransfer,
              'ani--leave': isAniVisible,
              'ani--enter': visiblePanel
            }],
            attrs: {
              placement: reactData.panelPlacement
            },
            style: reactData.panelStyle,
            on: panelOns
          }, initialized && (visiblePanel || isAniVisible)
            ? [
                dropdownsSlot
                  ? h('div', {
                    class: 'vxe-button--dropdown-wrapper',
                    on: {
                      mousedown: $xeButton.mousedownDropdownEvent,
                      click: $xeButton.clickDropdownEvent
                    }
                  }, initialized && (destroyOnClose ? (visiblePanel || isAniVisible) : true) ? dropdownsSlot.call($xeButton, {}) : [])
                  : h('div', {
                    class: 'vxe-button--dropdown-wrapper'
                  }, initialized && (destroyOnClose ? (visiblePanel || isAniVisible) : true)
                    ? downBtnList.map((option, i) => {
                      return h('vxe-button', {
                        key: i,
                        props: {
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
                          align: option.align
                        },
                        on: {
                          click (params: VxeButtonDefines.ClickEventParams) {
                            $xeButton.downBtnClickEvent(params, option)
                          }
                        }
                      })
                    })
                    : [])
              ]
            : [])
        ])
      }
      if (routerLink) {
        return h('router-link', {
          ref: 'refButton',
          class: ['vxe-button', 'vxe-button--link', `type--${btnMode}`, btnAlign ? `align--${btnAlign}` : '', className ? (XEUtils.isFunction(className) ? className({ $button: $xeButton }) : className) : '', {
            [`size--${vSize}`]: vSize,
            [`theme--${btnStatus}`]: btnStatus,
            'is--round': btnRound,
            'is--circle': btnCircle,
            'is--disabled': btnDisabled || loading,
            'is--loading': loading
          }],
          props: {
            title,
            name,
            type: isFormBtn ? type : 'button',
            disabled: btnDisabled || loading,
            custom: true,
            to: routerLink
          },
          on: {
            click: $xeButton.clickEvent,
            mouseenter: $xeButton.mouseenterEvent,
            mouseleave: $xeButton.mouseleaveEvent
          }
        }, $xeButton.renderContent(h))
      }
      return h('button', {
        ref: 'refButton',
        class: ['vxe-button', `type--${btnMode}`, btnAlign ? `align--${btnAlign}` : '', className ? (XEUtils.isFunction(className) ? className({ $button: $xeButton }) : className) : '', {
          [`size--${vSize}`]: vSize,
          [`theme--${btnStatus}`]: btnStatus,
          'is--round': btnRound,
          'is--circle': btnCircle,
          'is--disabled': btnDisabled || loading,
          'is--loading': loading
        }],
        attrs: {
          title,
          name,
          type: isFormBtn ? type : 'button',
          disabled: btnDisabled || loading
        },
        on: {
          click: $xeButton.clickEvent,
          mouseenter: $xeButton.mouseenterEvent,
          mouseleave: $xeButton.mouseleaveEvent
        }
      }, $xeButton.renderContent(h))
    }
  },
  mounted () {
    const $xeButton = this
    const props = $xeButton

    if (process.env.VUE_APP_VXE_ENV === 'development') {
      if (props.type === 'text') {
        warnLog('vxe.error.delProp', ['type=text', 'mode=text'])
      }
    }

    globalEvents.on($xeButton, 'mousewheel', $xeButton.handleGlobalMousewheelEvent)
    globalEvents.on($xeButton, 'mousedown', $xeButton.handleGlobalMousedownEvent)
  },
  beforeDestroy () {
    const $xeButton = this

    const panelElem = $xeButton.$refs.refBtnPanel as HTMLElement | undefined
    if (panelElem && panelElem.parentNode) {
      panelElem.parentNode.removeChild(panelElem)
    }
  },
  destroyed () {
    const $xeButton = this

    globalEvents.off($xeButton, 'mousewheel')
    globalEvents.off($xeButton, 'mousedown')
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
