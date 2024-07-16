import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf, VxeComponentSizeType } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxePasswordInput: defineVxeComponent<VxePasswordInputProps, VxePasswordInputEventProps, VxePasswordInputSlots>
export type VxePasswordInputComponent = DefineComponent<VxePasswordInputProps, VxePasswordInputEmits>

export type VxePasswordInputInstance = ComponentPublicInstance<VxePasswordInputProps, VxePasswordInputConstructor>

export interface VxePasswordInputConstructor extends VxeComponentBaseOptions, VxePasswordInputMethods {
  props: VxePasswordInputProps
  context: SetupContext<VxePasswordInputEmits>
  reactData: PasswordInputReactData
  getRefMaps(): PasswordInputPrivateRef
  getComputeMaps(): PasswordInputPrivateComputed
  renderVN: RenderFunction
}

export interface PasswordInputPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxePasswordInputPrivateRef extends PasswordInputPrivateRef { }

export namespace VxePasswordInputPropTypes {
  export type Size = VxeComponentSizeType
  export type ModelValue = string | null
  export type ClassName = string
  export type Name = string
  export type Clearable = boolean
  export type Readonly = boolean
  export type Disabled = boolean
  export type Placeholder = string
  export type Autocomplete = string
  export type PrefixIcon = string
  export type SuffixIcon = string
}

export type VxePasswordInputProps = {
  size?: VxePasswordInputPropTypes.Size
  modelValue?: VxePasswordInputPropTypes.ModelValue
  className?: VxePasswordInputPropTypes.ClassName
  name?: VxePasswordInputPropTypes.Name
  clearable?: VxePasswordInputPropTypes.Clearable
  readonly?: VxePasswordInputPropTypes.Readonly
  disabled?: VxePasswordInputPropTypes.Disabled
  placeholder?: VxePasswordInputPropTypes.Placeholder
  autocomplete?: VxePasswordInputPropTypes.Autocomplete
  prefixIcon?: VxePasswordInputPropTypes.PrefixIcon
  suffixIcon?: VxePasswordInputPropTypes.SuffixIcon
}

export interface PasswordInputPrivateComputed {
}
export interface VxePasswordInputPrivateComputed extends PasswordInputPrivateComputed { }

export interface PasswordInputReactData {
  showPwd: boolean
  isActivated: boolean
  inputValue: undefined | VxePasswordInputPropTypes.ModelValue
}

export interface PasswordInputMethods {
  dispatchEvent(type: ValueOf<VxePasswordInputEmits>, params: Record<string, any>, evnt: Event | null): void
  /**
   * 获取焦点
   */
  focus(): Promise<any>
  /**
   * 失去焦点
   */
  blur(): Promise<any>
  /**
   * 选中内容
   */
  select(): Promise<any>
}
export interface VxePasswordInputMethods extends PasswordInputMethods { }

export interface PasswordInputPrivateMethods { }
export interface VxePasswordInputPrivateMethods extends PasswordInputPrivateMethods { }

export type VxePasswordInputEmits = [
  'update:modelValue',
  'input',
  'change',
  'click',
  'focus',
  'blur',
  'clear',
  'toggle-visible',
  'prefix-click',
  'suffix-click'
]

export namespace VxePasswordInputDefines {
  export interface PasswordInputEventParams extends VxeComponentEventParams {
    $passwordInput: VxePasswordInputConstructor
  }
}

export type VxePasswordInputEventProps = {}

export interface VxePasswordInputListeners { }

export namespace VxePasswordInputEvents { }

export namespace VxePasswordInputSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxePasswordInputSlots {
  default: (params: VxePasswordInputSlotTypes.DefaultSlotParams) => any
}

export const PasswordInput: typeof VxePasswordInput
export default VxePasswordInput
