import { defineComponent, ref, h, reactive, PropType } from 'vue'
import VxeLoadingComponent from '../../loading/src/loading'
import XEUtils from 'xe-utils'

import type { VxeLayoutBodyPropTypes, LayoutBodyReactData, LayoutBodyPrivateRef, VxeLayoutBodyPrivateComputed, VxeLayoutBodyConstructor, VxeLayoutBodyPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeLayoutBody',
  props: {
    loading: Boolean as PropType<VxeLayoutBodyPropTypes.Loading>,
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
      const { loading, padding } = props
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: ['vxe-layout-body', {
          'is--loading': loading,
          'is--padding': padding
        }]
      }, [
        h('div', {
          class: 'vxe-layout-body--inner'
        }, defaultSlot ? defaultSlot({}) : []),
        /**
         * 加载中
         */
        h(VxeLoadingComponent, {
          class: 'vxe-list-view--loading',
          modelValue: loading
        })
      ])
    }

    $xeLayoutBody.renderVN = renderVN

    return $xeLayoutBody
  },
  render () {
    return this.renderVN()
  }
})
