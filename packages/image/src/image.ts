import { defineComponent, ref, h, reactive } from 'vue'
import XEUtils from 'xe-utils'

import type { ImageReactData, VxeImageEmits, ImagePrivateRef, VxeImagePrivateComputed, VxeImageConstructor, VxeImagePrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeImage',
  props: {
  },
  emits: [
  ] as VxeImageEmits,
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<ImageReactData>({
    })

    const refMaps: ImagePrivateRef = {
      refElem
    }

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

    const renderVN = () => {
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: 'vxe-image'
      }, defaultSlot ? defaultSlot({}) : [])
    }

    $xeImage.renderVN = renderVN

    return $xeImage
  },
  render () {
    return this.renderVN()
  }
})
