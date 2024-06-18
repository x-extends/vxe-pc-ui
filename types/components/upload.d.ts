import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeUpload: defineVxeComponent<VxeUploadProps, VxeUploadEventProps>
export type VxeUploadComponent = DefineComponent<VxeUploadProps, VxeUploadEmits>

export type VxeUploadInstance = ComponentPublicInstance<VxeUploadProps, VxeUploadConstructor>

export interface VxeUploadConstructor extends VxeComponentBaseOptions, VxeUploadMethods {
  props: VxeUploadProps
  context: SetupContext<VxeUploadEmits>
  reactData: UploadReactData
  getRefMaps(): UploadPrivateRef
  getComputeMaps(): UploadPrivateComputed
  renderVN: RenderFunction
}

export interface UploadPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeUploadPrivateRef extends UploadPrivateRef { }

export namespace VxeUploadPropTypes {
  export type ModelValue = VxeUploadDefines.FileObjItem[]
  export type ShowList = boolean
  export type Mode = null | '' | 'all' | 'image'
  export type Readonly = boolean
  export type Disabled = boolean
  export type ImageTypes = string[]
  export type FileTypes = string[]
  export type Multiple = boolean
  export type LimitSize = number | string
  export type LimitCount = number | string
  export type NameField = string
  export type TypeField = string
  export type UrlField = string
  export type SizeField = string
  export type TipText = string
  export type ButtonText = string
  export type ShowErrorStatus = boolean
  export type ShowProgress = boolean
  export type AutoHiddenButton = boolean
  export type UploadMethod = undefined | ((params: {
    file: File,
    option: VxeUploadDefines.FileObjItem
    updateProgress: (percentNum: number) => void
  }) => any)
  export type GetUrlMethod = undefined | ((params: {
    option: VxeUploadDefines.FileObjItem
  }) => any)

  /**
   * 已废弃，请使用 TipText
   * @deprecated
   */
  export type HintText = string
}

export type VxeUploadProps = {
  modelValue?: VxeUploadPropTypes.ModelValue
  showList?: VxeUploadPropTypes.ShowList
  mode?: VxeUploadPropTypes.Mode
  readonly?: VxeUploadPropTypes.Readonly
  disabled?: VxeUploadPropTypes.Disabled
  imageTypes?: VxeUploadPropTypes.ImageTypes
  fileTypes?: VxeUploadPropTypes.FileTypes
  multiple?: VxeUploadPropTypes.Multiple
  /**
   * 限制文件大小，单位M
   */
  limitSize?: VxeUploadPropTypes.LimitSize
  limitCount?: VxeUploadPropTypes.LimitCount
  nameField?: VxeUploadPropTypes.NameField
  typeField?: VxeUploadPropTypes.TypeField
  urlField?: VxeUploadPropTypes.UrlField
  sizeField?: VxeUploadPropTypes.SizeField
  buttonText?: VxeUploadPropTypes.ButtonText
  showErrorStatus?: VxeUploadPropTypes.ShowErrorStatus
  showProgress?: VxeUploadPropTypes.ShowProgress
  autoHiddenButton?: VxeUploadPropTypes.AutoHiddenButton
  tipText?: VxeUploadPropTypes.TipText
  uploadMethod?: VxeUploadPropTypes.UploadMethod
  getUrlMethod?: VxeUploadPropTypes.GetUrlMethod

  /**
   * 已废弃，请使用 tipText
   * @deprecated
   */
  hintText?: VxeUploadPropTypes.HintText
}

export interface UploadPrivateComputed {
}
export interface VxeUploadPrivateComputed extends UploadPrivateComputed { }

export interface UploadReactData {
  isDrag: boolean
  fileList: VxeUploadDefines.FileObjItem[]
}

export interface UploadMethods {
  dispatchEvent(type: ValueOf<VxeUploadEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeUploadMethods extends UploadMethods { }

export interface UploadPrivateMethods { }
export interface VxeUploadPrivateMethods extends UploadPrivateMethods { }

export type VxeUploadEmits = [
  'update:modelValue',
  'add',
  'remove',
  'upload-success',
  'upload-error'
]

export namespace VxeUploadDefines {
  export interface UploadEventParams extends VxeComponentEventParams {
    $upload: VxeUploadConstructor
  }

  export type SaveFileFunction = (options: {
    filename: string
    type: string
    content: string | Blob
  } | {
    filename: string
    type?: string
    content: Blob
  }) => Promise<any>

  export type ReadFileFunction = (options?: {
    multiple?: boolean
    types?: string[]
    message?: boolean
  }) => Promise<{
    status: boolean
    files: File[]
    file: File
  }>

  export interface FileObjItem {
    _X_DATA?: {
      k?: string | number
      f: File,
      l?: boolean
      s?: string
      p?: number
    }

    [key: string]: any
  }
}

export type VxeUploadEventProps = {}

export interface VxeUploadListeners { }

export namespace VxeUploadEvents { }

export namespace VxeUploadSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeUploadSlots {
  default: (params: VxeUploadSlotTypes.DefaultSlotParams) => any
  tip: (params: VxeUploadSlotTypes.DefaultSlotParams) => any
}

export const Upload: typeof VxeUpload
export default VxeUpload
