import { CreateElement, PropType, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { createEvent, renderEmptyElement } from '../../ui'
import { getOffsetPos } from '../../ui/src/dom'
import VxeAnchorLinkComponent from './anchor-link'

import type { VxeAnchorPropTypes, AnchorReactData, VxeAnchorLinkPropTypes, VxeAnchorEmits, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxeAnchor',
  props: {
    value: String as PropType<VxeAnchorPropTypes.ModelValue>,
    options: Array as PropType<VxeAnchorPropTypes.Options>,
    container: [String, Object, Function] as PropType<VxeAnchorPropTypes.Container>,
    showMarker: {
      type: Boolean as PropType<VxeAnchorPropTypes.ShowMarker>,
      default: true
    }
  },
  provide () {
    const $xeAnchor = this
    return {
      $xeAnchor
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: AnchorReactData = {
      activeHref: null,
      staticLinks: [],
      containerElem: null
    }
    return {
      xID,
      reactData
    }
  },
  computed: {
    computeAllHrefList () {
      const $xeAnchor = this
      const reactData = $xeAnchor.reactData

      const list: VxeAnchorPropTypes.ModelValue[] = []
      XEUtils.eachTree(reactData.staticLinks, item => {
        list.push(item.href || '')
      }, { children: 'children' })
      return list
    }
  },
  watch: {
    value (val) {
      const $xeAnchor = this
      const reactData = $xeAnchor.reactData

      reactData.activeHref = val
    },
    'reactData.activeHref' () {
      const $xeAnchor = this

      $xeAnchor.updateMarkerPos()
    },
    container () {
      const $xeAnchor = this

      $xeAnchor.removeContainerElemScroll()
      $xeAnchor.updateContainerElem()
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeAnchorEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeAnchor = this
      $xeAnchor.$emit(type, createEvent(evnt, { $anchor: $xeAnchor }, params))
    },
    getContainerElem  () {
      const $xeAnchor = this
      const props = $xeAnchor

      const { container } = props
      if (container) {
        if (XEUtils.isElement(container)) {
          return container
        }
        if (XEUtils.isString(container)) {
          return document.querySelector(container) as HTMLElement | null
        }
        if (XEUtils.isFunction(container)) {
          return container({ $anchor: $xeAnchor })
        }
      }
      return null
    },
    emitEvent  (value?: VxeAnchorPropTypes.ModelValue) {
      const $xeAnchor = this
      const reactData = $xeAnchor.reactData

      const { _events } = $xeAnchor as any
      reactData.activeHref = value
      $xeAnchor.$emit('input', value)
      if (_events && _events.modelValue) {
        $xeAnchor.$emit('modelValue', value)
      } else {
        $xeAnchor.$emit('model-value', value)
      }
    },
    handleContainerScrollEvent  () {
      const $xeAnchor = this
      const reactData = $xeAnchor.reactData

      const allHrefList = $xeAnchor.computeAllHrefList
      const { containerElem } = reactData
      if (containerElem) {
        const wrapperElList = containerElem.querySelectorAll(allHrefList.map(href => `${href}`).join(','))
        for (let i = 0; i < wrapperElList.length; i++) {
          const wrapperEl = wrapperElList[i]
          const wrapperRect = wrapperEl.getBoundingClientRect()
          if (wrapperRect.top > 0) {
            const href = wrapperEl.id
            reactData.activeHref = `#${href}`
            break
          }
        }
      }
    },
    removeContainerElemScroll  () {
      const $xeAnchor = this
      const reactData = $xeAnchor.reactData

      const { containerElem } = reactData
      if (containerElem) {
        containerElem.removeEventListener('scroll', $xeAnchor.handleContainerScrollEvent)
      }
    },
    updateContainerElem  () {
      const $xeAnchor = this
      const reactData = $xeAnchor.reactData

      const containerElem = $xeAnchor.getContainerElem()
      reactData.containerElem = containerElem
      if (containerElem) {
        containerElem.addEventListener('scroll', $xeAnchor.handleContainerScrollEvent, {
          passive: false
        })
      }
    },
    updateMarkerPos  () {
      const $xeAnchor = this
      const reactData = $xeAnchor.reactData

      $xeAnchor.$nextTick(() => {
        const { activeHref } = reactData
        const elem = $xeAnchor.$refs.refElem as HTMLDivElement
        const markerEl = $xeAnchor.$refs.refMarkerElem as HTMLDivElement
        if (elem && markerEl) {
          if (activeHref) {
            const linkEl = elem.querySelector(`[href="${activeHref}"]`)
            if (linkEl) {
              const { top } = getOffsetPos(linkEl, elem)
              markerEl.style.top = `${top}px`
            }
          }
        }
      })
    },
    handleClickLink (evnt: KeyboardEvent, href?: VxeAnchorLinkPropTypes.Href) {
      const $xeAnchor = this

      evnt.preventDefault()
      const targetEl = document.getElementById(`${href}`.replace('#', ''))
      if (targetEl) {
        targetEl.scrollIntoView({
          behavior: 'smooth'
        })
      }
      $xeAnchor.emitEvent(href)
      $xeAnchor.dispatchEvent('click', { href }, evnt)
    },

    //
    // Render
    //
    renderSubItems  (h: CreateElement, options?: VxeAnchorPropTypes.Options) {
      const $xeAnchor = this

      const itemVNs: VNode[] = []
      if (options) {
        options.forEach(item => {
          const subItems = item.children
          if (subItems && subItems.length) {
            itemVNs.push(h(VxeAnchorLinkComponent, {
              props: {
                content: item.content,
                title: item.title,
                href: item.href
              },
              scopedSlots: {
                sub: () => $xeAnchor.renderSubItems(h, subItems)
              }
            }))
          } else {
            itemVNs.push(h(VxeAnchorLinkComponent, {
              props: {
                content: item.content,
                title: item.title,
                href: item.href
              }
            }))
          }
        })
      }
      return itemVNs
    },
    renderVN (h: CreateElement): VNode {
      const $xeAnchor = this
      const props = $xeAnchor
      const slots = $xeAnchor.$scopedSlots

      const { options, showMarker } = props
      const defaultSlot = slots.default
      return h('div', {
        ref: 'refElem',
        class: ['vxe-anchor', {
          'is--marker': showMarker
        }]
      }, [
        h('div', {
          class: 'vxe-anchor--list'
        }, defaultSlot ? defaultSlot({}) : $xeAnchor.renderSubItems(h, options)),
        showMarker
          ? h('div', {
            ref: 'refMarkerElem',
            class: 'vxe-anchor--marker'
          })
          : renderEmptyElement($xeAnchor)
      ])
    }
  },
  mounted () {
    const $xeAnchor = this

    $xeAnchor.$nextTick(() => {
      $xeAnchor.updateContainerElem()
    })
  },
  beforeDestroy () {
    const $xeAnchor = this

    $xeAnchor.removeContainerElemScroll()
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
