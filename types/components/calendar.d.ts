import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeCalendar: defineVxeComponent<VxeCalendarProps, VxeCalendarEventProps, VxeCalendarSlots>
export type VxeCalendarComponent = DefineComponent<VxeCalendarProps & VxeCalendarEventProps>

export type VxeCalendarInstance = ComponentPublicInstance<VxeCalendarProps, VxeCalendarConstructor>

export interface VxeCalendarConstructor extends VxeComponentBaseOptions, VxeCalendarMethods {
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
  export type Size = VxeComponentSizeType
  export type ModelValue = string | number | Date | null
  export type ClassName = string
  export type Type = 'date' | 'week' | 'month' | 'quarter' | 'year'
  export type Width = string | number
  export type Height = string | number
  export type Multiple = boolean
  export type MinDate = string | number | Date
  export type MaxDate = string | number | Date
  export type StartDay = 0 | 1 | 2 | 3 | 4 | 5 | 6
  export type SelectDay = 0 | 1 | 2 | 3 | 4 | 5 | 6
  export type LabelFormat = string
  export type ValueFormat = string
  export type FestivalMethod = (params: VxeDatePickerDefines.DateFestivalParams) => VxeDatePickerDefines.DateFestivalInfo | null | void
  export type DisabledMethod = (params: VxeDatePickerDefines.DateDisabledParams) => boolean
}

export type VxeCalendarProps = {
  size?: VxeCalendarPropTypes.Size
  modelValue?: VxeCalendarPropTypes.ModelValue
  className?: VxeCalendarPropTypes.ClassName
  type?: VxeCalendarPropTypes.Type
  width?: VxeCalendarPropTypes.Width
  height?: VxeCalendarPropTypes.Height
  multiple?: VxeCalendarPropTypes.Multiple
  minDate?: VxeCalendarPropTypes.MinDate
  maxDate?: VxeCalendarPropTypes.MaxDate
  startDay?: VxeCalendarPropTypes.StartDay
  selectDay?: VxeCalendarPropTypes.SelectDay
  labelFormat?: VxeCalendarPropTypes.LabelFormat
  valueFormat?: VxeCalendarPropTypes.ValueFormat
  festivalMethod?: VxeCalendarPropTypes.FestivalMethod
  disabledMethod?: VxeCalendarPropTypes.DisabledMethod
}

export interface CalendarPrivateComputed {
}
export interface VxeCalendarPrivateComputed extends CalendarPrivateComputed { }

export interface CalendarReactData {
  panelIndex: number
  panelStyle: VxeComponentStyleType | null
  panelPlacement: VxeDatePickerPropTypes.Placement
  isActivated: boolean
  selectValue: VxeCalendarPropTypes.ModelValue | undefined
  inputValue: any
  datePanelValue: Date | null
  datePanelLabel: string
  datePanelType: DatePanelType
  selectMonth: any
  currentDate: any
}

export interface CalendarMethods {
  dispatchEvent(type: ValueOf<VxeCalendarEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeCalendarMethods extends CalendarMethods { }

export interface CalendarPrivateMethods { }
export interface VxeCalendarPrivateMethods extends CalendarPrivateMethods { }

export type VxeCalendarEmits = [
  'update:modelValue',
  'change',
  'click',
  'date-prev',
  'date-today',
  'date-next'
]

export namespace VxeCalendarDefines {
  export interface CalendarEventParams extends VxeComponentEventParams {
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
  default?: (params: VxeCalendarSlotTypes.DefaultSlotParams) => any
}

export const Calendar: typeof VxeCalendar
export default VxeCalendar
