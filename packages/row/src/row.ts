import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, globalMixins } from '../../ui'
import { toCssUnit } from '../../ui/src/dom'

import type { VxeRowPropTypes, RowReactData, VxeRowEmits, ValueOf } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeRow',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    gutter: [Number, String, Array] as PropType<VxeRowPropTypes.Gutter>,
    wrap: {
      type: Boolean as PropType<VxeRowPropTypes.Wrap>,
      default: () => getConfig().row.wrap
    },
    vertical: Boolean as PropType<VxeRowPropTypes.Vertical>,
    size: {
      type: String as PropType<VxeRowPropTypes.Size>,
      default: () => getConfig().row.size || getConfig().size
    }
  },
  provide () {
    const $xeRow = this
    return {
      $xeRow
    }
  },
  data () {
    const reactData: RowReactData = {
    }
    return {
      xID: XEUtils.uniqueId(),
      reactData
    }
  },
  computed: {
    computeRowStyle () {
      const $xeRow = this
      const props = $xeRow

      const { gutter, vertical } = props
      const style: Record<string, string | number> = {}
      if (gutter) {
        let [lrGutter, tbGutter] = XEUtils.isArray(gutter) ? gutter : [gutter]
        if (vertical) {
          tbGutter = lrGutter
          lrGutter = ''
        }
        if (lrGutter) {
          const offsetSize = XEUtils.isNumber(lrGutter) ? toCssUnit(-(lrGutter / 2)) : `calc(${toCssUnit(lrGutter)} / 2 * -1)`
          style.marginLeft = offsetSize
          style.marginRight = offsetSize
        }
        if (tbGutter) {
          const offsetSize = XEUtils.isNumber(tbGutter) ? toCssUnit(-(tbGutter / 2)) : `calc(${toCssUnit(tbGutter)} / 2 * -1)`
          style.marginTop = offsetSize
          style.marginBottom = offsetSize
        }
      }
      return style
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeRowEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeRow = this
      $xeRow.$emit(type, createEvent(evnt, { $row: $xeRow }, params))
    },
    clickEvent (evnt: Event) {
      const $xeRow = this
      $xeRow.dispatchEvent('click', {}, evnt)
    },
    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeRow = this
      const props = $xeRow
      const slots = $xeRow.$scopedSlots

      const { vertical, wrap } = props
      const rowStyle = $xeRow.computeRowStyle
      const defaultSlot = slots.default
      return h('div', {
        ref: 'refElem',
        class: ['vxe-row', {
          'is--vertical': vertical,
          'is--wrap': wrap
        }],
        style: rowStyle,
        on: {
          click: $xeRow.clickEvent
        }
      }, defaultSlot ? defaultSlot({}) : [])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
