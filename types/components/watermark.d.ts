import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeWatermark: DefineVxeComponentApp<VxeWatermarkProps, VxeWatermarkEventProps, VxeWatermarkSlots>
export type VxeWatermarkComponent = DefineVxeComponentOptions<VxeWatermarkProps>

export type VxeWatermarkInstance = DefineVxeComponentInstance<{
  reactData: WatermarkReactData
}, VxeWatermarkProps, VxeWatermarkPrivateComputed, VxeWatermarkMethods>

export type VxeWatermarkConstructor = VxeWatermarkInstance

export interface WatermarkPrivateRef {
}
export interface VxeWatermarkPrivateRef extends WatermarkPrivateRef { }

export namespace VxeWatermarkPropTypes {
  export type Width = number | string
  export type Height = number | string
  export type ImageUrl = string
  export type Rotate = number
  export type Gap = (number | string)[]
  export type Content = number | string | VxeWatermarkDefines.ContentConf | (number | string | VxeWatermarkDefines.ContentConf)[]
  export type Font = {
    fontSize?: number | string
    color?: string
    fontWeight?: number | 'normal' | 'bolder' | 'lighter'
    fontFamily?: string
    fontStyle?: 'none' | 'normal' | 'italic' | 'oblique'
  }
  export type ZIndex = number | string
}

export interface VxeWatermarkProps {
  width?: VxeWatermarkPropTypes.Width
  height?: VxeWatermarkPropTypes.Height
  imageUrl?: VxeWatermarkPropTypes.ImageUrl
  rotate?: VxeWatermarkPropTypes.Rotate
  gap?: VxeWatermarkPropTypes.Gap
  content?: VxeWatermarkPropTypes.Content
  font?: VxeWatermarkPropTypes.Font
  zIndex?: VxeWatermarkPropTypes.ZIndex
}

export interface WatermarkPrivateComputed {
}
export interface VxeWatermarkPrivateComputed extends WatermarkPrivateComputed { }

export interface WatermarkReactData {
  markUrl: string
}

export interface WatermarkMethods {
}
export interface VxeWatermarkMethods extends WatermarkMethods { }

export interface WatermarkPrivateMethods { }
export interface VxeWatermarkPrivateMethods extends WatermarkPrivateMethods { }

export type VxeWatermarkEmits = []

export namespace VxeWatermarkDefines {
  export interface WatermarkEventParams extends VxeComponentEventParams {
    $watermark: VxeWatermarkConstructor
  }

  export interface ContentConf {
    Font?: VxeWatermarkPropTypes.Font
    width?: number
    textContent: string
  }
}

export type VxeWatermarkEventProps = {}

export interface VxeWatermarkListeners { }

export namespace VxeWatermarkEvents { }

export namespace VxeWatermarkSlotTypes {
}

export interface VxeWatermarkSlots {
}

export const Watermark: typeof VxeWatermark
export default VxeWatermark
