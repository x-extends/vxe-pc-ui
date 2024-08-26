import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf, VxeComponentStyleType, VxeComponentSizeType } from '@vxe-ui/core'

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
  export type FestivalMethod = (params: VxeCalendarDefines.DateFestivalParams) => VxeCalendarDefines.DateFestivalInfo | null | void
  export type DisabledMethod = (params: VxeCalendarDefines.DateDisabledParams) => boolean
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
  selectValue: VxeCalendarPropTypes.ModelValue | undefined
  inputValue: any
  datePanelValue: Date | null
  datePanelLabel: string
  datePanelType: VxeCalendarDefines.DatePanelType
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

  export type DatePanelType = 'year' | 'quarter' | 'month' | 'week' | 'day'

  interface DateFestivalItem {
    /**
     * 显示名称
     */
    label?: string
    /**
     * 标记为重要信息
     */
    important?: boolean
    className?: string
    style?: VxeComponentStyleType
  }

  /**
   * 日期节日对象
   */
  export interface DateFestivalInfo extends DateFestivalItem {
    /**
     * 显示左上角小圆点通知
     */
    notice?: boolean
    /**
     * 显示右上角信息
     */
    extra?: string | DateFestivalItem
  }

  export interface DateFestivalParams {
    $calendar: VxeCalendarConstructor
    type: string
    viewType: DatePanelType
    date: Date
  }

  export interface DateDisabledParams {
    $calendar: VxeCalendarConstructor
    type: string
    viewType: DatePanelType
    date: Date
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
