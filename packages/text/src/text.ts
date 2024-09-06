import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI, getConfig, getIcon, getI18n, renderEmptyElement, createEvent, globalMixins } from '../../ui'
import { getSlotVNs } from '../../ui/src/vn'

import type { VxeTextPropTypes, TextReactData, VxeTextEmits, VxeComponentSizeType, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxeText',
  mixins: [
    globalMixins.sizeMixin,
    globalMixins.permissionMixin
  ],
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
  data () {
    const reactData: TextReactData = {
    }
    return {
      xID: XEUtils.uniqueId(),
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
    })
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeTextEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeText = this
      $xeText.$emit(type, createEvent(evnt, { $text: $xeText }, params))
    },
    clickIconEvent () {
      const $xeText = this
      const props = $xeText

      const { content, clickToCopy } = props
      if (clickToCopy) {
        const contentEl = $xeText.$refs.refContentElem as HTMLSpanElement
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
    },
    clickEvent  (evnt : MouseEvent) {
      const $xeText = this
      const props = $xeText

      const { loading } = props
      if (!loading) {
        $xeText.dispatchEvent('click', {}, evnt)
      }
    },

    //
    // Render
    //
    renderContent  (h: CreateElement): VNode[] {
      const $xeText = this
      const props = $xeText
      const slots = $xeText.$scopedSlots

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
                  on: {
                    click: $xeText.clickIconEvent
                  }
                }, iconSlot
                  ? getSlotVNs(iconSlot({}))
                  : [
                      h('i', {
                        class: icon || getIcon().TEXT_COPY
                      })
                    ])
                : renderEmptyElement($xeText)
            ),
        h('span', {
          ref: 'refContentElem',
          class: 'vxe-text--content'
        }, defaultSlot ? defaultSlot({}) : XEUtils.toValueString(content))
      ]
    },
    renderVN (h: CreateElement): VNode {
      const $xeText = this
      const props = $xeText

      const { loading, status, title, clickToCopy } = props
      const vSize = $xeText.computeSize
      return h('span', {
        ref: 'refElem',
        class: ['vxe-text', {
          [`size--${vSize}`]: vSize,
          [`theme--${status}`]: status,
          'is--copy': clickToCopy,
          'is--loading': loading
        }],
        attrs: {
          title
        },
        on: {
          click: $xeText.clickEvent
        }
      }, $xeText.renderContent(h))
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
