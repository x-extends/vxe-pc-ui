import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, ComputedRef, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeImagePreview: defineVxeComponent<VxeImagePreviewProps, VxeImagePreviewEventProps, VxeImagePreviewSlots>
export type VxeImagePreviewComponent = DefineComponent<VxeImagePreviewProps & VxeImagePreviewEventProps>

export type VxeImagePreviewInstance = ComponentPublicInstance<VxeImagePreviewProps, VxeImagePreviewConstructor>

export interface VxeImagePreviewConstructor extends VxeComponentBaseOptions, VxeImagePreviewMethods {
  props: VxeImagePreviewProps
  context: SetupContext<VxeImagePreviewEmits>
  reactData: ImagePreviewReactData
  getRefMaps(): ImagePreviewPrivateRef
  getComputeMaps(): ImagePreviewPrivateComputed
  renderVN: RenderFunction
}

export interface ImagePreviewPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeImagePreviewPrivateRef extends ImagePreviewPrivateRef { }

export namespace VxeImagePreviewPropTypes {
  export type ModelValue = null | number
  export type Url = string
  export type UrlList = any[]
  export type UrlField = string
  export type MaskClosable = boolean
  export type MarginSize = string | number
  export type ShowPrintButton = boolean
  export type ShowDownloadButton = boolean
  export type BeforeDownloadMethod = undefined | ((params: {
    $imagePreview: VxeImagePreviewConstructor
    url: any
    index: number
  }) => boolean | Promise<boolean>)
  export type DownloadMethod = undefined | ((params: {
    $imagePreview: VxeImagePreviewConstructor
    url: any
    index: number
  }) => Promise<any>)
}

export type VxeImagePreviewProps = {
  modelValue?: VxeImagePreviewPropTypes.ModelValue
  urlList?: VxeImagePreviewPropTypes.UrlList
  urlField?: VxeImagePreviewPropTypes.UrlField
  maskClosable?: VxeImagePreviewPropTypes.MaskClosable
  marginSize?: VxeImagePreviewPropTypes.MarginSize
  showPrintButton?: VxeImagePreviewPropTypes.ShowPrintButton
  showDownloadButton?: VxeImagePreviewPropTypes.ShowDownloadButton
  downloadMethod?: VxeImagePreviewPropTypes.DownloadMethod
  beforeDownloadMethod?: VxeImagePreviewPropTypes.BeforeDownloadMethod
}

export interface ImagePreviewPrivateComputed {
  computeImgList: ComputedRef<string[]>
}
export interface VxeImagePreviewPrivateComputed extends ImagePreviewPrivateComputed { }

export interface ImagePreviewReactData {
  activeIndex: undefined | VxeImagePreviewPropTypes.ModelValue
  offsetPct11: boolean
  offsetScale: number
  offsetRotate: number
  offsetLeft: number
  offsetTop: number
}

export interface ImagePreviewMethods {
  dispatchEvent(type: ValueOf<VxeImagePreviewEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeImagePreviewMethods extends ImagePreviewMethods { }

export interface ImagePreviewPrivateMethods {
}
export interface VxeImagePreviewPrivateMethods extends ImagePreviewPrivateMethods { }

export type VxeImagePreviewEmits = [
  'update:modelValue',
  'change',
  'download',
  'download-fail',
  'close'
]

export namespace VxeImagePreviewDefines {
  export interface ImagePreviewEventParams extends VxeComponentEventParams {
    $imagePreview: VxeImagePreviewConstructor
  }

  export type ChangeParams = {
    checklist: any[]
  }
  export interface ChangeEventParams extends ImagePreviewEventParams, ChangeParams { }
}

export type VxeImagePreviewEventProps = {
  onChange?: VxeImagePreviewEvents.Change
}

export interface VxeImagePreviewListeners {
  change?: VxeImagePreviewEvents.Change
}

export namespace VxeImagePreviewEvents {
  export type Change = (params: VxeImagePreviewDefines.ChangeEventParams) => void
 }

export namespace VxeImagePreviewSlotTypes {
  export interface DefaultSlotParams {
    [key: string]: any
  }
}

export interface VxeImagePreviewSlots {
  default: (params: VxeImagePreviewSlotTypes.DefaultSlotParams) => any
}

export const ImagePreview: typeof VxeImagePreview
export default VxeImagePreview
