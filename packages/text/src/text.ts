import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI, getConfig, getIcon, getI18n, createEvent, globalMixins } from '../../ui'

import type { VxeTextPropTypes, TextReactData, VxeTextEmits, VxeComponentSizeType, ValueOf } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeText',
  mixins: [
    globalMixins.sizeMixin,
    globalMixins.permissionMixin
  ],
  props: {
    status: String as PropType<VxeTextPropTypes.Status>,
    title: [String, Number] as PropType<VxeTextPropTypes.Title>,
    icon: String as PropType<VxeTextPropTypes.Icon>,
    prefixIcon: String as PropType<VxeTextPropTypes.PrefixIcon>,
    suffixIcon: String as PropType<VxeTextPropTypes.SuffixIcon>,
    loading: Boolean as PropType<VxeTextPropTypes.Loading>,
    content: [String, Number] as PropType<VxeTextPropTypes.Content>,
    clickToCopy: {
      type: Boolean as PropType<VxeTextPropTypes.ClickToCopy>,
      default: () => getConfig().text.clickToCopy
    },
    copyIcon: {
      type: String as PropType<VxeTextPropTypes.CopyIcon>,
      default: () => getConfig().text.copyIcon
    },
    copyLayout: {
      type: String as PropType<VxeTextPropTypes.CopyLayout>,
      default: () => getConfig().text.copyLayout
    },
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
    prefixEvent (evnt : MouseEvent) {
      const $xeText = this
      const props = $xeText

      const { loading } = props
      if (!loading) {
        $xeText.dispatchEvent('prefix-click', {}, evnt)
      }
    },
    suffixEvent (evnt : MouseEvent) {
      const $xeText = this
      const props = $xeText

      const { loading } = props
      if (!loading) {
        $xeText.dispatchEvent('suffix-click', {}, evnt)
      }
    },

    //
    // Render
    //
    renderCopyIcon (h: CreateElement) {
      const $xeText = this
      const props = $xeText

      const { copyIcon } = props
      return h('span', {
        key: 'ci',
        class: 'vxe-text--copy-icon',
        on: {
          click: $xeText.clickIconEvent
        }
      }, [
        h('i', {
          class: copyIcon || getIcon().TEXT_COPY
        })
      ])
    },
    renderContent  (h: CreateElement): VNode[] {
      const $xeText = this
      const props = $xeText
      const slots = $xeText.$scopedSlots

      const { loading, icon, prefixIcon, suffixIcon, clickToCopy, content, copyLayout } = props
      const defaultSlot = slots.default
      const prefixIconSlot = slots.prefixIcon || slots['prefix-icon'] || slots.icon
      const suffixIconSlot = slots.suffixIcon || slots['suffix-icon']
      const copyToRight = copyLayout === 'right'
      const contVNs: VNode[] = []
      if (loading) {
        contVNs.push(
          h('span', {
            key: 'lg',
            class: 'vxe-text--loading'
          }, [
            h('i', {
              class: getIcon().TEXT_LOADING
            })
          ])
        )
      } else if (clickToCopy && !copyToRight) {
        contVNs.push($xeText.renderCopyIcon(h))
      }
      if (prefixIcon || icon) {
        contVNs.push(
          h('span', {
            key: 'si',
            class: 'vxe-text--prefix-icon',
            on: {
              click: $xeText.prefixEvent
            }
          }, prefixIconSlot
            ? prefixIconSlot({})
            : [
                h('i', {
                  class: prefixIcon || icon
                })
              ])
        )
      }
      contVNs.push(
        h('span', {
          key: 'ct',
          ref: 'refContentElem',
          class: 'vxe-text--content'
        }, defaultSlot ? defaultSlot({}) : XEUtils.toValueString(content))
      )
      if (suffixIcon) {
        contVNs.push(
          h('span', {
            key: 'si',
            class: 'vxe-text--suffix-icon',
            on: {
              click: $xeText.suffixEvent
            }
          }, suffixIconSlot
            ? suffixIconSlot({})
            : [
                h('i', {
                  class: suffixIcon
                })
              ])
        )
      }
      if (clickToCopy && copyToRight && !loading) {
        contVNs.push($xeText.renderCopyIcon(h))
      }
      return contVNs
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
}) /* define-vxe-component end */
