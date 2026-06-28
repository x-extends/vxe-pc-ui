import { RenderFunction, SetupContext, Ref } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentBaseOptions, VxeComponentEventParams, VxeComponentSizeType } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeTransfer: DefineVxeComponentApp<VxeTransferProps, VxeTransferEventProps, VxeTransferSlots, VxeTransferMethods>
export type VxeTransferComponent = DefineVxeComponentOptions<VxeTransferProps, VxeTransferEventProps>

export type VxeTransferInstance = DefineVxeComponentInstance<VxeTransferProps, VxeTransferConstructor>

export interface VxeTransferConstructor extends VxeComponentBaseOptions, VxeTransferMethods {
  props: VxeTransferProps
  context: SetupContext<VxeTransferEmits>
  reactData: TransferReactData
  internalData: TransferInternalData
  getRefMaps(): TransferPrivateRef
  getComputeMaps(): TransferPrivateComputed
  renderVN: RenderFunction
}

export interface TransferPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeTransferPrivateRef extends TransferPrivateRef { }

export namespace VxeTransferPropTypes {
  export type Size = VxeComponentSizeType
  export type ModelValue = any[]
  export interface Option {
    value?: string | number
    label?: string | number
    children?: Option[]

    [key: string]: any
  }
  export type Options<D = Option> = D[]
}

export interface VxeTransferProps {
  size?: VxeTransferPropTypes.Size
  modelValue?: VxeTransferPropTypes.ModelValue
  options?: VxeTransferPropTypes.Options
}

export interface TransferPrivateComputed {
}
export interface VxeTransferPrivateComputed extends TransferPrivateComputed { }

export interface TransferReactData {
}
export interface TransferInternalData {
}

export interface TransferMethods {
}
export interface VxeTransferMethods extends TransferMethods { }

export interface TransferPrivateMethods { }
export interface VxeTransferPrivateMethods extends TransferPrivateMethods { }

export type VxeTransferEmits = []

export namespace VxeTransferDefines {
  export interface TransferEventParams extends VxeComponentEventParams {
    $transfer: VxeTransferConstructor
  }
}

export type VxeTransferEventProps = {}

export interface VxeTransferListeners { }

export namespace VxeTransferEvents { }

export namespace VxeTransferSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeTransferSlots {
  default?: (params: VxeTransferSlotTypes.DefaultSlotParams) => any
}

export const Transfer: typeof VxeTransfer
export default VxeTransfer
