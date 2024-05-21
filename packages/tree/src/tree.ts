import { defineComponent, ref, h, reactive } from 'vue'
import XEUtils from 'xe-utils'

import type { TreeReactData, VxeTreeEmits, TreePrivateRef, VxeTreePrivateComputed, VxeTreeConstructor, VxeTreePrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeTree',
  props: {
  },
  emits: [
  ] as VxeTreeEmits,
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<TreeReactData>({
    })

    const refMaps: TreePrivateRef = {
      refElem
    }

    const computeMaps: VxeTreePrivateComputed = {
    }

    const $xeTree = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeTreeConstructor & VxeTreePrivateMethods

    const renderVN = () => {
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: ['vxe-tree']
      }, defaultSlot ? defaultSlot({}) : [])
    }

    $xeTree.renderVN = renderVN

    return $xeTree
  },
  render () {
    return this.renderVN()
  }
})
