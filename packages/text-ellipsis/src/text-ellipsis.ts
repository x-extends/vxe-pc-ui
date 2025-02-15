import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, renderEmptyElement, globalMixins } from '../../ui'

import type { VxeTextEllipsisPropTypes, TextEllipsisReactData, VxeTextEllipsisEmits, VxeComponentSizeType, ValueOf, VxeComponentPermissionInfo } from '../../../types'

export default defineVxeComponent({
  name: 'VxeTextEllipsis',
  mixins: [
    globalMixins.sizeMixin,
    globalMixins.permissionMixin
  ],
  props: {
    href: String as PropType<VxeTextEllipsisPropTypes.Href>,
    target: String as PropType<VxeTextEllipsisPropTypes.Target>,
    content: [String, Number] as PropType<VxeTextEllipsisPropTypes.Content>,
    lineClamp: [String, Number] as PropType<VxeTextEllipsisPropTypes.LineClamp>,
    status: String as PropType<VxeTextEllipsisPropTypes.Status>,
    title: [String, Number] as PropType<VxeTextEllipsisPropTypes.Title>,
    loading: Boolean as PropType<VxeTextEllipsisPropTypes.Loading>,
    offsetLength: [String, Number] as PropType<VxeTextEllipsisPropTypes.OffsetLength>,
    routerLink: Object as PropType<VxeTextEllipsisPropTypes.RouterLink>,
    underline: {
      type: Boolean as PropType<VxeTextEllipsisPropTypes.Underline>,
      default: () => getConfig().textEllipsis.underline
    },
    /**
     * 权限码
     */
    permissionCode: [String, Number] as PropType<VxeTextEllipsisPropTypes.PermissionCode>,
    size: {
      type: String as PropType<VxeTextEllipsisPropTypes.Size>,
      default: () => getConfig().textEllipsis.size || getConfig().size
    }
  },
  data () {
    const reactData: TextEllipsisReactData = {
      resizeObserver: null,
      visibleLen: 0
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
    }),
    computeTextLineClamp () {
      const $xeTextEllipsis = this
      const props = $xeTextEllipsis

      return XEUtils.toNumber(props.lineClamp)
    },
    computeTextContent () {
      const $xeTextEllipsis = this
      const props = $xeTextEllipsis

      return XEUtils.toValueString(props.content)
    },
    computeTextOffsetLength () {
      const $xeTextEllipsis = this
      const props = $xeTextEllipsis

      return props.offsetLength ? XEUtils.toNumber(props.offsetLength) : 0
    },
    computeVisibleContent () {
      const $xeTextEllipsis = this
      const reactData = $xeTextEllipsis.reactData as TextEllipsisReactData

      const { visibleLen } = reactData
      const textLineClamp = $xeTextEllipsis.computeTextLineClamp as number
      const textContent = $xeTextEllipsis.computeTextContent as string
      const textOffsetLength = $xeTextEllipsis.computeTextOffsetLength as number
      if (textLineClamp > 1) {
        if (textContent.length > visibleLen) {
          return `${textContent.slice(0, Math.max(1, visibleLen - 3 + textOffsetLength))}...`
        }
        return textContent
      }
      return textContent
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeTextEllipsisEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeTextEllipsis = this
      $xeTextEllipsis.$emit(type, createEvent(evnt, { $text: $xeTextEllipsis }, params))
    },
    calculateFont  (targetWidth: number) {
      const $xeTextEllipsis = this
      const reactData = $xeTextEllipsis.reactData

      const el = $xeTextEllipsis.$refs.refElem as HTMLDivElement
      const ryEl = $xeTextEllipsis.$refs.realityElem as HTMLDivElement
      if (el && ryEl) {
        let fontSize = 12
        try {
          fontSize = Math.max(10, XEUtils.toNumber(getComputedStyle(ryEl).fontSize))
        } catch (e) {}
        const textContent = $xeTextEllipsis.computeTextContent
        let currIndex = Math.floor((targetWidth) / fontSize)
        let currStr = textContent.slice(0, currIndex)
        ryEl.textContent = currStr
        reactData.visibleLen = currStr.length
        let maxCount = 0
        while (targetWidth > ryEl.clientWidth && maxCount < 30) {
          maxCount++
          const offsetIndex = Math.floor((targetWidth - ryEl.clientWidth) / fontSize)
          if (offsetIndex) {
            currIndex += offsetIndex
            currStr = textContent.slice(0, currIndex)
            ryEl.textContent = currStr
            reactData.visibleLen = currStr.length
          } else {
            break
          }
        }
        ryEl.textContent = ''
        ryEl.style.display = ''
        ryEl.style.position = ''
        ryEl.style.top = ''
        ryEl.style.left = ''
      }
    },
    updateStyle  () {
      const $xeTextEllipsis = this
      const reactData = $xeTextEllipsis.reactData

      const el = $xeTextEllipsis.$refs.refElem as HTMLDivElement
      const ryEl = $xeTextEllipsis.$refs.realityElem as HTMLDivElement
      const textContent = $xeTextEllipsis.computeTextContent
      const textLineClamp = $xeTextEllipsis.computeTextLineClamp
      if (el && ryEl) {
        const cWidth = el.clientWidth
        ryEl.style.display = 'block'
        ryEl.style.position = 'absolute'
        ryEl.style.top = '-3000px'
        ryEl.style.left = '-3000px'
        ryEl.textContent = textContent
        const sWidth = ryEl.offsetWidth
        const targetWidth = Math.floor(cWidth * textLineClamp)
        if (targetWidth > sWidth) {
          reactData.visibleLen = textContent.length
        } else {
          $xeTextEllipsis.calculateFont(targetWidth)
        }
      } else {
        reactData.visibleLen = textContent.length
      }
    },
    clickEvent () {
      const $xeTextEllipsis = this

      $xeTextEllipsis.$emit('click', {})
    },
    initObserver () {
      const $xeTextEllipsis = this
      const reactData = $xeTextEllipsis.reactData

      const { resizeObserver } = reactData
      const textLineClamp = $xeTextEllipsis.computeTextLineClamp
      if (!resizeObserver) {
        const el = $xeTextEllipsis.$refs.refElem as HTMLDivElement
        if (el && textLineClamp > 1) {
          if (window.ResizeObserver) {
            const observerObj = new window.ResizeObserver(XEUtils.throttle(() => {
              $xeTextEllipsis.updateStyle()
            }, 300, { leading: true, trailing: true }))
            observerObj.observe(el)
            reactData.resizeObserver = observerObj
          }
        }
      }
    },

    //
    // Render
    //
    renderContent (h: CreateElement) {
      const $xeTextEllipsis = this
      const props = $xeTextEllipsis

      const { routerLink, href, target, title } = props
      const visibleContent = $xeTextEllipsis.computeVisibleContent
      if (routerLink) {
        return h('router-link', {
          class: 'vxe-text-ellipsis--link',
          props: {
            title,
            target,
            custom: true
          }
        }, visibleContent)
      }
      if (href) {
        return h('a', {
          class: 'vxe-text-ellipsis--link',
          attrs: {
            href,
            target,
            title
          }
        }, visibleContent)
      }
      return h('span', {
        class: 'vxe-text-ellipsis--content'
      }, visibleContent)
    },
    renderVN (h: CreateElement): VNode {
      const $xeTextEllipsis = this
      const props = $xeTextEllipsis

      const { loading, status, title, underline } = props
      const permissionInfo = $xeTextEllipsis.computePermissionInfo
      const vSize = $xeTextEllipsis.computeSize
      const textLineClamp = $xeTextEllipsis.computeTextLineClamp

      if (!permissionInfo.visible) {
        return renderEmptyElement($xeTextEllipsis)
      }

      return h('div', {
        ref: 'refElem',
        class: ['vxe-text-ellipsis', textLineClamp > 1 ? 'is--multi' : 'is--single', {
          [`size--${vSize}`]: vSize,
          [`theme--${status}`]: status,
          'is--underline': underline,
          'is--loading': loading
        }],
        attrs: {
          title
        },
        on: {
          click: $xeTextEllipsis.clickEvent
        }
      }, [
        h('span', {
          ref: 'realityElem',
          class: 'vxe-text-ellipsis--reality'
        }),
        $xeTextEllipsis.renderContent(h)
      ])
    }
  },
  watch: {
    content () {
      const $xeTextEllipsis = this

      $xeTextEllipsis.updateStyle()
    },
    lineClamp () {
      const $xeTextEllipsis = this

      $xeTextEllipsis.initObserver()
      $xeTextEllipsis.updateStyle()
    }
  },
  mounted () {
    const $xeTextEllipsis = this

    $xeTextEllipsis.initObserver()
    $xeTextEllipsis.updateStyle()
  },
  beforeDestroy () {
    const $xeTextEllipsis = this
    const reactData = $xeTextEllipsis.reactData

    const { resizeObserver } = reactData
    const el = $xeTextEllipsis.$refs.refElem as HTMLDivElement
    const ryEl = $xeTextEllipsis.$refs.realityElem as HTMLDivElement
    if (ryEl) {
      ryEl.textContent = ''
    }
    if (resizeObserver) {
      if (el) {
        resizeObserver.unobserve(el)
      }
      resizeObserver.disconnect()
      reactData.resizeObserver = null
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
