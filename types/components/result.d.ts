import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, VxeComponentStyleType, VxeComponentStatusType } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeResult: DefineVxeComponentApp<VxeResultProps, VxeResultEventProps, VxeResultSlots, VxeResultMethods>
export type VxeResultComponent = DefineVxeComponentOptions<VxeResultProps>

export type VxeResultInstance = DefineVxeComponentInstance<{
  reactData: ResultReactData
}, VxeResultProps, VxeResultPrivateComputed, VxeResultMethods>

export type VxeResultConstructor = VxeResultInstance

export interface ResultPrivateRef {
}
export interface VxeResultPrivateRef extends ResultPrivateRef { }

export namespace VxeResultPropTypes {
  export type ImageUrl = string
  export type ImageStyle = VxeComponentStyleType
  export type Icon = string
  export type Type = 'success' | 'error' | 'info' | 'warning' | 'question' | 'loading'
  export type Status = VxeComponentStatusType
  export type Title = number | string
  export type Content = number | string
}

export interface VxeResultProps {
  imageUrl?: VxeResultPropTypes.ImageUrl
  imageStyle?: VxeResultPropTypes.ImageStyle
  icon?: VxeResultPropTypes.Icon
  type?: VxeResultPropTypes.Type
  status?: VxeResultPropTypes.Status
  title?: VxeResultPropTypes.Title
  content?: VxeResultPropTypes.Content
}

export interface ResultPrivateComputed {
}
export interface VxeResultPrivateComputed extends ResultPrivateComputed { }

export interface ResultReactData {
}

export interface ResultMethods {
}
export interface VxeResultMethods extends ResultMethods { }

export interface ResultPrivateMethods { }
export interface VxeResultPrivateMethods extends ResultPrivateMethods { }

export type VxeResultEmits = []

export namespace VxeResultDefines {
  export interface ResultEventParams extends VxeComponentEventParams {
    $result: VxeResultConstructor
  }
}

export type VxeResultEventProps = {}

export interface VxeResultListeners { }

export namespace VxeResultEvents { }

export namespace VxeResultSlotTypes {
  export interface DefaultSlotParams {}
  export interface ExtraSlotParams {}
}

export interface VxeResultSlots {
  default?: (params: VxeResultSlotTypes.DefaultSlotParams) => any
  extra?: (params: VxeResultSlotTypes.ExtraSlotParams) => any
}

export const Result: typeof VxeResult
export default VxeResult
