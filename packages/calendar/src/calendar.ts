import { defineComponent, ref, h, reactive } from 'vue'
import XEUtils from 'xe-utils'

import { CalendarReactData, VxeCalendarEmits, CalendarPrivateRef, VxeCalendarPrivateComputed, VxeCalendarConstructor, VxeCalendarPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeCalendar',
  props: {
  },
  emits: [
  ] as VxeCalendarEmits,
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<CalendarReactData>({
    })

    const refMaps: CalendarPrivateRef = {
      refElem
    }

    const computeMaps: VxeCalendarPrivateComputed = {
    }

    const $xeCalendar = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeCalendarConstructor & VxeCalendarPrivateMethods

    const renderVN = () => {
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: ['vxe-calendar']
      }, defaultSlot ? defaultSlot({}) : [])
    }

    $xeCalendar.renderVN = renderVN

    return $xeCalendar
  },
  render () {
    return this.renderVN()
  }
})
