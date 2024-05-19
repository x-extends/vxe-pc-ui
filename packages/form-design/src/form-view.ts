import { defineComponent, ref, h, reactive } from 'vue'
import XEUtils from 'xe-utils'

import { FormViewReactData, FormViewPrivateRef, VxeFormViewEmits, VxeFormViewPrivateComputed, VxeFormViewConstructor, VxeFormViewPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeFormView',
  props: {
  },
  emits: [
  ] as VxeFormViewEmits,
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<FormViewReactData>({
    })

    const refMaps: FormViewPrivateRef = {
      refElem
    }

    const computeMaps: VxeFormViewPrivateComputed = {
    }

    const $xeFormView = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeFormViewConstructor & VxeFormViewPrivateMethods

    const renderVN = () => {
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: ['vxe-form-view']
      }, defaultSlot ? defaultSlot({}) : [])
    }

    $xeFormView.renderVN = renderVN

    return $xeFormView
  },
  render () {
    return this.renderVN()
  }
})
