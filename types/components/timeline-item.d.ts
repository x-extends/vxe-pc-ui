import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeTimelineItem: DefineVxeComponentApp<VxeTimelineItemProps, VxeTimelineItemEventProps, VxeTimelineItemSlots, VxeTimelineItemMethods>
export type VxeTimelineItemComponent = DefineVxeComponentOptions<VxeTimelineItemProps>

export type VxeTimelineItemInstance = DefineVxeComponentInstance<
  {},
  VxeTimelineItemProps,
  VxeTimelineItemPrivateComputed,
  VxeTimelineItemMethods
>

export type VxeTimelineItemConstructor = VxeTimelineItemInstance

export interface TimelineItemPrivateRef {}
export interface VxeTimelineItemPrivateRef extends TimelineItemPrivateRef {}

export namespace VxeTimelineItemPropTypes {
  export type Title = string | number
  export type Content = string | number
}

export interface VxeTimelineItemProps {
  title?: VxeTimelineItemPropTypes.Title
  content?: VxeTimelineItemPropTypes.Content
}

export interface TimelineItemPrivateComputed {}
export interface VxeTimelineItemPrivateComputed extends TimelineItemPrivateComputed {}

export interface TimelineItemReactData {}

export interface TimelineItemMethods {}
export interface VxeTimelineItemMethods extends TimelineItemMethods {}

export interface TimelineItemPrivateMethods {}
export interface VxeTimelineItemPrivateMethods extends TimelineItemPrivateMethods {}

export type VxeTimelineItemEmits = []

export namespace VxeTimelineItemDefines {
  export interface TimelineItemEventParams extends VxeComponentEventParams {
    $timelineItem: VxeTimelineItemConstructor
  }

  export interface ClickEventParams extends TimelineItemEventParams {}
  export interface CloseEventParams extends TimelineItemEventParams {}
}

export type VxeTimelineItemEventProps = {}

export interface VxeTimelineItemListeners {}

export namespace VxeTimelineItemEvents {}

export namespace VxeTimelineItemSlotTypes {
  export interface DefaultSlotParams {
    item: any
  }
  export interface TitleSlotParams {
    item: any
  }
}

export interface VxeTimelineItemSlots {
  default?: (params: VxeTimelineItemSlotTypes.DefaultSlotParams) => any
  title?: (params: VxeTimelineItemSlotTypes.TitleSlotParams) => any
}

export const TimelineItem: typeof VxeTimelineItem
export default VxeTimelineItem
