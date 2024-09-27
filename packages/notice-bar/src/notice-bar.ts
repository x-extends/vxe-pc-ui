import { CreateElement, PropType, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, globalEvents, renderEmptyElement, globalMixins } from '../../ui'
import { toCssUnit } from '../../ui/src/dom'

import type { NoticeBarReactData, VxeNoticeBarEmits, ValueOf, VxeNoticeBarPropTypes, VxeComponentSizeType } from '../../../types'

export default defineVxeComponent({
  name: 'VxeNoticeBar',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    duration: [String, Number] as PropType<VxeNoticeBarPropTypes.Duration>,
    direction: {
      type: String as PropType<VxeNoticeBarPropTypes.Direction>,
      default: () => getConfig().noticeBar.direction
    },
    speed: {
      type: String as PropType<VxeNoticeBarPropTypes.Speed>,
      default: () => getConfig().noticeBar.speed
    },
    content: String as PropType<VxeNoticeBarPropTypes.Content>,
    vertical: Boolean as PropType<VxeNoticeBarPropTypes.Vertical>,
    loop: {
      type: Boolean as PropType<VxeNoticeBarPropTypes.Loop>
    },
    size: {
      type: String as PropType<VxeNoticeBarPropTypes.Size>,
      default: () => getConfig().noticeBar.size || getConfig().size
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: NoticeBarReactData = {
      animationDuration: 0
    }
    return {
      xID,
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
    }),
    computeNoticeText () {
      const $xeNoticeBar = this
      const props = $xeNoticeBar

      const { content } = props
      return `${content || ''}`
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeNoticeBarEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeNoticeBar = this
      $xeNoticeBar.$emit(type, createEvent(evnt, { $noticeBar: $xeNoticeBar }, params))
    },
    updateAnimationStyle  () {
      const $xeNoticeBar = this
      const props = $xeNoticeBar
      const reactData = $xeNoticeBar.reactData

      const { speed } = props
      const contEl = this.$refs.refContentElem as HTMLDivElement
      if (contEl) {
        let sRate = 46
        if (speed === 'fast') {
          sRate = 118
        } else if (speed === 'slow') {
          sRate = 18
        }
        reactData.animationDuration = Math.ceil(contEl.scrollWidth / sRate)
      }
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeNoticeBar = this
      const props = $xeNoticeBar
      const slots = $xeNoticeBar.$scopedSlots
      const reactData = $xeNoticeBar.reactData

      const { vertical, duration, direction } = props
      const { animationDuration } = reactData
      const vSize = $xeNoticeBar.computeSize
      const noticeText = $xeNoticeBar.computeNoticeText
      const defaultSlot = slots.default
      const prefixSlot = slots.prefix
      const suffixSlot = slots.suffix
      return h('div', {
        ref: 'refElem',
        class: ['vxe-notice-bar', `is--${vertical ? 'vertical' : 'horizontal'}`, `dir--${direction || 'left'}`, {
          [`size--${vSize}`]: vSize
        }]
      }, [
        prefixSlot
          ? h('div', {
            class: 'vxe-notice-bar--prefix'
          }, prefixSlot({}))
          : renderEmptyElement($xeNoticeBar),
        h('div', {
          class: 'vxe-notice-bar--content'
        }, [
          h('div', {
            ref: 'refContentElem',
            class: 'vxe-notice-bar--inner'
          }, [
            h('div', {
              class: 'vxe-notice-bar--wrapper',
              style: {
                animationDuration: `${duration ? toCssUnit(duration, 's') : animationDuration}s`
              }
            }, defaultSlot ? defaultSlot({}) : noticeText)
          ])
        ]),
        suffixSlot
          ? h('div', {
            class: 'vxe-notice-bar--suffix'
          }, suffixSlot({}))
          : renderEmptyElement($xeNoticeBar)
      ])
    }
  },
  mounted () {
    const $xeNoticeBar = this

    globalEvents.on($xeNoticeBar, 'resize', $xeNoticeBar.updateAnimationStyle)
    $xeNoticeBar.updateAnimationStyle()
  },
  beforeDestroy () {
    const $xeNoticeBar = this

    globalEvents.off($xeNoticeBar, 'resize')
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
