import { RenderFunction, SetupContext, Ref, ComputedRef } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentBaseOptions, VxeComponentEventParams, VxeComponentSizeType, ValueOf } from '@vxe-ui/core'
import { VxeRadioPropTypes } from './radio'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeRadioGroup: DefineVxeComponentApp<VxeRadioGroupProps, VxeRadioGroupEventProps, VxeRadioGroupSlots, VxeRadioGroupMethods>
export type VxeRadioGroupComponent = DefineVxeComponentOptions<VxeRadioGroupProps, VxeRadioGroupEventProps>

export type VxeRadioGroupInstance = DefineVxeComponentInstance<VxeRadioGroupProps, VxeRadioGroupConstructor>

export interface VxeRadioGroupConstructor extends VxeComponentBaseOptions, VxeRadioGroupMethods {
  name: string
  props: VxeRadioGroupProps
  context: SetupContext<VxeRadioGroupEmits>
  reactData: RadioGroupReactData
  getRefMaps(): RadioGroupPrivateRef
  getComputeMaps(): RadioGroupPrivateComputed
  renderVN: RenderFunction
}

export interface RadioGroupPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeRadioGroupPrivateRef extends RadioGroupPrivateRef { }

export namespace VxeRadioGroupPropTypes {
  export type Size = VxeComponentSizeType
  export type Type = 'button' | 'default' | '' | null
  export type Options = {
    value?: VxeRadioPropTypes.Label
    label?: VxeRadioPropTypes.Content

    [key: string]: any
  }[]
  export type OptionProps = {
    value?: string
    label?: string
    disabled?: string
  }
  export type ModelValue = any
  export type Strict = boolean
  export type Disabled = boolean
}

export interface VxeRadioGroupProps {
  size?: VxeRadioGroupPropTypes.Size
  type?: VxeRadioGroupPropTypes.Type
  options?: VxeRadioGroupPropTypes.Options
  optionProps?: VxeRadioGroupPropTypes.OptionProps
  /**
   * 严格模式，不允许取消
   */
  strict?: VxeRadioGroupPropTypes.Strict
  modelValue?: VxeRadioGroupPropTypes.ModelValue
  disabled?: VxeRadioGroupPropTypes.Disabled
}

export interface RadioGroupPrivateComputed {
  computeIsDisabled: ComputedRef<boolean | undefined>
}
export interface VxeRadioGroupPrivateComputed extends RadioGroupPrivateComputed { }

export interface RadioGroupReactData {
}

export interface RadioGroupMethods {
  dispatchEvent(type: ValueOf<VxeRadioGroupEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeRadioGroupMethods extends RadioGroupMethods { }

export interface RadioGroupPrivateMethods {
  handleChecked(params: { label: any }, evnt: Event): void
}
export interface VxeRadioGroupPrivateMethods extends RadioGroupPrivateMethods { }

export type VxeRadioGroupEmits = [
  'update:modelValue',
  'change'
]

export namespace VxeRadioGroupDefines {
  interface RadioGroupEventParams extends VxeComponentEventParams {
    $radioGroup: VxeRadioGroupConstructor
  }

  export interface ChangeParams {
    label: any
  }
  export interface ChangeEventParams extends RadioGroupEventParams, ChangeParams { }
}

export type VxeRadioGroupEventProps = {
  'onUpdate:modelValue'?: VxeRadioGroupEvents.UpdateModelValue
  onChange?: VxeRadioGroupEvents.Change
}

export interface VxeRadioGroupListeners {
  'update:modelValue'?: VxeRadioGroupEvents.UpdateModelValue
  change?: VxeRadioGroupEvents.Change
}

export namespace VxeRadioGroupEvents {
  export type UpdateModelValue = (modelValue: VxeRadioGroupPropTypes.ModelValue) => void
  export type Change = (params: VxeRadioGroupDefines.ChangeEventParams) => void
}

export namespace VxeRadioGroupSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeRadioGroupSlots {
  default?: (params: VxeRadioGroupSlotTypes.DefaultSlotParams) => any
}

export const RadioGroup: typeof VxeRadioGroup
export default VxeRadioGroup
