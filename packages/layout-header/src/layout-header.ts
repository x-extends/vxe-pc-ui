import { defineComponent, ref, h, reactive } from 'vue'
import XEUtils from 'xe-utils'

import { LayoutHeaderReactData, LayoutHeaderPrivateRef, VxeLayoutHeaderPrivateComputed, VxeLayoutHeaderConstructor, VxeLayoutHeaderPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeLayoutHeader',
  props: {
    fixed: Boolean
  },
  emits: [],
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<LayoutHeaderReactData>({
    })

    const refMaps: LayoutHeaderPrivateRef = {
      refElem
    }

    const computeMaps: VxeLayoutHeaderPrivateComputed = {
    }

    const $xeLayoutHeader = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeLayoutHeaderConstructor & VxeLayoutHeaderPrivateMethods

    const renderVN = () => {
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: ['vxe-layout-header', {
          'is--fixed': props.fixed
        }]
      }, defaultSlot ? defaultSlot({}) : [])
    }

    $xeLayoutHeader.renderVN = renderVN

    return $xeLayoutHeader
  },
  render () {
    return this.renderVN()
  }
})
