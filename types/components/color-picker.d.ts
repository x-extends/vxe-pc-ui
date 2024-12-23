import { RenderFunction, SetupContext, Ref } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentBaseOptions, VxeComponentEventParams, VxeComponentSizeType, VxeComponentStyleType } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeColorPicker: DefineVxeComponentApp<VxeColorPickerProps, VxeColorPickerEventProps, VxeColorPickerSlots>
export type VxeColorPickerComponent = DefineVxeComponentOptions<VxeColorPickerProps, VxeColorPickerEventProps>

export type VxeColorPickerInstance = DefineVxeComponentInstance<VxeColorPickerProps, VxeColorPickerConstructor>

export interface VxeColorPickerConstructor extends VxeComponentBaseOptions, VxeColorPickerMethods {
  props: VxeColorPickerProps
  context: SetupContext<VxeColorPickerEmits>
  reactData: ColorPickerReactData
  getRefMaps(): ColorPickerPrivateRef
  getComputeMaps(): ColorPickerPrivateComputed
  renderVN: RenderFunction
}

export interface ColorPickerPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeColorPickerPrivateRef extends ColorPickerPrivateRef { }

export namespace VxeColorPickerPropTypes {
  export type ModelValue = string
  export type Size = VxeComponentSizeType
  export type Type = 'rgb' | 'rgba' | 'hex'
  export type ClassName = string | ((params: { $colorPicker: VxeColorPickerConstructor }) => string)
  export type PopupClassName = string | ((params: {$colorPicker: VxeColorPickerConstructor }) => string)
  export type Colors = string[] | {
    label?: string
    value: string
  }[]
  export type ShowAlpha = boolean
  export type ShowColorExtractor = boolean
  export type ShowQuick = boolean
  export type Readonly = boolean
  export type Disabled = boolean
  export type Placeholder = string
  export type ClickToCopy = boolean
  export type Clearable = boolean
  export type Placement = 'top' | 'bottom' | '' | null
  export type Transfer = boolean
}

export interface VxeColorPickerProps {
  /**
   * 绑定值
   */
  modelValue?: VxeColorPickerPropTypes.ModelValue
  size?: VxeColorPickerPropTypes.Size
  type?: VxeColorPickerPropTypes.Type
  className?: VxeColorPickerPropTypes.ClassName
  popupClassName?: VxeColorPickerPropTypes.PopupClassName
  colors?: VxeColorPickerPropTypes.Colors
  showAlpha?: VxeColorPickerPropTypes.ShowAlpha
  showColorExtractor?: VxeColorPickerPropTypes.ShowColorExtractor
  showQuick?: VxeColorPickerPropTypes.ShowQuick
  readonly?: VxeColorPickerPropTypes.Readonly
  disabled?: VxeColorPickerPropTypes.Disabled
  placeholder?: VxeColorPickerPropTypes.Placeholder
  clickToCopy?: VxeColorPickerPropTypes.ClickToCopy
  clearable?: VxeColorPickerPropTypes.Clearable
  placement?: VxeColorPickerPropTypes.Placement
  transfer?: VxeColorPickerPropTypes.Transfer
}

export interface ColorPickerPrivateComputed {
}
export interface VxeColorPickerPrivateComputed extends ColorPickerPrivateComputed { }

export interface ColorPickerReactData {
  initialized: boolean
  selectColor: string
  panelColor: string
  hexValue: string
  rValue: number
  gValue: number
  bValue: number
  aValue: number
  panelIndex: number
  panelStyle: VxeComponentStyleType
  panelPlacement: any
  visiblePanel: boolean
  isAniVisible: boolean
  isActivated: boolean
}

export interface ColorPickerInternalData {
  hpTimeout?: undefined | number
}

export interface ColorPickerMethods {
}
export interface VxeColorPickerMethods extends ColorPickerMethods { }

export interface ColorPickerPrivateMethods { }
export interface VxeColorPickerPrivateMethods extends ColorPickerPrivateMethods { }

export type VxeColorPickerEmits = [
  'update:modelValue',
  'change',
  'clear',
  'click'
]

export namespace VxeColorPickerDefines {
  export interface ColorPickerEventParams extends VxeComponentEventParams {
    $colorPicker: VxeColorPickerConstructor
  }
}

export type VxeColorPickerEventProps = {}

export interface VxeColorPickerListeners { }

export namespace VxeColorPickerEvents { }

export namespace VxeColorPickerSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeColorPickerSlots {
  default?: (params: VxeColorPickerSlotTypes.DefaultSlotParams) => any
}

export const ColorPicker: typeof VxeColorPicker
export default VxeColorPicker
