import { defineComponent, ref, h, reactive } from 'vue'
import XEUtils from 'xe-utils'

import type { NumberInputReactData, VxeNumberInputEmits, NumberInputPrivateRef, VxeNumberInputPrivateComputed, VxeNumberInputConstructor, VxeNumberInputPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeNumberInput',
  props: {
  },
  emits: [
  ] as VxeNumberInputEmits,
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<NumberInputReactData>({
    })

    const refMaps: NumberInputPrivateRef = {
      refElem
    }

    const computeMaps: VxeNumberInputPrivateComputed = {
    }

    const $xeNumberInput = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeNumberInputConstructor & VxeNumberInputPrivateMethods

    const renderVN = () => {
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: ['vxe-number-input']
      }, defaultSlot ? defaultSlot({}) : [])
    }

    $xeNumberInput.renderVN = renderVN

    return $xeNumberInput
  },
  render () {
    return this.renderVN()
  }
})
