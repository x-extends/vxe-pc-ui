import { CreateElement, VNode, PropType } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent } from '../../ui'

import type { TableTransferReactData, TableTransferInternalData, VxeTableTransferEmits, VxeTableTransferPropTypes, ValueOf } from '../../../types'

function createReactData (): TableTransferReactData {
  return {
  }
}

function createInternalData (): TableTransferInternalData {
  return {
  }
}

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeTableTransfer',
  props: {
    modelValue: Array as PropType<VxeTableTransferPropTypes.ModelValue>,
    options: Array as PropType<VxeTableTransferPropTypes.Options>,
    size: {
      type: String as PropType<VxeTableTransferPropTypes.Size>,
      default: () => getConfig().tableTransfer.size || getConfig().size
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData = createReactData()
    return {
      ...({} as {
        internalData: TableTransferInternalData
      }),
      xID,
      reactData
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeTableTransferEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeTableTransfer = this
      $xeTableTransfer.$emit(type, createEvent(evnt, { $tableTransfer: $xeTableTransfer }, params))
    },
    emitModel  (value: any) {
      const $xeTableTransfer = this

      const { _events } = $xeTableTransfer as any
      if (_events && _events.modelValue) {
        $xeTableTransfer.$emit('modelValue', value)
      } else {
        $xeTableTransfer.$emit('model-value', value)
      }
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeTableTransfer = this
      const slots = $xeTableTransfer.$scopedSlots

      const defaultSlot = slots.default
      return h('div', {
        ref: 'refElem',
        class: 'vxe-table-transfer'
      }, defaultSlot ? defaultSlot({}) : [])
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
