import { RenderFunction, SetupContext, Ref, ComponentPublicInstance } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent, VxeComponentSize, ValueOf } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeSwitch: defineVxeComponent<VxeSwitchProps, VxeSwitchEventProps>

export type VxeSwitchInstance = ComponentPublicInstance<VxeSwitchProps, VxeSwitchConstructor>

export interface VxeSwitchConstructor extends VxeComponentBase, VxeSwitchMethods {
  props: VxeSwitchProps
  context: SetupContext<VxeSwitchEmits>
  reactData: SwitchReactData
  getRefMaps(): SwitchPrivateRef
  getComputeMaps(): SwitchPrivateComputed
  renderVN: RenderFunction
}

export interface SwitchPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeSwitchPrivateRef extends SwitchPrivateRef { }

export namespace VxeSwitchPropTypes {
  export type Size = VxeComponentSize
  export type ModelValue = string | number | boolean
  export type Disabled = boolean
  export type OpenLabel = string
  export type CloseLabel = string
  export type OpenValue = string | number | boolean
  export type CloseValue = string | number | boolean
  export type OpenIcon = string
  export type CloseIcon = string
}

export type VxeSwitchProps = {
  size?: VxeSwitchPropTypes.Size
  modelValue?: VxeSwitchPropTypes.ModelValue
  disabled?: VxeSwitchPropTypes.Disabled
  openLabel?: VxeSwitchPropTypes.OpenLabel
  closeLabel?: VxeSwitchPropTypes.CloseLabel
  openValue?: VxeSwitchPropTypes.OpenValue
  closeValue?: VxeSwitchPropTypes.CloseValue
  openIcon?: VxeSwitchPropTypes.OpenIcon
  closeIcon?: VxeSwitchPropTypes.CloseIcon
}

export interface SwitchPrivateComputed {
}
export interface VxeSwitchPrivateComputed extends SwitchPrivateComputed { }

export interface SwitchReactData {
  isActivated: boolean
  hasAnimat: boolean
  offsetLeft: number
}

export interface SwitchMethods {
  dispatchEvent(type: ValueOf<VxeSwitchEmits>, params: any, evnt: Event): void
  /**
   * 获取焦点
   */
  focus(): Promise<any>
  /**
   * 失去焦点
   */
  blur(): Promise<any>
}
export interface VxeSwitchMethods extends SwitchMethods { }

export interface SwitchPrivateMethods { }
export interface VxeSwitchPrivateMethods extends SwitchPrivateMethods { }

export type VxeSwitchEmits = [
  'update:modelValue',
  'change',
  'focus',
  'blur'
]

export namespace VxeSwitchDefines {
  interface SwitchEventParams extends VxeComponentEvent {
    $switch: VxeSwitchConstructor
  }

  export interface ChangeEventParams extends SwitchEventParams { }
  export interface FocusEventParams extends SwitchEventParams { }
  export interface BlurEventParams extends SwitchEventParams { }
}

export type VxeSwitchEventProps = {
  onChange?: VxeSwitchEvents.Change
  onFocus?: VxeSwitchEvents.Focus
  onBlur?: VxeSwitchEvents.Blur
}

export interface VxeSwitchListeners {
  change?: VxeSwitchEvents.Change
  focus?: VxeSwitchEvents.Focus
  blur?: VxeSwitchEvents.Blur
}

export namespace VxeSwitchEvents {
  export type Change = (params: VxeSwitchDefines.ChangeEventParams) => void
  export type Focus = (params: VxeSwitchDefines.FocusEventParams) => void
  export type Blur = (params: VxeSwitchDefines.BlurEventParams) => void
}

export namespace VxeSwitchSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeSwitchSlots {
  default: (params: VxeSwitchSlotTypes.DefaultSlotParams) => any
}

export const Switch: typeof VxeSwitch
export default VxeSwitch
