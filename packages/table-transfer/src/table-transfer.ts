import { ref, h, reactive, PropType, onBeforeUnmount } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent } from '../../ui'

import type { TableTransferReactData, TableTransferInternalData, VxeTableTransferEmits, VxeTableTransferPropTypes, TableTransferMethods, TableTransferPrivateMethods, ValueOf, TableTransferPrivateRef, VxeTableTransferPrivateComputed, VxeTableTransferConstructor, VxeTableTransferPrivateMethods } from '../../../types'

function createReactData (): TableTransferReactData {
  return {
  }
}

function createInternalData (): TableTransferInternalData {
  return {
  }
}

export default defineVxeComponent({
  name: 'VxeTableTransfer',
  props: {
    modelValue: Array as PropType<VxeTableTransferPropTypes.ModelValue>,
    options: Array as PropType<VxeTableTransferPropTypes.Options>,
    size: {
      type: String as PropType<VxeTableTransferPropTypes.Size>,
      default: () => getConfig().tableTransfer.size || getConfig().size
    }
  },
  emits: [
  ] as VxeTableTransferEmits,
  setup (props, context) {
    const { emit } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive(createReactData())

    const internalData = createInternalData()

    const refMaps: TableTransferPrivateRef = {
      refElem
    }

    const computeMaps: VxeTableTransferPrivateComputed = {
    }

    const $xeTableTransfer = {
      xID,
      props,
      context,
      reactData,
      internalData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeTableTransferConstructor & VxeTableTransferPrivateMethods

    const dispatchEvent = (type: ValueOf<VxeTableTransferEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $tableTransfer: $xeTableTransfer }, params))
    }

    const tableTransferMethods: TableTransferMethods = {
      dispatchEvent
    }

    const tableTransferPrivateMethods: TableTransferPrivateMethods = {
    }

    Object.assign($xeTableTransfer, tableTransferMethods, tableTransferPrivateMethods)

    const renderVN = () => {
      return h('div', {
        ref: refElem,
        class: 'vxe-table-transfer'
      }, [])
    }

    onBeforeUnmount(() => {
      XEUtils.assign(reactData, createReactData())
      XEUtils.assign(internalData, createInternalData())
    })

    $xeTableTransfer.renderVN = renderVN

    return $xeTableTransfer
  },
  render () {
    return this.renderVN()
  }
})
