import { RenderFunction, SetupContext, Ref, ComputedRef } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'
import { VxeSplitItemProps } from './split-item'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeSplit: DefineVxeComponentApp<VxeSplitProps, VxeSplitEventProps, VxeSplitSlots>
export type VxeSplitComponent = DefineVxeComponentOptions<VxeSplitProps, VxeSplitEventProps>

export type VxeSplitInstance = DefineVxeComponentInstance<VxeSplitProps, VxeSplitConstructor>

export interface VxeSplitConstructor extends VxeComponentBaseOptions, VxeSplitMethods {
  props: VxeSplitProps
  context: SetupContext<VxeSplitEmits>
  reactData: SplitReactData
  getRefMaps(): SplitPrivateRef
  getComputeMaps(): SplitPrivateComputed
  renderVN: RenderFunction
}

export interface SplitPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
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
  computeItemOpts: ComputedRef<VxeSplitPropTypes.ItemConfig>
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
