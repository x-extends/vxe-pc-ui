import { defineComponent, ref, h, reactive, provide, PropType, computed } from 'vue'
import XEUtils from 'xe-utils'
import { toCssUnit } from '../../ui/src/dom'

import { VxeRowPropTypes, RowReactData, RowPrivateRef, VxeRowPrivateComputed, VxeRowConstructor, VxeRowPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeRow',
  props: {
    gutter: [Number, String, Array] as PropType<VxeRowPropTypes.Gutter>,
    wrap: {
      type: Boolean as PropType<VxeRowPropTypes.Wrap>,
      default: true
    },
    vertical: Boolean as PropType<VxeRowPropTypes.Vertical>
  },
  emits: [],
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<RowReactData>({
    })

    const refMaps: RowPrivateRef = {
      refElem
    }

    const computeRowStyle = computed(() => {
      const { gutter } = props
      const style: Record<string, string | number> = {}
      if (gutter) {
        const [lrGutter, tbGutter] = XEUtils.isArray(gutter) ? gutter : [gutter]
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
    })

    const computeMaps: VxeRowPrivateComputed = {
    }

    const $xeRow = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeRowConstructor & VxeRowPrivateMethods

    const renderVN = () => {
      const { vertical } = props
      const rowStyle = computeRowStyle.value
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: ['vxe-row', {
          'is--vertical': vertical
        }],
        style: rowStyle
      }, defaultSlot ? defaultSlot({}) : [])
    }

    $xeRow.renderVN = renderVN

    provide('$xeRow', $xeRow)

    return $xeRow
  },
  render () {
    return this.renderVN()
  }
})
