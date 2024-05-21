import { defineComponent, h, PropType } from 'vue'
import { createEvent } from '@vxe-ui/core'

import type { VxeIconPropTypes, VxeIconEmits } from '../../../types'

export default defineComponent({
  name: 'VxeIcon',
  props: {
    name: String as PropType<VxeIconPropTypes.Name>,
    roll: Boolean as PropType<VxeIconPropTypes.Roll>,
    status: String as PropType<VxeIconPropTypes.Status>
  },
  emits: [
    'click'
  ] as VxeIconEmits,
  setup (props, { emit }) {
    const clickEvent = (evnt: KeyboardEvent) => {
      emit('click', createEvent(evnt, { }))
    }

    return () => {
      const { name, roll, status } = props
      return h('i', {
        class: [`vxe-icon-${name}`, roll ? 'roll' : '', status ? [`theme--${status}`] : ''],
        onClick: clickEvent
      })
    }
  }
})
