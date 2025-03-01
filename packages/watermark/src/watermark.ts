import { CreateElement, VNode, PropType } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, globalEvents } from '../../ui'
import { toCssUnit } from '../../ui/src/dom'
import { getContentUrl } from './util'

import type { WatermarkReactData, VxeWatermarkPropTypes, VxeWatermarkEmits, ValueOf, VxeComponentStyleType } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeWatermark',
  props: {
    width: String as PropType<VxeWatermarkPropTypes.Width>,
    height: String as PropType<VxeWatermarkPropTypes.Height>,
    imageUrl: String as PropType<VxeWatermarkPropTypes.ImageUrl>,
    rotate: {
      type: [Number, String] as PropType<VxeWatermarkPropTypes.Rotate>,
      default: () => getConfig().watermark.rotate
    },
    gap: {
      type: [Array, Number, String] as PropType<VxeWatermarkPropTypes.Gap>,
      default: () => XEUtils.clone(getConfig().watermark.gap, true)
    },
    content: [String, Array] as PropType<VxeWatermarkPropTypes.Content>,
    font: Object as PropType<VxeWatermarkPropTypes.Font>,
    offset: Object as PropType<VxeWatermarkPropTypes.Offset>,
    zIndex: [String, Number] as PropType<VxeWatermarkPropTypes.ZIndex>
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: WatermarkReactData = {
      markUrl: ''
    }
    return {
      xID,
      reactData
    }
  },
  computed: {
    computeFontOpts () {
      const $xeWatermark = this
      const props = $xeWatermark

      return XEUtils.assign({}, XEUtils.clone(getConfig().watermark.font, true), props.font)
    },
    computeWrapperStyle () {
      const $xeWatermark = this
      const props = $xeWatermark
      const reactData = $xeWatermark.reactData

      const { width, height, zIndex } = props
      const { markUrl } = reactData
      const stys: VxeComponentStyleType = {}
      if (width) {
        stys.width = toCssUnit(width)
      }
      if (height) {
        stys.height = toCssUnit(height)
      }
      if (markUrl) {
        stys.backgroundImage = `url(${markUrl})`
      }
      if (zIndex) {
        stys.zIndex = zIndex
      }
      return stys
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeWatermarkEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeWatermark = this
      $xeWatermark.$emit(type, createEvent(evnt, { $watermark: $xeWatermark }, params))
    },
    updateMarkStyle  () {
      const $xeWatermark = this
      const props = $xeWatermark
      const reactData = $xeWatermark.reactData

      const { content, gap, rotate, offset } = props
      const el = $xeWatermark.$refs.refElem as HTMLDivElement
      const fontOpts = $xeWatermark.computeFontOpts
      if (el) {
        if (content) {
          getContentUrl(content, getComputedStyle(el).fontSize, {
            font: fontOpts,
            rotate,
            gap,
            offset
          }).then(url => {
            reactData.markUrl = url
          })
        }
      }
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeWatermark = this

      const wrapperStyle = $xeWatermark.computeWrapperStyle
      return h('div', {
        ref: 'refElem',
        class: 'vxe-watermark',
        style: wrapperStyle
      })
    }
  },
  watch: {
    imageUrl () {
      const $xeWatermark = this

      $xeWatermark.updateMarkStyle()
    },
    content () {
      const $xeWatermark = this

      $xeWatermark.updateMarkStyle()
    },
    gap () {
      const $xeWatermark = this

      $xeWatermark.updateMarkStyle()
    },
    rotate () {
      const $xeWatermark = this

      $xeWatermark.updateMarkStyle()
    },
    width () {
      const $xeWatermark = this

      $xeWatermark.updateMarkStyle()
    },
    height () {
      const $xeWatermark = this

      $xeWatermark.updateMarkStyle()
    },
    font () {
      const $xeWatermark = this

      $xeWatermark.updateMarkStyle()
    }
  },
  mounted () {
    const $xeWatermark = this

    $xeWatermark.updateMarkStyle()
    globalEvents.on($xeWatermark, 'resize', XEUtils.throttle(() => {
      $xeWatermark.updateMarkStyle()
    }, 300, { trailing: true, leading: true }))
  },
  beforeDestroy () {
    const $xeWatermark = this

    globalEvents.off($xeWatermark, 'resize')
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
