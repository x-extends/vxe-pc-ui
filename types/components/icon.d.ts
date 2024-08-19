import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, VxeComponentSizeType, ValueOf } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeIcon: defineVxeComponent<VxeIconProps, VxeIconEventProps, VxeIconSlots>
export type VxeIconComponent = DefineComponent<VxeIconProps & VxeIconEventProps>

export type VxeIconInstance = ComponentPublicInstance<VxeIconProps, VxeIconConstructor>

export interface VxeIconConstructor extends VxeComponentBaseOptions, VxeIconMethods {
  props: VxeIconProps
  context: SetupContext<VxeIconEmits>
  reactData: IconReactData
  getRefMaps(): IconPrivateRef
  getComputeMaps(): IconPrivateComputed
  renderVN: RenderFunction
}

export interface IconPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeIconPrivateRef extends IconPrivateRef { }

export namespace VxeIconPropTypes {
  export type Name = string
  export type ClassName = string
  export type Roll = boolean
  export type Status = string
  export type Size = VxeComponentSizeType
}

export type VxeIconProps = {
  name?: VxeIconPropTypes.Name
  className?: VxeIconPropTypes.Name
  roll?: VxeIconPropTypes.Roll
  status?: VxeIconPropTypes.Status
  size?: VxeIconPropTypes.Size
}

export interface IconPrivateComputed {
}
export interface VxeIconPrivateComputed extends IconPrivateComputed { }

export interface IconReactData {
}

export interface IconMethods {
  dispatchEvent(type: ValueOf<VxeIconEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeIconMethods extends IconMethods { }

export interface IconPrivateMethods { }
export interface VxeIconPrivateMethods extends IconPrivateMethods { }

export type VxeIconEmits = [
  'click'
]

export namespace VxeIconDefines {
  export interface IconEventParams extends VxeComponentEventParams {
    $icon: VxeIconConstructor
  }

  export interface ClickParams {}
  export interface ClickEventParams extends IconEventParams, ClickParams { }
}

export type VxeIconEventProps = {
  onClick?: VxeIconEvents.Click
}

export interface VxeIconListeners {
  onClick?: VxeIconEvents.Click
}

export namespace VxeIconEvents {
  export type Click = (params: VxeIconDefines.ClickEventParams) => void
 }

export namespace VxeIconSlotTypes {}

export interface VxeIconSlots {
}

export const Icon: typeof VxeIcon
export default VxeIcon
