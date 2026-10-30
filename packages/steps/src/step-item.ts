import { ref, h, inject, PropType, onMounted, onUnmounted } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { createStepItem, watchStepItem, assembleStepItem, destroyStepItem } from './util'

import type { VxeStepsConstructor, VxeStepItemPropTypes } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeStepItem',
  props: {
    title: [String, Number] as PropType<VxeStepItemPropTypes.Title>,
    content: [String, Number] as PropType<VxeStepItemPropTypes.Content>,
    status: String as PropType<VxeStepItemPropTypes.Status>
  },
  setup(props, context) {
    const { slots } = context

    const refElem = ref<HTMLDivElement>()
    const $xeSteps = inject('$xeSteps', {} as VxeStepsConstructor)
    const itemConfig = createStepItem($xeSteps, props)
    itemConfig.slots = slots

    watchStepItem(props, itemConfig)

    onMounted(() => {
      const el = refElem.value
      if (el) {
        assembleStepItem($xeSteps, el, itemConfig)
      }
    })

    onUnmounted(() => {
      destroyStepItem($xeSteps, itemConfig)
    })

    return () => {
      return h('div', {
        ref: refElem
      })
    }
  }
}) /* define-vxe-component end */
