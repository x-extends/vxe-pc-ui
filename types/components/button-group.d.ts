import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentSizeType, VxeComponentAlignType, VxeComponentEventParams, VxeComponentPermissionCodeType, ValueOf } from '@vxe-ui/core'
import { VxeButtonProps, VxeButtonPropTypes } from './button'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeButtonGroup: DefineVxeComponentApp<VxeButtonGroupProps, VxeButtonGroupEventProps, VxeButtonGroupSlots>
export type VxeButtonGroupComponent = DefineVxeComponentOptions<VxeButtonGroupProps>

export type VxeButtonGroupInstance = DefineVxeComponentInstance<{
  reactData: ButtonGroupReactData
}, VxeButtonGroupProps, VxeButtonGroupPrivateComputed, VxeButtonGroupMethods>

export type VxeButtonGroupConstructor = VxeButtonGroupInstance

export interface ButtonGroupPrivateRef {
}
export interface VxeButtonGroupPrivateRef extends ButtonGroupPrivateRef { }

export namespace VxeButtonGroupPropTypes {
  export type Size = VxeComponentSizeType
  export type PermissionCode = VxeComponentPermissionCodeType
  export type Options = VxeButtonProps[]
  export type Round = boolean
  export type Vertical = boolean
  export type Circle = boolean
  export type Align = VxeComponentAlignType
  export type Disabled = boolean
  export type Mode = VxeButtonPropTypes.Mode
  export type Status = VxeButtonPropTypes.Status
  export type ClassName = string | ((params: { $buttonGroup: VxeButtonGroupConstructor }) => string)
}

export interface VxeButtonGroupProps {
  size?: VxeButtonGroupPropTypes.Size
  permissionCode?: VxeButtonGroupPropTypes.PermissionCode
  options?: VxeButtonGroupPropTypes.Options
  mode?: VxeButtonGroupPropTypes.Mode
  status?: VxeButtonGroupPropTypes.Status
  round?: VxeButtonGroupPropTypes.Round
  align?: VxeButtonGroupPropTypes.Align
  vertical?: VxeButtonGroupPropTypes.Vertical
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
    name: VxeButtonPropTypes.Name | undefined
  }, evnt: Event): void
}
export interface VxeButtonGroupPrivateMethods extends ButtonGroupPrivateMethods { }

export type VxeButtonGroupEmits = [
  'click'
]

export namespace VxeButtonGroupDefines {
  export interface ButtonGroupEventParams extends VxeComponentEventParams {
    $buttonGroup: VxeButtonGroupConstructor
  }

  export interface ClickEventParams extends ButtonGroupEventParams {
    name: VxeButtonPropTypes.Name
    option: VxeButtonProps
  }
}

export type VxeButtonGroupEventProps = {
  onClick?: VxeButtonGroupEvents.Click
}

export interface VxeButtonGroupListeners {
  click?: VxeButtonGroupEvents.Click
}

export namespace VxeButtonGroupEvents {
  export type Click = (params: VxeButtonGroupDefines.ClickEventParams) => void
}

export namespace VxeButtonGroupSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeButtonGroupSlots {
  default?: (params: VxeButtonGroupSlotTypes.DefaultSlotParams) => any
}

export const ButtonGroup: typeof VxeButtonGroup
export default VxeButtonGroup
