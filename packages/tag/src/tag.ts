import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, globalMixins, renderEmptyElement } from '../../ui'
import { getSlotVNs } from '../../ui/src/vn'

import type { VxeTagPropTypes, TagReactData, VxeTagEmits, VxeComponentPermissionInfo, VxeComponentSizeType, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxeTag',
  mixins: [
    globalMixins.sizeMixin,
    globalMixins.permissionMixin
  ],
  props: {
    status: String as PropType<VxeTagPropTypes.Status>,
    title: [String, Number] as PropType<VxeTagPropTypes.Title>,
    icon: String as PropType<VxeTagPropTypes.Icon>,
    content: [String, Number] as PropType<VxeTagPropTypes.Content>,
    size: {
      type: String as PropType<VxeTagPropTypes.Size>,
      default: () => getConfig().tag.size || getConfig().size
    }
  },
  data () {
    const reactData: TagReactData = {
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
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeTagEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeTag = this
      this.$emit(type, createEvent(evnt, { $tag: $xeTag }, params))
    },
    //
    // Render
    //
    renderContent  (h: CreateElement): VNode[] {
      const $xeTag = this
      const props = $xeTag
      const slots = $xeTag.$scopedSlots

      const { icon, content } = props
      const defaultSlot = slots.default
      const iconSlot = slots.icon
      return [
        iconSlot || icon
          ? h('span', {
            class: 'vxe-tag--icon'
          }, iconSlot
            ? getSlotVNs(iconSlot({}))
            : [
                h('i', {
                  class: icon
                })
              ])
          : renderEmptyElement($xeTag),
        h('span', {
          class: 'vxe-tag--content'
        }, defaultSlot ? defaultSlot({}) : XEUtils.toValueString(content))
      ]
    },
    renderVN  (h: CreateElement): VNode {
      const $xeTag = this
      const props = $xeTag

      const { status, title } = props
      const vSize = $xeTag.computeSize
      return h('span', {
        ref: 'refElem',
        class: ['vxe-tag', {
          [`size--${vSize}`]: vSize,
          [`theme--${status}`]: status
        }],
        attrs: {
          title
        }
      }, $xeTag.renderContent(h))
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
