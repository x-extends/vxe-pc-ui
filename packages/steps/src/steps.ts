import { defineComponent, ref, h, reactive } from 'vue'
import XEUtils from 'xe-utils'
import { createEvent } from '../../ui'

import type { StepsReactData, VxeStepsEmits, StepsMethods, StepsPrivateMethods, ValueOf, StepsPrivateRef, VxeStepsPrivateComputed, VxeStepsConstructor, VxeStepsPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeSteps',
  props: {
  },
  emits: [
  ] as VxeStepsEmits,
  setup (props, context) {
    const { emit } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<StepsReactData>({
    })

    const refMaps: StepsPrivateRef = {
      refElem
    }

    const computeMaps: VxeStepsPrivateComputed = {
    }

    const $xeSteps = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeStepsConstructor & VxeStepsPrivateMethods

    const dispatchEvent = (type: ValueOf<VxeStepsEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $steps: $xeSteps }, params))
    }

    const collapsePaneMethods: StepsMethods = {
      dispatchEvent
    }

    const collapsePanePrivateMethods: StepsPrivateMethods = {
    }

    Object.assign($xeSteps, collapsePaneMethods, collapsePanePrivateMethods)

    const renderVN = () => {
      return h('div', {
        ref: refElem,
        class: 'vxe-steps'
      }, [])
    }

    $xeSteps.renderVN = renderVN

    return $xeSteps
  },
  render () {
    return this.renderVN()
  }
})
