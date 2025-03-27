import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'
import { VxeSplitItemProps } from './split-item'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeSplit: DefineVxeComponentApp<VxeSplitProps, VxeSplitEventProps, VxeSplitSlots>
export type VxeSplitComponent = DefineVxeComponentOptions<VxeSplitProps>

export type VxeSplitInstance = DefineVxeComponentInstance<{
  reactData: SplitReactData
}, VxeSplitProps, VxeSplitPrivateComputed, VxeSplitMethods>

export type VxeSplitConstructor = VxeSplitInstance

export interface SplitPrivateRef {
}
export interface VxeSplitPrivateRef extends SplitPrivateRef { }

export namespace VxeSplitPropTypes {
  export type Resize = boolean
  export type Vertical = boolean
  export type Border = boolean
  export type MinWidth = string | number
  export type MinHeight = string | number
}

export type VxeSplitProps = {
  resize?: VxeSplitPropTypes.Resize
  vertical?: VxeSplitPropTypes.Vertical
  border?: VxeSplitPropTypes.Border
  minWidth?: VxeSplitPropTypes.MinWidth
  minHeight?: VxeSplitPropTypes.MinHeight
}

export interface SplitPrivateComputed {
}
export interface VxeSplitPrivateComputed extends SplitPrivateComputed { }

export interface SplitReactData {
  staticItems: VxeSplitDefines.ItemConfig[]
}

export interface SplitInternalData {
}

export interface SplitMethods {
  dispatchEvent(type: ValueOf<VxeSplitEmits>, params: Record<string, any>, evnt: Event | null): void
  recalculate(): Promise<void>
}
export interface VxeSplitMethods extends SplitMethods { }

export interface SplitPrivateMethods { }
export interface VxeSplitPrivateMethods extends SplitPrivateMethods { }

export type VxeSplitEmits = [
]

export namespace VxeSplitDefines {
  export interface SplitEventParams extends VxeComponentEventParams {
    $split: VxeSplitConstructor
  }

  export interface ItemConfig extends VxeSplitItemProps {
    id: string
    renderWidth: number
    renderHeight: number
  }
}

export type VxeSplitEventProps = {
}

export interface VxeSplitListeners {
}

export namespace VxeSplitEvents {
}

export namespace VxeSplitSlotTypes {
  export interface DefaultSlotParams {
  }
}

export interface VxeSplitSlots {
  default?: (params: VxeSplitSlotTypes.DefaultSlotParams) => any
}

export const Split: typeof VxeSplit
export default VxeSplit
