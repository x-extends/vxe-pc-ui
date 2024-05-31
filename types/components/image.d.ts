import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeImage: defineVxeComponent<VxeImageProps, VxeImageEventProps>
export type VxeImageComponent = DefineComponent<VxeImageProps, VxeImageEmits>

export type VxeImageInstance = ComponentPublicInstance<VxeImageProps, VxeImageConstructor>

export interface VxeImageConstructor extends VxeComponentBaseOptions, VxeImageMethods {
  props: VxeImageProps
  context: SetupContext<VxeImageEmits>
  reactData: ImageReactData
  getRefMaps(): ImagePrivateRef
  getComputeMaps(): ImagePrivateComputed
  renderVN: RenderFunction
}

export interface ImagePrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeImagePrivateRef extends ImagePrivateRef { }

export namespace VxeImagePropTypes {
}

export type VxeImageProps = {
}

export interface ImagePrivateComputed {
}
export interface VxeImagePrivateComputed extends ImagePrivateComputed { }

export interface ImageReactData {
}

export interface ImageMethods {
}
export interface VxeImageMethods extends ImageMethods { }

export interface ImagePrivateMethods { }
export interface VxeImagePrivateMethods extends ImagePrivateMethods { }

export type VxeImageEmits = []

export namespace VxeImageDefines {
  export interface ImageEventParams extends VxeComponentEventParams {
    $image: VxeImageConstructor
  }
}

export type VxeImageEventProps = {}

export interface VxeImageListeners { }

export namespace VxeImageEvents { }

export namespace VxeImageSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeImageSlots {
  default: (params: VxeImageSlotTypes.DefaultSlotParams) => any
}

export const Image: typeof VxeImage
export default VxeImage
