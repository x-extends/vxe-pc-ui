import { RenderFunction, SetupContext, Ref } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, VxeComponentBaseOptions, DefineVxeComponentInstance, VxeComponentAlignType, VxeComponentEventParams, VxeComponentPermissionCodeType, VxeComponentStatusType, VxeComponentSizeType, VxeComponentStyleType, ValueOf } from '@vxe-ui/core'
import { VxeTooltipDefines } from './tooltip'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeButton: DefineVxeComponentApp<VxeButtonProps, VxeButtonEventProps, VxeButtonSlots, VxeButtonMethods>
export type VxeButtonComponent = DefineVxeComponentOptions<VxeButtonProps, VxeButtonEventProps>

export type VxeButtonInstance = DefineVxeComponentInstance<VxeButtonProps, VxeButtonConstructor>

export interface VxeButtonConstructor extends VxeComponentBaseOptions, VxeButtonMethods {
  props: VxeButtonProps
  context: SetupContext<VxeButtonEmits>
  reactData: ButtonReactData
  internalData: ButtonInternalData
  getRefMaps(): ButtonPrivateRef
  getComputeMaps(): ButtonPrivateComputed
  renderVN: RenderFunction
}

export interface ButtonPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
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

  /**
   * 按钮的前缀图标，属于 prefix-icon 的简写
   */
  export type Icon = string
  export type PrefixIcon = string
  export type SuffixIcon = string

  export type Round = boolean
  export type Circle = boolean
  export type Disabled = boolean
  export type Loading = boolean
  export type Trigger = 'manual' | 'hover' | 'click' | '' | null
  export type Align = VxeComponentAlignType
  export type Options = VxeButtonDefines.DownButtonOption[]

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
   * 按钮的前缀图标，属于 prefix-icon 的简写
   */
  icon?: VxeButtonPropTypes.Icon
  /**
   * 按钮的前缀图标
   */
  prefixIcon?: VxeButtonPropTypes.PrefixIcon
  /**
   * 按钮的后缀图标
   */
  suffixIcon?: VxeButtonPropTypes.SuffixIcon
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

  /**
   * 下拉按钮列表
   */
  options?: VxeButtonPropTypes.Options

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
  tooltipTimeout: number | undefined
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
  'dropdown-click',
  'dropdownClick'
]

export namespace VxeButtonDefines {
  export interface ButtonEventParams extends VxeComponentEventParams {
    $button: VxeButtonConstructor
  }

  export type DownButtonOption = Pick<VxeButtonProps, 'type' | 'mode' | 'className' | 'name' | 'routerLink' | 'permissionCode' | 'title' | 'content' | 'status' | 'icon' | 'round' | 'circle' | 'disabled' | 'loading' | 'align'>

  export interface ClickParams { }
  export interface ClickEventParams extends ButtonEventParams, ClickParams {
    $event: KeyboardEvent
  }

  export interface MouseenterParams { }
  export interface MouseenterEventParams extends ButtonEventParams, MouseenterParams { }

  export interface MouseleaveParams { }
  export interface MouseleaveEventParams extends ButtonEventParams, MouseleaveParams { }

  export interface DropdownClickParams {
    name: VxeButtonPropTypes.Name
    option: VxeButtonDefines.DownButtonOption | null
  }
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
  default?: (params: VxeButtonSlotTypes.DefaultSlotParams) => any
  /**
   * 自定义自定义图标
   */
  prefix?: (params: VxeButtonSlotTypes.DefaultSlotParams) => any
  /**
   * 自定义自定义图标
   */
  suffix?: (params: VxeButtonSlotTypes.DefaultSlotParams) => any
  /**
   * 自定义下拉按钮
   */
  dropdowns?: (params: VxeButtonSlotTypes.DefaultSlotParams) => any

  /**
   * 已废弃，被 prefix 替换
   * @deprecated
   */
  icon?: (params: VxeButtonSlotTypes.DefaultSlotParams) => any
}

export const Button: typeof VxeButton
export default VxeButton
