import { defineComponent, ref, h, reactive } from 'vue'
import XEUtils from 'xe-utils'

import type { CollapsePaneReactData, VxeCollapsePaneEmits, CollapsePanePrivateRef, VxeCollapsePanePrivateComputed, VxeCollapsePaneConstructor, VxeCollapsePanePrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeCollapsePane',
  props: {
  },
  emits: [
  ] as VxeCollapsePaneEmits,
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<CollapsePaneReactData>({
    })

    const refMaps: CollapsePanePrivateRef = {
      refElem
    }

    const computeMaps: VxeCollapsePanePrivateComputed = {
    }

    const $xeCollapsePane = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeCollapsePaneConstructor & VxeCollapsePanePrivateMethods

    const renderVN = () => {
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: ['vxe-collapse-pane']
      }, defaultSlot ? defaultSlot({}) : [])
    }

    $xeCollapsePane.renderVN = renderVN

    return $xeCollapsePane
  },
  render () {
    return this.renderVN()
  }
})
