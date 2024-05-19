import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeCalendar: defineVxeComponent<VxeCalendarProps, VxeCalendarEventProps>
export type VxeCalendarComponent = DefineComponent<VxeCalendarProps, VxeCalendarEmits>

export type VxeCalendarInstance = ComponentPublicInstance<VxeCalendarProps, VxeCalendarConstructor>

export interface VxeCalendarConstructor extends VxeComponentBase, VxeCalendarMethods {
  props: VxeCalendarProps
  context: SetupContext<VxeCalendarEmits>
  reactData: CalendarReactData
  getRefMaps(): CalendarPrivateRef
  getComputeMaps(): CalendarPrivateComputed
  renderVN: RenderFunction
}

export interface CalendarPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeCalendarPrivateRef extends CalendarPrivateRef { }

export namespace VxeCalendarPropTypes {
}

export type VxeCalendarProps = {
}

export interface CalendarPrivateComputed {
}
export interface VxeCalendarPrivateComputed extends CalendarPrivateComputed { }

export interface CalendarReactData {
}

export interface CalendarMethods {
}
export interface VxeCalendarMethods extends CalendarMethods { }

export interface CalendarPrivateMethods { }
export interface VxeCalendarPrivateMethods extends CalendarPrivateMethods { }

export type VxeCalendarEmits = []

export namespace VxeCalendarDefines {
  export interface CalendarEventParams extends VxeComponentEvent {
    $calendar: VxeCalendarConstructor
  }
}

export type VxeCalendarEventProps = {}

export interface VxeCalendarListeners { }

export namespace VxeCalendarEvents { }

export namespace VxeCalendarSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeCalendarSlots {
  default: (params: VxeCalendarSlotTypes.DefaultSlotParams) => any
}

export const Calendar: typeof VxeCalendar
export default VxeCalendar
