import { defineComponent, ref, h, reactive, onMounted, computed } from 'vue'
import XEUtils from 'xe-utils'
import { toCssUnit } from '../../core/src/dom'

import { LayoutAsideReactData, LayoutAsidePrivateRef, VxeLayoutAsidePrivateComputed, VxeLayoutAsideConstructor, VxeLayoutAsidePrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeLayoutAside',
  props: {
    width: [String, Number],
    collapsed: Boolean,
    collapseWidth: [String, Number]
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
      const { width, collapsed } = props
      const wrapperWidth = computeWrapperWidth.value
      const defaultSlot = slots.default

      return h('div', {
        ref: refElem,
        class: ['vxe-layout-aside', {
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
