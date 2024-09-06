import { CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { createEvent } from '../../ui'
import { assemblePageBreak, destroyPageBreak } from './util'

import type { PrintPageBreakReactData, VxePrintPageBreakEmits, VxeComponentSizeType, ValueOf, VxePrintDefines, VxePrintConstructor, VxePrintPrivateMethods } from '../../../types'

export default defineVxeComponent({
  name: 'VxePrintPageBreak',
  props: {},
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: PrintPageBreakReactData = {
    }
    const pageBreakConfig: VxePrintDefines.PageBreakConfig = {
      id: xID,
      slots: {}
    }
    return {
      xID: XEUtils.uniqueId(),
      reactData,
      pageBreakConfig
    }
  },
  inject: {
    $xePrint: {
      default: null
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
      $xePrint(): (VxePrintConstructor & VxePrintPrivateMethods) | null
    })
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxePrintPageBreakEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xePrintPageBreak = this
      $xePrintPageBreak.$emit(type, createEvent(evnt, { $printPageBreak: $xePrintPageBreak }, params))
    },
    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      return h('div', {
        ref: 'refElem'
      })
    }
  },
  mounted () {
    const $xePrintPageBreak = this
    const slots = $xePrintPageBreak.$scopedSlots
    const $xePrint = $xePrintPageBreak.$xePrint
    const pageBreakConfig = $xePrintPageBreak.pageBreakConfig

    pageBreakConfig.slots = slots
    const elem = $xePrintPageBreak.$refs.refElem as HTMLDivElement
    if ($xePrint && elem) {
      assemblePageBreak($xePrint, elem, pageBreakConfig)
    }
  },
  beforeDestroy () {
    const $xePrintPageBreak = this
    const $xePrint = $xePrintPageBreak.$xePrint
    const pageBreakConfig = $xePrintPageBreak.pageBreakConfig

    if ($xePrint) {
      destroyPageBreak($xePrint, pageBreakConfig)
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
