import { RenderFunction, SetupContext, Ref } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentBaseOptions, VxeComponentEventParams } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeWatermark: DefineVxeComponentApp<VxeWatermarkProps, VxeWatermarkEventProps, VxeWatermarkSlots>
export type VxeWatermarkComponent = DefineVxeComponentOptions<VxeWatermarkProps, VxeWatermarkEventProps>

export type VxeWatermarkInstance = DefineVxeComponentInstance<VxeWatermarkProps, VxeWatermarkConstructor>

export interface VxeWatermarkConstructor extends VxeComponentBaseOptions, VxeWatermarkMethods {
  props: VxeWatermarkProps
  context: SetupContext<VxeWatermarkEmits>
  reactData: WatermarkReactData
  getRefMaps(): WatermarkPrivateRef
  getComputeMaps(): WatermarkPrivateComputed
  renderVN: RenderFunction
}

export interface WatermarkPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
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
