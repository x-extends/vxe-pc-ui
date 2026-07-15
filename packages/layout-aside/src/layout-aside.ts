import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { toCssUnit } from '../../ui/src/dom'
import { getConfig, createEvent, globalMixins } from '../../ui'
import VxeLoadingComponent from '../../loading'
import XEUtils from 'xe-utils'

import type { VxeLayoutAsidePropTypes, LayoutAsideReactData, VxeComponentSizeType, VxeLayoutAsideEmits, ValueOf, VxeComponentStyleType } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeLayoutAside',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    width: [String, Number] as PropType<VxeLayoutAsidePropTypes.Width>,
    collapsed: Boolean as PropType<VxeLayoutAsidePropTypes.Collapsed>,
    collapseWidth: [String, Number] as PropType<VxeLayoutAsidePropTypes.CollapseWidth>,
    loading: Boolean as PropType<VxeLayoutAsidePropTypes.Loading>,
    padding: Boolean as PropType<VxeLayoutAsidePropTypes.Padding>,
    collapseConfig: Object as PropType<VxeLayoutAsidePropTypes.CollapseConfig>,
    size: {
      type: String as PropType<VxeLayoutAsidePropTypes.Size>,
      default: () => getConfig().layoutAside.size || getConfig().size
    }
  },
  provide () {
    const $xeLayoutAside = this
    return {
      $xeLayoutAside
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: LayoutAsideReactData = {
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
    computeCollapseOpts () {
      const $xeLayoutAside = this
      const props = $xeLayoutAside

      return Object.assign({}, getConfig().layoutAside.collapseConfig, props.collapseConfig)
    },
    computeVarStyle () {
      const $xeLayoutAside = this
      const props = $xeLayoutAside

      const { width, collapseWidth } = props
      const stys: VxeComponentStyleType = {}
      if (collapseWidth) {
        stys['--vxe-ui-layout-aside-collapse-width'] = toCssUnit(collapseWidth)
      }
      if (width) {
        stys['--vxe-ui-layout-aside-default-width'] = toCssUnit(width)
      }
      return stys
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeLayoutAsideEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeLayoutAside = this
      $xeLayoutAside.$emit(type, createEvent(evnt, { $layoutAside: $xeLayoutAside }, params))
    },
    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeLayoutAside = this
      const props = $xeLayoutAside
      const slots = $xeLayoutAside.$scopedSlots

      const { collapsed, loading, padding } = props
      const varStyle = $xeLayoutAside.computeVarStyle
      const vSize = $xeLayoutAside.computeSize
      const collapseOpts = $xeLayoutAside.computeCollapseOpts
      const defaultSlot = slots.default

      return h('aside', {
        class: ['vxe-layout-aside', {
          [`size--${vSize}`]: vSize,
          'is--animat': collapseOpts.animation !== false,
          'is--padding': padding,
          'is--collapse': collapsed,
          'is--loading': loading
        }],
        style: varStyle
      }, [
        h('div', {
          class: 'vxe-layout-aside--inner'
        }, defaultSlot ? defaultSlot({}) : []),
        /**
         * 加载中
         */
        h(VxeLoadingComponent, {
          class: 'vxe-list-view--loading',
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
