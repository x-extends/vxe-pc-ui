import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, globalMixins, createEvent, renderEmptyElement } from '../../ui'
import { getSlotVNs } from '../../ui/src/vn'

import type { VxeLinkPropTypes, LinkReactData, VxeLinkEmits, VxeComponentPermissionInfo, VxeComponentSizeType, ValueOf } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeLink',
  mixins: [
    globalMixins.sizeMixin,
    globalMixins.permissionMixin
  ],
  props: {
    href: String as PropType<VxeLinkPropTypes.Href>,
    target: String as PropType<VxeLinkPropTypes.Target>,
    status: String as PropType<VxeLinkPropTypes.Status>,
    title: [String, Number] as PropType<VxeLinkPropTypes.Title>,
    icon: String as PropType<VxeLinkPropTypes.Icon>,
    routerLink: Object as PropType<VxeLinkPropTypes.RouterLink>,
    underline: {
      type: Boolean as PropType<VxeLinkPropTypes.Underline>,
      default: () => getConfig().link.underline
    },
    /**
     * 权限码
     */
    permissionCode: [String, Number] as PropType<VxeLinkPropTypes.PermissionCode>,
    content: [String, Number] as PropType<VxeLinkPropTypes.Content>,
    size: {
      type: String as PropType<VxeLinkPropTypes.Size>,
      default: () => getConfig().link.size || getConfig().size
    }
  },
  data () {
    const reactData: LinkReactData = {
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
    dispatchEvent (type: ValueOf<VxeLinkEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeLink = this
      $xeLink.$emit(type, createEvent(evnt, { $link: $xeLink }, params))
    },
    clickEvent  (evnt: MouseEvent) {
      const $xeLink = this

      $xeLink.dispatchEvent('click', {}, evnt)
    },

    //
    // Render
    //
    renderContent  (h: CreateElement): VNode[] {
      const $xeLink = this
      const props = $xeLink
      const slots = $xeLink.$scopedSlots

      const { icon, content } = props
      const defaultSlot = slots.default
      const iconSlot = slots.icon
      const textContent = XEUtils.toValueString(content)
      return [
        iconSlot || icon
          ? h('span', {
            class: 'vxe-link--icon'
          }, iconSlot
            ? getSlotVNs(iconSlot({}))
            : [
                h('i', {
                  class: icon
                })
              ])
          : renderEmptyElement($xeLink),
        defaultSlot || textContent
          ? h('span', {
            class: 'vxe-link--content'
          }, defaultSlot ? defaultSlot({}) : textContent)
          : renderEmptyElement($xeLink)
      ]
    },
    renderVN (h: CreateElement): VNode {
      const $xeLink = this
      const props = $xeLink

      const { status, target, href, title, underline, routerLink } = props
      const permissionInfo = $xeLink.computePermissionInfo
      const vSize = $xeLink.computeSize

      if (!permissionInfo.visible) {
        return renderEmptyElement($xeLink)
      }

      if (routerLink) {
        return h('router-link', {
          class: ['vxe-link', {
            [`size--${vSize}`]: vSize,
            [`theme--${status}`]: status,
            'is--underline': underline
          }],
          props: {
            title,
            target,
            custom: true,
            to: routerLink
          },
          on: {
            click: $xeLink.clickEvent
          }
        }, $xeLink.renderContent(h))
      }
      return h('a', {
        ref: 'refElem',
        class: ['vxe-link', {
          [`size--${vSize}`]: vSize,
          [`theme--${status}`]: status,
          'is--underline': underline
        }],
        attrs: {
          href,
          target,
          title
        },
        on: {
          click: $xeLink.clickEvent
        }
      }, $xeLink.renderContent(h))
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
