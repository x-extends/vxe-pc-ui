import { ref, h, reactive, PropType, createCommentVNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI, getConfig, getIcon, getI18n, useSize, createEvent } from '../../ui'
import { getSlotVNs } from '../../ui/src/vn'

import type { VxeTextPropTypes, TextReactData, TextPrivateRef, VxeTextPrivateComputed, TextMethods, TextPrivateMethods, VxeTextEmits, VxeTextConstructor, ValueOf, VxeTextPrivateMethods } from '../../../types'

export default defineVxeComponent({
  name: 'VxeText',
  props: {
    status: String as PropType<VxeTextPropTypes.Status>,
    title: [String, Number] as PropType<VxeTextPropTypes.Title>,
    icon: String as PropType<VxeTextPropTypes.Icon>,
    loading: Boolean as PropType<VxeTextPropTypes.Loading>,
    content: [String, Number] as PropType<VxeTextPropTypes.Content>,
    clickToCopy: Boolean as PropType<VxeTextPropTypes.ClickToCopy>,
    size: {
      type: String as PropType<VxeTextPropTypes.Size>,
      default: () => getConfig().text.size || getConfig().size
    }
  },
  emits: [
    'click'
  ] as VxeTextEmits,
  setup (props, context) {
    const { emit, slots } = context

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

    const dispatchEvent = (type: ValueOf<VxeTextEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $text: $xeText }, params))
    }

    const textMethods: TextMethods = {
      dispatchEvent
    }

    const clickEvent = (evnt : MouseEvent) => {
      const { loading } = props
      if (!loading) {
        dispatchEvent('click', {}, evnt)
      }
    }

    const textPrivateMethods: TextPrivateMethods = {
    }

    Object.assign($xeText, textMethods, textPrivateMethods)

    const renderContent = () => {
      const { loading, icon, content, clickToCopy } = props
      const defaultSlot = slots.default
      const iconSlot = slots.icon
      return [
        loading
          ? h('span', {
            class: 'vxe-text--loading'
          }, [
            h('i', {
              class: getIcon().TEXT_LOADING
            })
          ])
          : (
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
                : createCommentVNode()
            ),
        h('span', {
          ref: refContentElem,
          class: 'vxe-text--content'
        }, defaultSlot ? defaultSlot({}) : XEUtils.toValueString(content))
      ]
    }

    const renderVN = () => {
      const { loading, status, title, clickToCopy } = props
      const vSize = computeSize.value
      return h('span', {
        ref: refElem,
        title,
        class: ['vxe-text', {
          [`size--${vSize}`]: vSize,
          [`theme--${status}`]: status,
          'is--copy': clickToCopy,
          'is--loading': loading
        }],
        onClick: clickEvent
      }, renderContent())
    }

    $xeText.renderVN = renderVN

    return $xeText
  },
  render () {
    return this.renderVN()
  }
})
