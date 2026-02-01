import { ref, h, inject, reactive, PropType, computed } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { getConfig, createEvent, useSize } from '../../ui'
import XEUtils from 'xe-utils'
import { toCssUnit } from '../../ui/src/dom'
import { openPreviewImage } from './util'

import type { VxeImagePropTypes, ImageReactData, VxeImageEmits, ImagePrivateRef, VxeImagePrivateComputed, VxeImageConstructor, VxeImagePrivateMethods, ImageMethods, ImagePrivateMethods, VxeImageGroupConstructor, VxeImageGroupPrivateMethods } from '../../../types'

export default defineVxeComponent({
  name: 'VxeImage',
  props: {
    src: [String, Array] as PropType<VxeImagePropTypes.Src>,
    alt: [String, Number] as PropType<VxeImagePropTypes.Alt>,
    loading: String as PropType<VxeImagePropTypes.Loading>,
    title: [String, Number] as PropType<VxeImagePropTypes.Title>,
    width: [String, Number] as PropType<VxeImagePropTypes.Width>,
    height: [String, Number] as PropType<VxeImagePropTypes.Height>,
    circle: Boolean as PropType<VxeImagePropTypes.Circle>,
    zIndex: Number as PropType<VxeImagePropTypes.ZIndex>,
    maskClosable: {
      type: Boolean as PropType<VxeImagePropTypes.MaskClosable>,
      default: () => getConfig().image.maskClosable
    },
    toolbarConfig: Object as PropType<VxeImagePropTypes.ToolbarConfig>,
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
    size: {
      type: String as PropType<VxeImagePropTypes.Size>,
      default: () => getConfig().image.size || getConfig().size
    },
    getThumbnailUrlMethod: Function as PropType<VxeImagePropTypes.GetThumbnailUrlMethod>
  },
  emits: [
    'click',
    'change',
    'rotate'
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

    const computeWrapperStyle = computed(() => {
      const { width, height, circle } = props
      const stys: Record<string, string> = {}
      if (width) {
        stys.width = toCssUnit(width)
      } else {
        if (circle) {
          if (height) {
            stys.width = toCssUnit(height)
          }
        }
      }
      if (height) {
        stys.height = toCssUnit(height)
      } else {
        if (circle) {
          if (width) {
            stys.height = toCssUnit(width)
          }
        }
      }
      return stys
    })

    const computeImgStyle = computed(() => {
      const { width, height } = props
      const stys: Record<string, string> = {}
      if (width && height) {
        stys.maxWidth = toCssUnit(width)
        stys.maxHeight = toCssUnit(height)
      } else {
        if (width) {
          stys.width = toCssUnit(width)
        }
        if (height) {
          stys.height = toCssUnit(height)
        }
      }
      return stys
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

    const computeImgThumbnailUrl = computed(() => {
      const getThumbnailUrlFn = props.getThumbnailUrlMethod || getConfig().image.getThumbnailUrlMethod
      const imgUrl = computeImgUrl.value
      return getThumbnailUrlFn ? getThumbnailUrlFn({ url: imgUrl, $image: $xeImage }) : ''
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
      const { showPreview, toolbarConfig, showPrintButton, showDownloadButton, maskClosable, zIndex } = props
      const imgList = computeImgList.value
      const imgUrl = computeImgUrl.value
      if ($xeImageGroup) {
        $xeImageGroup.handleClickImgEvent(evnt, { url: imgUrl })
      } else {
        if (showPreview && imgUrl) {
          openPreviewImage({
            urlList: imgList,
            toolbarConfig,
            showPrintButton,
            showDownloadButton,
            maskClosable,
            zIndex,
            events: {
              change (eventParams) {
                $xeImage.dispatchEvent('change', eventParams, eventParams.$event)
              },
              rotate (eventParams) {
                $xeImage.dispatchEvent('rotate', eventParams, eventParams.$event)
              }
            }
          })
        }
        $xeImage.dispatchEvent('click', { url: imgUrl }, evnt)
      }
    }

    const imagePrivateMethods: ImagePrivateMethods = {
    }

    Object.assign($xeImage, imageMethods, imagePrivateMethods)

    const renderVN = () => {
      const { alt, loading, circle } = props
      const wrapperStyle = computeWrapperStyle.value
      const imgStyle = computeImgStyle.value
      const imgUrl = computeImgUrl.value
      const imgThumbnailUrl = computeImgThumbnailUrl.value
      const vSize = computeSize.value
      return h('div', {
        class: ['vxe-image', {
          [`size--${vSize}`]: vSize,
          'is--circle': circle
        }],
        style: wrapperStyle
      }, [
        h('img', {
          ref: refElem,
          class: 'vxe-image-img',
          src: imgThumbnailUrl || imgUrl,
          alt,
          loading,
          style: imgStyle,
          onClick: clickEvent
        })
      ])
    }

    $xeImage.renderVN = renderVN

    return $xeImage
  },
  render () {
    return this.renderVN()
  }
})
