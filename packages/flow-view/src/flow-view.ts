import { ref, h, reactive } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'

import type { FlowViewReactData, VxeFlowViewEmits, FlowViewPrivateRef, VxeFlowViewPrivateComputed, VxeFlowViewConstructor, VxeFlowViewPrivateMethods } from '../../../types'

export default defineVxeComponent({
  name: 'VxeFlowView',
  props: {
  },
  emits: [
  ] as VxeFlowViewEmits,
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<FlowViewReactData>({
    })

    const refMaps: FlowViewPrivateRef = {
      refElem
    }

    const computeMaps: VxeFlowViewPrivateComputed = {
    }

    const $xeFlowView = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeFlowViewConstructor & VxeFlowViewPrivateMethods

    const renderVN = () => {
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: ['vxe-upload']
      }, defaultSlot ? defaultSlot({}) : [])
    }

    $xeFlowView.renderVN = renderVN

    return $xeFlowView
  },
  render () {
    return this.renderVN()
  }
})
