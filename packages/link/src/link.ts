import { defineComponent, ref, h, reactive, PropType, createCommentVNode } from 'vue'
import XEUtils from 'xe-utils'
import { getConfig } from '@vxe-ui/core'
import { getSlotVNs } from '../../ui/src/vn'

import type { VxeLinkPropTypes, LinkReactData, LinkPrivateRef, VxeLinkPrivateComputed, VxeLinkConstructor, VxeLinkPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeLink',
  props: {
    href: String as PropType<VxeLinkPropTypes.Href>,
    target: String as PropType<VxeLinkPropTypes.Target>,
    status: String as PropType<VxeLinkPropTypes.Status>,
    title: [String, Number] as PropType<VxeLinkPropTypes.Title>,
    icon: String as PropType<VxeLinkPropTypes.Icon>,
    routerLink: String as PropType<VxeLinkPropTypes.RouterLink>,
    underline: {
      type: Boolean as PropType<VxeLinkPropTypes.Underline>,
      default: () => getConfig().link.underline
    },
    content: [String, Number] as PropType<VxeLinkPropTypes.Content>
  },
  emits: [],
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<LinkReactData>({
    })

    const refMaps: LinkPrivateRef = {
      refElem
    }

    const computeMaps: VxeLinkPrivateComputed = {
    }

    const $xeLink = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeLinkConstructor & VxeLinkPrivateMethods

    const renderVN = () => {
      const { status, target, href, title, underline, icon, content } = props
      const defaultSlot = slots.default
      const iconSlot = slots.icon
      return h('a', {
        ref: refElem,
        href,
        target,
        title,
        class: ['vxe-link', {
          'is--underline': underline,
          [`theme--${status}`]: status
        }]
      }, [
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
          : createCommentVNode(),
        h('span', {
          class: 'vxe-link--content'
        }, defaultSlot ? defaultSlot({}) : XEUtils.toValueString(content))
      ])
    }

    $xeLink.renderVN = renderVN

    return $xeLink
  },
  render () {
    return this.renderVN()
  }
})
