import { defineComponent, ref, h, reactive, PropType, createCommentVNode } from 'vue'
import XEUtils from 'xe-utils'
import { getConfig, useSize } from '../../ui'
import { getSlotVNs } from '../../ui/src/vn'

import type { VxeTipPropTypes, TipReactData, VxeTipEmits, TipPrivateRef, VxeTipPrivateComputed, VxeTipConstructor, VxeTipPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeTip',
  props: {
    title: {
      type: [String, Number] as PropType<VxeTipPropTypes.Title>,
      default: () => getConfig().tip.title
    },
    content: [String, Number] as PropType<VxeTipPropTypes.Content>,
    status: String as PropType<VxeTipPropTypes.Status>,
    icon: {
      type: String as PropType<VxeTipPropTypes.Icon>,
      default: () => getConfig().tip.icon
    },
    size: { type: String as PropType<VxeTipPropTypes.Size>, default: () => getConfig().tip.size || getConfig().size }
  },
  emits: [
  ] as VxeTipEmits,
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<TipReactData>({
    })

    const refMaps: TipPrivateRef = {
      refElem
    }

    const computeMaps: VxeTipPrivateComputed = {
    }

    const $xeTip = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeTipConstructor & VxeTipPrivateMethods

    const renderVN = () => {
      const { status, content, icon, title } = props
      const defaultSlot = slots.default
      const titleSlot = slots.title
      const iconSlot = slots.icon
      const vSize = computeSize.value
      return h('div', {
        ref: refElem,
        class: ['vxe-tip', {
          [`size--${vSize}`]: vSize,
          [`theme--${status}`]: status,
          'has--title': !!(titleSlot || title)
        }]
      }, [
        iconSlot || icon
          ? h('div', {
            class: 'vxe-tip--icon'
          }, iconSlot
            ? getSlotVNs(iconSlot({}))
            : [
                h('i', {
                  class: icon
                })
              ])
          : createCommentVNode(),
        h('div', {
          class: 'vxe-tip--body'
        }, [
          titleSlot || title
            ? h('div', {
              class: 'vxe-tip--title'
            }, titleSlot ? getSlotVNs(titleSlot({})) : XEUtils.toValueString(title))
            : createCommentVNode(),
          h('div', {
            class: 'vxe-tip--content'
          }, defaultSlot ? getSlotVNs(defaultSlot({})) : XEUtils.toValueString(content))
        ])
      ])
    }

    $xeTip.renderVN = renderVN

    return $xeTip
  },
  render () {
    return this.renderVN()
  }
})
