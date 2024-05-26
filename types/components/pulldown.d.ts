import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, VxeComponentSizeType, VxeComponentStyleType, ValueOf } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxePulldown: defineVxeComponent<VxePulldownProps, VxePulldownEventProps>
export type VxePulldownComponent = DefineComponent<VxePulldownProps, VxePulldownEmits>

export type VxePulldownInstance = ComponentPublicInstance<VxePulldownProps, VxePulldownConstructor>

export interface VxePulldownConstructor extends VxeComponentBaseOptions, VxePulldownMethods {
  props: VxePulldownProps
  context: SetupContext<VxePulldownEmits>
  reactData: PulldownReactData
  getRefMaps(): PulldownPrivateRef
  getComputeMaps(): PulldownPrivateComputed
  renderVN: RenderFunction
}

export interface PulldownPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxePulldownPrivateRef extends PulldownPrivateRef { }

export namespace VxePulldownPropTypes {
  export type ModelValue = boolean
  export type Size = VxeComponentSizeType
  export type Disabled = boolean
  export type Placement = string
  export type ClassName = string | ((params: { $pulldown: VxePulldownConstructor }) => string)
  export type PopupClassName = string | ((params: { $pulldown: VxePulldownConstructor }) => string)
  export type DestroyOnClose = boolean
  export type Transfer = boolean
}

export type VxePulldownProps = {
  size?: VxePulldownPropTypes.Size
  modelValue?: VxePulldownPropTypes.ModelValue
  /**
   * 是否禁用
   */
  disabled?: VxePulldownPropTypes.Disabled
  className?: VxePulldownPropTypes.ClassName
  popupClassName?: VxePulldownPropTypes.PopupClassName
  /**
   * 固定显示下拉面板的方向
   */
  placement?: VxePulldownPropTypes.Placement
  /**
   * 在下拉容器关闭时销毁内容
   */
  destroyOnClose?: VxePulldownPropTypes.DestroyOnClose
  /**
   * 是否将弹框容器插入于 body 内（对于嵌入到表格或者弹窗中被遮挡时需要设置为 true）
   */
  transfer?: VxePulldownPropTypes.Transfer
}

export interface PulldownPrivateComputed {
}
export interface VxePulldownPrivateComputed extends PulldownPrivateComputed { }

export interface PulldownReactData {
  inited: boolean
  panelIndex: number
  panelStyle: VxeComponentStyleType | null
  panelPlacement: string | null
  visiblePanel: boolean
  animatVisible: boolean
  isActivated: boolean
}

export interface PulldownMethods {
  dispatchEvent(type: ValueOf<VxePulldownEmits>, params: Record<string, any>, evnt: Event | null): void
  /**
   * 判断下拉面板是否可视
   */
  isPanelVisible(): boolean

  /**
   * 切换下拉面板
   */
  togglePanel(): Promise<void>

  /**
   * 显示下拉面板
   */
  showPanel(): Promise<void>

  /**
   * 隐藏下拉面板
   */
  hidePanel(): Promise<void>
}
export interface VxePulldownMethods extends PulldownMethods { }

export interface PulldownPrivateMethods { }
export interface VxePulldownPrivateMethods extends PulldownPrivateMethods { }

export type VxePulldownEmits = [
  'update:modelValue',
  'hide-panel'
]

export namespace VxePulldownDefines {
  export interface PulldownEventParams extends VxeComponentEventParams {
    $pulldown: VxePulldownConstructor
  }

  export interface HidePanelParams { }
  export type HidePanelEventParams = HidePanelParams
}

export type VxePulldownEventProps = {
  onHidePanel?: VxePulldownEvents.HidePanel
}

export interface VxePulldownListeners {
  hidePanel?: VxePulldownEvents.HidePanel
}

export namespace VxePulldownEvents {
  export type HidePanel = (params: VxePulldownDefines.HidePanelEventParams) => void
 }

export namespace VxePulldownSlotTypes {
  export interface DefaultSlotParams {
    [key: string]: any
  }
}

export interface VxePulldownSlots {
  header: (params: VxePulldownSlotTypes.DefaultSlotParams) => any
  default: (params: VxePulldownSlotTypes.DefaultSlotParams) => any
  footer: (params: VxePulldownSlotTypes.DefaultSlotParams) => any
  dropdown: (params: VxePulldownSlotTypes.DefaultSlotParams) => any
}

export const Pulldown: typeof VxePulldown
export default VxePulldown
