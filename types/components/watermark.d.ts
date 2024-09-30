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
}

export interface VxeWatermarkProps {
}

export interface WatermarkPrivateComputed {
}
export interface VxeWatermarkPrivateComputed extends WatermarkPrivateComputed { }

export interface WatermarkReactData {
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
}

export type VxeWatermarkEventProps = {}

export interface VxeWatermarkListeners { }

export namespace VxeWatermarkEvents { }

export namespace VxeWatermarkSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeWatermarkSlots {
  default?: (params: VxeWatermarkSlotTypes.DefaultSlotParams) => any
}

export const Watermark: typeof VxeWatermark
export default VxeWatermark
