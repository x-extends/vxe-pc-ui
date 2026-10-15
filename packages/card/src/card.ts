import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, globalMixins, renderEmptyElement } from '../../ui'
import { toCssUnit } from '../../ui/src/dom'
import { getDefaultConfig } from '../../ui/src/utils'
import { getSlotVNs } from '../../ui/src/vn'
import VxeLoadingComponent from '../../loading'
import VxeScrollbarComponent from '../../scrollbar'

import type { CardReactData, VxeCardEmits, VxeCardPropTypes, ValueOf, VxeComponentSizeType } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeCard',
  mixins: [
    globalMixins.sizeMixin
  ],
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
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: CardReactData = {
    }
    return {
      xID,
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
    }),
    computeCardStyle () {
      const $xeCard = this
      const props = $xeCard

      const { height, width } = props
      const stys: Record<string, string> = {}
      if (width) {
        stys.width = toCssUnit(width)
      }
      if (height) {
        stys.height = toCssUnit(height)
      }
      return stys
    },
    computeScrollbarOpts () {
      const $xeCard = this
      const props = $xeCard

      return Object.assign({}, getConfig().card.scrollbarConfig, props.scrollbarConfig)
    },
    computeScrollbarProps () {
      const $xeCard = this

      const scrollbarOpts = $xeCard.computeScrollbarOpts as VxeCardPropTypes.ScrollbarConfig
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
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeCardEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeCard = this
      $xeCard.$emit(type, createEvent(evnt, { $card: $xeCard }, params))
    },
    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeCard = this
      const props = $xeCard
      const slots = $xeCard.$scopedSlots

      const { title, border, shadow, padding, loading, showTitleOverflow, useScrollbar } = props
      const defaultSlot = slots.default
      const headerSlot = slots.header
      const titleSlot = slots.title
      const extraSlot = slots.extra
      const footerSlot = slots.footer
      const leftSlot = slots.left
      const rightSlot = slots.right
      const vSize = $xeCard.computeSize
      const cardStyle = $xeCard.computeCardStyle
      const scrollbarOpts = $xeCard.computeScrollbarOpts
      const scrollbarProps = $xeCard.computeScrollbarProps
      const { viewClassName, viewInnerClassName } = scrollbarOpts

      return h('div', {
        ref: 'refElem',
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
                    props: {
                      ...scrollbarProps,
                      viewClassName: 'vxe-card--body-scrollbar-left-view',
                      viewInnerClassName: 'vxe-card--body-scrollbar-left-inner'
                    },
                    scopedSlots: {
                      default: () => getSlotVNs(leftSlot({}))
                    }
                  })
                  : h('div', {
                    class: 'vxe-card--body-left'
                  }, getSlotVNs(leftSlot({})))
              )
            : renderEmptyElement($xeCard),
          useScrollbar
            ? h(VxeScrollbarComponent, {
              class: 'vxe-card--body-scrollbar-content',
              props: {
                ...scrollbarProps,
                viewClassName: 'vxe-card--body-scrollbar-content-view' + (viewClassName ? (' ' + viewClassName) : ''),
                viewInnerClassName: 'vxe-card--body-scrollbar-content-inner' + (viewClassName ? (' ' + viewInnerClassName) : '')
              },
              scopedSlots: {
                default: () => defaultSlot ? getSlotVNs(defaultSlot({})) : []
              }
            })
            : h('div', {
              class: 'vxe-card--body-content'
            }, defaultSlot ? getSlotVNs(defaultSlot({})) : []),
          rightSlot
            ? (
                useScrollbar
                  ? h(VxeScrollbarComponent, {
                    class: 'vxe-card--body-scrollbar-right',
                    props: {
                      ...scrollbarProps,
                      viewClassName: 'vxe-card--body-scrollbar-right-view',
                      viewInnerClassName: 'vxe-card--body-scrollbar-right-inner'
                    },
                    scopedSlots: {
                      default: () => getSlotVNs(rightSlot({}))
                    }
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
          props: {
            value: loading
          }
        })
      ])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
