import { RenderFunction, SetupContext, Ref } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, VxeComponentBaseOptions, DefineVxeComponentInstance, VxeComponentEventParams, VxeComponentSizeType, VxeComponentStatusType, ValueOf } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeNoticeBar: DefineVxeComponentApp<VxeNoticeBarProps, VxeNoticeBarEventProps, VxeNoticeBarSlots>
export type VxeNoticeBarComponent = DefineVxeComponentOptions<VxeNoticeBarProps, VxeNoticeBarEventProps>

export type VxeNoticeBarInstance = DefineVxeComponentInstance<VxeNoticeBarProps, VxeNoticeBarConstructor>

export interface VxeNoticeBarConstructor extends VxeComponentBaseOptions, VxeNoticeBarMethods {
  props: VxeNoticeBarProps
  context: SetupContext<VxeNoticeBarEmits>
  reactData: NoticeBarReactData
  getRefMaps(): NoticeBarPrivateRef
  getComputeMaps(): NoticeBarPrivateComputed
  renderVN: RenderFunction
}

export interface NoticeBarPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeNoticeBarPrivateRef extends NoticeBarPrivateRef { }

export namespace VxeNoticeBarPropTypes {
  export type Size = VxeComponentSizeType
  export type Duration = string | number
  export type Loop = boolean
  export type Content = string
  export type Speed = '' | 'default' | 'fast' | 'slow'
  export type Direction = '' | 'left' | 'right'
  export type Vertical = boolean
}

export type VxeNoticeBarProps = {
  size?: VxeNoticeBarPropTypes.Size
  duration?: VxeNoticeBarPropTypes.Duration
  loop?: VxeNoticeBarPropTypes.Loop
  content?: VxeNoticeBarPropTypes.Content
  speed?: VxeNoticeBarPropTypes.Speed
  direction?: VxeNoticeBarPropTypes.Direction
  vertical?: VxeNoticeBarPropTypes.Vertical
}

export interface NoticeBarPrivateComputed {
}
export interface VxeNoticeBarPrivateComputed extends NoticeBarPrivateComputed { }

export interface NoticeBarReactData {
  animationDuration: number
}

export interface NoticeBarMethods {
  dispatchEvent(type: ValueOf<VxeNoticeBarEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeNoticeBarMethods extends NoticeBarMethods { }

export interface NoticeBarPrivateMethods { }
export interface VxeNoticeBarPrivateMethods extends NoticeBarPrivateMethods { }

export type VxeNoticeBarEmits = [
]

export namespace VxeNoticeBarDefines {
  export interface NoticeBarEventParams extends VxeComponentEventParams {
    $noticeBar: VxeNoticeBarConstructor
  }
}

export type VxeNoticeBarEventProps = {}

export interface VxeNoticeBarListeners { }

export namespace VxeNoticeBarEvents { }

export namespace VxeNoticeBarSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeNoticeBarSlots {
  default?: (params: VxeNoticeBarSlotTypes.DefaultSlotParams) => any
}

export const NoticeBar: typeof VxeNoticeBar
export default VxeNoticeBar
