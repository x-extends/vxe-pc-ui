import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, ValueOf, VxeComponentSizeType } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeLayoutContainer: DefineVxeComponentApp<VxeLayoutContainerProps, VxeLayoutContainerEventProps, VxeLayoutContainerSlots>
export type VxeLayoutContainerComponent = DefineVxeComponentOptions<VxeLayoutContainerProps>

export type VxeLayoutContainerInstance = DefineVxeComponentInstance<{
  reactData: LayoutContainerReactData
}, VxeLayoutContainerProps, VxeLayoutContainerPrivateComputed, VxeLayoutContainerMethods>

export type VxeLayoutContainerConstructor = VxeLayoutContainerInstance

export interface LayoutContainerPrivateRef {
}
export interface VxeLayoutContainerPrivateRef extends LayoutContainerPrivateRef { }

export namespace VxeLayoutContainerPropTypes {
  export type Size = VxeComponentSizeType
  export type Vertical = boolean
}

export interface VxeLayoutContainerProps {
  size?: VxeLayoutContainerPropTypes.Size
  vertical?: VxeLayoutContainerPropTypes.Vertical
}

export interface LayoutContainerPrivateComputed {
}
export interface VxeLayoutContainerPrivateComputed extends LayoutContainerPrivateComputed { }

export interface LayoutContainerReactData {
}

export interface LayoutContainerMethods {
  dispatchEvent(type: ValueOf<VxeLayoutContainerEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeLayoutContainerMethods extends LayoutContainerMethods { }

export interface LayoutContainerPrivateMethods { }
export interface VxeLayoutContainerPrivateMethods extends LayoutContainerPrivateMethods { }

export type VxeLayoutContainerEmits = []

export namespace VxeLayoutContainerDefines {
  export interface LayoutContainerEventParams extends VxeComponentEventParams {
    $layoutContainer: VxeLayoutContainerConstructor
  }
}

export type VxeLayoutContainerEventProps = {}

export interface VxeLayoutContainerListeners { }

export namespace VxeLayoutContainerEvents { }

export namespace VxeLayoutContainerSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeLayoutContainerSlots {
  default: (params: VxeLayoutContainerSlotTypes.DefaultSlotParams) => any
}

export const LayoutContainer: typeof VxeLayoutContainer
export default VxeLayoutContainer
