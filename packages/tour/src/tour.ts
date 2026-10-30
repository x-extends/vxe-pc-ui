import { ref, h, reactive, PropType } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI } from '@vxe-ui/core'

import type { TourReactData, VxeTourPropTypes, TourPrivateRef, VxeTourEmits, VxeTourPrivateComputed, TourMethods, TourPrivateMethods, VxeTourConstructor, VxeTourPrivateMethods, ValueOf } from '../../../types'

const { getConfig, createEvent } = VxeUI

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeTour',
  props: {
    size: {
      type: String as PropType<VxeTourPropTypes.Size>,
      default: () => getConfig().tour.size || getConfig().size
    }
  },
  emits: [] as VxeTourEmits,
  setup(props, context) {
    const { emit } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<TourReactData>({})

    const refMaps: TourPrivateRef = {
      refElem
    }

    const computeMaps: VxeTourPrivateComputed = {}

    const $xeTour = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeTourConstructor & VxeTourPrivateMethods

    const dispatchEvent = (type: ValueOf<VxeTourEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $tour: $xeTour }, params))
    }

    const tagMethods: TourMethods = {
      dispatchEvent
    }

    const tagPrivateMethods: TourPrivateMethods = {}

    Object.assign($xeTour, tagMethods, tagPrivateMethods)

    const renderVN = () => {
      return h('div', {
        ref: refElem,
        class: 'vxe-tour'
      })
    }

    $xeTour.renderVN = renderVN

    return $xeTour
  },
  render() {
    return this.renderVN()
  }
}) /* define-vxe-component end */
