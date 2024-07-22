import { defineComponent, ref, h, reactive, PropType, computed } from 'vue'
import { getConfig, createEvent } from '../../ui'
import XEUtils from 'xe-utils'
import { toCssUnit } from '../..//ui/src/dom'
import { openPreviewImage } from './util'

import type { VxeImagePropTypes, ImageReactData, VxeImageEmits, ImagePrivateRef, VxeImagePrivateComputed, VxeImageConstructor, VxeImagePrivateMethods, ImageMethods, ImagePrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeImage',
  props: {
    src: [String, Array] as PropType<VxeImagePropTypes.Src>,
    alt: [String, Number] as PropType<VxeImagePropTypes.Alt>,
    loading: String as PropType<VxeImagePropTypes.Loading>,
    title: [String, Number] as PropType<VxeImagePropTypes.Title>,
    width: [String, Number] as PropType<VxeImagePropTypes.Width>,
    height: [String, Number] as PropType<VxeImagePropTypes.Height>,
    showPreview: {
      type: Boolean as PropType<VxeImagePropTypes.ShowPreview>,
      default: () => getConfig().image.showPreview
    }
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

    const computeImgUrl = computed(() => {
      const { src } = props
      const item = XEUtils.isArray(src) ? src[0] : src
      if (XEUtils.isString(item)) {
        return item
      }
      return item ? (item as any).url : item
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
      const { showPreview, src } = props
      if (showPreview && src) {
        openPreviewImage({
          urlList: XEUtils.isArray(src) ? src : [src]
        })
      }
      imageMethods.dispatchEvent('click', {}, evnt)
    }

    const imagePrivateMethods: ImagePrivateMethods = {
    }

    Object.assign($xeImage, imageMethods, imagePrivateMethods)

    const renderVN = () => {
      const { alt, loading } = props
      const imgStyle = computeImgStyle.value
      const imgUrl = computeImgUrl.value
      return h('img', {
        ref: refElem,
        class: 'vxe-image',
        src: imgUrl,
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
