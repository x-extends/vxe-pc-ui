import { defineComponent, ref, h, reactive } from 'vue'
import XEUtils from 'xe-utils'

import type { PasswordInputReactData, VxePasswordInputEmits, PasswordInputPrivateRef, VxePasswordInputPrivateComputed, VxePasswordInputConstructor, VxePasswordInputPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxePasswordInput',
  props: {
  },
  emits: [
  ] as VxePasswordInputEmits,
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<PasswordInputReactData>({
    })

    const refMaps: PasswordInputPrivateRef = {
      refElem
    }

    const computeMaps: VxePasswordInputPrivateComputed = {
    }

    const $xePasswordInput = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxePasswordInputConstructor & VxePasswordInputPrivateMethods

    const renderVN = () => {
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: ['vxe-password-input']
      }, defaultSlot ? defaultSlot({}) : [])
    }

    $xePasswordInput.renderVN = renderVN

    return $xePasswordInput
  },
  render () {
    return this.renderVN()
  }
})
