import { RenderFunction, SetupContext, Ref, ComponentPublicInstance } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentSize, VxeComponentEvent, ValueOf } from '../tool'
import { VxeButtonProps, VxeButtonPropTypes } from './button'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeButtonGroup: defineVxeComponent<VxeButtonGroupProps, VxeButtonGroupEventProps>

export type VxeButtonGroupInstance = ComponentPublicInstance<VxeButtonGroupProps, VxeButtonGroupConstructor>

export interface VxeButtonGroupConstructor extends VxeComponentBase, VxeButtonGroupMethods {
  props: VxeButtonGroupProps
  context: SetupContext<VxeButtonGroupEmits>
  reactData: ButtonGroupReactData
  getRefMaps(): ButtonGroupPrivateRef
  getComputeMaps(): ButtonGroupPrivateComputed
  renderVN: RenderFunction
}

export interface ButtonGroupPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeButtonGroupPrivateRef extends ButtonGroupPrivateRef { }

export namespace VxeButtonGroupPropTypes {
  export type Size = VxeComponentSize
  export type Options = VxeButtonProps[]
  export type Round = boolean
  export type Circle = boolean
  export type Disabled = boolean
  export type Mode = VxeButtonPropTypes.Mode
  export type Status = VxeButtonPropTypes.Status
  export type ClassName = string | ((params: { $buttonGroup: VxeButtonGroupConstructor }) => string)
}

export type VxeButtonGroupProps = {
  size?: VxeButtonGroupPropTypes.Size
  options?: VxeButtonGroupPropTypes.Options
  mode?: VxeButtonGroupPropTypes.Mode
  status?: VxeButtonGroupPropTypes.Status
  round?: VxeButtonGroupPropTypes.Round
  circle?: VxeButtonGroupPropTypes.Circle
  /**
   * 是否禁用
   */
  disabled?: VxeButtonGroupPropTypes.Disabled
  className?: VxeButtonGroupPropTypes.ClassName
}

export interface ButtonGroupPrivateComputed {
}
export interface VxeButtonGroupPrivateComputed extends ButtonGroupPrivateComputed { }

export interface ButtonGroupReactData {
}

export interface ButtonGroupMethods {
  dispatchEvent(type: ValueOf<VxeButtonGroupEmits>, params: any, evnt: Event): void
}
export interface VxeButtonGroupMethods extends ButtonGroupMethods { }

export interface ButtonGroupPrivateMethods {
  handleClick(params: {
    name: VxeButtonPropTypes.Name
  }, evnt: Event): void
}
export interface VxeButtonGroupPrivateMethods extends ButtonGroupPrivateMethods { }

export type VxeButtonGroupEmits = [
  'click'
]

export namespace VxeButtonGroupDefines {
  export interface ButtonGroupEventParams extends VxeComponentEvent {
    $buttonGroup: VxeButtonGroupConstructor
  }
}

export type VxeButtonGroupEventProps = {}

export interface VxeButtonGroupListeners { }

export namespace VxeButtonGroupEvents { }

export namespace VxeButtonGroupSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeButtonGroupSlots {
  default: (params: VxeButtonGroupSlotTypes.DefaultSlotParams) => any
}

export const ButtonGroup: typeof VxeButtonGroup
export default VxeButtonGroup
