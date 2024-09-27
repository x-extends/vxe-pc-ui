import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, VxeComponentSizeType, ValueOf, VxeComponentStatusType } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeTextEllipsis: DefineVxeComponentApp<VxeTextEllipsisProps, VxeTextEllipsisEventProps, VxeTextEllipsisSlots>
export type VxeTextEllipsisComponent = DefineVxeComponentOptions<VxeTextEllipsisProps>

export type VxeTextEllipsisInstance = DefineVxeComponentInstance<{
  reactData: TextEllipsisReactData
}, VxeTextEllipsisProps, VxeTextEllipsisPrivateComputed, VxeTextEllipsisMethods>

export type VxeTextEllipsisConstructor = VxeTextEllipsisInstance

export interface TextEllipsisPrivateRef {
}
export interface VxeTextEllipsisPrivateRef extends TextEllipsisPrivateRef { }

export namespace VxeTextEllipsisPropTypes {
  export type Status = VxeComponentStatusType
  export type Title = string | number
  export type LineClamp = string | number
  export type Loading = boolean
  export type OffsetLength = string | number
  export type Content = string | number
  export type Size = VxeComponentSizeType
}

export type VxeTextEllipsisProps = {
  status?: VxeTextEllipsisPropTypes.Status
  title?: VxeTextEllipsisPropTypes.Title
  lineClamp?: VxeTextEllipsisPropTypes.LineClamp
  loading?: VxeTextEllipsisPropTypes.Loading
  offsetLength?: VxeTextEllipsisPropTypes.OffsetLength
  content?: VxeTextEllipsisPropTypes.Content
  size?: VxeTextEllipsisPropTypes.Size
}

export interface TextEllipsisPrivateComputed {
}
export interface VxeTextEllipsisPrivateComputed extends TextEllipsisPrivateComputed { }

export interface TextEllipsisReactData {
  resizeObserver: ResizeObserver | null
  visibleLen: number
}

export interface TextEllipsisMethods {
  dispatchEvent(type: ValueOf<VxeTextEllipsisEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeTextEllipsisMethods extends TextEllipsisMethods { }

export interface TextEllipsisPrivateMethods { }
export interface VxeTextEllipsisPrivateMethods extends TextEllipsisPrivateMethods { }

export type VxeTextEllipsisEmits = [
  'click'
]

export namespace VxeTextEllipsisDefines {
  export interface TextEllipsisEventParams extends VxeComponentEventParams {
    $textEllipsis: VxeTextEllipsisConstructor
  }

  export interface ClickParams {
  }
  export interface ClickEventParams extends TextEllipsisEventParams, ClickParams { }
}

export type VxeTextEllipsisEventProps = {
  onClick?: VxeTextEllipsisEvents.Click
}

export interface VxeTextEllipsisListeners {
  click?: VxeTextEllipsisEvents.Click
}

export namespace VxeTextEllipsisEvents {
  export type Click = (params: VxeTextEllipsisDefines.ClickEventParams) => void
}

export namespace VxeTextEllipsisSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeTextEllipsisSlots {
}

export const TextEllipsis: typeof VxeTextEllipsis
export default VxeTextEllipsis
