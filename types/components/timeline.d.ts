import { RenderFunction, SetupContext, Ref } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, ValueOf, DefineVxeComponentInstance, VxeComponentSizeType, VxeComponentBaseOptions, VxeComponentEventParams } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeTimeline: DefineVxeComponentApp<VxeTimelineProps, VxeTimelineEventProps, VxeTimelineSlots, VxeTimelineMethods>
export type VxeTimelineComponent = DefineVxeComponentOptions<VxeTimelineProps, VxeTimelineEventProps>

export type VxeTimelineInstance = DefineVxeComponentInstance<VxeTimelineProps, VxeTimelineConstructor>

export interface VxeTimelineConstructor extends VxeComponentBaseOptions, VxeTimelineMethods {
  props: VxeTimelineProps
  context: SetupContext<VxeTimelineEmits>
  reactData: TimelineReactData
  internalData: TimelineInternalData
  getRefMaps(): TimelinePrivateRef
  getComputeMaps(): TimelinePrivateComputed
  renderVN: RenderFunction
}

export interface TimelinePrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeTimelinePrivateRef extends TimelinePrivateRef {}

export namespace VxeTimelinePropTypes {
  export type Size = VxeComponentSizeType
  export type Reverse = boolean
  export type Vertical = boolean
  export interface OptionProps {
    title?: string
    content?: string
  }
  type Option = Record<string, any>
  export type Options = Option[]
}

export interface VxeTimelineProps {
  size?: VxeTimelinePropTypes.Size
  options?: VxeTimelinePropTypes.Options
  reverse?: VxeTimelinePropTypes.Reverse
  vertical?: VxeTimelinePropTypes.Vertical
  optionProps?: VxeTimelinePropTypes.OptionProps
}

export interface TimelinePrivateComputed {}
export interface VxeTimelinePrivateComputed extends TimelinePrivateComputed {}

export interface TimelineReactData {
  itemList: any[]
  staticItems: VxeTimelineDefines.ItemInfo[]
  isOptConf: boolean
}
export interface TimelineInternalData {
  fullData: any[]
}

export interface TimelineMethods {
  dispatchEvent(type: ValueOf<VxeTimelineEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeTimelineMethods extends TimelineMethods {}

export interface TimelinePrivateMethods {}
export interface VxeTimelinePrivateMethods extends TimelinePrivateMethods {}

export type VxeTimelineEmits = []

export namespace VxeTimelineDefines {
  export interface ItemInfo {
    id: string
    title?: string | number
    content?: string | number
    [key: string]: any
  }

  export interface TimelineEventParams extends VxeComponentEventParams {
    $timeline: VxeTimelineConstructor
  }
}

export type VxeTimelineEventProps = {}

export interface VxeTimelineListeners {}

export namespace VxeTimelineEvents {}

export namespace VxeTimelineSlotTypes {
  export interface TitleSlotParams {
    item: any
  }
  export interface ContentSlotParams {
    item: any
  }
}

export interface VxeTimelineSlots {
  default?: (params: Record<string, any>) => any
  title?: (params: VxeTimelineSlotTypes.TitleSlotParams) => any
  content?: (params: VxeTimelineSlotTypes.ContentSlotParams) => any
}

export const Timeline: typeof VxeTimeline
export default VxeTimeline
