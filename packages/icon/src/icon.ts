import { defineComponent, h, PropType } from 'vue'
import { getConfig, createEvent, useSize } from '../../ui'

import type { VxeIconPropTypes, VxeIconEmits } from '../../../types'

export default defineComponent({
  name: 'VxeIcon',
  props: {
    name: String as PropType<VxeIconPropTypes.Name>,
    className: String as PropType<VxeIconPropTypes.ClassName>,
    roll: Boolean as PropType<VxeIconPropTypes.Roll>,
    status: String as PropType<VxeIconPropTypes.Status>,
    size: { type: String as PropType<VxeIconPropTypes.Size>, default: () => getConfig().icon.size || getConfig().size }
  },
  emits: [
    'click'
  ] as VxeIconEmits,
  setup (props, { emit }) {
    const { computeSize } = useSize(props)

    const clickEvent = (evnt: KeyboardEvent) => {
      emit('click', createEvent(evnt, { }))
    }

    return () => {
      const { name, roll, status, className } = props
      const vSize = computeSize.value
      return h('i', {
        class: ['vxe-icon', `vxe-icon-${name}`, `${className || ''}`, {
          [`size--${vSize}`]: vSize,
          [`theme--${status}`]: status,
          roll: roll
        }],
        onClick: clickEvent
      })
    }
  }
})
