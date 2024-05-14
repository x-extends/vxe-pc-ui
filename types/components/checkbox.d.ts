import { RenderFunction, SetupContext, Ref, ComponentPublicInstance } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent, VxeComponentSize, ValueOf } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeCheckbox: defineVxeComponent<VxeCheckboxProps, VxeCheckboxEventProps>

export type VxeCheckboxInstance = ComponentPublicInstance<VxeCheckboxProps, VxeCheckboxConstructor>

export interface VxeCheckboxConstructor extends VxeComponentBase, VxeCheckboxMethods {
  props: VxeCheckboxProps
  context: SetupContext<VxeCheckboxEmits>
  reactData: CheckboxReactData
  getRefMaps(): CheckboxPrivateRef
  getComputeMaps(): CheckboxPrivateComputed
  renderVN: RenderFunction
}

export interface CheckboxPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeCheckboxPrivateRef extends CheckboxPrivateRef { }

export namespace VxeCheckboxPropTypes {
  export type Size = VxeComponentSize
  export type ModelValue = string | number | boolean
  export type Label = string | number
  export type Indeterminate = boolean
  export type Title = string | number
  export type CheckedValue = string | number | boolean
  export type UncheckedValue = string | number | boolean
  export type Content = string | number
  export type Disabled = boolean
}

export type VxeCheckboxProps = {
  size?: VxeCheckboxPropTypes.Size
  /**
   * 绑定值
   */
  modelValue?: VxeCheckboxPropTypes.ModelValue
  /**
   * 只对 checkbox-group 有效，值
   */
  label?: VxeCheckboxPropTypes.Label
  /**
   * 是否不确定状态
   */
  indeterminate?: VxeCheckboxPropTypes.Indeterminate
  /**
   * 原生 title 属性
   */
  title?: VxeCheckboxPropTypes.Title
  checkedValue?: VxeCheckboxPropTypes.CheckedValue
  uncheckedValue?: VxeCheckboxPropTypes.UncheckedValue
  /**
   * 内容
   */
  content?: VxeCheckboxPropTypes.Content
  /**
   * 是否禁用
   */
  disabled?: VxeCheckboxPropTypes.Disabled
}

export interface CheckboxPrivateComputed {
}
export interface VxeCheckboxPrivateComputed extends CheckboxPrivateComputed { }

export interface CheckboxReactData {
}

export interface CheckboxMethods {
  dispatchEvent(type: ValueOf<VxeCheckboxEmits>, params: any, evnt: Event): void
}
export interface VxeCheckboxMethods extends CheckboxMethods { }

export interface CheckboxPrivateMethods { }
export interface VxeCheckboxPrivateMethods extends CheckboxPrivateMethods { }

export type VxeCheckboxEmits = [
  'update:modelValue',
  'change'
]

export namespace VxeCheckboxDefines {
  export interface CheckboxEventParams extends VxeComponentEvent {
    $checkbox: VxeCheckboxConstructor
  }

  export interface ChangeParams {
    checked: boolean
    label: any
  }
  export interface ChangeEventParams extends CheckboxEventParams, ChangeParams { }
}

export type VxeCheckboxEventProps = {
  onChange?: VxeCheckboxEvents.Change
}

export interface VxeCheckboxListeners {
  change?: VxeCheckboxEvents.Change
}

export namespace VxeCheckboxEvents {
  export type Change = (params: VxeCheckboxDefines.ChangeEventParams) => void
}

export namespace VxeCheckboxSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeCheckboxSlots {
  default: (params: VxeCheckboxSlotTypes.DefaultSlotParams) => any
}

export const Checkbox: typeof VxeCheckbox
export default VxeCheckbox
