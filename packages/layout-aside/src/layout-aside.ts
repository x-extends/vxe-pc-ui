import { defineComponent, ref, h, reactive, onMounted, computed, PropType } from 'vue'
import XEUtils from 'xe-utils'
import { toCssUnit } from '../../ui/src/dom'

import type { VxeLayoutAsidePropTypes, LayoutAsideReactData, LayoutAsidePrivateRef, VxeLayoutAsidePrivateComputed, VxeLayoutAsideConstructor, VxeLayoutAsidePrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeLayoutAside',
  props: {
    width: [String, Number] as PropType<VxeLayoutAsidePropTypes.Width>,
    collapsed: Boolean as PropType<VxeLayoutAsidePropTypes.Collapsed>,
    collapseWidth: [String, Number] as PropType<VxeLayoutAsidePropTypes.CollapseWidth>,
    padding: Boolean as PropType<VxeLayoutAsidePropTypes.Padding>
  },
  emits: [],
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<LayoutAsideReactData>({})

    const refMaps: LayoutAsidePrivateRef = {
      refElem
    }

    const computeWrapperWidth = computed(() => {
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
    })

    const computeMaps: VxeLayoutAsidePrivateComputed = {
    }

    const $xeLayoutAside = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeLayoutAsideConstructor & VxeLayoutAsidePrivateMethods

    const renderVN = () => {
      const { width, collapsed, padding } = props
      const wrapperWidth = computeWrapperWidth.value
      const defaultSlot = slots.default

      return h('aside', {
        ref: refElem,
        class: ['vxe-layout-aside', {
          'is--padding': padding,
          'is--default-width': !width,
          'is--collapse': collapsed
        }],
        style: wrapperWidth
          ? {
              width: wrapperWidth
            }
          : null
      }, defaultSlot ? defaultSlot({}) : [])
    }

    onMounted(() => {

    })

    $xeLayoutAside.renderVN = renderVN

    return $xeLayoutAside
  },
  render () {
    return this.renderVN()
  }
})
