import { ref, h, reactive, PropType } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { VxeUI } from '@vxe-ui/core'
import XEUtils from 'xe-utils'

import type { VxeLayoutContainerPropTypes, LayoutContainerReactData, LayoutContainerPrivateMethods, VxeLayoutContainerEmits, LayoutContainerMethods, LayoutContainerPrivateRef, VxeLayoutContainerPrivateComputed, VxeLayoutContainerConstructor, VxeLayoutContainerPrivateMethods, ValueOf } from '../../../types'

const { getConfig, baseUtils, useFns, createEvent } = VxeUI

const { getDefVal } = baseUtils

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeLayoutContainer',
  props: {
    vertical: Boolean as PropType<VxeLayoutContainerPropTypes.Vertical>,
    useScrollbar: {
      type: Boolean as PropType<VxeLayoutContainerPropTypes.UseScrollbar>,
      default: () => getDefVal(getConfig().layoutContainer.useScrollbar, getConfig().useScrollbar)
    },
    size: {
      type: String as PropType<VxeLayoutContainerPropTypes.Size>,
      default: () => getConfig().layoutContainer.size || getConfig().size
    }
  },
  emits: [] as VxeLayoutContainerEmits,
  setup(props, context) {
    const { slots, emit } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const { computeSize } = useFns.useSize(props)
    const { computeIsVScrollbar } = useFns.useVScrollbar(props)

    const reactData = reactive<LayoutContainerReactData>({})

    const refMaps: LayoutContainerPrivateRef = {
      refElem
    }

    const computeMaps: VxeLayoutContainerPrivateComputed = {
      computeSize,
      computeIsVScrollbar
    }

    const $xeLayoutContainer = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeLayoutContainerConstructor & VxeLayoutContainerPrivateMethods

    const dispatchEvent = (type: ValueOf<VxeLayoutContainerEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $layoutContainer: $xeLayoutContainer }, params))
    }

    const layoutContainerMethods: LayoutContainerMethods = {
      dispatchEvent
    }

    const layoutContainerPrivateMethods: LayoutContainerPrivateMethods = {}

    Object.assign($xeLayoutContainer, layoutContainerMethods, layoutContainerPrivateMethods)

    const renderVN = () => {
      const { vertical } = props
      const vSize = computeSize.value
      const defaultSlot = slots.default

      return h(
        'div',
        {
          ref: refElem,
          class: [
            'vxe-layout-container',
            {
              [`size--${vSize}`]: vSize,
              'is--vertical': vertical
            }
          ]
        },
        defaultSlot ? defaultSlot({}) : []
      )
    }

    $xeLayoutContainer.renderVN = renderVN

    return $xeLayoutContainer
  },
  render() {
    return this.renderVN()
  }
}) /* define-vxe-component end */
