import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, VxeComponentSizeType, ValueOf } from '@vxe-ui/core'
import { VxeCheckboxPropTypes } from './checkbox'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeCheckboxGroup: DefineVxeComponentApp<VxeCheckboxGroupProps, VxeCheckboxGroupEventProps, VxeCheckboxGroupSlots>
export type VxeCheckboxGroupComponent = DefineVxeComponentOptions<VxeCheckboxGroupProps>

export type VxeCheckboxGroupInstance = DefineVxeComponentInstance<{
  reactData: CheckboxGroupReactData
}, VxeCheckboxGroupProps, VxeCheckboxGroupPrivateComputed, VxeCheckboxGroupMethods>

export type VxeCheckboxGroupConstructor = VxeCheckboxGroupInstance

export interface CheckboxGroupPrivateRef {
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

export interface VxeCheckboxGroupProps {
  size?: VxeCheckboxGroupPropTypes.Size
  options?: VxeCheckboxGroupPropTypes.Options
  optionProps?: VxeCheckboxGroupPropTypes.OptionProps
  /**
   * 绑定值
   */
  value?: VxeCheckboxGroupPropTypes.ModelValue
  max?: VxeCheckboxGroupPropTypes.Max
  /**
   * 是否禁用
   */
  disabled?: VxeCheckboxGroupPropTypes.Disabled
}

export interface CheckboxGroupPrivateComputed {
  computeIsMaximize: boolean
  computeIsDisabled: boolean | undefined
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
  'input',
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
  default?: (params: VxeCheckboxGroupSlotTypes.DefaultSlotParams) => any
}

export const CheckboxGroup: typeof VxeCheckboxGroup
export default VxeCheckboxGroup
