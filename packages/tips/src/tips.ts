import { defineComponent, ref, h, reactive, PropType, createCommentVNode } from 'vue'
import XEUtils from 'xe-utils'
import { getConfig } from '@vxe-ui/core'
import { getSlotVNs } from '../..//ui/src/vn'

import type { VxeTipsPropTypes, TipsReactData, VxeTipsEmits, TipsPrivateRef, VxeTipsPrivateComputed, VxeTipsConstructor, VxeTipsPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeTips',
  props: {
    title: {
      type: [String, Number] as PropType<VxeTipsPropTypes.Title>,
      default: () => getConfig().tips.title
    },
    content: [String, Number] as PropType<VxeTipsPropTypes.Content>,
    status: String as PropType<VxeTipsPropTypes.Status>,
    icon: {
      type: String as PropType<VxeTipsPropTypes.Icon>,
      default: () => getConfig().tips.icon
    }
  },
  emits: [
  ] as VxeTipsEmits,
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<TipsReactData>({
    })

    const refMaps: TipsPrivateRef = {
      refElem
    }

    const computeMaps: VxeTipsPrivateComputed = {
    }

    const $xeTips = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeTipsConstructor & VxeTipsPrivateMethods

    const renderVN = () => {
      const { status, content, icon, title } = props
      const defaultSlot = slots.default
      const titleSlot = slots.title
      const iconSlot = slots.icon
      return h('div', {
        ref: refElem,
        class: ['vxe-tips', {
          [`theme--${status}`]: status
        }]
      }, [
        iconSlot || icon
          ? h('div', {
            class: 'vxe-tips--icon'
          }, iconSlot
            ? getSlotVNs(iconSlot({}))
            : [
                h('i', {
                  class: icon
                })
              ])
          : createCommentVNode(),
        h('div', {
          class: 'vxe-tips--body'
        }, [
          titleSlot || title
            ? h('div', {
              class: 'vxe-tips--title'
            }, titleSlot ? getSlotVNs(titleSlot({})) : XEUtils.toValueString(title))
            : createCommentVNode(),
          h('div', {
            class: 'vxe-tips--content'
          }, defaultSlot ? getSlotVNs(defaultSlot({})) : XEUtils.toValueString(content))
        ])
      ])
    }

    $xeTips.renderVN = renderVN

    return $xeTips
  },
  render () {
    return this.renderVN()
  }
})
