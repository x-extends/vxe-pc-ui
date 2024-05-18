import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent, VxeComponentSize, ValueOf } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeRadioGroup: defineVxeComponent<VxeRadioGroupProps, VxeRadioGroupEventProps>
export type VxeRadioGroupComponent = DefineComponent<VxeRadioGroupProps, VxeRadioGroupEmits>

export type VxeRadioGroupInstance = ComponentPublicInstance<VxeRadioGroupProps, VxeRadioGroupConstructor>

export interface VxeRadioGroupConstructor extends VxeComponentBase, VxeRadioGroupMethods {
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
  export type Size = VxeComponentSize
  export type Type = 'button' | 'default' | '' | null
  export type Options = {
    value?: VxeRadioPropTypes.Label
    label?: VxeRadioPropTypes.Content

    [key: string]: any
  }[]
  export type OptionProps = VxeGlobalRendererHandles.RenderOptionProps
  export type ModelValue = any
  export type Strict = boolean
  export type Disabled = boolean
}

export type VxeRadioGroupProps = {
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
}
export interface VxeRadioGroupPrivateComputed extends RadioGroupPrivateComputed { }

export interface RadioGroupReactData {
}

export interface RadioGroupMethods {
  dispatchEvent(type: ValueOf<VxeRadioGroupEmits>, params: any, evnt?: Event): void
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
  interface RadioGroupEventParams extends VxeComponentEvent {
    $radioGroup: VxeRadioGroupConstructor
  }

  export interface ChangeParams {
    label: any
  }
  export interface ChangeEventParams extends RadioGroupEventParams, ChangeParams { }
}

export type VxeRadioGroupEventProps = {
  onChange?: VxeRadioGroupEvents.Change
}

export interface VxeRadioGroupListeners {
  change?: VxeRadioGroupEvents.Change
}

export namespace VxeRadioGroupEvents {
  export type Change = (params: VxeRadioGroupDefines.ChangeEventParams) => void
}

export namespace VxeRadioGroupSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeRadioGroupSlots {
  default: (params: VxeRadioGroupSlotTypes.DefaultSlotParams) => any
}

export const RadioGroup: typeof VxeRadioGroup
export default VxeRadioGroup
