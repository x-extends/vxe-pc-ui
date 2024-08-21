import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf, VxeComponentStyleType, VxeComponentSizeType } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeIconPicker: defineVxeComponent<VxeIconPickerProps, VxeIconPickerEventProps, VxeIconPickerSlots>
export type VxeIconPickerComponent = DefineComponent<VxeIconPickerProps & VxeIconPickerEventProps>

export type VxeIconPickerInstance = ComponentPublicInstance<VxeIconPickerProps, VxeIconPickerConstructor>

export interface VxeIconPickerConstructor extends VxeComponentBaseOptions, VxeIconPickerMethods {
  props: VxeIconPickerProps
  context: SetupContext<VxeIconPickerEmits>
  reactData: IconPickerReactData
  getRefMaps(): IconPickerPrivateRef
  getComputeMaps(): IconPickerPrivateComputed
  renderVN: RenderFunction
}

export interface IconPickerPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeIconPickerPrivateRef extends IconPickerPrivateRef { }

export namespace VxeIconPickerPropTypes {
  export type ModelValue = string
  export type Placeholder = string
  export type Size = VxeComponentSizeType
  export type ClassName = string | ((params: { $iconPicker: VxeIconPickerConstructor }) => string)
  export type PopupClassName = string | ((params: {$iconPicker: VxeIconPickerConstructor }) => string)
  export type Readonly = boolean
  export type Disabled = boolean
  export type Icons = string[]
  export type Clearable = boolean
  export type ShowIconTitle = boolean
  export type Placement = 'top' | 'bottom' | '' | null
  export type Transfer = boolean
}

export type VxeIconPickerProps = {
  /**
   * 绑定值
   */
  modelValue?: VxeIconPickerPropTypes.ModelValue
  placeholder?: VxeIconPickerPropTypes.Placeholder
  size?: VxeIconPickerPropTypes.Size
  className?: VxeIconPickerPropTypes.ClassName
  popupClassName?: VxeIconPickerPropTypes.PopupClassName
  readonly?: VxeIconPickerPropTypes.Readonly
  disabled?: VxeIconPickerPropTypes.Disabled
  icons?: VxeIconPickerPropTypes.Icons
  clearable?: VxeIconPickerPropTypes.Clearable
  showIconTitle?: VxeIconPickerPropTypes.ShowIconTitle
  placement?: VxeIconPickerPropTypes.Placement
  transfer?: VxeIconPickerPropTypes.Transfer
}

export interface IconPickerPrivateComputed {
}
export interface VxeIconPickerPrivateComputed extends IconPickerPrivateComputed { }

export interface IconPickerReactData {
  initialized: boolean
  selectIcon: VxeIconPickerPropTypes.ModelValue
  panelIndex: number
  panelStyle: VxeComponentStyleType
  panelPlacement: any
  visiblePanel: boolean
  isAniVisible: boolean
  isActivated: boolean
}

export interface IconPickerMethods {
  dispatchEvent(type: ValueOf<VxeIconPickerEmits>, params: Record<string, any>, evnt: Event | null): void
  /**
   * 判断下拉面板是否可视
   */
  isPanelVisible(): boolean
  /**
   * 切换下拉面板
   */
  togglePanel(): Promise<any>
  /**
   * 显示下拉面板
   */
  showPanel(): Promise<any>
  /**
   * 隐藏下拉面板
   */
  hidePanel(): Promise<any>
  /**
   * 获取焦点
   */
  focus(): Promise<any>
  /**
   * 失去焦点
   */
  blur(): Promise<any>
}
export interface VxeIconPickerMethods extends IconPickerMethods { }

export interface IconPickerPrivateMethods { }
export interface VxeIconPickerPrivateMethods extends IconPickerPrivateMethods { }

export type VxeIconPickerEmits = [
  'update:modelValue',
  'change',
  'clear',
  'click'
]

export namespace VxeIconPickerDefines {
  export interface IconPickerEventParams extends VxeComponentEventParams {
    $iconPicker: VxeIconPickerConstructor
  }

  export interface IconItemObj {
    title?: string
    icon?: string
  }
}

export type VxeIconPickerEventProps = {}

export interface VxeIconPickerListeners { }

export namespace VxeIconPickerEvents { }

export namespace VxeIconPickerSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeIconPickerSlots {
  default: (params: VxeIconPickerSlotTypes.DefaultSlotParams) => any
}

export const IconPicker: typeof VxeIconPicker
export default VxeIconPicker
