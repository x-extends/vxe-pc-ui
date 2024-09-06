import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, ValueOf, VxeComponentSizeType } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxePasswordInput: DefineVxeComponentApp<VxePasswordInputProps, VxePasswordInputEventProps, VxePasswordInputSlots>
export type VxePasswordInputComponent = DefineVxeComponentOptions<VxePasswordInputProps>

export type VxePasswordInputInstance = DefineVxeComponentInstance<{
  reactData: PasswordInputReactData
}, VxePasswordInputProps, PasswordInputPrivateComputed, PasswordInputMethods>

export type VxePasswordInputConstructor = VxePasswordInputInstance

export interface PasswordInputPrivateRef {
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
  export type MaxLength = string | number
  export type Placeholder = string
  export type AutoComplete = string
  export type PrefixIcon = string
  export type SuffixIcon = string
  /**
   * 请使用 AutoComplete
   * @deprecated
   */
  export type Autocomplete = string
}

export interface VxePasswordInputProps {
  size?: VxePasswordInputPropTypes.Size
  value?: VxePasswordInputPropTypes.ModelValue
  className?: VxePasswordInputPropTypes.ClassName
  name?: VxePasswordInputPropTypes.Name
  clearable?: VxePasswordInputPropTypes.Clearable
  readonly?: VxePasswordInputPropTypes.Readonly
  disabled?: VxePasswordInputPropTypes.Disabled
  maxLength?: VxePasswordInputPropTypes.MaxLength
  autoComplete?: VxePasswordInputPropTypes.AutoComplete
  placeholder?: VxePasswordInputPropTypes.Placeholder
  prefixIcon?: VxePasswordInputPropTypes.PrefixIcon
  suffixIcon?: VxePasswordInputPropTypes.SuffixIcon
  /**
   * 请使用 AutoComplete
   * @deprecated
   */
  autocomplete?: VxePasswordInputPropTypes.Autocomplete
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
  'modelValue',
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
  default?: (params: VxePasswordInputSlotTypes.DefaultSlotParams) => any
}

export const PasswordInput: typeof VxePasswordInput
export default VxePasswordInput
