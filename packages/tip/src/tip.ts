import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, globalMixins, renderEmptyElement } from '../../ui'
import { getSlotVNs } from '../../ui/src/vn'

import type { VxeTipPropTypes, TipReactData, VxeTipEmits, VxeComponentPermissionInfo, VxeComponentSizeType, ValueOf } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeTip',
  mixins: [
    globalMixins.sizeMixin,
    globalMixins.permissionMixin
  ],
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
    /**
     * 权限码
     */
    permissionCode: [String, Number] as PropType<VxeTipPropTypes.PermissionCode>,
    size: {
      type: String as PropType<VxeTipPropTypes.Size>,
      default: () => getConfig().tip.size || getConfig().size
    }
  },
  data () {
    const reactData: TipReactData = {
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
    dispatchEvent (type: ValueOf<VxeTipEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeTip = this
      $xeTip.$emit(type, createEvent(evnt, { $tip: $xeTip }, params))
    },
    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeTip = this
      const props = $xeTip
      const slots = $xeTip.$scopedSlots

      const { status, content, icon, title } = props
      const defaultSlot = slots.default
      const titleSlot = slots.title
      const iconSlot = slots.icon
      const permissionInfo = $xeTip.computePermissionInfo
      const vSize = $xeTip.computeSize

      if (!permissionInfo.visible) {
        return renderEmptyElement($xeTip)
      }
      return h('div', {
        ref: 'refElem',
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
          : renderEmptyElement($xeTip),
        h('div', {
          class: 'vxe-tip--body'
        }, [
          titleSlot || title
            ? h('div', {
              class: 'vxe-tip--title'
            }, titleSlot ? getSlotVNs(titleSlot({})) : XEUtils.toValueString(title))
            : renderEmptyElement($xeTip),
          h('div', {
            class: 'vxe-tip--content'
          }, defaultSlot ? getSlotVNs(defaultSlot({})) : XEUtils.toValueString(content))
        ])
      ])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
