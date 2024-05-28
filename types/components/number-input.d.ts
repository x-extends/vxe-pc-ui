import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeNumberInput: defineVxeComponent<VxeNumberInputProps, VxeNumberInputEventProps>
export type VxeNumberInputComponent = DefineComponent<VxeNumberInputProps, VxeNumberInputEmits>

export type VxeNumberInputInstance = ComponentPublicInstance<VxeNumberInputProps, VxeNumberInputConstructor>

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
  export type ModelValue = string | number | Date | null
  export type ClassName = string
  export type Immediate = boolean
  export type Name = string
  export type Type = 'number' | 'integer' | 'float'
  export type Clearable = boolean
  export type Readonly = boolean
  export type Disabled = boolean
  export type Placeholder = string
  export type Maxlength = string | number
  export type Multiple = boolean
  export type Autocomplete = string
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
}

export type VxeNumberInputProps = {
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
  maxlength?: VxeNumberInputPropTypes.Maxlength
  multiple?: VxeNumberInputPropTypes.Multiple
  autocomplete?: VxeNumberInputPropTypes.Autocomplete
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
}

export interface NumberInputPrivateComputed {
}
export interface VxeNumberInputPrivateComputed extends NumberInputPrivateComputed { }

export interface NumberInputReactData {
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
}

export type VxeNumberInputEventProps = {}

export interface VxeNumberInputListeners { }

export namespace VxeNumberInputEvents { }

export namespace VxeNumberInputSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeNumberInputSlots {
  default: (params: VxeNumberInputSlotTypes.DefaultSlotParams) => any
}

export const NumberInput: typeof VxeNumberInput
export default VxeNumberInput
