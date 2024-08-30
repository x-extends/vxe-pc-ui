import { defineComponent, ref, h, inject, reactive, PropType, computed } from 'vue'
import { getConfig, createEvent, useSize } from '../../ui'
import XEUtils from 'xe-utils'
import { toCssUnit } from '../..//ui/src/dom'
import { openPreviewImage } from './util'

import type { VxeImagePropTypes, ImageReactData, VxeImageEmits, ImagePrivateRef, VxeImagePrivateComputed, VxeImageConstructor, VxeImagePrivateMethods, ImageMethods, ImagePrivateMethods, VxeImageGroupConstructor, VxeImageGroupPrivateMethods } from '../../../types'

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
    },
    showPrintButton: {
      type: Boolean as PropType<VxeImagePropTypes.ShowPrintButton>,
      default: () => getConfig().image.showPrintButton
    },
    showDownloadButton: {
      type: Boolean as PropType<VxeImagePropTypes.ShowDownloadButton>,
      default: () => getConfig().image.showDownloadButton
    },
    size: { type: String as PropType<VxeImagePropTypes.Size>, default: () => getConfig().image.size || getConfig().size }
  },
  emits: [
    'click'
  ] as VxeImageEmits,
  setup (props, context) {
    const { emit } = context

    const xID = XEUtils.uniqueId()

    const $xeImageGroup = inject<(VxeImageGroupConstructor & VxeImageGroupPrivateMethods) | null>('$xeImageGroup', null)

    const refElem = ref<HTMLDivElement>()

    const { computeSize } = useSize(props)

    const reactData = reactive<ImageReactData>({
    })

    const refMaps: ImagePrivateRef = {
      refElem
    }

    const computeImgStyle = computed(() => {
      const { width, height } = props
      const style: Record<string, string> = {}
      if (width && height) {
        style.maxWidth = toCssUnit(width)
        style.maxHeight = toCssUnit(height)
      } else {
        if (width) {
          style.width = toCssUnit(width)
        }
        if (height) {
          style.height = toCssUnit(height)
        }
      }
      return style
    })

    const computeImgList = computed(() => {
      const { src } = props
      if (src) {
        return (XEUtils.isArray(src) ? src : [src]).map(item => {
          if (XEUtils.isString(item)) {
            return {
              url: item,
              alt: ''
            }
          }
          return {
            url: item.url,
            alt: item.alt
          }
        })
      }
      return []
    })

    const computeImgItem = computed(() => {
      const imgList = computeImgList.value
      return imgList[0]
    })

    const computeImgUrl = computed(() => {
      const imgItem = computeImgItem.value
      return imgItem ? `${imgItem.url || ''}` : ''
    })

    const computeMaps: VxeImagePrivateComputed = {
      computeSize
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
      const { showPreview, showPrintButton, showDownloadButton } = props
      const imgList = computeImgList.value
      const imgUrl = computeImgUrl.value
      if ($xeImageGroup) {
        $xeImageGroup.handleClickImgEvent(evnt, { url: imgUrl })
      } else {
        if (showPreview && imgUrl) {
          openPreviewImage({
            urlList: imgList,
            showPrintButton,
            showDownloadButton
          })
        }
        imageMethods.dispatchEvent('click', { url: imgUrl }, evnt)
      }
    }

    const imagePrivateMethods: ImagePrivateMethods = {
    }

    Object.assign($xeImage, imageMethods, imagePrivateMethods)

    const renderVN = () => {
      const { alt, loading } = props
      const imgStyle = computeImgStyle.value
      const imgUrl = computeImgUrl.value
      const vSize = computeSize.value
      return h('img', {
        ref: refElem,
        class: ['vxe-image', {
          [`size--${vSize}`]: vSize
        }],
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
