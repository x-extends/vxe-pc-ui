import { defineComponent, ref, h, reactive, PropType } from 'vue'
import XEUtils from 'xe-utils'
import { createEvent } from '@vxe-ui/core'
import { printHtml } from './util'

import type { VxePrintPropTypes, PrintReactData, PrintPrivateRef, VxePrintPrivateComputed, VxePrintConstructor, VxePrintPrivateMethods, PrintMethods } from '../../../types'

export default defineComponent({
  name: 'VxePrint',
  props: {
    title: String as PropType<VxePrintPropTypes.Title>,
    content: String as PropType<VxePrintPropTypes.Content>,
    customStyle: String as PropType<VxePrintPropTypes.CustomStyle>,
    beforeMethod: Function as PropType<VxePrintPropTypes.beforeMethod>
  },
  emits: [],
  setup (props, context) {
    const { slots, emit } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<PrintReactData>({
    })

    const refMaps: PrintPrivateRef = {
      refElem
    }

    const computeMaps: VxePrintPrivateComputed = {
    }

    const $xePrint = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxePrintConstructor & VxePrintPrivateMethods

    const printMethods: PrintMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, createEvent(evnt, { $print: $xePrint }, params))
      },
      print () {
        const elem = refElem.value
        return printHtml(Object.assign({}, props, {
          content: (elem ? elem.outerHTML : '') || props.content || ''
        }))
      }
    }

    Object.assign($xePrint, printMethods)

    const renderVN = () => {
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: ['vxe-print']
      }, defaultSlot ? defaultSlot({}) : [])
    }

    $xePrint.renderVN = renderVN

    return $xePrint
  },
  render () {
    return this.renderVN()
  }
})
