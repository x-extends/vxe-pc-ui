import { defineComponent, ref, h, reactive } from 'vue'
import XEUtils from 'xe-utils'

import { ListViewReactData, ListViewPrivateRef, VxeListViewEmits, VxeListViewPrivateComputed, VxeListViewConstructor, VxeListViewPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeListView',
  props: {
  },
  emits: [

  ] as VxeListViewEmits,
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<ListViewReactData>({
    })

    const refMaps: ListViewPrivateRef = {
      refElem
    }

    const computeMaps: VxeListViewPrivateComputed = {
    }

    const $xeListView = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeListViewConstructor & VxeListViewPrivateMethods

    const renderVN = () => {
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: ['vxe-list-view']
      }, defaultSlot ? defaultSlot({}) : [])
    }

    $xeListView.renderVN = renderVN

    return $xeListView
  },
  render () {
    return this.renderVN()
  }
})
