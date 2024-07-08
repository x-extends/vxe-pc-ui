import { defineComponent, h, PropType } from 'vue'
import { createEvent } from '../../ui'

import type { VxeIconPropTypes, VxeIconEmits } from '../../../types'

export default defineComponent({
  name: 'VxeIcon',
  props: {
    name: String as PropType<VxeIconPropTypes.Name>,
    className: String as PropType<VxeIconPropTypes.ClassName>,
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
      const { name, roll, status, className } = props
      return h('i', {
        class: [`vxe-icon-${name}`, roll ? 'roll' : '', status ? [`theme--${status}`] : '', `${className || ''}`],
        onClick: clickEvent
      })
    }
  }
})
