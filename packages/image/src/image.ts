import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, globalMixins } from '../../ui'
import { toCssUnit } from '../../ui/src/dom'
import { openPreviewImage } from './util'

import type { VxeImagePropTypes, ImageReactData, VxeImageEmits, VxeImageGroupConstructor, VxeImageConstructor, VxeImageGroupPrivateMethods, ValueOf, VxeComponentSizeType } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeImage',
  mixins: [
    globalMixins.sizeMixin
  ],
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
  data () {
    const reactData: ImageReactData = {
    }
    return {
      xID: XEUtils.uniqueId(),
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
      $xeImageGroup(): (VxeImageGroupConstructor & VxeImageGroupPrivateMethods) | null
    }),
    computeWrapperStyle () {
      const $xeImage = this
      const props = $xeImage

      const { width, height, circle } = props
      const stys: Record<string, string> = {}
      if (width) {
        stys.width = toCssUnit(width)
      } else if (circle) {
        if (height) {
          stys.width = toCssUnit(height)
        }
      }
      if (height) {
        stys.height = toCssUnit(height)
      } else if (circle) {
        if (width) {
          stys.height = toCssUnit(width)
        }
      }
      return stys
    },
    computeImgStyle () {
      const $xeImage = this
      const props = $xeImage

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
    },
    computeImgList  () {
      const $xeImage = this
      const props = $xeImage

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
    },
    computeImgItem  () {
      const $xeImage = this

      const imgList: {
        url: string | undefined;
        alt: string | number | undefined;
      }[] = $xeImage.computeImgList
      return imgList[0]
    },
    computeImgUrl  () {
      const $xeImage = this

      const imgItem: {
        url: string | undefined;
        alt: string | number | undefined;
      } = $xeImage.computeImgItem
      return imgItem ? `${imgItem.url || ''}` : ''
    },
    computeImgThumbnailUrl () {
      const $xeImage = this
      const props = $xeImage

      const getThumbnailUrlFn = props.getThumbnailUrlMethod || getConfig().image.getThumbnailUrlMethod
      const imgUrl = $xeImage.computeImgUrl as string
      return getThumbnailUrlFn ? getThumbnailUrlFn({ url: imgUrl, $image: $xeImage as unknown as VxeImageConstructor }) : ''
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeImageEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeImage = this
      $xeImage.$emit(type, createEvent(evnt, { $image: $xeImage }, params))
    },
    clickEvent  (evnt: MouseEvent) {
      const $xeImage = this
      const props = $xeImage
      const $xeImageGroup = $xeImage.$xeImageGroup

      const { showPreview, toolbarConfig, showPrintButton, showDownloadButton, maskClosable, zIndex } = props
      const imgList = $xeImage.computeImgList
      const imgUrl = $xeImage.computeImgUrl
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
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeImage = this
      const props = $xeImage

      const { alt, loading, circle } = props
      const wrapperStyle = $xeImage.computeWrapperStyle
      const imgStyle = $xeImage.computeImgStyle
      const imgUrl = $xeImage.computeImgUrl
      const imgThumbnailUrl = $xeImage.computeImgThumbnailUrl
      const vSize = $xeImage.computeSize
      return h('div', {
        class: ['vxe-image', {
          [`size--${vSize}`]: vSize,
          'is--circle': circle
        }],
        style: wrapperStyle
      }, [
        h('img', {
          ref: 'refElem',
          class: 'vxe-image-img',
          style: imgStyle,
          attrs: {
            src: imgThumbnailUrl || imgUrl,
            alt,
            loading
          },
          on: {
            click: $xeImage.clickEvent
          }
        })
      ])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
