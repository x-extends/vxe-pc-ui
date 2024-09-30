import { defineComponent, ref, h, reactive } from 'vue'
import XEUtils from 'xe-utils'
import { createEvent } from '../../ui'

import type { WatermarkReactData, VxeWatermarkEmits, WatermarkMethods, WatermarkPrivateMethods, ValueOf, WatermarkPrivateRef, VxeWatermarkPrivateComputed, VxeWatermarkConstructor, VxeWatermarkPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeWatermark',
  props: {
  },
  emits: [
  ] as VxeWatermarkEmits,
  setup (props, context) {
    const { emit } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<WatermarkReactData>({
    })

    const refMaps: WatermarkPrivateRef = {
      refElem
    }

    const computeMaps: VxeWatermarkPrivateComputed = {
    }

    const $xeWatermark = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeWatermarkConstructor & VxeWatermarkPrivateMethods

    const dispatchEvent = (type: ValueOf<VxeWatermarkEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $watermark: $xeWatermark }, params))
    }

    const collapsePaneMethods: WatermarkMethods = {
      dispatchEvent
    }

    const collapsePanePrivateMethods: WatermarkPrivateMethods = {
    }

    Object.assign($xeWatermark, collapsePaneMethods, collapsePanePrivateMethods)

    const renderVN = () => {
      return h('div', {
        ref: refElem,
        class: 'vxe-watermark'
      }, [])
    }

    $xeWatermark.renderVN = renderVN

    return $xeWatermark
  },
  render () {
    return this.renderVN()
  }
})
