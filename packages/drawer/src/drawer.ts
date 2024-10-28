import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { globalMixins, getIcon, getConfig, getI18n, globalEvents, GLOBAL_EVENT_KEYS, createEvent, renderEmptyElement } from '../../ui'
import { getLastZIndex, nextZIndex, getFuncText } from '../../ui/src/utils'
import { toCssUnit } from '../../ui/src/dom'
import { getSlotVNs } from '../../ui/src/vn'
import VxeButtonComponent from '../../button/src/button'
import VxeLoadingComponent from '../../loading/index'

import type { VxeDrawerPropTypes, DrawerReactData, VxeDrawerEmits, ValueOf, VxeDrawerConstructor, VxeButtonConstructor, DrawerEventTypes } from '../../../types'

export const allActiveDrawers: VxeDrawerConstructor[] = []

export default defineVxeComponent({
  name: 'VxeDrawer',
  mixins: [
    globalMixins.sizeMixin,
    globalMixins.permissionMixin
  ],
  props: {
    value: Boolean as PropType<VxeDrawerPropTypes.ModelValue>,
    id: String as PropType<VxeDrawerPropTypes.ID>,
    title: String as PropType<VxeDrawerPropTypes.Title>,
    loading: {
      type: Boolean as PropType<VxeDrawerPropTypes.Loading>,
      default: null
    },
    className: String as PropType<VxeDrawerPropTypes.ClassName>,
    position: {
      type: [String, Object] as PropType<VxeDrawerPropTypes.Position>,
      default: () => getConfig().drawer.position
    },
    lockView: {
      type: Boolean as PropType<VxeDrawerPropTypes.LockView>,
      default: () => getConfig().drawer.lockView
    },
    lockScroll: Boolean as PropType<VxeDrawerPropTypes.LockScroll>,
    mask: {
      type: Boolean as PropType<VxeDrawerPropTypes.Mask>,
      default: () => getConfig().drawer.mask
    },
    maskClosable: {
      type: Boolean as PropType<VxeDrawerPropTypes.MaskClosable>,
      default: () => getConfig().drawer.maskClosable
    },
    escClosable: {
      type: Boolean as PropType<VxeDrawerPropTypes.EscClosable>,
      default: () => getConfig().drawer.escClosable
    },
    cancelClosable: {
      type: Boolean as PropType<VxeDrawerPropTypes.CancelClosable>,
      default: () => getConfig().drawer.cancelClosable
    },
    confirmClosable: {
      type: Boolean as PropType<VxeDrawerPropTypes.ConfirmClosable>,
      default: () => getConfig().drawer.confirmClosable
    },
    showHeader: {
      type: Boolean as PropType<VxeDrawerPropTypes.ShowHeader>,
      default: () => getConfig().drawer.showHeader
    },
    showFooter: {
      type: Boolean as PropType<VxeDrawerPropTypes.ShowFooter>,
      default: () => getConfig().drawer.showFooter
    },
    showClose: {
      type: Boolean as PropType<VxeDrawerPropTypes.ShowClose>,
      default: () => getConfig().drawer.showClose
    },
    content: [Number, String] as PropType<VxeDrawerPropTypes.Content>,
    showCancelButton: {
      type: Boolean as PropType<VxeDrawerPropTypes.ShowCancelButton>,
      default: null
    },
    cancelButtonText: {
      type: String as PropType<VxeDrawerPropTypes.CancelButtonText>,
      default: () => getConfig().drawer.cancelButtonText
    },
    showConfirmButton: {
      type: Boolean as PropType<VxeDrawerPropTypes.ShowConfirmButton>,
      default: () => getConfig().drawer.showConfirmButton
    },
    confirmButtonText: {
      type: String as PropType<VxeDrawerPropTypes.ConfirmButtonText>,
      default: () => getConfig().drawer.confirmButtonText
    },
    destroyOnClose: {
      type: Boolean as PropType<VxeDrawerPropTypes.DestroyOnClose>,
      default: () => getConfig().drawer.destroyOnClose
    },
    showTitleOverflow: {
      type: Boolean as PropType<VxeDrawerPropTypes.ShowTitleOverflow>,
      default: () => getConfig().drawer.showTitleOverflow
    },
    width: [Number, String] as PropType<VxeDrawerPropTypes.Width>,
    height: [Number, String] as PropType<VxeDrawerPropTypes.Height>,
    zIndex: Number as PropType<VxeDrawerPropTypes.ZIndex>,
    transfer: {
      type: Boolean as PropType<VxeDrawerPropTypes.Transfer>,
      default: () => getConfig().drawer.transfer
    },
    padding: {
      type: Boolean as PropType<VxeDrawerPropTypes.Padding>,
      default: () => getConfig().drawer.padding
    },
    size: {
      type: String as PropType<VxeDrawerPropTypes.Size>,
      default: () => getConfig().drawer.size || getConfig().size
    },
    beforeHideMethod: {
      type: Function as PropType<VxeDrawerPropTypes.BeforeHideMethod>,
      default: () => getConfig().drawer.beforeHideMethod
    },
    slots: Object as PropType<VxeDrawerPropTypes.Slots>
  },
  provide () {
    const $xeDrawer = this
    return {
      $xeDrawer
    }
  },
  data () {
    const reactData: DrawerReactData = {
      initialized: false,
      visible: false,
      contentVisible: false,
      drawerZIndex: 0
    }
    return {
      xID: XEUtils.uniqueId(),
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): DrawerReactData
    })
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeDrawerEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeDrawer = this
      $xeDrawer.$emit(type, createEvent(evnt, { $drawer: $xeDrawer }, params))
    },
    emitModel (value: any) {
      const $xeDrawer = this

      const { _events } = $xeDrawer as any
      $xeDrawer.$emit('input', value)
      if (_events && _events.modelValue) {
        $xeDrawer.$emit('modelValue', value)
      } else {
        $xeDrawer.$emit('model-value', value)
      }
    },
    callSlot  (slotFunc: ((params: any, h: CreateElement) => any) | string | null, params: any, h: CreateElement) {
      const $xeDrawer = this
      const slots = $xeDrawer.$scopedSlots

      if (slotFunc) {
        if (XEUtils.isString(slotFunc)) {
          slotFunc = slots[slotFunc] || null
        }
        if (XEUtils.isFunction(slotFunc)) {
          return getSlotVNs(slotFunc.call($xeDrawer, params, h))
        }
      }
      return []
    },
    open () {
      const $xeDrawer = this

      return $xeDrawer.openDrawer()
    },
    close () {
      const $xeDrawer = this

      return $xeDrawer.closeDrawer('close')
    },
    getBox  () {
      const $xeDrawer = this

      const boxElem = $xeDrawer.$refs.refDrawerBox as HTMLDialogElement
      return boxElem
    },
    recalculate  () {
      const $xeDrawer = this
      const props = $xeDrawer

      const { width, height } = props
      const boxElem = $xeDrawer.getBox()
      if (boxElem) {
        boxElem.style.width = toCssUnit(width)
        boxElem.style.height = toCssUnit(height)
      }
      return $xeDrawer.$nextTick()
    },
    updateZindex () {
      const $xeDrawer = this
      const props = $xeDrawer
      const reactData = $xeDrawer.reactData

      const { zIndex } = props
      const { drawerZIndex } = reactData
      if (zIndex) {
        reactData.drawerZIndex = zIndex
      } else if (drawerZIndex < getLastZIndex()) {
        reactData.drawerZIndex = nextZIndex()
      }
    },
    closeDrawer  (type: DrawerEventTypes) {
      const $xeDrawer = this
      const props = $xeDrawer
      const reactData = $xeDrawer.reactData

      const { beforeHideMethod } = props
      const { visible } = reactData
      const params = { type }
      if (visible) {
        Promise.resolve(beforeHideMethod ? beforeHideMethod(params) : null).then((rest) => {
          if (!XEUtils.isError(rest)) {
            reactData.contentVisible = false
            XEUtils.remove(allActiveDrawers, item => item === $xeDrawer)
            $xeDrawer.dispatchEvent('before-hide', params, null)
            setTimeout(() => {
              reactData.visible = false
              $xeDrawer.emitModel(false)
              $xeDrawer.dispatchEvent('hide', params, null)
            }, 200)
          }
        }).catch(e => e)
      }
      return $xeDrawer.$nextTick()
    },
    closeEvent (evnt: Event) {
      const $xeDrawer = this

      const type = 'close'
      $xeDrawer.dispatchEvent(type, { type }, evnt)
      $xeDrawer.closeDrawer(type)
    },
    confirmEvent (evnt: Event) {
      const $xeDrawer = this
      const props = $xeDrawer

      const { confirmClosable } = props
      const type = 'confirm'
      $xeDrawer.dispatchEvent(type, { type }, evnt)
      if (confirmClosable) {
        $xeDrawer.closeDrawer(type)
      }
    },
    cancelEvent  (evnt: Event) {
      const $xeDrawer = this
      const props = $xeDrawer

      const { cancelClosable } = props
      const type = 'cancel'
      $xeDrawer.dispatchEvent(type, { type }, evnt)
      if (cancelClosable) {
        $xeDrawer.closeDrawer(type)
      }
    },
    openDrawer () {
      const $xeDrawer = this
      const props = $xeDrawer
      const reactData = $xeDrawer.reactData

      const { showFooter } = props
      const { initialized, visible } = reactData
      if (!initialized) {
        reactData.initialized = true
      }
      if (!visible) {
        $xeDrawer.recalculate()
        reactData.visible = true
        reactData.contentVisible = false
        $xeDrawer.updateZindex()
        allActiveDrawers.push($xeDrawer)
        setTimeout(() => {
          reactData.contentVisible = true
          $xeDrawer.$nextTick(() => {
            if (showFooter) {
              const confirmBtn = $xeDrawer.$refs.refConfirmBtn as unknown as VxeButtonConstructor
              const cancelBtn = $xeDrawer.$refs.refCancelBtn as unknown as VxeButtonConstructor
              const operBtn = confirmBtn || cancelBtn
              if (operBtn) {
                operBtn.focus()
              }
            }
            const type = ''
            const params = { type }
            $xeDrawer.emitModel(true)
            $xeDrawer.dispatchEvent('show', params, null)
          })
        }, 10)
      }
      return $xeDrawer.$nextTick()
    },
    selfClickEvent  (evnt: Event) {
      const $xeDrawer = this
      const props = $xeDrawer

      const el = $xeDrawer.$refs.refElem as HTMLDivElement
      if (props.maskClosable && evnt.target === el) {
        const type = 'mask'
        $xeDrawer.closeDrawer(type)
      }
    },
    handleGlobalKeydownEvent  (evnt: KeyboardEvent) {
      const $xeDrawer = this

      const isEsc = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ESCAPE)
      if (isEsc) {
        const lastDrawer = XEUtils.max(allActiveDrawers, (item) => item.reactData.drawerZIndex)
        // 多个时，只关掉最上层的窗口
        if (lastDrawer) {
          setTimeout(() => {
            if (lastDrawer === $xeDrawer && lastDrawer.escClosable) {
              const type = 'exit'
              $xeDrawer.dispatchEvent('close', { type }, evnt)
              $xeDrawer.closeDrawer(type)
            }
          }, 10)
        }
      }
    },
    boxMousedownEvent () {
      const $xeDrawer = this
      const reactData = $xeDrawer.reactData

      const { drawerZIndex } = reactData
      if (allActiveDrawers.some(comp => comp.reactData.visible && comp.reactData.drawerZIndex > drawerZIndex)) {
        $xeDrawer.updateZindex()
      }
    },

    //
    // Render
    //
    renderTitles  (h: CreateElement) {
      const $xeDrawer = this
      const props = $xeDrawer
      const slots = $xeDrawer.$scopedSlots

      const { slots: propSlots = {}, showClose, title } = props
      const titleSlot = slots.title || propSlots.title
      const cornerSlot = slots.corner || propSlots.corner
      return [
        h('div', {
          class: 'vxe-drawer--header-title'
        }, titleSlot ? $xeDrawer.callSlot(titleSlot, { $drawer: $xeDrawer }, h) : (title ? getFuncText(title) : getI18n('vxe.alert.title'))),
        h('div', {
          class: 'vxe-drawer--header-right'
        }, [
          cornerSlot
            ? h('div', {
              class: 'vxe-drawer--corner-wrapper'
            }, $xeDrawer.callSlot(cornerSlot, { $drawer: $xeDrawer }, h))
            : renderEmptyElement($xeDrawer),
          showClose
            ? h('div', {
              class: ['vxe-drawer--close-btn', 'trigger--btn'],
              attrs: {
                title: getI18n('vxe.drawer.close')
              },
              on: {
                click: $xeDrawer.closeEvent
              }
            }, [
              h('i', {
                class: getIcon().DRAWER_CLOSE
              })
            ])
            : renderEmptyElement($xeDrawer)
        ])
      ]
    },
    renderHeader  (h: CreateElement) {
      const $xeDrawer = this
      const props = $xeDrawer
      const slots = $xeDrawer.$scopedSlots

      const { slots: propSlots = {}, showTitleOverflow } = props
      const headerSlot = slots.header || propSlots.header
      if (props.showHeader) {
        return h('div', {
          class: ['vxe-drawer--header', {
            'is--ellipsis': showTitleOverflow
          }]
        }, headerSlot ? $xeDrawer.callSlot(headerSlot, { $drawer: $xeDrawer }, h) : $xeDrawer.renderTitles(h))
      }
      return renderEmptyElement($xeDrawer)
    },
    renderBody (h: CreateElement) {
      const $xeDrawer = this
      const props = $xeDrawer
      const slots = $xeDrawer.$scopedSlots

      const { slots: propSlots = {}, content } = props
      const defaultSlot = slots.default || propSlots.default
      const leftSlot = slots.left || propSlots.left
      const rightSlot = slots.right || propSlots.right
      return h('div', {
        class: 'vxe-drawer--body'
      }, [
        leftSlot
          ? h('div', {
            class: 'vxe-drawer--body-left'
          }, $xeDrawer.callSlot(leftSlot, { $drawer: $xeDrawer }, h))
          : renderEmptyElement($xeDrawer),
        h('div', {
          class: 'vxe-drawer--body-default'
        }, [
          h('div', {
            class: 'vxe-drawer--content'
          }, defaultSlot ? $xeDrawer.callSlot(defaultSlot, { $drawer: $xeDrawer }, h) : getFuncText(content))
        ]),
        rightSlot
          ? h('div', {
            class: 'vxe-drawer--body-right'
          }, $xeDrawer.callSlot(rightSlot, { $drawer: $xeDrawer }, h))
          : renderEmptyElement($xeDrawer),
        h(VxeLoadingComponent, {
          class: 'vxe-drawer--loading',
          props: {
            value: props.loading
          }
        })
      ])
    },
    renderDefaultFooter (h: CreateElement): VNode {
      const $xeDrawer = this
      const props = $xeDrawer
      const slots = $xeDrawer.$scopedSlots

      const { slots: propSlots = {}, showCancelButton, showConfirmButton, loading } = props
      const lfSlot = slots.leftfoot || propSlots.leftfoot
      const rfSlot = slots.rightfoot || propSlots.rightfoot
      const btnVNs = []
      if (showCancelButton) {
        btnVNs.push(
          h(VxeButtonComponent, {
            key: 1,
            ref: 'refCancelBtn',
            props: {
              content: props.cancelButtonText || getI18n('vxe.button.cancel')
            },
            on: {
              click: $xeDrawer.cancelEvent
            }
          })
        )
      }
      if (showConfirmButton) {
        btnVNs.push(
          h(VxeButtonComponent, {
            key: 2,
            ref: 'refConfirmBtn',
            props: {
              status: 'primary',
              loading: loading,
              content: props.confirmButtonText || getI18n('vxe.button.confirm')
            },
            on: {
              click: $xeDrawer.confirmEvent
            }
          })
        )
      }
      return h('div', {
        class: 'vxe-drawer--footer-wrapper'
      }, [
        h('div', {
          class: 'vxe-drawer--footer-left'
        }, lfSlot ? $xeDrawer.callSlot(lfSlot, { $drawer: $xeDrawer }, h) : []),
        h('div', {
          class: 'vxe-drawer--footer-right'
        }, rfSlot ? $xeDrawer.callSlot(rfSlot, { $drawer: $xeDrawer }, h) : btnVNs)
      ])
    },
    renderFooter  (h: CreateElement): VNode {
      const $xeDrawer = this
      const props = $xeDrawer
      const slots = $xeDrawer.$scopedSlots

      const { slots: propSlots = {} } = props
      const footerSlot = slots.footer || propSlots.footer
      if (props.showFooter) {
        return h('div', {
          class: 'vxe-drawer--footer'
        }, footerSlot ? $xeDrawer.callSlot(footerSlot, { $drawer: $xeDrawer }, h) : [$xeDrawer.renderDefaultFooter(h)])
      }
      return renderEmptyElement($xeDrawer)
    },
    renderVN (h: CreateElement): VNode {
      const $xeDrawer = this
      const props = $xeDrawer
      const slots = $xeDrawer.$scopedSlots
      const reactData = $xeDrawer.reactData

      const { slots: propSlots = {}, className, position, loading, lockScroll, padding, lockView, mask, destroyOnClose } = props
      const { initialized, contentVisible, visible } = reactData
      const asideSlot = slots.aside || propSlots.aside
      const vSize = $xeDrawer.computeSize
      return h('div', {
        ref: 'refElem',
        class: ['vxe-drawer--wrapper', `pos--${position}`, className || '', {
          [`size--${vSize}`]: vSize,
          'is--padding': padding,
          'lock--scroll': lockScroll,
          'lock--view': lockView,
          'is--mask': mask,
          'is--visible': contentVisible,
          'is--active': visible,
          'is--loading': loading
        }],
        style: {
          zIndex: reactData.drawerZIndex
        },
        on: {
          click: $xeDrawer.selfClickEvent
        }
      }, initialized
        ? [
            h('div', {
              ref: 'refDrawerBox',
              class: 'vxe-drawer--box',
              on: {
                mousedown: $xeDrawer.boxMousedownEvent
              }
            }, [
              asideSlot
                ? h('div', {
                  class: 'vxe-drawer--aside'
                }, $xeDrawer.callSlot(asideSlot, { $drawer: $xeDrawer }, h))
                : renderEmptyElement($xeDrawer),
              h('div', {
                class: 'vxe-drawer--container'
              }, !reactData.initialized || (destroyOnClose && !reactData.visible)
                ? []
                : [
                    $xeDrawer.renderHeader(h),
                    $xeDrawer.renderBody(h),
                    $xeDrawer.renderFooter(h)
                  ])
            ])
          ]
        : [])
    }
  },
  watch: {
    width () {
      const $xeDrawer = this

      $xeDrawer.recalculate()
    },
    height () {
      const $xeDrawer = this

      $xeDrawer.recalculate()
    },
    value (val) {
      const $xeDrawer = this

      if (val) {
        $xeDrawer.openDrawer()
      } else {
        $xeDrawer.closeDrawer('model')
      }
    }
  },
  mounted () {
    const $xeDrawer = this
    const props = $xeDrawer

    $xeDrawer.$nextTick(() => {
      if (props.value) {
        $xeDrawer.openDrawer()
      }
      $xeDrawer.recalculate()
    })
    if (props.escClosable) {
      globalEvents.on($xeDrawer, 'keydown', $xeDrawer.handleGlobalKeydownEvent)
    }
  },
  beforeDestroy () {
    const $xeDrawer = this
    const reactData = $xeDrawer.reactData

    const { drawerZIndex } = reactData
    if (allActiveDrawers.some(comp => comp.reactData.visible && comp.reactData.drawerZIndex > drawerZIndex)) {
      $xeDrawer.updateZindex()
    }
    globalEvents.off($xeDrawer, 'keydown')
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
