import { defineComponent, ref, h, reactive } from 'vue'
import XEUtils from 'xe-utils'

import { CollapseReactData, VxeCollapseEmits, CollapsePrivateRef, VxeCollapsePrivateComputed, VxeCollapseConstructor, VxeCollapsePrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeCollapse',
  props: {
  },
  emits: [
  ] as VxeCollapseEmits,
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<CollapseReactData>({
    })

    const refMaps: CollapsePrivateRef = {
      refElem
    }

    const computeMaps: VxeCollapsePrivateComputed = {
    }

    const $xeCollapse = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeCollapseConstructor & VxeCollapsePrivateMethods

    const renderVN = () => {
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: ['vxe-collapse']
      }, defaultSlot ? defaultSlot({}) : [])
    }

    $xeCollapse.renderVN = renderVN

    return $xeCollapse
  },
  render () {
    return this.renderVN()
  }
})
