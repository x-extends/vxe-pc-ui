import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, globalMixins } from '../../ui'
import { toCssUnit } from '../../ui/src/dom'

import type { ColReactData, VxeColPropTypes, VxeColEmits, VxeRowConstructor, VxeRowPrivateMethods, VxeComponentSizeType, ValueOf } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeCol',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    span: [Number, String] as PropType<VxeColPropTypes.Span>,
    align: String as PropType<VxeColPropTypes.Align>,
    width: [Number, String] as PropType<VxeColPropTypes.Width>,
    fill: Boolean as PropType<VxeColPropTypes.Fill>,
    ellipsis: Boolean as PropType<VxeColPropTypes.Ellipsis>,
    size: {
      type: String as PropType<VxeColPropTypes.Size>,
      default: () => getConfig().col.size || getConfig().size
    }
  },
  inject: {
    $xeRow: {
      default: null
    }
  },
  data () {
    const reactData: ColReactData = {
    }
    return {
      xID: XEUtils.uniqueId(),
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
      $xeRow(): VxeRowConstructor & VxeRowPrivateMethods
    }),
    computeRowGutter () {
      const $xeCol = this
      const $xeRow = $xeCol.$xeRow

      if ($xeRow) {
        return $xeRow.gutter
      }
      return null
    },
    computeRowVertical () {
      const $xeCol = this
      const $xeRow = $xeCol.$xeRow

      if ($xeRow) {
        return $xeRow.vertical
      }
      return null
    },
    computeColStyle () {
      const $xeCol = this
      const props = $xeCol

      const { width } = props
      const rowGutter = $xeCol.computeRowGutter
      const rowVertical = $xeCol.computeRowVertical
      const style: Record<string, string | number> = {}
      if (rowGutter) {
        let [lrGutter, tbGutter] = XEUtils.isArray(rowGutter) ? rowGutter : [rowGutter]
        if (rowVertical) {
          tbGutter = lrGutter
          lrGutter = ''
        }
        if (lrGutter) {
          const padding = XEUtils.isNumber(lrGutter) ? toCssUnit(lrGutter / 2) : `calc(${toCssUnit(lrGutter)} / 2)`
          style.paddingLeft = padding
          style.paddingRight = padding
        }
        if (tbGutter) {
          const padding = XEUtils.isNumber(tbGutter) ? toCssUnit(tbGutter / 2) : `calc(${toCssUnit(tbGutter)} / 2)`
          style.paddingTop = padding
          style.paddingBottom = padding
        }
      }
      if (width) {
        style.width = toCssUnit(width)
      }
      return style
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeColEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeCol = this
      $xeCol.$emit(type, createEvent(evnt, { $col: $xeCol }, params))
    },
    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeCol = this
      const props = $xeCol
      const slots = $xeCol.$scopedSlots

      const { span, fill, align, width, ellipsis } = props
      const colStyle = $xeCol.computeColStyle
      const defaultSlot = slots.default
      return h('div', {
        ref: 'refElem',
        class: ['vxe-col', span ? `span${span}` : '', align ? `align--${align}` : '', {
          'is--span': !!span,
          'is--width': !!width,
          'is--fill': fill,
          'is--ellipsis': ellipsis
        }],
        style: colStyle
      }, [
        h('div', {
          class: 'vxe-col--inner'
        }, defaultSlot ? defaultSlot({}) : [])
      ])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
