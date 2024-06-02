import { defineComponent, ref, h, reactive, PropType, computed } from 'vue'
import { createEvent } from '@vxe-ui/core'
import XEUtils from 'xe-utils'
import { toCssUnit } from '../..//ui/src/dom'
import { openPreviewImage } from './util'

import type { VxeImagePropTypes, ImageReactData, VxeImageEmits, ImagePrivateRef, VxeImagePrivateComputed, VxeImageConstructor, VxeImagePrivateMethods, ImageMethods, ImagePrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeImage',
  props: {
    src: String as PropType<VxeImagePropTypes.Src>,
    alt: [String, Number] as PropType<VxeImagePropTypes.Alt>,
    loading: String as PropType<VxeImagePropTypes.Loading>,
    title: [String, Number] as PropType<VxeImagePropTypes.Title>,
    width: [String, Number] as PropType<VxeImagePropTypes.Width>,
    height: [String, Number] as PropType<VxeImagePropTypes.Height>
  },
  emits: [
    'click'
  ] as VxeImageEmits,
  setup (props, context) {
    const { emit } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<ImageReactData>({
    })

    const refMaps: ImagePrivateRef = {
      refElem
    }

    const computeImgStyle = computed(() => {
      const { width, height } = props
      const style: Record<string, string> = {}
      if (width) {
        style.width = toCssUnit(width)
      }
      if (height) {
        style.height = toCssUnit(height)
      }
      return style
    })

    const computeMaps: VxeImagePrivateComputed = {
    }

    const $xeImage = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeImageConstructor & VxeImagePrivateMethods

    const imageMethods: ImageMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, createEvent(evnt, { $image: $xeImage }, params))
      }
    }

    const clickEvent = (evnt: MouseEvent) => {
      const { src } = props
      if (src) {
        openPreviewImage({
          urlList: [src]
        })
      }
      imageMethods.dispatchEvent('click', {}, evnt)
    }

    const imagePrivateMethods: ImagePrivateMethods = {
    }

    Object.assign($xeImage, imageMethods, imagePrivateMethods)

    const renderVN = () => {
      const { src, alt, loading } = props
      const imgStyle = computeImgStyle.value
      return h('img', {
        ref: refElem,
        class: 'vxe-image',
        src,
        alt,
        loading,
        style: imgStyle,
        onClick: clickEvent
      })
    }

    $xeImage.renderVN = renderVN

    return $xeImage
  },
  render () {
    return this.renderVN()
  }
})
