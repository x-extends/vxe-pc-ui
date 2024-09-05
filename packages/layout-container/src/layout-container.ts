import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, globalMixins, createEvent } from '../../ui'

import type { VxeLayoutContainerPropTypes, LayoutContainerReactData, VxeLayoutContainerEmits, VxeComponentSizeType, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxeLayoutContainer',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    vertical: Boolean as PropType<VxeLayoutContainerPropTypes.Vertical>,
    size: {
      type: String as PropType<VxeLayoutContainerPropTypes.Size>,
      default: () => getConfig().layoutContainer.size || getConfig().size
    }
  },
  data () {
    const reactData: LayoutContainerReactData = {
    }
    return {
      xID: XEUtils.uniqueId(),
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
    })
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeLayoutContainerEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeLayoutContainer = this
      this.$emit(type, createEvent(evnt, { $layoutContainer: $xeLayoutContainer }, params))
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
})
