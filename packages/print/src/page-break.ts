import { defineComponent, ref, h, reactive, inject, onMounted, onUnmounted, createCommentVNode } from 'vue'
import XEUtils from 'xe-utils'
import { assemblePageBreak, destroyPageBreak } from './util'

import type { PrintPageBreakReactData, PrintPageBreakPrivateRef, VxePrintPageBreakEmits, VxePrintDefines, VxePrintPageBreakPrivateComputed, VxePrintConstructor, VxePrintPrivateMethods, VxePrintPageBreakConstructor, VxePrintPageBreakPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxePrintPageBreak',
  props: {},
  emits: [] as VxePrintPageBreakEmits,
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()
    const $xePrint = inject<(VxePrintConstructor & VxePrintPrivateMethods) | null>('$xePrint', null)

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<PrintPageBreakReactData>({
    })

    const refMaps: PrintPageBreakPrivateRef = {
      refElem
    }

    const computeMaps: VxePrintPageBreakPrivateComputed = {
    }

    const pageBreakConfig = reactive<VxePrintDefines.PageBreakConfig>({
      id: xID,
      slots
    })

    const $xePrintPageBreak = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxePrintPageBreakConstructor & VxePrintPageBreakPrivateMethods

    if (!$xePrint) {
      $xePrintPageBreak.renderVN = () => {
        return createCommentVNode()
      }
      return $xePrintPageBreak
    }

    const renderVN = () => {
      return h('div', {
        ref: refElem
      })
    }

    $xePrintPageBreak.renderVN = renderVN

    onMounted(() => {
      const elem = refElem.value
      if ($xePrint && elem) {
        assemblePageBreak($xePrint, elem, pageBreakConfig)
      }
    })

    onUnmounted(() => {
      if ($xePrint) {
        destroyPageBreak($xePrint, pageBreakConfig)
      }
    })

    return $xePrintPageBreak
  },
  render () {
    return this.renderVN()
  }
})
