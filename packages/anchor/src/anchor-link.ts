import { defineComponent, ref, h, computed, reactive, PropType, inject, createCommentVNode, onMounted, onUnmounted, provide, watch } from 'vue'
import XEUtils from 'xe-utils'
import { assemAnchorLink, destroyAnchorLink } from './util'

import { VxeAnchorLinkDefines, VxeAnchorLinkPropTypes, AnchorLinkReactData, AnchorLinkPrivateRef, VxeAnchorLinkPrivateComputed, VxeAnchorLinkConstructor, VxeAnchorLinkPrivateMethods, VxeAnchorConstructor, VxeAnchorPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeAnchorLink',
  props: {
    content: [String, Number] as PropType<VxeAnchorLinkPropTypes.Content>,
    title: [String, Number] as PropType<VxeAnchorLinkPropTypes.Title>,
    href: String as PropType<VxeAnchorLinkPropTypes.Href>
  },
  emits: [],
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<AnchorLinkReactData>({
    })

    const linkConfig = reactive<VxeAnchorLinkDefines.LinkConfig>({
      id: xID,
      href: props.href,
      children: []
    })

    const $xeAnchor = inject<(VxeAnchorConstructor & VxeAnchorPrivateMethods) | null>('$xeAnchor', null)
    const $xeParentAnchorLink = inject<(VxeAnchorLinkConstructor & VxeAnchorLinkPrivateMethods) | null>('$xeAnchorLink', null)

    const refMaps: AnchorLinkPrivateRef = {
      refElem
    }

    const computeIsActive = computed(() => {
      const { href } = props
      if ($xeAnchor) {
        return $xeAnchor.reactData.activeHref === href
      }
      return null
    })

    const computeMaps: VxeAnchorLinkPrivateComputed = {
    }

    const $xeAnchorLink = {
      xID,
      props,
      context,
      reactData,
      linkConfig,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeAnchorLinkConstructor & VxeAnchorLinkPrivateMethods

    const clickEvent = (event: KeyboardEvent) => {
      const { href } = props
      if ($xeAnchor) {
        $xeAnchor.handleClickLink(event, href)
      }
    }

    watch(() => props.href, (val) => {
      linkConfig.href = val
    })

    onMounted(() => {
      if ($xeAnchor && refElem.value) {
        assemAnchorLink($xeAnchor, refElem.value, linkConfig, $xeParentAnchorLink)
      }
    })

    onUnmounted(() => {
      if ($xeAnchor) {
        destroyAnchorLink($xeAnchor, linkConfig)
      }
    })

    const renderVN = () => {
      const { href, content, title } = props
      const defaultSlot = slots.default
      const subSlot = slots.sub
      const isActive = computeIsActive.value

      return h('div', {
        ref: refElem,
        class: ['vxe-anchor-link', {
          'is--active': isActive
        }]
      }, [
        h('a', {
          class: 'vxe-anchor-link--item',
          href,
          title,
          onClick: clickEvent
        }, defaultSlot ? defaultSlot({}) : (XEUtils.toValueString(content))),
        subSlot
          ? h('div', {
            class: 'vxe-anchor-link--sub-items'
          }, subSlot({}))
          : createCommentVNode()
      ])
    }

    $xeAnchorLink.renderVN = renderVN

    provide('$xeAnchorLink', $xeAnchorLink)

    return $xeAnchorLink
  },
  render () {
    return this.renderVN()
  }
})
