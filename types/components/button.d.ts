import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, VxeComponentAlignType, VxeComponentPermissionCodeType, VxeComponentStatusType, VxeComponentSizeType, VxeComponentStyleType, ValueOf } from '@vxe-ui/core'
import { VxeTooltipDefines } from './tooltip'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeButton: DefineVxeComponentApp<VxeButtonProps, VxeButtonEventProps, VxeButtonSlots>
export type VxeButtonComponent = DefineVxeComponentOptions<VxeButtonProps>

export type VxeButtonInstance = DefineVxeComponentInstance<{
  reactData: ButtonReactData
}, VxeButtonProps, VxeButtonPrivateComputed, VxeButtonMethods>

export type VxeButtonConstructor = VxeButtonInstance

export interface ButtonPrivateRef {
}
export interface VxeButtonPrivateRef extends ButtonPrivateRef { }

export namespace VxeButtonPropTypes {
  export type Size = VxeComponentSizeType
  export type Type = string
  export type Mode = null | '' | 'button' | 'text'
  export type ClassName = string | ((params: { $button: VxeButtonConstructor }) => string)
  export type PopupClassName = string | ((params: { $button: VxeButtonConstructor }) => string)
  export type Name = string | number
  export type RouterLink = {
    path?: string
    name?: string | number | null
    query?: any
    params?: any
    target?: null | '' | '_blank' | '_self' | '_parent' | '_top'
  }
  export type PermissionCode = VxeComponentPermissionCodeType
  export type Content = string | number
  export type Placement = '' | 'top' | 'bottom'
  export type Status = VxeComponentStatusType
  export type Title = string
  export type Icon = string
  export type Round = boolean
  export type Circle = boolean
  export type Disabled = boolean
  export type Loading = boolean
  export type Trigger = 'manual' | 'hover' | 'click' | '' | null
  export type Align = VxeComponentAlignType

  export type PrefixTooltip = VxeTooltipDefines.TooltipHelperOption
  export type SuffixTooltip = VxeTooltipDefines.TooltipHelperOption

  export type DestroyOnClose = boolean
  export type Transfer = boolean
}

export interface VxeButtonProps {
  size?: VxeButtonPropTypes.Size
  /**
   * 按钮类型
   */
  type?: VxeButtonPropTypes.Type
  /**
   * 按钮的模式
   */
  mode?: VxeButtonPropTypes.Mode
  className?: VxeButtonPropTypes.ClassName
  popupClassName?: VxeButtonPropTypes.PopupClassName
  /**
   * 用来标识这一项
   */
  name?: VxeButtonPropTypes.Name
  routerLink?: VxeButtonPropTypes.RouterLink
  /**
   * 权限码
   */
  permissionCode?: VxeButtonPropTypes.PermissionCode
  title?: VxeButtonPropTypes.Title
  /**
   * 按钮内容
   */
  content?: VxeButtonPropTypes.Content
  /**
   * 固定显示下拉面板的方向
   */
  placement?: VxeButtonPropTypes.Placement
  /**
   * 按钮状态
   */
  status?: VxeButtonPropTypes.Status
  /**
   * 按钮的图标
   */
  icon?: VxeButtonPropTypes.Icon
  /**
   * 圆角边框
   */
  round?: VxeButtonPropTypes.Round
  /**
   * 圆角按钮
   */
  circle?: VxeButtonPropTypes.Circle
  /**
   * 是否禁用
   */
  disabled?: VxeButtonPropTypes.Disabled
  /**
   * 是否加载中
   */
  loading?: VxeButtonPropTypes.Loading
  trigger?: VxeButtonPropTypes.Trigger
  align?: VxeButtonPropTypes.Align

  prefixTooltip?: VxeButtonPropTypes.PrefixTooltip
  suffixTooltip?: VxeButtonPropTypes.SuffixTooltip
  /**
   * 在下拉面板关闭时销毁内容
   */
  destroyOnClose?: VxeButtonPropTypes.DestroyOnClose
  /**
   * 是否将弹框容器插入于 body 内
   */
  transfer?: VxeButtonPropTypes.Transfer
}

export interface ButtonPrivateComputed {
}
export interface VxeButtonPrivateComputed extends ButtonPrivateComputed { }

export interface ButtonReactData {
  initialized: boolean
  visiblePanel: boolean
  isAniVisible: boolean
  isActivated: boolean
  panelIndex: number
  panelStyle: VxeComponentStyleType
  panelPlacement: any
}

export interface ButtonInternalData {
  showTime: number | undefined
}

export interface ButtonMethods {
  dispatchEvent(type: ValueOf<VxeButtonEmits>, params: Record<string, any>, evnt: Event | null): void
  openPanel(): Promise<any>
  closePanel(): Promise<any>
  /**
   * 获取焦点
   */
  focus(): Promise<any>
  /**
   * 失去焦点
   */
  blur(): Promise<any>
}
export interface VxeButtonMethods extends ButtonMethods { }

export interface ButtonPrivateMethods { }
export interface VxeButtonPrivateMethods extends ButtonPrivateMethods { }

export type VxeButtonEmits = [
  'click',
  'mouseenter',
  'mouseleave',
  'dropdown-click'
]

export namespace VxeButtonDefines {
  export interface ButtonEventParams extends VxeComponentEventParams {
    $button: VxeButtonConstructor
  }

  export interface ClickParams { }
  export interface ClickEventParams extends ButtonEventParams, ClickParams { }

  export interface MouseenterParams { }
  export interface MouseenterEventParams extends ButtonEventParams, MouseenterParams { }

  export interface MouseleaveParams { }
  export interface MouseleaveEventParams extends ButtonEventParams, MouseleaveParams { }

  export interface DropdownClickParams { }
  export interface DropdownClickEventParams extends ButtonEventParams, DropdownClickParams { }
}

export type VxeButtonEventProps = {
  onClick?: VxeButtonEvents.Click
  onMouseenter?: VxeButtonEvents.Mouseenter
  onMouseleave?: VxeButtonEvents.Mouseleave
  onDropdownClick?: VxeButtonEvents.DropdownClick
}

export interface VxeButtonListeners {
  click?: VxeButtonEvents.Click
  mouseenter?: VxeButtonEvents.Mouseenter
  mouseleave?: VxeButtonEvents.Mouseleave
  dropdownClick?: VxeButtonEvents.DropdownClick
}

export namespace VxeButtonEvents {
  export type Click = (params: VxeButtonDefines.ClickEventParams) => void
  export type Mouseenter = (params: VxeButtonDefines.MouseenterEventParams) => void
  export type Mouseleave = (params: VxeButtonDefines.MouseleaveEventParams) => void
  export type DropdownClick = (params: VxeButtonDefines.DropdownClickParams) => void
}

export namespace VxeButtonSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeButtonSlots {
  /**
   * 自定义按钮内容
   */
  default?: (params: Record<string, any>) => any
  /**
   * 自定义自定义图标
   */
  icon?: (params: Record<string, any>) => any
  /**
   * 自定义下拉按钮
   */
  dropdowns?: (params: Record<string, any>) => any
}

export const Button: typeof VxeButton
export default VxeButton
