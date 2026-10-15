import { ref, h, reactive, PropType, computed } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getSlotVNs } from '../../ui/src/vn'
import { getConfig, createEvent, useSize, renderEmptyElement } from '../../ui'
import { toCssUnit } from '../../ui/src/dom'
import { getDefaultConfig } from '../../ui/src/utils'
import VxeLoadingComponent from '../../loading'
import VxeScrollbarComponent from '../../scrollbar'

import type { CardReactData, VxeCardEmits, VxeCardPropTypes, CardPrivateRef, ValueOf, CardMethods, CardPrivateMethods, VxeCardPrivateComputed, VxeCardConstructor, VxeCardPrivateMethods } from '../../../types'

export default defineVxeComponent({
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
    },
    size: {
      type: String as PropType<VxeCardPropTypes.Size>,
      default: () => getConfig().card.size || getConfig().size
    },
    useScrollbar: {
      type: Boolean as PropType<VxeCardPropTypes.UseScrollbar>,
      default: () => getDefaultConfig(getConfig().card.useScrollbar, getConfig().useScrollbar)
    },
    scrollbarConfig: Object as PropType<VxeCardPropTypes.ScrollbarConfig>
  },
  emits: [
  ] as VxeCardEmits,
  setup (props, context) {
    const { slots, emit } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const { computeSize } = useSize(props)

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

    const computeScrollbarOpts = computed(() => {
      return Object.assign({}, getConfig().card.scrollbarConfig, props.scrollbarConfig)
    })

    const computeScrollbarProps = computed(() => {
      const scrollbarOpts = computeScrollbarOpts.value
      return {
        width: scrollbarOpts.width,
        height: scrollbarOpts.height,
        autoHide: scrollbarOpts.autoHide,
        visible: scrollbarOpts.visible,
        xConfig: scrollbarOpts.xConfig,
        yConfig: scrollbarOpts.yConfig,
        className: scrollbarOpts.className,
        viewAttrs: scrollbarOpts.viewAttrs
      }
    })

    const computeMaps: VxeCardPrivateComputed = {
      computeSize
    }

    const $xeCard = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeCardConstructor & VxeCardPrivateMethods

    const dispatchEvent = (type: ValueOf<VxeCardEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $card: $xeCard }, params))
    }

    const cardMethods: CardMethods = {
      dispatchEvent
    }

    const cardPrivateMethods: CardPrivateMethods = {
    }

    Object.assign($xeCard, cardMethods, cardPrivateMethods)

    const renderVN = () => {
      const { title, border, shadow, padding, loading, showTitleOverflow, useScrollbar } = props
      const defaultSlot = slots.default
      const headerSlot = slots.header
      const titleSlot = slots.title
      const extraSlot = slots.extra
      const footerSlot = slots.footer
      const leftSlot = slots.left
      const rightSlot = slots.right
      const vSize = computeSize.value
      const cardStyle = computeCardStyle.value
      const scrollbarOpts = computeScrollbarOpts.value
      const scrollbarProps = computeScrollbarProps.value
      const { viewClassName, viewInnerClassName } = scrollbarOpts

      return h('div', {
        ref: refElem,
        class: ['vxe-card', {
          [`size--${vSize}`]: vSize,
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
                  : renderEmptyElement($xeCard)
              ])
          : renderEmptyElement($xeCard),
        h('div', {
          class: 'vxe-card--body'
        }, [
          leftSlot
            ? (
                useScrollbar
                  ? h(VxeScrollbarComponent, {
                    class: 'vxe-card--body-scrollbar-left',
                    ...scrollbarProps,
                    viewClassName: 'vxe-card--body-scrollbar-left-view',
                    viewInnerClassName: 'vxe-card--body-scrollbar-left-inner'
                  }, {
                    default: () => getSlotVNs(leftSlot({}))
                  })
                  : h('div', {
                    class: 'vxe-card--body-left'
                  }, getSlotVNs(leftSlot({})))
              )
            : renderEmptyElement($xeCard),
          useScrollbar
            ? h(VxeScrollbarComponent, {
              class: 'vxe-card--body-scrollbar-content',
              ...scrollbarProps,
              viewClassName: 'vxe-card--body-scrollbar-content-view' + (viewClassName ? (' ' + viewClassName) : ''),
              viewInnerClassName: 'vxe-card--body-scrollbar-content-inner' + (viewClassName ? (' ' + viewInnerClassName) : '')
            }, {
              default: () => defaultSlot ? getSlotVNs(defaultSlot({})) : []
            })
            : h('div', {
              class: 'vxe-card--body-content'
            }, defaultSlot ? getSlotVNs(defaultSlot({})) : []),
          rightSlot
            ? (
                useScrollbar
                  ? h(VxeScrollbarComponent, {
                    class: 'vxe-card--body-scrollbar-right',
                    ...scrollbarProps,
                    viewClassName: 'vxe-card--body-scrollbar-right-view',
                    viewInnerClassName: 'vxe-card--body-scrollbar-right-inner'
                  }, {
                    default: () => getSlotVNs(rightSlot({}))
                  })
                  : h('div', {
                    class: 'vxe-card--body-right'
                  }, getSlotVNs(rightSlot({})))
              )
            : renderEmptyElement($xeCard)
        ]),
        footerSlot
          ? h('div', {
            class: 'vxe-card--footer'
          }, getSlotVNs(footerSlot({})))
          : renderEmptyElement($xeCard),
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
