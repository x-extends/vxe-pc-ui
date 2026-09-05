import { CreateElement, VNode, PropType } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, globalMixins } from '../../ui'

import type { VxeDividerEmits, ValueOf, VxeDividerPropTypes, VxeComponentSizeType } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeDivider',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    vertical: {
      type: Boolean as PropType<VxeDividerPropTypes.Vertical>,
      default: () => getConfig().divider.vertical
    },
    titleContent: {
      type: String as PropType<VxeDividerPropTypes.TitleContent>,
      default: () => getConfig().divider.titleContent
    },
    titleAlign: {
      type: String as PropType<VxeDividerPropTypes.TitleAlign>,
      default: () => getConfig().divider.titleAlign
    },
    size: {
      type: String as PropType<VxeDividerPropTypes.Size>,
      default: () => getConfig().divider.size || getConfig().size
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    return {
      xID
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
    dispatchEvent (type: ValueOf<VxeDividerEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeDivider = this
      $xeDivider.$emit(type, createEvent(evnt, { $divider: $xeDivider }, params))
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeDivider = this
      const props = $xeDivider
      const slots = $xeDivider.$scopedSlots

      const { vertical, titleContent, titleAlign } = props
      const vSize = $xeDivider.computeSize
      const titleSlot = slots.title
      return h('div', {
        ref: 'refElem',
        class: ['vxe-divider', vertical ? 'is--vertical' : 'is--horizontal', `t--align-${titleAlign || 'center'}`, {
          [`size--${vSize}`]: vSize
        }]
      }, titleContent && !vertical
        ? [
            h('span', {
              class: 'vxe-divider--content'
            }, titleSlot ? titleSlot({}) : titleContent)
          ]
        : [])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
