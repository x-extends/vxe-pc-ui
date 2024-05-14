import { RenderFunction, SetupContext, Ref, ComponentPublicInstance } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeTooltip: defineVxeComponent<VxeTooltipProps, VxeTooltipEventProps>

export type VxeTooltipInstance = ComponentPublicInstance<VxeTooltipProps, VxeTooltipConstructor>

export interface VxeTooltipConstructor extends VxeComponentBase, VxeTooltipMethods {
  props: VxeTooltipProps
  context: SetupContext<VxeTooltipEmits>
  reactData: TooltipReactData
  getRefMaps(): TooltipPrivateRef
  getComputeMaps(): TooltipPrivateComputed
  renderVN: RenderFunction
}

export interface TooltipPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeTooltipPrivateRef extends TooltipPrivateRef { }

export namespace VxeTooltipPropTypes {
  export type Size = SizeType
  export type ModelValue = boolean
  export type Trigger = 'hover' | 'click' | 'manual' | '' | null
  export type Theme = string
  export type Content = string | number
  export type UseHTML = boolean
  export type ZIndex = string | number
  export type PopupClassName = string | ((params: { $tooltip: VxeTooltipConstructor }) => string)
  export type IsArrow = boolean
  export type Enterable = boolean
  export type EnterDelay = number
  export type LeaveDelay = number
  export type LeaveMethod = (params: { $event: MouseEvent }) => boolean
}

export type VxeTooltipProps = {
  size?: VxeTooltipPropTypes.Size
  modelValue?: VxeTooltipPropTypes.ModelValue
  trigger?: VxeTooltipPropTypes.Trigger
  theme?: VxeTooltipPropTypes.Theme
  content?: VxeTooltipPropTypes.Content
  useHTML?: VxeTooltipPropTypes.UseHTML
  popupClassName?: VxeTooltipPropTypes.PopupClassName
  zIndex?: VxeTooltipPropTypes.ZIndex
  isArrow?: VxeTooltipPropTypes.IsArrow
  enterable?: VxeTooltipPropTypes.Enterable
  enterDelay?: VxeTooltipPropTypes.EnterDelay
  leaveDelay?: VxeTooltipPropTypes.LeaveDelay
  leaveMethod?: VxeTooltipPropTypes.LeaveMethod
}

export interface TooltipPrivateComputed {
}
export interface VxeTooltipPrivateComputed extends TooltipPrivateComputed { }

export interface TooltipReactData {
  target: HTMLElement | null
  isUpdate: boolean
  visible: boolean
  tipContent: string | number | undefined,
  tipActive: boolean
  tipTarget: HTMLElement | null
  tipZindex: number
  tipStore: {
    style: VNodeStyle
    placement: any
    arrowStyle: VNodeStyle
  }
}

export interface TooltipMethods {
  dispatchEvent(type: ValueOf<VxeTooltipEmits>, params: any, evnt: Event): void
  /**
   * 显示
   * @param target 自定义目标元素
   * @param content 自定义内容
   */
  open(target?: any, content?: VxeTooltipPropTypes.Content): Promise<void>
  toVisible(target?: HTMLElement, content?: VxeTooltipPropTypes.Content): Promise<void>
  /**
   * 隐藏
   */
  close(): Promise<any>
  updatePlacement(): Promise<any>
  isActived(): boolean
  setActived(actived: boolean): void
}
export interface VxeTooltipMethods extends TooltipMethods { }

export interface TooltipPrivateMethods { }
export interface VxeTooltipPrivateMethods extends TooltipPrivateMethods { }

export type VxeTooltipEmits = [
  'update:modelValue'
]

export namespace VxeTooltipDefines {
  export interface TooltipEventParams extends VxeComponentEvent {
    $tooltip: VxeTooltipConstructor
  }
}

export type VxeTooltipEventProps = {}

export interface VxeTooltipListeners { }

export namespace VxeTooltipEvents { }

export namespace VxeTooltipSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeTooltipSlots {
  default: (params: VxeTooltipSlotTypes.DefaultSlotParams) => any
}

export const Tooltip: typeof VxeTooltip
export default VxeTooltip
