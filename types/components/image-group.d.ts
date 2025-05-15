import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, ValueOf, VxeComponentSizeType } from '@vxe-ui/core'
import { VxeImagePreviewPropTypes } from './image-preview'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeImageGroup: DefineVxeComponentApp<VxeImageGroupProps, VxeImageGroupEventProps, VxeImageGroupSlots, VxeImageGroupMethods>
export type VxeImageGroupComponent = DefineVxeComponentOptions<VxeImageGroupProps>

export type VxeImageGroupInstance = DefineVxeComponentInstance<{
  reactData: ImageGroupReactData
}, VxeImageGroupProps, VxeImageGroupPrivateComputed, VxeImageGroupMethods>

export type VxeImageGroupConstructor = VxeImageGroupInstance

export interface ImageGroupPrivateRef {
}
export interface VxeImageGroupPrivateRef extends ImageGroupPrivateRef { }

export namespace VxeImageGroupPropTypes {
  export type Size = VxeComponentSizeType
  export type ShowPreview = boolean
  export type UrlList = string | string[] | {
    url?: string
    alt?: string | number
  }[]
  export interface ImageStyle {
    width?: number | string
    height?: number | string
  }
  export type ToolbarConfig = VxeImagePreviewPropTypes.ToolbarConfig
  export type ShowPrintButton = boolean
  export type ShowDownloadButton = boolean
}

export interface VxeImageGroupProps {
  size?: VxeImageGroupPropTypes.Size
  showPreview?: VxeImageGroupPropTypes.ShowPreview
  urlList?: VxeImageGroupPropTypes.UrlList
  imageStyle?: VxeImageGroupPropTypes.ImageStyle
  toolbarConfig?: VxeImageGroupPropTypes.ToolbarConfig
  showPrintButton?: VxeImageGroupPropTypes.ShowPrintButton
  showDownloadButton?: VxeImageGroupPropTypes.ShowDownloadButton
}

export interface ImageGroupPrivateComputed {
}
export interface VxeImageGroupPrivateComputed extends ImageGroupPrivateComputed { }

export interface ImageGroupReactData {
}

export interface ImageGroupMethods {
  dispatchEvent(type: ValueOf<VxeImageGroupEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeImageGroupMethods extends ImageGroupMethods { }

export interface ImageGroupPrivateMethods {
  handleClickImgEvent(evnt: Event, params: { url: string }): void
}
export interface VxeImageGroupPrivateMethods extends ImageGroupPrivateMethods { }

export type VxeImageGroupEmits = [
  'click'
]

export namespace VxeImageGroupDefines {
  export interface ImageGroupEventParams extends VxeComponentEventParams {
    $imageGroup: VxeImageGroupConstructor
  }

  export interface ClickEventParams {
    url: string
  }
}

export type VxeImageGroupEventProps = {
  onClick?: VxeImageGroupEvents.Click
}

export interface VxeImageGroupListeners {
  click?: VxeImageGroupEvents.Click
}

export namespace VxeImageGroupEvents {
  export type Click = (params: VxeImageGroupDefines.ClickEventParams) => void
}

export namespace VxeImageGroupSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeImageGroupSlots {
  default: (params: VxeImageGroupSlotTypes.DefaultSlotParams) => any
}

export const ImageGroup: typeof VxeImageGroup
export default VxeImageGroup
