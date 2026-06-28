import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, VxeComponentSizeType } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeTransfer: DefineVxeComponentApp<VxeTransferProps, VxeTransferEventProps, VxeTransferSlots, VxeTransferMethods>
export type VxeTransferComponent = DefineVxeComponentOptions<VxeTransferProps>

export type VxeTransferInstance = DefineVxeComponentInstance<{
  reactData: TransferReactData
  internalData: TransferInternalData
}, VxeTransferProps, VxeTransferPrivateComputed, VxeTransferMethods>

export type VxeTransferConstructor = VxeTransferInstance

export interface TransferPrivateRef {
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
