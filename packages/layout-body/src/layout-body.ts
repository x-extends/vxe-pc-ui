import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { getConfig, createEvent, globalMixins, renderEmptyElement } from '../../ui'
import VxeLoadingComponent from '../../loading'
import VxeUIBacktopComponent from '../../backtop'
import XEUtils from 'xe-utils'

import type { LayoutBodyInternalData, VxeLayoutBodyPropTypes, LayoutBodyReactData, VxeLayoutBodyEmits, VxeComponentSizeType, ValueOf } from '../../../types'

function createInternalData (): LayoutBodyInternalData {
  return {}
}

function createReactData (): LayoutBodyReactData {
  return {}
}

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeLayoutBody',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    loading: Boolean as PropType<VxeLayoutBodyPropTypes.Loading>,
    padding: Boolean as PropType<VxeLayoutBodyPropTypes.Padding>,
    showBacktop: {
      type: Boolean as PropType<VxeLayoutBodyPropTypes.ShowBacktop>,
      default: () => getConfig().layoutBody.showBacktop
    },
    backtopConfig: Object as PropType<VxeLayoutBodyPropTypes.BacktopConfig>,
    size: {
      type: String as PropType<VxeLayoutBodyPropTypes.Size>,
      default: () => getConfig().layoutBody.size || getConfig().size
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const backtopId = `vxe_layout_body_backtop_${xID}`
    const internalData = createInternalData()
    const reactData = createReactData()
    return {
      xID,
      backtopId,
      internalData,
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
    }),
    computeBacktopOpts () {
      const $xeLayoutBody = this
      const props = $xeLayoutBody
      const backtopId = ($xeLayoutBody as any).backtopId as string

      return Object.assign({}, getConfig().layoutBody.backtopConfig, props.backtopConfig, {
        target: '#' + backtopId
      })
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
      const backtopOpts = $xeLayoutBody.computeBacktopOpts
      const vSize = $xeLayoutBody.computeSize
      const defaultSlot = slots.default
      const backtopSlot = slots.backtop
      return h('div', {
        class: ['vxe-layout-body', {
          [`size--${vSize}`]: vSize,
          'is--loading': loading,
          'is--padding': padding
        }]
      }, [
        h('div', {
          attrs: {
            id: showBacktop ? backtopId : ''
          },
          class: 'vxe-layout-body--inner'
        }, defaultSlot ? defaultSlot({}) : []),
        /**
         * 加载中
         */
        h(VxeLoadingComponent, {
          class: 'vxe-list-view--loading',
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
            scopedSlots: backtopSlot
              ? {
                  default: backtopSlot
                }
              : undefined
          })
          : renderEmptyElement($xeLayoutBody)
      ])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
