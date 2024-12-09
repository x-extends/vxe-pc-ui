import { RenderFunction, SetupContext, Ref } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf, VxeComponentSizeType } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeNumberInput: DefineVxeComponentApp<VxeNumberInputProps, VxeNumberInputEventProps, VxeNumberInputSlots>
export type VxeNumberInputComponent = DefineVxeComponentOptions<VxeNumberInputProps, VxeNumberInputEventProps>

export type VxeNumberInputInstance = DefineVxeComponentInstance<VxeNumberInputProps, VxeNumberInputConstructor>

export interface VxeNumberInputConstructor extends VxeComponentBaseOptions, VxeNumberInputMethods {
  props: VxeNumberInputProps
  context: SetupContext<VxeNumberInputEmits>
  reactData: NumberInputReactData
  getRefMaps(): NumberInputPrivateRef
  getComputeMaps(): NumberInputPrivateComputed
  renderVN: RenderFunction
}

export interface NumberInputPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeNumberInputPrivateRef extends NumberInputPrivateRef { }

export namespace VxeNumberInputPropTypes {
  export type Size = VxeComponentSizeType
  export type ModelValue = string | number | null
  export type ClassName = string
  export type Immediate = boolean
  export type Name = string
  export type Type = 'number' | 'integer' | 'float' | 'amount'
  export type Clearable = boolean
  export type Readonly = boolean
  export type Disabled = boolean
  export type Placeholder = string
  export type MaxLength = string | number
  export type Multiple = boolean
  export type AutoComplete = string
  export type Align = string
  export type Form = string
  export type Min = string | number
  export type Max = string | number
  export type Step = string | number
  export type Exponential = boolean
  export type Controls = boolean
  export type Digits = string | number
  export type PrefixIcon = string
  export type SuffixIcon = string

  /**
   * 请使用 AutoComplete
   * @deprecated
   */
  export type Autocomplete = string
  /**
   * 请使用 MaxLength
   * @deprecated
   */
  export type Maxlength = string | number
}

export interface VxeNumberInputProps {
  size?: VxeNumberInputPropTypes.Size
  modelValue?: VxeNumberInputPropTypes.ModelValue
  className?: VxeNumberInputPropTypes.ClassName
  immediate?: VxeNumberInputPropTypes.Immediate
  name?: VxeNumberInputPropTypes.Name
  type?: VxeNumberInputPropTypes.Type
  clearable?: VxeNumberInputPropTypes.Clearable
  readonly?: VxeNumberInputPropTypes.Readonly
  disabled?: VxeNumberInputPropTypes.Disabled
  placeholder?: VxeNumberInputPropTypes.Placeholder
  maxLength?: VxeNumberInputPropTypes.MaxLength
  multiple?: VxeNumberInputPropTypes.Multiple
  autoComplete?: VxeNumberInputPropTypes.AutoComplete
  align?: VxeNumberInputPropTypes.Align
  form?: VxeNumberInputPropTypes.Form

  // number、integer、float
  min?: VxeNumberInputPropTypes.Min
  max?: VxeNumberInputPropTypes.Max
  step?: VxeNumberInputPropTypes.Step
  exponential?: VxeNumberInputPropTypes.Exponential

  // number、integer、float、password
  controls?: VxeNumberInputPropTypes.Controls

  // float
  digits?: VxeNumberInputPropTypes.Digits

  prefixIcon?: VxeNumberInputPropTypes.PrefixIcon
  suffixIcon?: VxeNumberInputPropTypes.SuffixIcon

  /**
   * 请使用 autoComplete
   * @deprecated
   */
  autocomplete?: VxeNumberInputPropTypes.AutoComplete
  /**
   * 请使用 autoComplete
   * @deprecated
   */
  maxlength?: VxeNumberInputPropTypes.MaxLength
}

export interface NumberInputPrivateComputed {
}
export interface VxeNumberInputPrivateComputed extends NumberInputPrivateComputed { }

export interface NumberInputReactData {
  isFocus: boolean
  isActivated: boolean
  inputValue: VxeNumberInputPropTypes.ModelValue | undefined
}

export interface NumberInputInternalData {
  dnTimeout?: undefined | number
}

export interface NumberInputMethods {
  dispatchEvent(type: ValueOf<VxeNumberInputEmits>, params: Record<string, any>, evnt: Event | null): void
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
export interface VxeNumberInputMethods extends NumberInputMethods { }

export interface NumberInputPrivateMethods { }
export interface VxeNumberInputPrivateMethods extends NumberInputPrivateMethods { }

export type VxeNumberInputEmits = [
  'update:modelValue',
  'input',
  'change',
  'keydown',
  'keyup',
  'wheel',
  'click',
  'focus',
  'blur',
  'clear',
  'prev-number',
  'next-number',
  'prefix-click',
  'suffix-click'
]

export namespace VxeNumberInputDefines {
  export interface NumberInputEventParams extends VxeComponentEventParams {
    $numberInput: VxeNumberInputConstructor
  }

  export interface NumberInputParams {
    value: number
  }
  export interface InputEventParams extends NumberInputEventParams, NumberInputParams { }

  export interface ChangeParams extends NumberInputParams {}
  export interface ChangeEventParams extends NumberInputEventParams, ChangeParams { }
}

export type VxeNumberInputEventProps = {
  onInput?: VxeNumberInputEvents.Input
  onChange?: VxeNumberInputEvents.Change
}

export interface VxeNumberInputListeners {
  input?: VxeNumberInputEvents.Input
  change?: VxeNumberInputEvents.Change
}

export namespace VxeNumberInputEvents {
  export type Input = (params: VxeNumberInputDefines.InputEventParams) => void
  export type Change = (params: VxeNumberInputDefines.ChangeEventParams) => void
}

export namespace VxeNumberInputSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeNumberInputSlots {
  default?: (params: VxeNumberInputSlotTypes.DefaultSlotParams) => any
  prefix: (params: VxeNumberInputSlotTypes.DefaultSlotParams) => any
  suffix: (params: VxeNumberInputSlotTypes.DefaultSlotParams) => any
}

export const NumberInput: typeof VxeNumberInput
export default VxeNumberInput
