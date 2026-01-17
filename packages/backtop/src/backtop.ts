import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, createEvent, globalMixins, renderEmptyElement } from '../../ui'
import { errLog } from '../../ui/src/log'
import { getLastZIndex, nextZIndex } from '../../ui/src/utils'
import { toCssUnit } from '../../ui/src/dom'
import VxeButtonComponent from '../../button'

import type { BacktopInternalData, VxeBacktopPropTypes, BacktopReactData, VxeBacktopEmits, VxeComponentSizeType, ValueOf, VxeComponentStyleType } from '../../../types'

function createInternalData (): BacktopInternalData {
  return {
    targetEl: null
  }
}

function createReactData (): BacktopReactData {
  return {
    showBtn: false,
    backtopZindex: 0
  }
}

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeBacktop',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    target: String as PropType<VxeBacktopPropTypes.Target>,
    size: {
      type: String as PropType<VxeBacktopPropTypes.Size>,
      default: () => getConfig().backtop.size || getConfig().size
    },
    circle: {
      type: Boolean as PropType<VxeBacktopPropTypes.Circle>,
      default: () => getConfig().backtop.circle
    },
    right: {
      type: [String, Number] as PropType<VxeBacktopPropTypes.Right>,
      default: () => getConfig().backtop.right
    },
    bottom: {
      type: [String, Number] as PropType<VxeBacktopPropTypes.Bottom>,
      default: () => getConfig().backtop.bottom
    },
    status: {
      type: [String, Number] as PropType<VxeBacktopPropTypes.Status>,
      default: () => getConfig().backtop.status
    },
    icon: {
      type: String as PropType<VxeBacktopPropTypes.Icon>,
      default: () => getConfig().backtop.icon
    },
    showIcon: {
      type: Boolean as PropType<VxeBacktopPropTypes.ShowIcon>,
      default: () => getConfig().backtop.showIcon
    },
    content: {
      type: [String, Number] as PropType<VxeBacktopPropTypes.Content>,
      default: () => getConfig().backtop.content
    },
    showContent: {
      type: Boolean as PropType<VxeBacktopPropTypes.ShowContent>,
      default: () => getConfig().backtop.showContent
    },
    showTop: {
      type: Boolean as PropType<VxeBacktopPropTypes.ShowTop>,
      default: () => getConfig().backtop.showTop
    },
    showBottom: {
      type: Boolean as PropType<VxeBacktopPropTypes.ShowBottom>,
      default: () => getConfig().backtop.showBottom
    },
    shadow: {
      type: Boolean as PropType<VxeBacktopPropTypes.Shadow>,
      default: () => getConfig().backtop.shadow
    },
    zIndex: {
      type: [String, Number] as PropType<VxeBacktopPropTypes.ZIndex>,
      default: () => getConfig().backtop.zIndex
    },
    threshold: {
      type: [String, Number] as PropType<VxeBacktopPropTypes.Threshold>,
      default: () => getConfig().backtop.threshold
    },
    position: {
      type: String as PropType<VxeBacktopPropTypes.Position>,
      default: () => getConfig().backtop.position
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const internalData = createInternalData()
    const reactData = createReactData()
    return {
      xID,
      internalData,
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
    }),
    computeWrapperStyle () {
      const $xeBacktop = this
      const props = $xeBacktop
      const reactData = $xeBacktop.reactData

      const { right, bottom } = props
      const { backtopZindex } = reactData
      const stys: VxeComponentStyleType = {}
      if (right) {
        stys.right = toCssUnit(right)
      }
      if (bottom) {
        stys.bottom = toCssUnit(bottom)
      }
      if (backtopZindex) {
        stys.zIndex = backtopZindex
      }
      return stys
    }
  },
  watch: {
    position () {
      const $xeBacktop = this

      $xeBacktop.updateZIndex()
    },
    target () {
      const $xeBacktop = this

      $xeBacktop.handleTargetElement()
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeBacktopEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeBacktop = this
      $xeBacktop.$emit(type, createEvent(evnt, { $backtop: $xeBacktop }, params))
    },
    updateZIndex () {
      const $xeBacktop = this
      const props = $xeBacktop
      const reactData = $xeBacktop.reactData

      const { position, zIndex } = props
      const { backtopZindex } = reactData
      if (zIndex) {
        reactData.backtopZindex = XEUtils.toNumber(zIndex)
      } else if (position === 'fixed') {
        if (backtopZindex < getLastZIndex()) {
          reactData.backtopZindex = nextZIndex()
        }
      }
    },
    showBacktop () {
      const $xeBacktop = this
      const reactData = $xeBacktop.reactData

      $xeBacktop.updateZIndex()
      reactData.showBtn = true
    },
    hideBacktop () {
      const $xeBacktop = this
      const reactData = $xeBacktop.reactData

      reactData.showBtn = false
    },
    handleScrollEvent (evnt: Event) {
      const $xeBacktop = this
      const props = $xeBacktop
      const reactData = $xeBacktop.reactData

      const { threshold } = props
      const currentEl = evnt.currentTarget as HTMLElement
      const scrollTop = currentEl.scrollTop
      reactData.showBtn = scrollTop > Math.max(1, XEUtils.toNumber(threshold))
    },
    handleToTop () {
      const $xeBacktop = this
      const internalData = $xeBacktop.internalData

      const { targetEl } = internalData
      if (!targetEl) {
        return
      }
      const scrollTop = targetEl.scrollTop
      if (scrollTop > 0) {
        requestAnimationFrame($xeBacktop.handleToTop)
        const currScrollTop = scrollTop - Math.max(12, scrollTop / 6)
        targetEl.scrollTop = currScrollTop > 10 ? currScrollTop : 0
      }
    },
    removeScrollEvent () {
      const $xeBacktop = this
      const internalData = $xeBacktop.internalData

      const { targetEl } = internalData
      if (targetEl) {
        targetEl.removeEventListener('scroll', $xeBacktop.handleScrollEvent)
      }
    },
    addScrollEvent () {
      const $xeBacktop = this
      const internalData = $xeBacktop.internalData

      const { targetEl } = internalData
      if (targetEl) {
        targetEl.addEventListener('scroll', $xeBacktop.handleScrollEvent, { passive: true })
      }
    },
    handleTargetElement () {
      const $xeBacktop = this
      const props = $xeBacktop
      const internalData = $xeBacktop.internalData

      $xeBacktop.$nextTick(() => {
        const { target } = props
        if (!target) {
          $xeBacktop.removeScrollEvent()
          errLog('vxe.error.reqProp', ['target'])
          return
        }
        if (XEUtils.isString(target)) {
          const tEl = document.querySelector<HTMLElement>(target)
          if (!tEl) {
            errLog('vxe.error.errProp', [`target=${target}`, 'body'])
          }
          const { targetEl } = internalData
          if (targetEl !== tEl) {
            $xeBacktop.removeScrollEvent()
            internalData.targetEl = tEl
            $xeBacktop.addScrollEvent()
          }
        }
      })
    },
    clickEvent (evnt: MouseEvent) {
      const $xeBacktop = this

      $xeBacktop.handleToTop()
      $xeBacktop.dispatchEvent('click', {}, evnt)
    },

    //
    // Render
    //
    renderVN  (h: CreateElement): VNode {
      const $xeBacktop = this
      const props = $xeBacktop
      const slots = $xeBacktop.$scopedSlots
      const reactData = $xeBacktop.reactData

      const { circle, position, status, icon, showIcon, content, showContent, showTop, showBottom, shadow } = props
      const { showBtn } = reactData
      const wrapperStyle = $xeBacktop.computeWrapperStyle
      const vSize = $xeBacktop.computeSize
      const defaultSlot = slots.default
      const topSlot = slots.top
      const bottomSlot = slots.bottom
      return h('div', {
        ref: 'refElem',
        class: ['vxe-backtop', position === 'fixed' ? ('is--' + position) : 'is--absolute', {
          [`size--${vSize}`]: vSize,
          'is--visible': showBtn
        }],
        style: wrapperStyle
      }, [
        showTop && topSlot
          ? h('div', {
            class: 'vxe-backtop--top-wrapper'
          }, topSlot({}))
          : renderEmptyElement($xeBacktop),
        h('div', {
          class: 'vxe-backtop--content-wrapper',
          on: {
            click: $xeBacktop.clickEvent
          }
        }, [
          defaultSlot
            ? defaultSlot({})
            : [
                h(VxeButtonComponent, {
                  props: {
                    circle,
                    status,
                    shadow,
                    icon: showIcon ? (icon || getIcon().BACKTOP_TOP) : '',
                    content: showContent ? content : ''
                  }
                })
              ]
        ]),
        showBottom && bottomSlot
          ? h('div', {
            class: 'vxe-backtop--bottom-wrapper'
          }, bottomSlot({}))
          : renderEmptyElement($xeBacktop)
      ])
    }
  },
  mounted () {
    const $xeBacktop = this
    const props = $xeBacktop

    const { showTop } = props
    if (showTop) {
      $xeBacktop.updateZIndex()
    }
    $xeBacktop.handleTargetElement()
  },
  beforeDestroy () {
    const $xeBacktop = this
    const reactData = $xeBacktop.reactData
    const internalData = $xeBacktop.internalData

    $xeBacktop.removeScrollEvent()
    XEUtils.assign(reactData, createReactData())
    XEUtils.assign(internalData, createInternalData())
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
