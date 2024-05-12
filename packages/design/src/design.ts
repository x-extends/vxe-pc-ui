import { defineComponent, ref, h, PropType, reactive } from 'vue'
import VxeUI from '../../core'
import XEUtils from 'xe-utils'

import { VxeDesignPropTypes, DesignReactData, DesignPrivateRef, VxeDesignPrivateComputed, VxeDesignConstructor, VxeDesignPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeDesign',
  props: {
    size: {
      type: String as PropType<VxeDesignPropTypes.Size>,
      default: () => VxeUI.getConfig('design.size')
    }
  },
  emits: [],
  setup (props, context) {
    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<DesignReactData>({
    })

    const refMaps: DesignPrivateRef = {
      refElem
    }

    const computeMaps: VxeDesignPrivateComputed = {
    }

    const $xedesign = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeDesignConstructor & VxeDesignPrivateMethods

    const renderVN = () => {
      return h('div', {
        ref: refElem,
        class: 'vxe-design'
      })
    }

    $xedesign.renderVN = renderVN

    return $xedesign
  },
  render () {
    return this.renderVN()
  }
})
