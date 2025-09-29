import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, createEvent, globalMixins, renderEmptyElement } from '../../ui'

import type { VxeTagPropTypes, TagReactData, VxeTagEmits, VxeComponentPermissionInfo, VxeComponentSizeType, ValueOf } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeTag',
  mixins: [
    globalMixins.sizeMixin,
    globalMixins.permissionMixin
  ],
  props: {
    border: {
      type: Boolean as PropType<VxeTagPropTypes.Border>,
      default: () => getConfig().tag.border
    },
    visible: {
      type: Boolean as PropType<VxeTagPropTypes.Visible>,
      default: null
    },
    status: String as PropType<VxeTagPropTypes.Status>,
    title: [String, Number] as PropType<VxeTagPropTypes.Title>,
    icon: String as PropType<VxeTagPropTypes.Icon>,
    closeIcon: {
      type: String as PropType<VxeTagPropTypes.CloseIcon>,
      default: () => getConfig().tag.closeIcon
    },
    content: [String, Number] as PropType<VxeTagPropTypes.Content>,
    round: Boolean as PropType<VxeTagPropTypes.Round>,
    closable: {
      type: Boolean as PropType<VxeTagPropTypes.Closable>,
      default: () => getConfig().tag.closable
    },
    color: String as PropType<VxeTagPropTypes.Color>,
    loading: Boolean as PropType<VxeTagPropTypes.Loading>,
    size: {
      type: String as PropType<VxeTagPropTypes.Size>,
      default: () => getConfig().tag.size || getConfig().size
    }
  },
  data () {
    const reactData: TagReactData = {
      showTag: true
    }
    return {
      xID: XEUtils.uniqueId(),
      reactData
    }
  },
  computed: {
    ...({} as {
      computePermissionInfo(): VxeComponentPermissionInfo
      computeSize(): VxeComponentSizeType
    })
  },
  watch: {
    visible () {
      const $xeTag = this

      $xeTag.updateVisible()
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeTagEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeTag = this
      $xeTag.$emit(type, createEvent(evnt, { $tag: $xeTag }, params))
    },
    updateVisible () {
      const $xeTag = this
      const props = $xeTag
      const reactData = $xeTag.reactData

      reactData.showTag = props.visible !== false
    },
    clickEvent  (evnt: MouseEvent) {
      const $xeTag = this
      const props = $xeTag

      const { loading } = props
      if (!loading) {
        $xeTag.dispatchEvent('click', {}, evnt)
      }
    },
    dblclickEvent  (evnt: MouseEvent) {
      const $xeTag = this
      const props = $xeTag

      const { loading } = props
      if (!loading) {
        $xeTag.dispatchEvent('dblclick', {}, evnt)
      }
    },
    closeEvent (evnt: MouseEvent) {
      const $xeTag = this
      const props = $xeTag
      const reactData = $xeTag.reactData

      const { loading } = props
      if (!loading) {
        const visible = !reactData.showTag
        reactData.showTag = visible
        $xeTag.$emit('update:visible', visible)
        $xeTag.dispatchEvent('close', { visible }, evnt)
      }
    },

    //
    // Render
    //
    renderContent  (h: CreateElement): VNode[] {
      const $xeTag = this
      const props = $xeTag
      const slots = $xeTag.$scopedSlots

      const { icon, content, closable, closeIcon, loading } = props
      const defaultSlot = slots.default
      const iconSlot = slots.icon
      const closeIconSlot = slots.closeIcon || slots['close-icon']
      return [
        iconSlot || icon
          ? h('span', {
            class: 'vxe-tag--icon'
          }, iconSlot
            ? iconSlot({})
            : [
                h('i', {
                  class: icon
                })
              ])
          : renderEmptyElement($xeTag),
        h('span', {
          class: 'vxe-tag--content'
        }, defaultSlot ? defaultSlot({}) : XEUtils.toValueString(content)),
        loading || closable
          ? h('span', {
            class: loading ? 'vxe-tag--loading' : 'vxe-tag--close',
            on: {
              click: $xeTag.closeEvent
            }
          }, !loading && closeIconSlot
            ? closeIconSlot({})
            : [
                h('i', {
                  class: loading ? getIcon().TAG_LOADING : (closeIcon || getIcon().TAG_CLOSE)
                })
              ])
          : renderEmptyElement($xeTag)
      ]
    },
    renderVN  (h: CreateElement): VNode {
      const $xeTag = this
      const props = $xeTag
      const reactData = $xeTag.reactData

      const { status, color, title, round, border, loading } = props
      const { showTag } = reactData
      const vSize = $xeTag.computeSize
      if (!showTag) {
        return renderEmptyElement($xeTag)
      }
      return h('span', {
        ref: 'refElem',
        class: ['vxe-tag', {
          [`size--${vSize}`]: vSize,
          [`theme--${status}`]: status && !color,
          [`color--${color}`]: color && !status,
          'is--color': color,
          'is--round': round,
          'is--border': border,
          'is--loading': loading
        }],
        attrs: {
          title
        },
        on: {
          click: $xeTag.clickEvent,
          dblclick: $xeTag.dblclickEvent
        }
      }, $xeTag.renderContent(h))
    }
  },
  created () {
    const $xeTag = this

    $xeTag.updateVisible()
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
