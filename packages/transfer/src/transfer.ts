import { CreateElement, VNode, PropType } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, renderEmptyElement } from '../../ui'

import type { TransferReactData, TransferInternalData, VxeTransferPropTypes, VxeTransferEmits, ValueOf } from '../../../types'

function createReactData (): TransferReactData {
  return {
  }
}

function createInternalData (): TransferInternalData {
  return {
  }
}

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeTransfer',
  props: {
    modelValue: Array as PropType<VxeTransferPropTypes.ModelValue>,
    options: Array as PropType<VxeTransferPropTypes.Options>,
    size: {
      type: String as PropType<VxeTransferPropTypes.Size>,
      default: () => getConfig().transfer.size || getConfig().size
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData = createReactData()
    return {
      ...({} as {
        internalData: TransferInternalData
      }),
      xID,
      reactData
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeTransferEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeTransfer = this
      $xeTransfer.$emit(type, createEvent(evnt, { $transfer: $xeTransfer }, params))
    },
    emitModel  (value: any) {
      const $xeTransfer = this

      const { _events } = $xeTransfer as any
      if (_events && _events.modelValue) {
        $xeTransfer.$emit('modelValue', value)
      } else {
        $xeTransfer.$emit('model-value', value)
      }
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeTransfer = this
      const slots = $xeTransfer.$scopedSlots

      const headerSlot = slots.header
      const footerSlot = slots.footer
      return h('div', {
        ref: 'refElem',
        class: 'vxe-transfer'
      }, [
        headerSlot
          ? h('div', {
            class: 'vxe-transfer--header'
          }, headerSlot({ $transfer: $xeTransfer }))
          : renderEmptyElement($xeTransfer),
        h('div'),
        h('div'),
        h('div'),
        footerSlot
          ? h('div', {
            class: 'vxe-transfer--footer'
          }, footerSlot({ $transfer: $xeTransfer }))
          : renderEmptyElement($xeTransfer)
      ])
    }
  },
  created () {
    const $xeUpload = this

    $xeUpload.internalData = createInternalData()
  },
  beforeDestroy () {
    const $xeUpload = this
    const reactData = $xeUpload.reactData
    const internalData = $xeUpload.internalData

    XEUtils.assign(reactData, createReactData())
    XEUtils.assign(internalData, createInternalData())
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
