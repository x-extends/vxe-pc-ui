import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI, globalMixins } from '../../ui'

import type { VxeLayoutContainerPropTypes, LayoutContainerReactData, VxeLayoutContainerEmits, VxeComponentSizeType, ValueOf, VxeComponentIsVScrollbar } from '../../../types'

const { getConfig, baseUtils, createEvent } = VxeUI

const { getDefVal } = baseUtils

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeLayoutContainer',
  mixins: [
    globalMixins.sizeMixin,
    globalMixins.vScrollbarMixin
  ],
  props: {
    vertical: Boolean as PropType<VxeLayoutContainerPropTypes.Vertical>,
    useScrollbar: {
      type: Boolean as PropType<VxeLayoutContainerPropTypes.UseScrollbar>,
      default: () => getDefVal(getConfig().layoutContainer.useScrollbar, getConfig().useScrollbar)
    },
    size: {
      type: String as PropType<VxeLayoutContainerPropTypes.Size>,
      default: () => getConfig().layoutContainer.size || getConfig().size
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: LayoutContainerReactData = {
    }
    return {
      xID,
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
      computeIsVScrollbar(): VxeComponentIsVScrollbar
    })
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeLayoutContainerEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeLayoutContainer = this
      $xeLayoutContainer.$emit(type, createEvent(evnt, { $layoutContainer: $xeLayoutContainer }, params))
    },
    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeLayoutContainer = this
      const props = $xeLayoutContainer
      const slots = $xeLayoutContainer.$scopedSlots

      const { vertical } = props
      const vSize = $xeLayoutContainer.computeSize
      const defaultSlot = slots.default

      return h('div', {
        class: ['vxe-layout-container', {
          [`size--${vSize}`]: vSize,
          'is--vertical': vertical
        }]
      }, defaultSlot ? defaultSlot({}) : [])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
