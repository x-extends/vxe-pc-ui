import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'
import { VxeRadioPropTypes } from './radio'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeRadioButton: defineVxeComponent<VxeRadioButtonProps, VxeRadioButtonEventProps, VxeRadioButtonSlots>
export type VxeRadioButtonComponent = DefineComponent<VxeRadioButtonProps & VxeRadioButtonEventProps>

export type VxeRadioButtonInstance = ComponentPublicInstance<VxeRadioButtonProps, VxeRadioButtonConstructor>

export interface VxeRadioButtonConstructor extends VxeComponentBaseOptions, VxeRadioButtonMethods {
  props: VxeRadioButtonProps
  context: SetupContext<VxeRadioButtonEmits>
  reactData: RadioButtonReactData
  getRefMaps(): RadioButtonPrivateRef
  getComputeMaps(): RadioButtonPrivateComputed
  renderVN: RenderFunction
}

export interface RadioButtonPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeRadioButtonPrivateRef extends RadioButtonPrivateRef { }

export namespace VxeRadioButtonPropTypes {
  export type Size = VxeRadioPropTypes.Size
  export type ModelValue = any
  export type Strict = boolean
  export type Label = VxeRadioPropTypes.Label
  export type Title = string | number
  export type Content = string | number
  export type Disabled = boolean
}

export type VxeRadioButtonProps = {
  size?: VxeRadioButtonPropTypes.Size
  modelValue?: VxeRadioButtonPropTypes.ModelValue
  /**
   * 严格模式，不允许取消
   */
  strict?: VxeRadioButtonPropTypes.Strict
  label?: VxeRadioButtonPropTypes.Label
  title?: VxeRadioButtonPropTypes.Title
  content?: VxeRadioButtonPropTypes.Content
  disabled?: VxeRadioButtonPropTypes.Disabled
}

export interface RadioButtonPrivateComputed {
}
export interface VxeRadioButtonPrivateComputed extends RadioButtonPrivateComputed { }

export interface RadioButtonReactData {
}

export interface RadioButtonMethods {
  dispatchEvent(type: ValueOf<VxeRadioButtonEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeRadioButtonMethods extends RadioButtonMethods { }

export interface RadioButtonPrivateMethods { }
export interface VxeRadioButtonPrivateMethods extends RadioButtonPrivateMethods { }

export type VxeRadioButtonEmits = [
  'update:modelValue',
  'change'
]

export namespace VxeRadioButtonDefines {
  interface RadioButtonEventParams extends VxeComponentEventParams {
    $radioButton: VxeRadioButtonConstructor
  }

  export interface ChangeParams {
    label: any
  }
  export interface ChangeEventParams extends RadioButtonEventParams, ChangeParams { }
}

export type VxeRadioButtonEventProps = {
  onChange?: VxeRadioButtonEvents.Change
}

export interface VxeRadioButtonListeners {
  change?: VxeRadioButtonEvents.Change
}

export namespace VxeRadioButtonEvents {
  export type Change = (params: VxeRadioButtonDefines.ChangeEventParams) => void
}

export namespace VxeRadioButtonSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeRadioButtonSlots {
  default?: (params: VxeRadioButtonSlotTypes.DefaultSlotParams) => any
}

export const RadioButton: typeof VxeRadioButton
export default VxeRadioButton
