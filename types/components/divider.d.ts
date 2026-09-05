import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, VxeComponentSizeType, VxeComponentAlignType } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeDivider: DefineVxeComponentApp<VxeDividerProps, VxeDividerEventProps, VxeDividerSlots, VxeDividerMethods>
export type VxeDividerComponent = DefineVxeComponentOptions<VxeDividerProps>

export type VxeDividerInstance = DefineVxeComponentInstance<{
  reactData: DividerReactData
}, VxeDividerProps, VxeDividerPrivateComputed, VxeDividerMethods>

export type VxeDividerConstructor = VxeDividerInstance

export interface DividerPrivateRef {
}
export interface VxeDividerPrivateRef extends DividerPrivateRef { }

export namespace VxeDividerPropTypes {
  export type Size = VxeComponentSizeType
  export type Vertical = boolean
  export type TitleContent = string
  export type TitleAlign = VxeComponentAlignType
}

export interface VxeDividerProps {
  size?: VxeDividerPropTypes.Size
  vertical?: VxeDividerPropTypes.Vertical
  titleContent?: VxeDividerPropTypes.TitleContent
  titleAlign?: VxeDividerPropTypes.TitleAlign
}

export interface DividerPrivateComputed {
}
export interface VxeDividerPrivateComputed extends DividerPrivateComputed { }

export interface DividerReactData {
}

export interface DividerMethods {
}
export interface VxeDividerMethods extends DividerMethods { }

export interface DividerPrivateMethods { }
export interface VxeDividerPrivateMethods extends DividerPrivateMethods { }

export type VxeDividerEmits = []

export namespace VxeDividerDefines {
  export interface DividerEventParams extends VxeComponentEventParams {
    $divider: VxeDividerConstructor
  }
}

export type VxeDividerEventProps = {}

export interface VxeDividerListeners { }

export namespace VxeDividerEvents { }

export namespace VxeDividerSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeDividerSlots {
  default?: (params: VxeDividerSlotTypes.DefaultSlotParams) => any
}

export const Divider: typeof VxeDivider
export default VxeDivider
