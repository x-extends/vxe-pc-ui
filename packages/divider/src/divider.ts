import { ref, h, PropType } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, useSize } from '../../ui'

import type { VxeDividerEmits, VxeDividerPropTypes, DividerMethods, DividerPrivateMethods, ValueOf, DividerPrivateRef, VxeDividerPrivateComputed, VxeDividerConstructor, VxeDividerPrivateMethods } from '../../../types'

export default defineVxeComponent({
  name: 'VxeDivider',
  props: {
    vertical: {
      type: Boolean as PropType<VxeDividerPropTypes.Vertical>,
      default: () => getConfig().divider.vertical
    },
    titleContent: {
      type: String as PropType<VxeDividerPropTypes.TitleContent>,
      default: () => getConfig().divider.titleContent
    },
    titleAlign: {
      type: String as PropType<VxeDividerPropTypes.TitleAlign>,
      default: () => getConfig().divider.titleAlign
    },
    size: {
      type: String as PropType<VxeDividerPropTypes.Size>,
      default: () => getConfig().divider.size || getConfig().size
    }
  },
  emits: [
  ] as VxeDividerEmits,
  setup (props, context) {
    const { emit, slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const { computeSize } = useSize(props)

    const refMaps: DividerPrivateRef = {
      refElem
    }

    const computeMaps: VxeDividerPrivateComputed = {
    }

    const $xeDivider = {
      xID,
      props,
      context,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeDividerConstructor & VxeDividerPrivateMethods

    const dispatchEvent = (type: ValueOf<VxeDividerEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $divider: $xeDivider }, params))
    }

    const dividerMethods: DividerMethods = {
      dispatchEvent
    }

    const dividerPrivateMethods: DividerPrivateMethods = {
    }

    Object.assign($xeDivider, dividerMethods, dividerPrivateMethods)

    const renderVN = () => {
      const { vertical, titleContent, titleAlign } = props
      const vSize = computeSize.value
      const titleSlot = slots.title
      return h('div', {
        ref: refElem,
        class: ['vxe-divider', vertical ? 'is--vertical' : 'is--horizontal', `t--align-${titleAlign || 'center'}`, {
          [`size--${vSize}`]: vSize
        }]
      }, (titleContent || titleSlot) && !vertical
        ? [
            h('span', {
              class: 'vxe-divider--content'
            }, titleSlot ? titleSlot({}) : titleContent)
          ]
        : [])
    }

    $xeDivider.renderVN = renderVN

    return $xeDivider
  },
  render () {
    return this.renderVN()
  }
})
