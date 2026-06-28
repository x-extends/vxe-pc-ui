import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, VxeComponentSizeType } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeTableTransfer: DefineVxeComponentApp<VxeTableTransferProps, VxeTableTransferEventProps, VxeTableTransferSlots, VxeTableTransferMethods>
export type VxeTableTransferComponent = DefineVxeComponentOptions<VxeTableTransferProps>

export type VxeTableTransferInstance = DefineVxeComponentInstance<{
  reactData: TableTransferReactData
  internalData: TableTransferInternalData
}, VxeTableTransferProps, VxeTableTransferPrivateComputed, VxeTableTransferMethods>

export type VxeTableTransferConstructor = VxeTableTransferInstance

export interface TableTransferPrivateRef {
}
export interface VxeTableTransferPrivateRef extends TableTransferPrivateRef { }

export namespace VxeTableTransferPropTypes {
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

export interface VxeTableTransferProps {
  size?: VxeTableTransferPropTypes.Size
  modelValue?: VxeTableTransferPropTypes.ModelValue
  options?: VxeTableTransferPropTypes.Options
}

export interface TableTransferPrivateComputed {
}
export interface VxeTableTransferPrivateComputed extends TableTransferPrivateComputed { }

export interface TableTransferReactData {
}
export interface TableTransferInternalData {
}

export interface TableTransferMethods {
}
export interface VxeTableTransferMethods extends TableTransferMethods { }

export interface TableTransferPrivateMethods { }
export interface VxeTableTransferPrivateMethods extends TableTransferPrivateMethods { }

export type VxeTableTransferEmits = []

export namespace VxeTableTransferDefines {
  export interface TableTransferEventParams extends VxeComponentEventParams {
    $tableTransfer: VxeTableTransferConstructor
  }
}

export type VxeTableTransferEventProps = {}

export interface VxeTableTransferListeners { }

export namespace VxeTableTransferEvents { }

export namespace VxeTableTransferSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeTableTransferSlots {
  default?: (params: VxeTableTransferSlotTypes.DefaultSlotParams) => any
}

export const TableTransfer: typeof VxeTableTransfer
export default VxeTableTransfer
