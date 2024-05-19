import { defineComponent, ref, h, reactive } from 'vue'
import XEUtils from 'xe-utils'

import { UploadReactData, VxeUploadEmits, UploadPrivateRef, VxeUploadPrivateComputed, VxeUploadConstructor, VxeUploadPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeUpload',
  props: {
  },
  emits: [
  ] as VxeUploadEmits,
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<UploadReactData>({
    })

    const refMaps: UploadPrivateRef = {
      refElem
    }

    const computeMaps: VxeUploadPrivateComputed = {
    }

    const $xeUpload = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeUploadConstructor & VxeUploadPrivateMethods

    const renderVN = () => {
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: ['vxe-upload']
      }, defaultSlot ? defaultSlot({}) : [])
    }

    $xeUpload.renderVN = renderVN

    return $xeUpload
  },
  render () {
    return this.renderVN()
  }
})
