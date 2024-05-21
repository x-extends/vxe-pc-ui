import { defineComponent, ref, h, PropType, reactive } from 'vue'
import XEUtils from 'xe-utils'
import { getConfig } from '@vxe-ui/core'

import { VxeListDesignPropTypes, ListDesignReactData, ListDesignPrivateRef, VxeListDesignPrivateComputed, VxeListDesignConstructor, VxeListDesignPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeListDesign',
  props: {
    size: {
      type: String as PropType<VxeListDesignPropTypes.Size>,
      default: () => getConfig().formDesign.size
    }
  },
  emits: [],
  setup (props, context) {
    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<ListDesignReactData>({
    })

    const refMaps: ListDesignPrivateRef = {
      refElem
    }

    const computeMaps: VxeListDesignPrivateComputed = {
    }

    const $xeListDesign = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeListDesignConstructor & VxeListDesignPrivateMethods

    const renderVN = () => {
      return h('div', {
        ref: refElem,
        class: 'vxe-list-design'
      })
    }

    $xeListDesign.renderVN = renderVN

    return $xeListDesign
  },
  render () {
    return this.renderVN()
  }
})
