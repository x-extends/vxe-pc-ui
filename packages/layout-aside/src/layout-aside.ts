import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { toCssUnit } from '../../ui/src/dom'
import { getConfig, createEvent, globalMixins } from '../../ui'
import VxeLoadingComponent from '../../loading/src/loading'
import XEUtils from 'xe-utils'

import type { VxeLayoutAsidePropTypes, LayoutAsideReactData, VxeComponentSizeType, VxeLayoutAsideEmits, ValueOf } from '../../../types'

export default defineVxeComponent({
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
    const reactData: LayoutAsideReactData = {
    }
    return {
      xID: XEUtils.uniqueId(),
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
    }),
    computeWrapperWidth () {
      const $xeLayoutAside = this
      const props = $xeLayoutAside

      const { width, collapsed, collapseWidth } = props
      if (collapsed) {
        if (collapseWidth) {
          return toCssUnit(collapseWidth)
        }
      } else {
        if (width) {
          return toCssUnit(width)
        }
      }
      return ''
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

      const { width, collapsed, loading, padding } = props
      const wrapperWidth = $xeLayoutAside.computeWrapperWidth
      const vSize = $xeLayoutAside.computeSize
      const defaultSlot = slots.default

      return h('aside', {
        class: ['vxe-layout-aside', {
          [`size--${vSize}`]: vSize,
          'is--padding': padding,
          'is--default-width': !width,
          'is--collapse': collapsed,
          'is--loading': loading
        }],
        style: wrapperWidth
          ? {
              width: wrapperWidth
            }
          : {}
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
})
