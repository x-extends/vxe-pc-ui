import { defineComponent, ref, h, reactive } from 'vue'
import XEUtils from 'xe-utils'

import type { DateInputReactData, VxeDateInputEmits, DateInputPrivateRef, VxeDateInputPrivateComputed, VxeDateInputConstructor, VxeDateInputPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeDateInput',
  props: {
  },
  emits: [
  ] as VxeDateInputEmits,
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<DateInputReactData>({
    })

    const refMaps: DateInputPrivateRef = {
      refElem
    }

    const computeMaps: VxeDateInputPrivateComputed = {
    }

    const $xeDateInput = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeDateInputConstructor & VxeDateInputPrivateMethods

    const renderVN = () => {
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: ['vxe-date-input']
      }, defaultSlot ? defaultSlot({}) : [])
    }

    $xeDateInput.renderVN = renderVN

    return $xeDateInput
  },
  render () {
    return this.renderVN()
  }
})
