import { CreateElement, PropType, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, getIcon, renderEmptyElement } from '../../ui'
import { getSlotVNs } from '../../ui/src/vn'

import type { VxeAlertPropTypes, AlertReactData, VxeAlertEmits, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxeAlert',
  props: {
    title: {
      type: [String, Number] as PropType<VxeAlertPropTypes.Title>,
      default: () => getConfig().alert.title
    },
    content: [String, Number] as PropType<VxeAlertPropTypes.Content>,
    status: String as PropType<VxeAlertPropTypes.Status>,
    showIcon: Boolean as PropType<VxeAlertPropTypes.ShowIcon>,
    showClose: Boolean as PropType<VxeAlertPropTypes.ShowClose>,
    icon: {
      type: String as PropType<VxeAlertPropTypes.Icon>,
      default: () => getConfig().alert.icon
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: AlertReactData = {
    }
    return {
      xID,
      reactData
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeAlertEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeAlert = this
      this.$emit(type, createEvent(evnt, { $alert: $xeAlert }, params))
    },
    closeEvent  (evnt: MouseEvent) {
      const $xeAlert = this
      $xeAlert.dispatchEvent('close', {}, evnt)
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeAlert = this
      const props = $xeAlert
      const slots = $xeAlert.$scopedSlots

      const { status, content, icon, title, showIcon, showClose } = props
      const defaultSlot = slots.default
      const titleSlot = slots.title
      const iconSlot = slots.icon
      return h('div', {
        ref: 'refElem',
        class: ['vxe-alert', {
          [`theme--${status}`]: status
        }]
      }, [
        iconSlot || (showIcon && status) || icon
          ? h('div', {
            class: 'vxe-alert--icon'
          }, iconSlot
            ? getSlotVNs(iconSlot({}))
            : [
                h('i', {
                  class: icon || getIcon()[`ALERT_${status?.toUpperCase()}` as 'ALERT_SUCCESS']
                })
              ])
          : renderEmptyElement($xeAlert),
        h('div', {
          class: 'vxe-alert--body'
        }, [
          titleSlot || title
            ? h('div', {
              class: 'vxe-alert--title'
            }, titleSlot ? getSlotVNs(titleSlot({})) : XEUtils.toValueString(title))
            : renderEmptyElement($xeAlert),
          h('div', {
            class: 'vxe-alert--content'
          }, defaultSlot ? getSlotVNs(defaultSlot({})) : XEUtils.toValueString(content))
        ]),
        showClose
          ? h('div', {
            class: 'vxe-alert--close-btn',
            on: {
              click: $xeAlert.closeEvent
            }
          }, [
            h('i', {
              class: getIcon().ALERT_CLOSE
            })
          ])
          : renderEmptyElement($xeAlert)
      ])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
