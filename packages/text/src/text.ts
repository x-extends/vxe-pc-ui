import { defineComponent, ref, h, reactive, PropType, createCommentVNode } from 'vue'
import XEUtils from 'xe-utils'
import { VxeUI, getConfig, getIcon, getI18n, useSize } from '../../ui'
import { getSlotVNs } from '../../ui/src/vn'

import type { VxeTextPropTypes, TextReactData, TextPrivateRef, VxeTextPrivateComputed, VxeTextConstructor, VxeTextPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeText',
  props: {
    status: String as PropType<VxeTextPropTypes.Status>,
    title: [String, Number] as PropType<VxeTextPropTypes.Title>,
    icon: String as PropType<VxeTextPropTypes.Icon>,
    content: [String, Number] as PropType<VxeTextPropTypes.Content>,
    clickToCopy: Boolean as PropType<VxeTextPropTypes.ClickToCopy>,
    size: { type: String as PropType<VxeTextPropTypes.Size>, default: () => getConfig().text.size || getConfig().size }
  },
  emits: [],
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const refElem = ref<HTMLDivElement>()
    const refContentElem = ref<HTMLSpanElement>()

    const reactData = reactive<TextReactData>({
    })

    const refMaps: TextPrivateRef = {
      refElem
    }

    const computeMaps: VxeTextPrivateComputed = {
    }

    const clickIconEvent = () => {
      const { content, clickToCopy } = props
      if (clickToCopy) {
        const contentEl = refContentElem.value
        const copyVal = (contentEl ? contentEl.textContent : '') || content
        if (copyVal) {
          if (VxeUI.clipboard.copy(copyVal)) {
            if (VxeUI.modal) {
              VxeUI.modal.message({
                content: getI18n('vxe.text.copySuccess'),
                status: 'success'
              })
            }
          } else {
            if (VxeUI.modal) {
              VxeUI.modal.message({
                content: getI18n('vxe.text.copyError'),
                status: 'error'
              })
            }
          }
        }
      }
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
      const { icon, content, clickToCopy } = props
      const defaultSlot = slots.default
      const iconSlot = slots.icon
      return [
        iconSlot || icon || clickToCopy
          ? h('span', {
            class: 'vxe-text--icon',
            onClick: clickIconEvent
          }, iconSlot
            ? getSlotVNs(iconSlot({}))
            : [
                h('i', {
                  class: icon || getIcon().TEXT_COPY
                })
              ])
          : createCommentVNode(),
        h('span', {
          ref: refContentElem,
          class: 'vxe-text--content'
        }, defaultSlot ? defaultSlot({}) : XEUtils.toValueString(content))
      ]
    }

    const renderVN = () => {
      const { status, title, clickToCopy } = props
      const vSize = computeSize.value
      return h('span', {
        ref: refElem,
        title,
        class: ['vxe-text', {
          [`size--${vSize}`]: vSize,
          [`theme--${status}`]: status,
          'is--copy': clickToCopy
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
