import { defineComponent, ref, h, reactive, PropType, createCommentVNode } from 'vue'
import XEUtils from 'xe-utils'
import { getSlotVNs } from '../../ui/src/vn'

import type { VxeTextPropTypes, TextReactData, TextPrivateRef, VxeTextPrivateComputed, VxeTextConstructor, VxeTextPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeText',
  props: {
    status: String as PropType<VxeTextPropTypes.Status>,
    title: [String, Number] as PropType<VxeTextPropTypes.Title>,
    icon: String as PropType<VxeTextPropTypes.Icon>,
    content: [String, Number] as PropType<VxeTextPropTypes.Content>
  },
  emits: [],
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<TextReactData>({
    })

    const refMaps: TextPrivateRef = {
      refElem
    }

    const computeMaps: VxeTextPrivateComputed = {
    }

    const $xeText = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeTextConstructor & VxeTextPrivateMethods

    const renderContent = () => {
      const { icon, content } = props
      const defaultSlot = slots.default
      const iconSlot = slots.icon
      return [
        iconSlot || icon
          ? h('span', {
            class: 'vxe-text--icon'
          }, iconSlot
            ? getSlotVNs(iconSlot({}))
            : [
                h('i', {
                  class: icon
                })
              ])
          : createCommentVNode(),
        h('span', {
          class: 'vxe-text--content'
        }, defaultSlot ? defaultSlot({}) : XEUtils.toValueString(content))
      ]
    }

    const renderVN = () => {
      const { status, title } = props
      return h('span', {
        ref: refElem,
        title,
        class: ['vxe-text', {
          [`theme--${status}`]: status
        }]
      }, renderContent())
    }

    $xeText.renderVN = renderVN

    return $xeText
  },
  render () {
    return this.renderVN()
  }
})
