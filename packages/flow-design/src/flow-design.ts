import { ref, h, reactive } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'

import type { FlowDesignReactData, VxeFlowDesignEmits, FlowDesignPrivateRef, VxeFlowDesignPrivateComputed, VxeFlowDesignConstructor, VxeFlowDesignPrivateMethods } from '../../../types'

export default defineVxeComponent({
  name: 'VxeFlowDesign',
  props: {
  },
  emits: [
  ] as VxeFlowDesignEmits,
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<FlowDesignReactData>({
    })

    const refMaps: FlowDesignPrivateRef = {
      refElem
    }

    const computeMaps: VxeFlowDesignPrivateComputed = {
    }

    const $xeFlowDesign = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeFlowDesignConstructor & VxeFlowDesignPrivateMethods

    const renderVN = () => {
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: ['vxe-upload']
      }, defaultSlot ? defaultSlot({}) : [])
    }

    $xeFlowDesign.renderVN = renderVN

    return $xeFlowDesign
  },
  render () {
    return this.renderVN()
  }
})
