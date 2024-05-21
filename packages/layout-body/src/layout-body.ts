import { defineComponent, ref, h, reactive, PropType } from 'vue'
import XEUtils from 'xe-utils'

import type { VxeLayoutBodyPropTypes, LayoutBodyReactData, LayoutBodyPrivateRef, VxeLayoutBodyPrivateComputed, VxeLayoutBodyConstructor, VxeLayoutBodyPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeLayoutBody',
  props: {
    padding: Boolean as PropType<VxeLayoutBodyPropTypes.Padding>
  },
  emits: [],
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<LayoutBodyReactData>({
    })

    const refMaps: LayoutBodyPrivateRef = {
      refElem
    }

    const computeMaps: VxeLayoutBodyPrivateComputed = {
    }

    const $xeLayoutBody = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeLayoutBodyConstructor & VxeLayoutBodyPrivateMethods

    const renderVN = () => {
      const { padding } = props
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: ['vxe-layout-body', {
          'is--padding': padding
        }]
      }, defaultSlot ? defaultSlot({}) : [])
    }

    $xeLayoutBody.renderVN = renderVN

    return $xeLayoutBody
  },
  render () {
    return this.renderVN()
  }
})
