import { defineComponent, ref, h, reactive, PropType } from 'vue'
import { getConfig, useSize } from '../../ui'
import XEUtils from 'xe-utils'

import type { VxeLayoutContainerPropTypes, LayoutContainerReactData, LayoutContainerPrivateRef, VxeLayoutContainerPrivateComputed, VxeLayoutContainerConstructor, VxeLayoutContainerPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeLayoutContainer',
  props: {
    vertical: Boolean as PropType<VxeLayoutContainerPropTypes.Vertical>,
    size: { type: String as PropType<VxeLayoutContainerPropTypes.Size>, default: () => getConfig().layoutContainer.size || getConfig().size }
  },
  emits: [],
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const { computeSize } = useSize(props)

    const reactData = reactive<LayoutContainerReactData>({
    })

    const refMaps: LayoutContainerPrivateRef = {
      refElem
    }

    const computeMaps: VxeLayoutContainerPrivateComputed = {
      computeSize
    }

    const $xeLayoutContainer = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeLayoutContainerConstructor & VxeLayoutContainerPrivateMethods

    const renderVN = () => {
      const { vertical } = props
      const vSize = computeSize.value
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: ['vxe-layout-container', {
          [`size--${vSize}`]: vSize,
          'is--vertical': vertical
        }]
      }, defaultSlot ? defaultSlot({}) : [])
    }

    $xeLayoutContainer.renderVN = renderVN

    return $xeLayoutContainer
  },
  render () {
    return this.renderVN()
  }
})
