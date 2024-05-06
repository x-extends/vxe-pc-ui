import { defineComponent, h, PropType } from 'vue'
import VxeUI from '../../core'
import 'xe-utils'

import { VxeDesignPropTypes } from '../../../types'

export default defineComponent({
  name: 'VxeDesign',
  props: {
    size: {
      type: String as PropType<VxeDesignPropTypes.Size>,
      default: () => VxeUI.getConfig('design.size')
    }
  },
  emits: [],
  setup () {
    return h('div', {
      class: 'vxe-design'
    })
  }
})
