import { CreateElement, PropType, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { createEvent, renderEmptyElement } from '../../ui'
import { assembleAnchorLink, destroyAnchorLink } from './util'

import type { VxeAnchorLinkDefines, VxeAnchorLinkPropTypes, AnchorLinkReactData, VxeComponentSizeType, VxeAnchorLinkEmits, VxeAnchorLinkConstructor, VxeAnchorLinkPrivateMethods, VxeAnchorConstructor, VxeAnchorPrivateMethods, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxeAnchorLink',
  props: {
    content: [String, Number] as PropType<VxeAnchorLinkPropTypes.Content>,
    title: [String, Number] as PropType<VxeAnchorLinkPropTypes.Title>,
    href: String as PropType<VxeAnchorLinkPropTypes.Href>
  },
  inject: {
    $xeAnchor: {
      default: null
    },
    $xeParentAnchorLink: {
      from: '$xeAnchorLink',
      default: null
    }
  },
  provide () {
    const $xeAnchorLink = this
    return {
      $xeAnchorLink
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: AnchorLinkReactData = {
    }
    const linkConfig: VxeAnchorLinkDefines.LinkConfig = {
      id: xID,
      href: '',
      children: []
    }
    return {
      xID,
      reactData,
      linkConfig
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
      $xeAnchor(): (VxeAnchorConstructor & VxeAnchorPrivateMethods) | null
      $xeParentAnchorLink(): (VxeAnchorLinkConstructor & VxeAnchorLinkPrivateMethods) | null
    }),
    computeIsActive () {
      const $xeAnchorLink = this
      const props = $xeAnchorLink
      const $xeAnchor = $xeAnchorLink.$xeAnchor

      const { href } = props
      if ($xeAnchor) {
        return $xeAnchor.reactData.activeHref === href
      }
      return null
    }
  },
  watch: {
    href (val) {
      const $xeAnchorLink = this
      const linkConfig = $xeAnchorLink.linkConfig

      linkConfig.href = val
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeAnchorLinkEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeAnchorLink = this
      $xeAnchorLink.$emit(type, createEvent(evnt, { $anchorLink: $xeAnchorLink }, params))
    },
    clickEvent  (event: KeyboardEvent) {
      const $xeAnchorLink = this
      const props = $xeAnchorLink
      const $xeAnchor = $xeAnchorLink.$xeAnchor

      const { href } = props
      if ($xeAnchor) {
        $xeAnchor.handleClickLink(event, href)
      }
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeAnchorLink = this
      const props = $xeAnchorLink
      const slots = $xeAnchorLink.$scopedSlots

      const { href, content, title } = props
      const defaultSlot = slots.default
      const subSlot = slots.sub
      const isActive = $xeAnchorLink.computeIsActive

      return h('div', {
        ref: 'refElem',
        class: ['vxe-anchor-link', {
          'is--active': isActive
        }]
      }, [
        h('a', {
          class: 'vxe-anchor-link--item',
          attrs: {
            href,
            title
          },
          on: {
            click: $xeAnchorLink.clickEvent
          }
        }, defaultSlot ? defaultSlot({}) : (XEUtils.toValueString(content))),
        subSlot
          ? h('div', {
            class: 'vxe-anchor-link--sub-items'
          }, subSlot({}))
          : renderEmptyElement($xeAnchorLink)
      ])
    }
  },
  created () {
    const $xeAnchorLink = this
    const props = $xeAnchorLink
    const linkConfig = $xeAnchorLink.linkConfig

    linkConfig.href = props.href
  },
  mounted () {
    const $xeAnchorLink = this
    const $xeAnchor = $xeAnchorLink.$xeAnchor
    const $xeParentAnchorLink = $xeAnchorLink.$xeParentAnchorLink
    const linkConfig = $xeAnchorLink.linkConfig

    const elem = $xeAnchorLink.$refs.refElem as HTMLDivElement
    if ($xeAnchor && elem) {
      assembleAnchorLink($xeAnchor, elem, linkConfig, $xeParentAnchorLink)
    }
  },
  beforeDestroy () {
    const $xeAnchorLink = this
    const $xeAnchor = $xeAnchorLink.$xeAnchor
    const linkConfig = $xeAnchorLink.linkConfig

    if ($xeAnchor) {
      destroyAnchorLink($xeAnchor, linkConfig)
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
