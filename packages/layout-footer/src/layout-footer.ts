import { defineComponent, ref, h, reactive, PropType } from 'vue'
import XEUtils from 'xe-utils'

import { VxeLayoutFooterPropTypes, LayoutFooterReactData, LayoutFooterPrivateRef, VxeLayoutFooterPrivateComputed, VxeLayoutFooterConstructor, VxeLayoutFooterPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeLayoutFooter',
  props: {
    fixed: Boolean as PropType<VxeLayoutFooterPropTypes.Fixed>,
    align: String as PropType<VxeLayoutFooterPropTypes.Align>
  },
  emits: [],
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<LayoutFooterReactData>({
    })

    const refMaps: LayoutFooterPrivateRef = {
      refElem
    }

    const computeMaps: VxeLayoutFooterPrivateComputed = {
    }

    const $xeLayoutFooter = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeLayoutFooterConstructor & VxeLayoutFooterPrivateMethods

    const renderVN = () => {
      const { fixed, align } = props
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: ['vxe-layout-footer', align ? `align--${align}` : '', {
          'is--fixed': fixed
        }]
      }, defaultSlot ? defaultSlot({}) : [])
    }

    $xeLayoutFooter.renderVN = renderVN

    return $xeLayoutFooter
  },
  render () {
    return this.renderVN()
  }
})
