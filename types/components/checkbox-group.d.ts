import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, ComputedRef, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, VxeComponentSizeType, ValueOf } from '@vxe-ui/core'
import { VxeCheckboxPropTypes } from './checkbox'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeCheckboxGroup: defineVxeComponent<VxeCheckboxGroupProps, VxeCheckboxGroupEventProps>
export type VxeCheckboxGroupComponent = DefineComponent<VxeCheckboxGroupProps, VxeCheckboxGroupEmits>

export type VxeCheckboxGroupInstance = ComponentPublicInstance<VxeCheckboxGroupProps, VxeCheckboxGroupConstructor>

export interface VxeCheckboxGroupConstructor extends VxeComponentBaseOptions, VxeCheckboxGroupMethods {
  props: VxeCheckboxGroupProps
  context: SetupContext<VxeCheckboxGroupEmits>
  reactData: CheckboxGroupReactData
  getRefMaps(): CheckboxGroupPrivateRef
  getComputeMaps(): CheckboxGroupPrivateComputed
  renderVN: RenderFunction
}

export interface CheckboxGroupPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeCheckboxGroupPrivateRef extends CheckboxGroupPrivateRef { }

export namespace VxeCheckboxGroupPropTypes {
  export type Size = VxeComponentSizeType
  export type ModelValue = any[]
  export type Options = {
    value?: VxeCheckboxPropTypes.Label
    label?: VxeCheckboxPropTypes.Content

    [key: string]: any
  }[]
  export type OptionProps = {
    value?: string
    label?: string
    disabled?: string
  }
  export type Max = string | number
  export type Disabled = boolean
}

export type VxeCheckboxGroupProps = {
  size?: VxeCheckboxGroupPropTypes.Size
  options?: VxeCheckboxGroupPropTypes.Options
  optionProps?: VxeCheckboxGroupPropTypes.OptionProps
  /**
   * 绑定值
   */
  modelValue?: VxeCheckboxGroupPropTypes.ModelValue
  max?: VxeCheckboxGroupPropTypes.Max
  /**
   * 是否禁用
   */
  disabled?: VxeCheckboxGroupPropTypes.Disabled
}

export interface CheckboxGroupPrivateComputed {
  computeIsMaximize: ComputedRef<boolean>
  computeIsDisabled: ComputedRef<boolean | undefined>
}
export interface VxeCheckboxGroupPrivateComputed extends CheckboxGroupPrivateComputed { }

export interface CheckboxGroupReactData {
}

export interface CheckboxGroupMethods {
  dispatchEvent(type: ValueOf<VxeCheckboxGroupEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeCheckboxGroupMethods extends CheckboxGroupMethods { }

export interface CheckboxGroupPrivateMethods {
  handleChecked(params: {
    checked: boolean
    value: VxeCheckboxPropTypes.ModelValue
    label: VxeCheckboxPropTypes.Label
  }, evnt: Event): void
}
export interface VxeCheckboxGroupPrivateMethods extends CheckboxGroupPrivateMethods { }

export type VxeCheckboxGroupEmits = [
  'update:modelValue',
  'change'
]

export namespace VxeCheckboxGroupDefines {
  export interface CheckboxGroupEventParams extends VxeComponentEventParams {
    $checkboxGroup: VxeCheckboxGroupConstructor
  }

  export type ChangeParams = {
    checklist: any[]
  }
  export interface ChangeEventParams extends CheckboxGroupEventParams, ChangeParams { }
}

export type VxeCheckboxGroupEventProps = {
  onChange?: VxeCheckboxGroupEvents.Change
}

export interface VxeCheckboxGroupListeners {
  change?: VxeCheckboxGroupEvents.Change
}

export namespace VxeCheckboxGroupEvents {
  export type Change = (params: VxeCheckboxGroupDefines.ChangeEventParams) => void
 }

export namespace VxeCheckboxGroupSlotTypes {
  export interface DefaultSlotParams {
    [key: string]: any
  }
}

export interface VxeCheckboxGroupSlots {
  default: (params: VxeCheckboxGroupSlotTypes.DefaultSlotParams) => any
}

export const CheckboxGroup: typeof VxeCheckboxGroup
export default VxeCheckboxGroup
