import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, VxeComponentStyleType, VxeComponentSizeType } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeColorPicker: DefineVxeComponentApp<VxeColorPickerProps, VxeColorPickerEventProps, VxeColorPickerSlots, VxeColorPickerMethods>
export type VxeColorPickerComponent = DefineVxeComponentOptions<VxeColorPickerProps>

export type VxeColorPickerInstance = DefineVxeComponentInstance<{
  reactData: ColorPickerReactData
}, VxeColorPickerProps, VxeColorPickerPrivateComputed, VxeColorPickerMethods>

export type VxeColorPickerConstructor = VxeColorPickerInstance

export interface ColorPickerPrivateRef {
}
export interface VxeColorPickerPrivateRef extends ColorPickerPrivateRef { }

export namespace VxeColorPickerPropTypes {
  export type ModelValue = string | null
  export type Size = VxeComponentSizeType
  export type Type = 'rgb' | 'hex'
  export type ClassName = string | ((params: { $colorPicker: VxeColorPickerConstructor }) => string)
  export type PopupClassName = string | ((params: {$colorPicker: VxeColorPickerConstructor }) => string)
  export type Colors = string[] | {
    label?: string
    value: string
  }[]
  export type ShowAlpha = boolean
  export type ShowEyeDropper = boolean
  export type ShowColorExtractor = boolean
  export type ShowQuick = boolean
  export type Readonly = boolean
  export type Disabled = boolean
  export type Placeholder = string
  export type ClickToCopy = boolean
  export type Clearable = boolean
  /**
   * 已废弃，请使用 PopupConfig.placement
   * @deprecated
   */
  export type Placement = 'top' | 'bottom' | '' | null
  /**
   * 已废弃，请使用 PopupConfig.transfer
   * @deprecated
   */
  export type Transfer = boolean

  export interface PopupConfig {
    /**
     * 设置弹出面板方向
     */
    placement?: 'top' | 'bottom' | '' | null
    /**
     * 默认弹出面板方向
     */
    defaultPlacement?: 'top' | 'bottom' | '' | null
    /**
     * 触发方式
     */
    trigger?: 'default' | 'icon' | 'manual' | '' | null
    /**
     * 是否启用元素挂载
     */
    transfer?: boolean
    /**
     * 挂载到指定元素下
     */
    appendTo?: string | HTMLElement | ((params: {}) => string | HTMLElement)
    width?: number | string
    height?: number | string
    zIndex?: number | string
    className?: string | ((params: { $colorPicker: VxeColorPickerConstructor }) => string)
  }
}

export interface VxeColorPickerProps {
  /**
   * 绑定值
   */
  value?: VxeColorPickerPropTypes.ModelValue
  size?: VxeColorPickerPropTypes.Size
  type?: VxeColorPickerPropTypes.Type
  className?: VxeColorPickerPropTypes.ClassName
  popupClassName?: VxeColorPickerPropTypes.PopupClassName
  colors?: VxeColorPickerPropTypes.Colors
  showAlpha?: VxeColorPickerPropTypes.ShowAlpha
  showEyeDropper?: VxeColorPickerPropTypes.ShowEyeDropper
  showColorExtractor?: VxeColorPickerPropTypes.ShowColorExtractor
  showQuick?: VxeColorPickerPropTypes.ShowQuick
  readonly?: VxeColorPickerPropTypes.Readonly
  disabled?: VxeColorPickerPropTypes.Disabled
  placeholder?: VxeColorPickerPropTypes.Placeholder
  clickToCopy?: VxeColorPickerPropTypes.ClickToCopy
  clearable?: VxeColorPickerPropTypes.Clearable
  /**
   * 已废弃，请使用 popupConfig.placement
   * @deprecated
   */
  placement?: VxeColorPickerPropTypes.Placement
  /**
   * 已废弃，请使用 popupConfig.transfer
   * @deprecated
   */
  transfer?: VxeColorPickerPropTypes.Transfer
  popupConfig?: VxeColorPickerPropTypes.PopupConfig
}

export interface ColorPickerPrivateComputed {
}
export interface VxeColorPickerPrivateComputed extends ColorPickerPrivateComputed { }

export interface ColorPickerReactData {
  initialized: boolean
  selectTyle: VxeColorPickerPropTypes.Type
  selectColor: string
  showTypePopup: boolean
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

export interface ColorController {
  /**
   * 解析颜色
   */
  parseColor<T extends keyof VxeColorPickerDefines.ParseResultMap>(color: string, format?: T): VxeColorPickerDefines.ParseResultMap[T] | null
  /**
   * 判断颜色是否 RGB 格式
   */
  hasRgb(color: string): boolean
  /**
   * 判断颜色是否 HEX 格式
   */
  hasHex(color: string): boolean
  /**
   * 转成 RGB 格式
   */
  toRgb(color: string): VxeColorPickerDefines.RgbObj | null
  /**
   * 转成 RGB 字符串格式
   */
  toRgbString(color: string): string
  /**
   * 转成 HEX 格式
   */
  toHex(color: string): VxeColorPickerDefines.HexObj | null
  /**
   * 转成 HEX 字符串格式
   */
  toHexString(color: string): string
  /**
   * 转成 HSL 格式
   */
  toHsl(color: string): VxeColorPickerDefines.HslObj | null
  /**
   * 转成 HSV 格式
   */
  toHsv(color: string): VxeColorPickerDefines.HsvObj | null
  /**
   * 对颜色进行高亮
   */
  lighten(color: string, ratio: number): string
  /**
   * 对颜色进行加深
   */
  darken(color: string, ratio: number): string
}

export type VxeColorPickerEmits = [
  'model-value',
  'modelValue',
  'change',
  'clear',
  'click'
]

export namespace VxeColorPickerDefines {
  export interface ColorPickerEventParams extends VxeComponentEventParams {
    $colorPicker: VxeColorPickerConstructor
  }

  export type ParseResultMap = {
    '': VxeColorPickerDefines.RgbObj
    'rgb': VxeColorPickerDefines.RgbObj
    'rgba': VxeColorPickerDefines.RgbObj
    'hex': VxeColorPickerDefines.HexObj
    'hsl': VxeColorPickerDefines.HslObj
    'hsv': VxeColorPickerDefines.HsvObj
  }

  export interface RgbObj {
    type: 'rgba' | 'rgb'
    value: string
    label: string
    r: number
    g: number
    b: number
    a: number
  }

  export interface HexObj {
    type: 'hex'
    value: string
    label: string
    hex: string
    hexV: string
    hexA: string
    a: number
  }

  export interface HslObj {
    type: 'hsl'
    value: string
    h: number
    s: number
    l: number
    a: number
  }

  export interface HsvObj {
    type: 'hsv'
    value: string
    h: number
    s: number
    v: number
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
