import { defineComponent, computed, h, provide, PropType } from 'vue'
import { getConfig, createEvent, useSize } from '@vxe-ui/core'
import { openPreviewImage } from './util'
import XEUtils from 'xe-utils'
import VxeImageComponent from './image'

import type { VxeImageGroupPropTypes, VxeImageGroupEmits, VxeImageGroupConstructor, VxeImageGroupPrivateMethods, ImageGroupMethods, ButtonPrivateComputed, ImageGroupPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeImageGroup',
  props: {
    urlList: [Array, String] as PropType<VxeImageGroupPropTypes.UrlList>,
    showPreview: {
      type: Boolean as PropType<VxeImageGroupPropTypes.ShowPreview>,
      default: () => getConfig().imageGroup.showPreview
    },
    imageStyle: Object as PropType<VxeImageGroupPropTypes.ImageStyle>,
    size: { type: String as PropType<VxeImageGroupPropTypes.Size>, default: () => getConfig().imageGroup.size || getConfig().size }
  },
  emits: [
    'click'
  ] as VxeImageGroupEmits,
  setup (props, context) {
    const { emit } = context

    const xID = XEUtils.uniqueId()

    const computeImgList = computed(() => {
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
    })

    const computeImgStyleOpts = computed(() => {
      return Object.assign({}, getConfig().imageGroup.imageStyle, props.imageStyle)
    })

    const computeMaps: ButtonPrivateComputed = {}

    const $xeImageGroup = {
      xID,
      props,
      context,

      getComputeMaps: () => computeMaps
    } as unknown as VxeImageGroupConstructor & VxeImageGroupPrivateMethods

    useSize(props)

    const imageGroupMethods: ImageGroupMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, createEvent(evnt, { $imageGroup: $xeImageGroup }, params))
      }
    }

    const imageGroupPrivateMethods: ImageGroupPrivateMethods = {
      handleClickImgEvent (evnt, params) {
        const { showPreview } = props
        const { url } = params
        const imgList = computeImgList.value
        if (showPreview && url) {
          openPreviewImage({
            activeIndex: Math.max(0, XEUtils.findIndexOf(imgList, item => item.url === url)),
            urlList: imgList
          })
        }
        imageGroupMethods.dispatchEvent('click', { url, urlList: imgList }, evnt)
      }
    }

    Object.assign($xeImageGroup, imageGroupMethods, imageGroupPrivateMethods)

    const renderVN = () => {
      const imgList = computeImgList.value
      const imgStyleOpts = computeImgStyleOpts.value
      return h('div', {
        class: 'vxe-image-group'
      }, imgList
        ? imgList.map((item, index) => {
          return h(VxeImageComponent, {
            key: index,
            src: item.url,
            alt: item.alt,
            width: imgStyleOpts.width,
            height: imgStyleOpts.height
          })
        })
        : [])
    }

    $xeImageGroup.renderVN = renderVN

    provide('$xeImageGroup', $xeImageGroup)

    return renderVN
  }
})
