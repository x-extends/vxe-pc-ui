import { defineComponent, ref, h, reactive } from 'vue'
import { createEvent } from '@vxe-ui/core'
import XEUtils from 'xe-utils'

import type { TreeSelectReactData, VxeTreeSelectEmits, TreeSelectPrivateRef, TreeSelectPrivateMethods, TreeSelectMethods, VxeTreeSelectPrivateComputed, VxeTreeSelectConstructor, VxeTreeSelectPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeTreeSelect',
  props: {
  },
  emits: [
  ] as VxeTreeSelectEmits,
  setup (props, context) {
    const { emit, slots } = context

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

    const treeSelectMethods: TreeSelectMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, createEvent(evnt, { $treeSelect: $xeTreeSelect }, params))
      }
    }

    const treeSelectPrivateMethods: TreeSelectPrivateMethods = {
    }

    Object.assign($xeTreeSelect, treeSelectMethods, treeSelectPrivateMethods)

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
