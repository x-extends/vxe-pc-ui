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
  export type Height = string | number
  export type Width = string | number
  export type Padding = boolean
  export type Vertical = boolean
  export type Border = boolean
  export interface ItemConfig {
    minWidth?: string | number
    minHeight?: string | number
  }
}

export type VxeSplitProps = {
  height?: VxeSplitPropTypes.Height
  width?: VxeSplitPropTypes.Width
  padding?: VxeSplitPropTypes.Padding
  vertical?: VxeSplitPropTypes.Vertical
  border?: VxeSplitPropTypes.Border
  itemConfig?: VxeSplitPropTypes.ItemConfig
}

export interface SplitPrivateComputed {
  computeItemOpts: VxeSplitPropTypes.ItemConfig
}
export interface VxeSplitPrivateComputed extends SplitPrivateComputed { }

export interface SplitReactData {
  staticItems: VxeSplitDefines.ChunkConfig[]
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

  export interface ChunkConfig extends VxeSplitItemProps {
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
