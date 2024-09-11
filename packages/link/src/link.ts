import { defineComponent, ref, h, reactive, PropType, createCommentVNode, resolveComponent } from 'vue'
import XEUtils from 'xe-utils'
import { getConfig, usePermission, useSize, createEvent } from '../../ui'
import { getSlotVNs } from '../../ui/src/vn'

import type { VxeLinkPropTypes, LinkReactData, LinkPrivateRef, LinkMethods, LinkPrivateMethods, VxeLinkEmits, VxeLinkPrivateComputed, VxeLinkConstructor, VxeLinkPrivateMethods, ValueOf } from '../../../types'

export default defineComponent({
  name: 'VxeLink',
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
  emits: [
    'click'
  ] as VxeLinkEmits,
  setup (props, context) {
    const { slots, emit } = context

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const { computePermissionInfo } = usePermission(props)

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

    const dispatchEvent = (type: ValueOf<VxeLinkEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $link: $xeLink }, params))
    }

    const linkMethods: LinkMethods = {
      dispatchEvent
    }

    const linkPrivateMethods: LinkPrivateMethods = {
    }

    const clickEvent = (evnt: MouseEvent) => {
      dispatchEvent('click', {}, evnt)
    }

    Object.assign($xeLink, linkMethods, linkPrivateMethods)

    const renderContent = () => {
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
          : createCommentVNode(),
        defaultSlot || textContent
          ? h('span', {
            class: 'vxe-link--content'
          }, defaultSlot ? defaultSlot({}) : textContent)
          : createCommentVNode()
      ]
    }

    const renderVN = () => {
      const { status, target, href, title, underline, routerLink } = props
      const permissionInfo = computePermissionInfo.value
      const vSize = computeSize.value
      if (!permissionInfo.visible) {
        return createCommentVNode()
      }
      if (routerLink) {
        return h(resolveComponent('router-link'), {
          class: ['vxe-link', {
            [`size--${vSize}`]: vSize,
            [`theme--${status}`]: status,
            'is--underline': underline
          }],
          title,
          target,
          to: routerLink,
          onClick: clickEvent
        }, {
          default () {
            return renderContent()
          }
        })
      }
      return h('a', {
        ref: refElem,
        class: ['vxe-link', {
          [`size--${vSize}`]: vSize,
          [`theme--${status}`]: status,
          'is--underline': underline
        }],
        href,
        target,
        title,
        onClick: clickEvent
      }, renderContent())
    }

    $xeLink.renderVN = renderVN

    return $xeLink
  },
  render () {
    return this.renderVN()
  }
})
