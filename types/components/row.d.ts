import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeRow: defineVxeComponent<VxeRowProps, VxeRowEventProps>
export type VxeRowComponent = DefineComponent<VxeRowProps, VxeRowEmits>

export type VxeRowInstance = ComponentPublicInstance<VxeRowProps, VxeRowConstructor>

export interface VxeRowConstructor extends VxeComponentBase, VxeRowMethods {
  props: VxeRowProps
  context: SetupContext<VxeRowEmits>
  reactData: RowReactData
  getRefMaps(): RowPrivateRef
  getComputeMaps(): RowPrivateComputed
  renderVN: RenderFunction
}

export interface RowPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeRowPrivateRef extends RowPrivateRef { }

export namespace VxeRowPropTypes {
  export type Gutter = string | number | (string | number)[]
  export type Wrap = boolean
  export type Vertical = boolean
}

export type VxeRowProps = {
  gutter?: VxeRowPropTypes.Gutter
  wrap?: VxeRowPropTypes.Wrap
  vertical?: VxeRowPropTypes.Vertical
}

export interface RowPrivateComputed {
}
export interface VxeRowPrivateComputed extends RowPrivateComputed { }

export interface RowReactData {
}

export interface RowMethods {
}
export interface VxeRowMethods extends RowMethods { }

export interface RowPrivateMethods { }
export interface VxeRowPrivateMethods extends RowPrivateMethods { }

export type VxeRowEmits = []

export namespace VxeRowDefines {
  export interface RowEventParams extends VxeComponentEvent {
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
  default: (params: VxeRowSlotTypes.DefaultSlotParams) => any
}

export const Row: typeof VxeRow
export default VxeRow
