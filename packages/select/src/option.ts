import { defineComponent, h, onUnmounted, inject, ref, Ref, onMounted, PropType } from 'vue'
import { XEOptionProvide, createOption, watchOption, destroyOption, assembleOption } from './util'

import type { VxeSelectConstructor, VxeOptionPropTypes } from '../../../types'

export default defineComponent({
  name: 'VxeOption',
  props: {
    value: null,
    label: { type: [String, Number, Boolean] as PropType<VxeOptionPropTypes.Label>, default: '' },
    visible: { type: Boolean as PropType<VxeOptionPropTypes.Visible>, default: null },
    className: [String, Function] as PropType<VxeOptionPropTypes.ClassName>,
    disabled: Boolean as PropType<VxeOptionPropTypes.Disabled>
  },
  setup (props, { slots }) {
    const elem = ref() as Ref<HTMLDivElement>
    const $xeSelect = inject('$xeSelect', {} as VxeSelectConstructor)
    const optGroup = inject<XEOptionProvide | null>('xeoptgroup', null)
    const option = createOption($xeSelect, props)
    option.slots = slots

    watchOption(props, option)

    onMounted(() => {
      assembleOption($xeSelect, elem.value, option, optGroup)
    })

    onUnmounted(() => {
      destroyOption($xeSelect, option)
    })

    return () => {
      return h('div', {
        ref: elem
      })
    }
  }
})
