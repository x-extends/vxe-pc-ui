import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, ValueOf, VxeComponentStyleType, VxeComponentSizeType } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeDatePanel: DefineVxeComponentApp<VxeDatePanelProps, VxeDatePanelEventProps, VxeDatePanelSlots, VxeDatePanelMethods>
export type VxeDatePanelComponent = DefineVxeComponentOptions<VxeDatePanelProps>

export type VxeDatePanelInstance = DefineVxeComponentInstance<{
  reactData: DatePanelReactData
}, VxeDatePanelProps, VxeDatePanelPrivateComputed, VxeDatePanelMethods>

export type VxeDatePanelConstructor = VxeDatePanelInstance

export interface DatePanelPrivateRef {
}
export interface VxeDatePanelPrivateRef extends DatePanelPrivateRef { }

export namespace VxeDatePanelPropTypes {
  export type Size = VxeComponentSizeType
  export type ModelValue = string | number | Date | null
  export type ClassName = string
  export type Type = 'date' | 'time' | 'datetime' | 'week' | 'month' | 'quarter' | 'year'
  export type Multiple = boolean
  export type LimitCount = string | number
  export type StartDate = string | number | Date
  export type EndDate = string | number | Date
  export type DefaultDate = string | number | Date
  export type MinDate = string | number | Date
  export type MaxDate = string | number | Date
  export type StartDay = 0 | 1 | 2 | 3 | 4 | 5 | 6
  export type SelectDay = 0 | 1 | 2 | 3 | 4 | 5 | 6
  export type LabelFormat = string
  export type ValueFormat = string
  export type FestivalMethod = (params: VxeDatePanelDefines.DateFestivalParams) => VxeDatePanelDefines.DateFestivalInfo | null | void
  export type DisabledMethod = (params: VxeDatePanelDefines.DateDisabledParams) => boolean
}

export interface VxeDatePanelProps {
  size?: VxeDatePanelPropTypes.Size
  modelValue?: VxeDatePanelPropTypes.ModelValue
  className?: VxeDatePanelPropTypes.ClassName
  type?: VxeDatePanelPropTypes.Type
  multiple?: VxeDatePanelPropTypes.Multiple
  limitCount?: VxeDatePanelPropTypes.LimitCount

  /**
   * 日期面板的起始周为星期几
   */
  startDate?: VxeDatePanelPropTypes.StartDate
  endDate?: VxeDatePanelPropTypes.EndDate
  defaultDate?: VxeDatePanelPropTypes.DefaultDate
  minDate?: VxeDatePanelPropTypes.MinDate
  maxDate?: VxeDatePanelPropTypes.MaxDate

  startDay?: VxeDatePanelPropTypes.StartDay
  labelFormat?: VxeDatePanelPropTypes.LabelFormat
  valueFormat?: VxeDatePanelPropTypes.ValueFormat
  festivalMethod?: VxeDatePanelPropTypes.FestivalMethod
  disabledMethod?: VxeDatePanelPropTypes.DisabledMethod

  /**
   * 只对 type=week 有效，选中日期后指定为一周的哪一天
   */
  selectDay?: VxeDatePanelPropTypes.SelectDay
}

export interface DatePanelPrivateComputed {
}
export interface VxeDatePanelPrivateComputed extends DatePanelPrivateComputed { }

export interface DatePanelReactData {
  visiblePanel: boolean
  isAniVisible: boolean
  isActivated: boolean
  inputValue: any
  datetimePanelValue: Date | null
  datePanelValue: Date | null
  datePanelLabel: string
  datePanelType: VxeDatePanelDefines.DatePanelType
  selectMonth: any
  currentDate: any
}

export interface DatePanelInternalData {
  yearSize: number
  monthSize: number
  quarterSize: number
  hpTimeout?: undefined | number
}

export interface DatePanelMethods {
  dispatchEvent(type: ValueOf<VxeDatePanelEmits>, params: Record<string, any>, evnt: Event | null): void

  getModelValue(): string
  setPanelDate(date: Date): void
  getPanelDate(): Date
  checkValue(inputLabel: string): void
  confirmByEvent(event: Event): void
}
export interface VxeDatePanelMethods extends DatePanelMethods { }

export interface DatePanelPrivateMethods { }
export interface VxeDatePanelPrivateMethods extends DatePanelPrivateMethods { }

export type VxeDatePanelEmits = [
  'update:modelValue',
  'change',
  'click',
  'clear',
  'date-prev',
  'date-today',
  'date-next',
  'confirm'
]

export namespace VxeDatePanelDefines {
  export interface DatePanelEventParams extends VxeComponentEventParams {
    $datePanel: VxeDatePanelConstructor
  }

  export interface DateYearItem {
    date: Date;
    isPrev: boolean;
    isCurrent: boolean;
    isNow: boolean;
    isNext: boolean;
    year: number;
  }

  export interface DateMonthItem {
    date: Date;
    isPrev: boolean;
    isCurrent: boolean;
    isNow: boolean;
    isNext: boolean;
    month: number;
  }

  export interface DateQuarterItem {
    date: Date;
    isPrev: boolean;
    isCurrent: boolean;
    isNow: boolean;
    isNext: boolean;
    quarter: number;
  }

  export interface DateDayItem {
    date: Date;
    isWeekNumber?: boolean;
    isPrev: boolean;
    isCurrent: boolean;
    isNow: boolean;
    isNext: boolean;
    label: number;
  }

  export interface DateHourMinuteSecondItem {
    value: number;
    label: string;
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
    $datePanel: VxeDatePanelConstructor
    type: string
    viewType: DatePanelType
    date: Date
  }

  export interface DateDisabledParams {
    $datePanel: VxeDatePanelConstructor
    type: string
    viewType: DatePanelType
    date: Date
  }

  export interface DatePanelParams {
    value: string
  }

  export interface ChangeEventParams extends DatePanelEventParams, DatePanelParams { }
}

export type VxeDatePanelEventProps = {
  onChange?: VxeDatePanelEvents.Change
}

export interface VxeDatePanelListeners {
  change?: VxeDatePanelEvents.Change
}

export namespace VxeDatePanelEvents {
  export type Change = (params: VxeDatePanelDefines.ChangeEventParams) => void
}

export namespace VxeDatePanelSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeDatePanelSlots {
  default?: (params: VxeDatePanelSlotTypes.DefaultSlotParams) => any
}

export const DatePanel: typeof VxeDatePanel
export default VxeDatePanel
