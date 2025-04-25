import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, VxeComponentSizeType, ValueOf } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeRow: DefineVxeComponentApp<VxeRowProps, VxeRowEventProps, VxeRowSlots, VxeRowMethods>
export type VxeRowComponent = DefineVxeComponentOptions<VxeRowProps>

export type VxeRowInstance = DefineVxeComponentInstance<{
  reactData: RowReactData
}, VxeRowProps, VxeRowPrivateComputed, VxeRowMethods>

export type VxeRowConstructor = VxeRowInstance

export interface RowPrivateRef {
}
export interface VxeRowPrivateRef extends RowPrivateRef { }

export namespace VxeRowPropTypes {
  export type Gutter = string | number | (string | number)[]
  export type Wrap = boolean
  export type Vertical = boolean
  export type Size = VxeComponentSizeType
}

export interface VxeRowProps {
  gutter?: VxeRowPropTypes.Gutter
  wrap?: VxeRowPropTypes.Wrap
  vertical?: VxeRowPropTypes.Vertical
  size?: VxeRowPropTypes.Size
}

export interface RowPrivateComputed {
}
export interface VxeRowPrivateComputed extends RowPrivateComputed { }

export interface RowReactData {
}

export interface RowMethods {
  dispatchEvent(type: ValueOf<VxeRowEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeRowMethods extends RowMethods { }

export interface RowPrivateMethods { }
export interface VxeRowPrivateMethods extends RowPrivateMethods { }

export type VxeRowEmits = [
  'click'
]

export namespace VxeRowDefines {
  export interface RowEventParams extends VxeComponentEventParams {
    $row: VxeRowConstructor
  }
}

export type VxeRowEventProps = {}

export interface VxeRowListeners { }

export namespace VxeRowEvents { }

export namespace VxeRowSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeRowSlots {
  default?: (params: VxeRowSlotTypes.DefaultSlotParams) => any
}

export const Row: typeof VxeRow
export default VxeRow
