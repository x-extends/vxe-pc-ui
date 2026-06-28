import { ref, h, reactive, PropType, onBeforeUnmount } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, renderEmptyElement } from '../../ui'

import type { TransferReactData, TransferInternalData, VxeTransferEmits, VxeTransferPropTypes, TransferMethods, TransferPrivateMethods, ValueOf, TransferPrivateRef, VxeTransferPrivateComputed, VxeTransferConstructor, VxeTransferPrivateMethods } from '../../../types'

function createReactData (): TransferReactData {
  return {
  }
}

function createInternalData (): TransferInternalData {
  return {
  }
}

export default defineVxeComponent({
  name: 'VxeTransfer',
  props: {
    modelValue: Array as PropType<VxeTransferPropTypes.ModelValue>,
    options: Array as PropType<VxeTransferPropTypes.Options>,
    size: {
      type: String as PropType<VxeTransferPropTypes.Size>,
      default: () => getConfig().transfer.size || getConfig().size
    }
  },
  emits: [
  ] as VxeTransferEmits,
  setup (props, context) {
    const { emit, slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive(createReactData())

    const internalData = createInternalData()

    const refMaps: TransferPrivateRef = {
      refElem
    }

    const computeMaps: VxeTransferPrivateComputed = {
    }

    const $xeTransfer = {
      xID,
      props,
      context,
      reactData,
      internalData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeTransferConstructor & VxeTransferPrivateMethods

    const dispatchEvent = (type: ValueOf<VxeTransferEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $transfer: $xeTransfer }, params))
    }

    const transferMethods: TransferMethods = {
      dispatchEvent
    }

    const transferPrivateMethods: TransferPrivateMethods = {
    }

    Object.assign($xeTransfer, transferMethods, transferPrivateMethods)

    const renderVN = () => {
      const headerSlot = slots.header
      const footerSlot = slots.footer
      return h('div', {
        ref: refElem,
        class: 'vxe-transfer'
      }, [
        headerSlot
          ? h('div', {
            class: 'vxe-transfer--header'
          }, headerSlot({ $transfer: $xeTransfer }))
          : renderEmptyElement($xeTransfer),
        h('div', {
          class: 'vxe-transfer--body'
        }, [
          h('div', {
            class: 'vxe-transfer--left-wrapper'
          }),
          h('div', {
            class: 'vxe-transfer--buttons-wrapper'
          }),
          h('div', {
            class: 'vxe-transfer--right-wrapper'
          })
        ]),
        footerSlot
          ? h('div', {
            class: 'vxe-transfer--footer'
          }, footerSlot({ $transfer: $xeTransfer }))
          : renderEmptyElement($xeTransfer)
      ])
    }

    onBeforeUnmount(() => {
      XEUtils.assign(reactData, createReactData())
      XEUtils.assign(internalData, createInternalData())
    })

    $xeTransfer.renderVN = renderVN

    return $xeTransfer
  },
  render () {
    return this.renderVN()
  }
})
