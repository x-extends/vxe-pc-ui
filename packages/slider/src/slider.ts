import { defineComponent, ref, h, reactive } from 'vue'
import XEUtils from 'xe-utils'
import { createEvent } from '../../ui'

import type { SliderReactData, VxeSliderEmits, SliderMethods, SliderPrivateMethods, ValueOf, SliderPrivateRef, VxeSliderPrivateComputed, VxeSliderConstructor, VxeSliderPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeSlider',
  props: {
  },
  emits: [
  ] as VxeSliderEmits,
  setup (props, context) {
    const { emit } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<SliderReactData>({
    })

    const refMaps: SliderPrivateRef = {
      refElem
    }

    const computeMaps: VxeSliderPrivateComputed = {
    }

    const $xeSlider = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeSliderConstructor & VxeSliderPrivateMethods

    const dispatchEvent = (type: ValueOf<VxeSliderEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $slider: $xeSlider }, params))
    }

    const collapsePaneMethods: SliderMethods = {
      dispatchEvent
    }

    const collapsePanePrivateMethods: SliderPrivateMethods = {
    }

    Object.assign($xeSlider, collapsePaneMethods, collapsePanePrivateMethods)

    const renderVN = () => {
      return h('div', {
        ref: refElem,
        class: 'vxe-slider'
      }, [])
    }

    $xeSlider.renderVN = renderVN

    return $xeSlider
  },
  render () {
    return this.renderVN()
  }
})
