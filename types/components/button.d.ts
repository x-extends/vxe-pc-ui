import { RenderFunction, SetupContext, Ref } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent, VxeComponentStatus, VxeComponentSize, VxeComponentStyle, ValueOf } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeButton: defineVxeComponent<VxeButtonProps, VxeButtonEventProps>

export type VxeButtonInstance = ComponentPublicInstance<VxeButtonProps, VxeButtonConstructor>

export interface VxeButtonConstructor extends VxeComponentBase, VxeButtonMethods {
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
  export type Size = VxeComponentSize
  export type Type = string
  export type Mode = null | '' | 'button' | 'text'
  export type ClassName = string | ((params: { $button: VxeButtonConstructor }) => string)
  export type PopupClassName = string | ((params: { $button: VxeButtonConstructor }) => string)
  export type Name = string | number
  export type Content = string | number
  export type Placement = string
  export type Status = VxeComponentStatus
  export type Title = string
  export type Icon = string
  export type Round = boolean
  export type Circle = boolean
  export type Disabled = boolean
  export type Loading = boolean
  export type DestroyOnClose = boolean
  export type Transfer = boolean
}

export type VxeButtonProps = {
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
  inited: boolean
  showPanel: boolean
  animatVisible: boolean
  panelIndex: number
  panelStyle: VxeComponentStyle
  panelPlacement: any
}

export interface ButtonInternalData {
  showTime: any
}

export interface ButtonMethods {
  dispatchEvent(type: ValueOf<VxeButtonEmits>, params: any, evnt: Event): void
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
  export interface ButtonEventParams extends VxeComponentEvent {
    $button: VxeButtonConstructor
  }
}

export type VxeButtonEventProps = {}

export interface VxeButtonListeners { }

export namespace VxeButtonEvents { }

export namespace VxeButtonSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeButtonSlots {
  /**
   * 自定义显示内容模板
   */
  default: (params: VxeButtonSlotTypes.DefaultSlotParams) => any
}

export const Button: typeof VxeButton
export default VxeButton
