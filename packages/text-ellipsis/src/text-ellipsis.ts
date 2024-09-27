import { defineComponent, ref, h, PropType, watch, computed, reactive, onMounted, onBeforeUnmount } from 'vue'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, useSize } from '../../ui'

import type { TextEllipsisReactData, VxeTextEllipsisEmits, VxeTextEllipsisPropTypes, TextEllipsisMethods, TextEllipsisPrivateMethods, ValueOf, TextEllipsisPrivateRef, VxeTextEllipsisPrivateComputed, VxeTextEllipsisConstructor, VxeTextEllipsisPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeTextEllipsis',
  props: {
    content: [String, Number] as PropType<VxeTextEllipsisPropTypes.Content>,
    lineClamp: [String, Number] as PropType<VxeTextEllipsisPropTypes.LineClamp>,
    status: String as PropType<VxeTextEllipsisPropTypes.Status>,
    title: [String, Number] as PropType<VxeTextEllipsisPropTypes.Title>,
    loading: Boolean as PropType<VxeTextEllipsisPropTypes.Loading>,
    offsetLength: [String, Number] as PropType<VxeTextEllipsisPropTypes.OffsetLength>,
    size: {
      type: String as PropType<VxeTextEllipsisPropTypes.Size>,
      default: () => getConfig().textEllipsis.size || getConfig().size
    }
  },
  emits: [
    'click'
  ] as VxeTextEllipsisEmits,
  setup (props, context) {
    const { emit } = context

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const refElem = ref<HTMLDivElement>()
    const realityElem = ref<HTMLDivElement>()

    const reactData = reactive<TextEllipsisReactData>({
      resizeObserver: null,
      visibleLen: 0
    })

    const refMaps: TextEllipsisPrivateRef = {
      refElem
    }

    const computeTextLineClamp = computed(() => {
      return XEUtils.toNumber(props.lineClamp)
    })

    const computeTextContent = computed(() => {
      return XEUtils.toValueString(props.content)
    })

    const computeTextOffsetLength = computed(() => {
      return props.offsetLength ? XEUtils.toNumber(props.offsetLength) : 0
    })

    const computeVisibleContent = computed(() => {
      const { visibleLen } = reactData
      const textLineClamp = computeTextLineClamp.value
      const textContent = computeTextContent.value
      const textOffsetLength = computeTextOffsetLength.value
      if (textLineClamp > 1) {
        if (textContent.length > visibleLen) {
          return `${textContent.slice(0, Math.max(1, visibleLen - 3 + textOffsetLength))}...`
        }
        return textContent
      }
      return textContent
    })

    const computeMaps: VxeTextEllipsisPrivateComputed = {
    }

    const $xeTextEllipsis = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeTextEllipsisConstructor & VxeTextEllipsisPrivateMethods

    const dispatchEvent = (type: ValueOf<VxeTextEllipsisEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $textEllipsis: $xeTextEllipsis }, params))
    }

    const calculateFont = (targetWidth: number) => {
      const el = refElem.value
      const ryEl = realityElem.value
      if (el && ryEl) {
        let fontSize = 10
        try {
          fontSize = Math.max(10, XEUtils.toNumber(getComputedStyle(ryEl).fontSize))
        } catch (e) {}
        const ctextContent = computeTextContent.value
        let currIndex = Math.floor((targetWidth) / fontSize)
        let currStr = ctextContent.slice(0, currIndex)
        ryEl.textContent = currStr
        reactData.visibleLen = currStr.length
        let maxCount = 0
        while (targetWidth > ryEl.clientWidth && maxCount < 30) {
          maxCount++
          const offsetIndex = Math.floor((targetWidth - ryEl.clientWidth) / fontSize)
          if (offsetIndex) {
            currIndex += offsetIndex
            currStr = ctextContent.slice(0, currIndex)
            ryEl.textContent = currStr
            reactData.visibleLen = currStr.length
          } else {
            break
          }
        }
        Object.assign(ryEl.style, {
          display: '',
          position: '',
          top: '',
          left: ''
        })
        ryEl.textContent = ''
      }
    }

    const updateStyle = () => {
      const el = refElem.value
      const ryEl = realityElem.value
      const textContent = computeTextContent.value
      const textLineClamp = computeTextLineClamp.value
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
          calculateFont(targetWidth)
        }
      } else {
        reactData.visibleLen = textContent.length
      }
    }

    const textEllipsisMethods: TextEllipsisMethods = {
      dispatchEvent
    }

    const clickEvent = () => {
      emit('click', {})
    }

    const initObserver = () => {
      const { resizeObserver } = reactData
      const textLineClamp = computeTextLineClamp.value
      if (!resizeObserver) {
        const el = refElem.value
        if (el && textLineClamp > 1) {
          if (window.ResizeObserver) {
            const observerObj = new window.ResizeObserver(() => {
              updateStyle()
            })
            observerObj.observe(el)
            reactData.resizeObserver = observerObj
          }
        }
      }
    }

    const textEllipsisPrivateMethods: TextEllipsisPrivateMethods = {
    }

    Object.assign($xeTextEllipsis, textEllipsisMethods, textEllipsisPrivateMethods)

    const renderVN = () => {
      const { loading, status, title } = props
      const vSize = computeSize.value
      const visibleContent = computeVisibleContent.value
      const textLineClamp = computeTextLineClamp.value

      return h('div', {
        ref: refElem,
        class: ['vxe-text-ellipsis', textLineClamp > 1 ? 'is--multi' : 'is--single', {
          [`size--${vSize}`]: vSize,
          [`theme--${status}`]: status,
          'is--loading': loading
        }],
        title,
        onClick: clickEvent
      }, [
        h('span', {
          ref: realityElem,
          class: 'vxe-text-ellipsis-reality'
        }),
        h('span', {
          class: 'vxe-text-ellipsis-content'
        }, visibleContent)
      ])
    }

    watch(() => props.content, () => {
      updateStyle()
    })

    watch(() => props.lineClamp, () => {
      initObserver()
      updateStyle()
    })

    onMounted(() => {
      initObserver()
      updateStyle()
    })

    onBeforeUnmount(() => {
      const { resizeObserver } = reactData
      if (resizeObserver) {
        resizeObserver.disconnect()
        reactData.resizeObserver = null
      }
    })

    $xeTextEllipsis.renderVN = renderVN

    return $xeTextEllipsis
  },
  render () {
    return this.renderVN()
  }
})
