import { defineComponent, ref, h, reactive, PropType, createCommentVNode, computed } from 'vue'
import { getSlotVNs } from '../../ui/src/vn'
import { getConfig, createEvent } from '../../ui'
import { toCssUnit } from '../..//ui/src/dom'
import VxeLoadingComponent from '../../loading/src/loading'
import XEUtils from 'xe-utils'

import type { CardReactData, VxeCardEmits, VxeCardPropTypes, CardPrivateRef, CardMethods, CardPrivateMethods, VxeCardPrivateComputed, VxeCardConstructor, VxeCardPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeCard',
  props: {
    title: String as PropType<VxeCardPropTypes.Title>,
    showTitleOverflow: {
      type: Boolean as PropType<VxeCardPropTypes.ShowTitleOverflow>,
      default: () => getConfig().card.showTitleOverflow
    },
    width: [String, Number] as PropType<VxeCardPropTypes.Width>,
    height: [String, Number] as PropType<VxeCardPropTypes.Height>,
    border: {
      type: Boolean as PropType<VxeCardPropTypes.Border>,
      default: () => getConfig().card.border
    },
    loading: Boolean as PropType<VxeCardPropTypes.Loading>,
    shadow: {
      type: Boolean as PropType<VxeCardPropTypes.Shadow>,
      default: () => getConfig().card.shadow
    },
    padding: {
      type: Boolean as PropType<VxeCardPropTypes.Padding>,
      default: () => getConfig().card.padding
    }
  },
  emits: [
  ] as VxeCardEmits,
  setup (props, context) {
    const { slots, emit } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<CardReactData>({
    })

    const refMaps: CardPrivateRef = {
      refElem
    }

    const computeCardStyle = computed(() => {
      const { height, width } = props
      const stys: Record<string, string> = {}
      if (width) {
        stys.width = toCssUnit(width)
      }
      if (height) {
        stys.height = toCssUnit(height)
      }
      return stys
    })

    const computeMaps: VxeCardPrivateComputed = {
    }

    const $xeCard = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeCardConstructor & VxeCardPrivateMethods

    const cardMethods: CardMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, createEvent(evnt, { $card: $xeCard }, params))
      }
    }

    const cardPrivateMethods: CardPrivateMethods = {
    }

    Object.assign($xeCard, cardMethods, cardPrivateMethods)

    const renderVN = () => {
      const { title, border, shadow, padding, loading, showTitleOverflow } = props
      const defaultSlot = slots.default
      const headerSlot = slots.header
      const titleSlot = slots.title
      const extraSlot = slots.extra
      const footerSlot = slots.footer
      const leftSlot = slots.left
      const rightSlot = slots.right
      const cardStyle = computeCardStyle.value

      return h('div', {
        ref: refElem,
        class: ['vxe-card', {
          'is--border': border,
          'is--shadow': shadow,
          'is--padding': padding
        }],
        style: cardStyle
      }, [
        title || titleSlot || headerSlot
          ? h('div', {
            class: 'vxe-card--header'
          }, headerSlot
            ? getSlotVNs(headerSlot({}))
            : [
                h('div', {
                  class: ['vxe-card--header-title', {
                    'is--ellipsis': showTitleOverflow
                  }]
                }, titleSlot ? getSlotVNs(titleSlot({})) : `${title || ''}`),
                extraSlot
                  ? h('div', {
                    class: 'vxe-card--header-extra'
                  }, getSlotVNs(extraSlot({})))
                  : createCommentVNode()
              ])
          : createCommentVNode(),
        h('div', {
          class: 'vxe-card--body'
        }, [
          leftSlot
            ? h('div', {
              class: 'vxe-card--body-left'
            }, getSlotVNs(leftSlot({})))
            : createCommentVNode(),
          h('div', {
            class: 'vxe-card--body-content'
          }, defaultSlot ? getSlotVNs(defaultSlot({})) : []),
          rightSlot
            ? h('div', {
              class: 'vxe-card--body-right'
            }, getSlotVNs(rightSlot({})))
            : createCommentVNode()
        ]),
        footerSlot
          ? h('div', {
            class: 'vxe-card--footer'
          }, getSlotVNs(footerSlot({})))
          : createCommentVNode(),
        /**
         * 加载中
         */
        h(VxeLoadingComponent, {
          class: 'vxe-card--loading',
          modelValue: loading
        })
      ])
    }

    $xeCard.renderVN = renderVN

    return $xeCard
  },
  render () {
    return this.renderVN()
  }
})
