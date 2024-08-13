import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'
import { VxeImagePreviewProps, VxeImagePreviewPropTypes } from './image-preview'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeImage: defineVxeComponent<VxeImageProps, VxeImageEventProps, VxeImageSlots>
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
  export type Src = string | string[] | {
    url?: string
    alt?: string | number
  }[]
  export type Alt = number | string
  export type Loading = '' | 'lazy'
  export type Title = number | string
  export type Width = number | string
  export type Height = number | string
  export type ShowPreview = boolean
}

export type VxeImageProps = {
  src?: VxeImagePropTypes.Src
  alt?: VxeImagePropTypes.Alt
  loading?: VxeImagePropTypes.Loading
  title?: VxeImagePropTypes.Title
  width?: VxeImagePropTypes.Width
  height?: VxeImagePropTypes.Height
  showPreview?: VxeImagePropTypes.ShowPreview
}

export interface ImagePrivateComputed {
}
export interface VxeImagePrivateComputed extends ImagePrivateComputed { }

export interface ImageReactData {
}

export interface ImageMethods {
  dispatchEvent(type: ValueOf<VxeImageEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeImageMethods extends ImageMethods { }

export interface ImagePrivateMethods {}
export interface VxeImagePrivateMethods extends ImagePrivateMethods { }

export type VxeImageEmits = [
  'click'
]

export namespace VxeImageDefines {
  export interface ImageEventParams extends VxeComponentEventParams {
    $image: VxeImageConstructor
  }

  export interface ClickEventParams {
    url: string
  }

  export type PreviewImageFunction = (options: VxeImagePreviewProps & {
    activeIndex?: VxeImagePreviewPropTypes.ModelValue
    escClosable?: boolean
  }) => Promise<any>
}

export type VxeImageEventProps = {
  onClick?: VxeImageEvents.Click
}

export interface VxeImageListeners {
  click?: VxeImageEvents.Click
}

export namespace VxeImageEvents {
  export type Click = (params: VxeImageDefines.ClickEventParams) => void
}

export namespace VxeImageSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeImageSlots {
  default: (params: VxeImageSlotTypes.DefaultSlotParams) => any
}

export const Image: typeof VxeImage
export default VxeImage
