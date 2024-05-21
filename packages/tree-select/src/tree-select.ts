import { defineComponent, ref, h, reactive } from 'vue'
import XEUtils from 'xe-utils'

import type { TreeSelectReactData, VxeTreeSelectEmits, TreeSelectPrivateRef, VxeTreeSelectPrivateComputed, VxeTreeSelectConstructor, VxeTreeSelectPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeTreeSelect',
  props: {
  },
  emits: [
  ] as VxeTreeSelectEmits,
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<TreeSelectReactData>({
    })

    const refMaps: TreeSelectPrivateRef = {
      refElem
    }

    const computeMaps: VxeTreeSelectPrivateComputed = {
    }

    const $xeTreeSelect = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeTreeSelectConstructor & VxeTreeSelectPrivateMethods

    const renderVN = () => {
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: ['vxe-tree-select']
      }, defaultSlot ? defaultSlot({}) : [])
    }

    $xeTreeSelect.renderVN = renderVN

    return $xeTreeSelect
  },
  render () {
    return this.renderVN()
  }
})
