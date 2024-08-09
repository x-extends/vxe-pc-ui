import { defineComponent, h, onUnmounted, provide, inject, ref, Ref, onMounted, PropType } from 'vue'
import { XEOptionProvide, createOption, watchOption, destroyOption, assembleOption } from './util'

import type { VxeSelectConstructor, VxeOptionPropTypes } from '../../../types'

export default defineComponent({
  name: 'VxeOptgroup',
  props: {
    label: { type: [String, Number, Boolean] as PropType<VxeOptionPropTypes.Label>, default: '' },
    visible: { type: Boolean as PropType<VxeOptionPropTypes.Visible>, default: null },
    className: [String, Function] as PropType<VxeOptionPropTypes.ClassName>,
    disabled: Boolean as PropType<VxeOptionPropTypes.Disabled>
  },
  setup (props, { slots }) {
    const elem = ref() as Ref<HTMLDivElement>
    const $xeSelect = inject('$xeSelect', {} as VxeSelectConstructor)
    const option = createOption($xeSelect, props)
    const xeOption: XEOptionProvide = { option }
    option.options = []

    provide('xeoptgroup', xeOption)

    watchOption(props, option)

    onMounted(() => {
      assembleOption($xeSelect, elem.value, option)
    })

    onUnmounted(() => {
      destroyOption($xeSelect, option)
    })

    return () => {
      return h('div', {
        ref: elem
      }, slots.default ? slots.default() : [])
    }
  }
})
