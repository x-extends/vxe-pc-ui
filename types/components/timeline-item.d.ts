import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeTimelineItem: DefineVxeComponentApp<VxeTimelineItemProps, VxeTimelineItemEventProps, VxeTimelineItemSlots, VxeTimelineItemMethods>
export type VxeTimelineItemComponent = DefineVxeComponentOptions<VxeTimelineItemProps>

export type VxeTimelineItemInstance = DefineVxeComponentInstance<{
  reactData: TimelineItemReactData
}, VxeTimelineItemProps, VxeTimelineItemPrivateComputed, VxeTimelineItemMethods>

export type VxeTimelineItemConstructor = VxeTimelineItemInstance

export interface TimelineItemPrivateRef {
}
export interface VxeTimelineItemPrivateRef extends TimelineItemPrivateRef { }

export namespace VxeTimelineItemPropTypes {
}

export type VxeTimelineItemProps = {
}

export interface TimelineItemPrivateComputed {
}
export interface VxeTimelineItemPrivateComputed extends TimelineItemPrivateComputed { }

export interface TimelineItemReactData {
}

export interface TimelineItemMethods {
  dispatchEvent(type: ValueOf<VxeTimelineItemEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeTimelineItemMethods extends TimelineItemMethods { }

export interface TimelineItemPrivateMethods { }
export interface VxeTimelineItemPrivateMethods extends TimelineItemPrivateMethods { }

export type VxeTimelineItemEmits = [
]

export namespace VxeTimelineItemDefines {
  export interface TimelineItemEventParams extends VxeComponentEventParams {
    $timelineItem: VxeTimelineItemConstructor
  }

  export interface ClickEventParams extends TimelineItemEventParams { }
  export interface CloseEventParams extends TimelineItemEventParams { }
}

export type VxeTimelineItemEventProps = {
}

export interface VxeTimelineItemListeners {
}

export namespace VxeTimelineItemEvents {
}

export namespace VxeTimelineItemSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeTimelineItemSlots {
}

export const TimelineItem: typeof VxeTimelineItem
export default VxeTimelineItem
