import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { getConfig, createEvent, globalMixins, renderEmptyElement } from '../../ui'
import XEUtils from 'xe-utils'
import { getDefaultConfig } from '../../ui/src/utils'
import VxeLoadingComponent from '../../loading'
import VxeScrollbarComponent from '../../scrollbar'
import VxeUIBacktopComponent from '../../backtop'

import type { LayoutBodyInternalData, VxeLayoutBodyPropTypes, LayoutBodyReactData, VxeLayoutBodyEmits, VxeComponentSizeType, VxeComponentIsVScrollbar, ValueOf } from '../../../types'

function createInternalData (): LayoutBodyInternalData {
  return {}
}

function createReactData (): LayoutBodyReactData {
  return {}
}

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeLayoutBody',
  mixins: [
    globalMixins.sizeMixin,
    globalMixins.vScrollbarMixin
  ],
  props: {
    loading: Boolean as PropType<VxeLayoutBodyPropTypes.Loading>,
    padding: Boolean as PropType<VxeLayoutBodyPropTypes.Padding>,
    showBacktop: {
      type: Boolean as PropType<VxeLayoutBodyPropTypes.ShowBacktop>,
      default: () => getConfig().layoutBody.showBacktop
    },
    backtopConfig: Object as PropType<VxeLayoutBodyPropTypes.BacktopConfig>,
    useScrollbar: {
      type: Boolean as PropType<VxeLayoutBodyPropTypes.UseScrollbar>,
      default: () => getDefaultConfig(getConfig().layoutBody.useScrollbar, getConfig().useScrollbar)
    },
    scrollbarConfig: Object as PropType<VxeLayoutBodyPropTypes.ScrollbarConfig>,
    size: {
      type: String as PropType<VxeLayoutBodyPropTypes.Size>,
      default: () => getConfig().layoutBody.size || getConfig().size
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const backtopId = `vxe_layout_body_backtop_${xID}`
    const reactData = createReactData()
    return {
      ...({} as {
        internalData: LayoutBodyInternalData
      }),
      xID,
      backtopId,
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
      computeIsVScrollbar(): VxeComponentIsVScrollbar
    }),
    computeBacktopOpts () {
      const $xeLayoutBody = this
      const props = $xeLayoutBody
      const backtopId = ($xeLayoutBody as any).backtopId as string

      return Object.assign({}, getConfig().layoutBody.backtopConfig, props.backtopConfig, {
        target: '#' + backtopId
      })
    },
    computeScrollbarOpts () {
      const $xeLayoutBody = this
      const props = $xeLayoutBody

      return Object.assign({}, getConfig().layoutBody.scrollbarConfig, props.scrollbarConfig)
    },
    computeScrollbarProps () {
      const $xeLayoutBody = this
      const props = $xeLayoutBody
      const backtopId = ($xeLayoutBody as any).backtopId as string

      const { showBacktop } = props
      const scrollbarOpts = $xeLayoutBody.computeScrollbarOpts as VxeLayoutBodyPropTypes.ScrollbarConfig
      const { className, viewClassName, viewInnerClassName } = scrollbarOpts
      return {
        width: scrollbarOpts.width,
        height: scrollbarOpts.height,
        autoHide: scrollbarOpts.autoHide,
        visible: scrollbarOpts.visible,
        xConfig: scrollbarOpts.xConfig,
        yConfig: scrollbarOpts.yConfig,
        className: 'vxe-layout-body--scrollbar' + (className ? (' ' + className) : ''),
        viewAttrs: {
          ...scrollbarOpts.viewAttrs,
          id: showBacktop ? (backtopId || null) : null
        },
        viewClassName: 'vxe-layout-body--scrollbar-view' + (viewClassName ? (' ' + viewClassName) : ''),
        viewInnerClassName: 'vxe-layout-body--scrollbar-inner' + (viewInnerClassName ? (' ' + viewInnerClassName) : '')
      }
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeLayoutBodyEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeLayoutBody = this
      $xeLayoutBody.$emit(type, createEvent(evnt, { $layoutBody: $xeLayoutBody }, params))
    },
    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeLayoutBody = this
      const props = $xeLayoutBody
      const slots = $xeLayoutBody.$scopedSlots
      const backtopId = $xeLayoutBody.backtopId

      const { loading, padding, showBacktop } = props
      const isVScrollbar = $xeLayoutBody.computeIsVScrollbar
      const backtopOpts = $xeLayoutBody.computeBacktopOpts
      const scrollbarProps = $xeLayoutBody.computeScrollbarProps
      const vSize = $xeLayoutBody.computeSize
      const defaultSlot = slots.default
      const backtopSlot = slots.backtop
      const backtopTopSlot = slots.backtopTop || slots['backtop-top']
      const backtopBottomSlot = slots.backtopBottom || slots['backtop-bottom']
      const backtopScopeSlots: {
        default?: any
        top?: any
        bottom?: any
      } = {}
      if (backtopSlot) {
        backtopScopeSlots.default = backtopSlot
      }
      if (backtopTopSlot) {
        backtopScopeSlots.top = backtopTopSlot
      }
      if (backtopBottomSlot) {
        backtopScopeSlots.bottom = backtopBottomSlot
      }
      return h('div', {
        class: ['vxe-layout-body', {
          [`size--${vSize}`]: vSize,
          'is--loading': loading,
          'is--padding': padding
        }]
      }, [
        isVScrollbar
          ? h(VxeScrollbarComponent, {
            props: scrollbarProps,
            scopedSlots: {
              default: () => defaultSlot ? defaultSlot({}) : []
            }
          })
          : h('div', {
            attrs: {
              id: showBacktop ? backtopId : ''
            },
            class: 'vxe-layout-body--inner'
          }, defaultSlot ? defaultSlot({}) : []),
        /**
         * 加载中
         */
        h(VxeLoadingComponent, {
          class: 'vxe-layout-body-view--loading',
          props: {
            value: loading
          }
        }),
        /**
         * 回到顶部
         */
        showBacktop
          ? h(VxeUIBacktopComponent, {
            props: backtopOpts,
            scopedSlots: backtopScopeSlots
          })
          : renderEmptyElement($xeLayoutBody)
      ])
    }
  },
  created () {
    const $xeLayoutBody = this

    $xeLayoutBody.internalData = createInternalData()
  },
  beforeDestroy () {
    const $xeLayoutBody = this
    const reactData = $xeLayoutBody.reactData
    const internalData = $xeLayoutBody.internalData

    XEUtils.assign(reactData, createReactData())
    XEUtils.assign(internalData, createInternalData())
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
