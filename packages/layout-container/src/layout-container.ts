import { defineComponent, ref, h, reactive } from 'vue'
import XEUtils from 'xe-utils'

import { LayoutContainerReactData, LayoutContainerPrivateRef, VxeLayoutContainerPrivateComputed, VxeLayoutContainerConstructor, VxeLayoutContainerPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeLayoutContainer',
  props: {
    vertical: Boolean
  },
  emits: [],
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<LayoutContainerReactData>({
    })

    const refMaps: LayoutContainerPrivateRef = {
      refElem
    }

    const computeMaps: VxeLayoutContainerPrivateComputed = {
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
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: ['vxe-layout-container', {
          'is--vertical': props.vertical
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
