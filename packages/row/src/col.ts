import { defineComponent, ref, h, reactive, computed, inject } from 'vue'
import XEUtils from 'xe-utils'
import { toCssUnit } from '../../ui/src/dom'

import type { ColReactData, ColPrivateRef, VxeColPrivateComputed, VxeColConstructor, VxeColPrivateMethods, VxeRowConstructor, VxeRowPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeCol',
  props: {
    span: [Number, String],
    align: String,
    width: [Number, String],
    fill: Boolean,
    ellipsis: Boolean
  },
  emits: [],
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<ColReactData>({
    })

    const refMaps: ColPrivateRef = {
      refElem
    }

    const $xeRow = inject<(VxeRowConstructor & VxeRowPrivateMethods) | null>('$xeRow', null)

    const computeRowGutter = computed(() => {
      if ($xeRow) {
        return $xeRow.props.gutter
      }
      return null
    })

    const computeRowVertical = computed(() => {
      if ($xeRow) {
        return $xeRow.props.vertical
      }
      return null
    })

    const computeColStyle = computed(() => {
      const { width } = props
      const rowGutter = computeRowGutter.value
      const rowVertical = computeRowVertical.value
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
    })

    const computeMaps: VxeColPrivateComputed = {
    }

    const $xeCol = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeColConstructor & VxeColPrivateMethods

    const renderVN = () => {
      const { span, fill, align, ellipsis } = props
      const colStyle = computeColStyle.value
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: ['vxe-col', span ? `span${span}` : '', align ? `align--${align}` : '', {
          'is--span': span,
          'is--fill': fill,
          'is--ellipsis': ellipsis
        }],
        style: colStyle
      }, defaultSlot ? defaultSlot({}) : [])
    }

    $xeCol.renderVN = renderVN

    return $xeCol
  },
  render () {
    return this.renderVN()
  }
})
