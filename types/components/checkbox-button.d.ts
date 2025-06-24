import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'
import { VxeCheckboxPropTypes } from './checkbox'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeCheckboxButton: DefineVxeComponentApp<VxeCheckboxButtonProps, VxeCheckboxButtonEventProps, VxeCheckboxButtonSlots, VxeCheckboxButtonMethods>
export type VxeCheckboxButtonComponent = DefineVxeComponentOptions<VxeCheckboxButtonProps>

export type VxeCheckboxButtonInstance = DefineVxeComponentInstance<{
  reactData: CheckboxButtonReactData
}, VxeCheckboxButtonProps, VxeCheckboxButtonPrivateComputed, VxeCheckboxButtonMethods>

export type VxeCheckboxButtonConstructor = VxeCheckboxButtonInstance

export interface CheckboxButtonPrivateRef {
}
export interface VxeCheckboxButtonPrivateRef extends CheckboxButtonPrivateRef { }

export namespace VxeCheckboxButtonPropTypes {
  export type Size = VxeCheckboxPropTypes.Size
  export type ModelValue = any
  export type Label = VxeCheckboxPropTypes.Label
  export type Title = VxeCheckboxPropTypes.Title
  export type CheckedValue = VxeCheckboxPropTypes.CheckedValue
  export type UncheckedValue = VxeCheckboxPropTypes.UncheckedValue
  export type Content = VxeCheckboxPropTypes.Content
  export type Disabled = VxeCheckboxPropTypes.Disabled
}

export interface VxeCheckboxButtonProps {
  size?: VxeCheckboxButtonPropTypes.Size
  modelValue?: VxeCheckboxButtonPropTypes.ModelValue
  label?: VxeCheckboxButtonPropTypes.Label
  title?: VxeCheckboxButtonPropTypes.Title
  checkedValue?: VxeCheckboxButtonPropTypes.CheckedValue
  uncheckedValue?: VxeCheckboxButtonPropTypes.UncheckedValue
  content?: VxeCheckboxButtonPropTypes.Content
  disabled?: VxeCheckboxButtonPropTypes.Disabled
}

export interface CheckboxButtonPrivateComputed {
}
export interface VxeCheckboxButtonPrivateComputed extends CheckboxButtonPrivateComputed { }

export interface CheckboxButtonReactData {
}

export interface CheckboxButtonMethods {
  dispatchEvent(type: ValueOf<VxeCheckboxButtonEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeCheckboxButtonMethods extends CheckboxButtonMethods { }

export interface CheckboxButtonPrivateMethods { }
export interface VxeCheckboxButtonPrivateMethods extends CheckboxButtonPrivateMethods { }

export type VxeCheckboxButtonEmits = [
  'input',
  'change'
]

export namespace VxeCheckboxButtonDefines {
  interface CheckboxButtonEventParams extends VxeComponentEventParams {
    $checkboxButton: VxeCheckboxButtonConstructor
  }

  export interface ChangeParams {
    label: any
  }
  export interface ChangeEventParams extends CheckboxButtonEventParams, ChangeParams { }
}

export type VxeCheckboxButtonEventProps = {
  onChange?: VxeCheckboxButtonEvents.Change
}

export interface VxeCheckboxButtonListeners {
  change?: VxeCheckboxButtonEvents.Change
}

export namespace VxeCheckboxButtonEvents {
  export type Change = (params: VxeCheckboxButtonDefines.ChangeEventParams) => void
}

export namespace VxeCheckboxButtonSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeCheckboxButtonSlots {
  default?: (params: VxeCheckboxButtonSlotTypes.DefaultSlotParams) => any
}

export const CheckboxButton: typeof VxeCheckboxButton
export default VxeCheckboxButton
