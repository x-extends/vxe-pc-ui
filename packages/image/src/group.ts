import { CreateElement, PropType, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, globalMixins } from '@vxe-ui/core'
import { openPreviewImage } from './util'
import VxeImageComponent from './image'

import type { VxeImageGroupPropTypes, VxeImageGroupEmits, ImageGroupReactData, ValueOf, VxeComponentSizeType } from '../../../types'

export default defineVxeComponent({
  name: 'VxeImageGroup',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    urlList: [Array, String] as PropType<VxeImageGroupPropTypes.UrlList>,
    showPreview: {
      type: Boolean as PropType<VxeImageGroupPropTypes.ShowPreview>,
      default: () => getConfig().imageGroup.showPreview
    },
    imageStyle: Object as PropType<VxeImageGroupPropTypes.ImageStyle>,
    size: { type: String as PropType<VxeImageGroupPropTypes.Size>, default: () => getConfig().imageGroup.size || getConfig().size },
    showPrintButton: {
      type: Boolean as PropType<VxeImageGroupPropTypes.ShowPrintButton>,
      default: () => getConfig().imageGroup.showPrintButton
    },
    showDownloadButton: {
      type: Boolean as PropType<VxeImageGroupPropTypes.ShowDownloadButton>,
      default: () => getConfig().imageGroup.showDownloadButton
    }
  },
  provide () {
    const $xeImageGroup = this
    return {
      $xeImageGroup
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: ImageGroupReactData = {
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
    computeImgList  () {
      const $xeImageGroup = this
      const props = $xeImageGroup

      const { urlList } = props
      if (urlList) {
        return (XEUtils.isArray(urlList) ? urlList : [urlList]).map(item => {
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
    computeImgStyleOpts () {
      const $xeImageGroup = this
      const props = $xeImageGroup

      return Object.assign({}, getConfig().imageGroup.imageStyle, props.imageStyle)
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeImageGroupEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeImageGroup = this
      $xeImageGroup.$emit(type, createEvent(evnt, { $imageGroup: $xeImageGroup }, params))
    },
    handleClickImgEvent (evnt: Event, params: {
      url: string;
    }) {
      const $xeImageGroup = this
      const props = $xeImageGroup

      const { showPreview, showPrintButton, showDownloadButton } = props
      const { url } = params
      const imgList = $xeImageGroup.computeImgList
      if (showPreview && url) {
        openPreviewImage({
          activeIndex: Math.max(0, XEUtils.findIndexOf(imgList, item => item.url === url)),
          urlList: imgList,
          showPrintButton,
          showDownloadButton
        })
      }
      $xeImageGroup.dispatchEvent('click', { url, urlList: imgList }, evnt)
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeImageGroup = this

      const imgList = $xeImageGroup.computeImgList
      const vSize = $xeImageGroup.computeSize
      const imgStyleOpts = $xeImageGroup.computeImgStyleOpts
      return h('div', {
        class: ['vxe-image-group', {
          [`size--${vSize}`]: vSize
        }]
      }, imgList
        ? imgList.map((item, index) => {
          return h(VxeImageComponent, {
            key: index,
            props: {
              src: item.url,
              alt: item.alt,
              width: imgStyleOpts.width,
              height: imgStyleOpts.height
            }
          })
        })
        : [])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
