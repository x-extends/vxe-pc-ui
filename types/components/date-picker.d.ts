import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, ValueOf, VxeComponentStyleType, VxeComponentSizeType } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeDatePicker: DefineVxeComponentApp<VxeDatePickerProps, VxeDatePickerEventProps, VxeDatePickerSlots>
export type VxeDatePickerComponent = DefineVxeComponentOptions<VxeDatePickerProps>

export type VxeDatePickerInstance = DefineVxeComponentInstance<{
  reactData: DatePickerReactData
}, VxeDatePickerProps, DatePickerPrivateComputed, DatePickerMethods>

export type VxeDatePickerConstructor = VxeDatePickerInstance

export interface DatePickerPrivateRef {
}
export interface VxeDatePickerPrivateRef extends DatePickerPrivateRef { }

export namespace VxeDatePickerPropTypes {
  export type Size = VxeComponentSizeType
  export type ModelValue = string | number | Date | null
  export type ClassName = string
  export type Immediate = boolean
  export type Name = string
  export type Type = 'date' | 'time' | 'datetime' | 'week' | 'month' | 'quarter' | 'year'
  export type Clearable = boolean
  export type Readonly = boolean
  export type Disabled = boolean
  export type Placeholder = string
  export type MaxLength = string | number
  export type Multiple = boolean
  export type ShowWordCount = boolean
  export type CountMethod = (params: {
    value: string
  }) => number
  export type AutoComplete = string
  export type Align = string
  export type Form = string
  export type Min = string | number
  export type Max = string | number
  export type Step = string | number
  export type Exponential = boolean
  export type Controls = boolean
  export type Digits = string | number
  export type StartDate = string | number | Date
  export type EndDate = string | number | Date
  export type MinDate = string | number | Date
  export type MaxDate = string | number | Date
  export type StartDay = 0 | 1 | 2 | 3 | 4 | 5 | 6
  export type SelectDay = 0 | 1 | 2 | 3 | 4 | 5 | 6
  export type LabelFormat = string
  export type ValueFormat = string
  export type Editable = boolean
  export type FestivalMethod = (params: VxeDatePickerDefines.DateFestivalParams) => VxeDatePickerDefines.DateFestivalInfo | null | void
  export type DisabledMethod = (params: VxeDatePickerDefines.DateDisabledParams) => boolean
  export type PrefixIcon = string
  export type SuffixIcon = string
  export type Placement = 'top' | 'bottom' | '' | null
  export type Transfer = boolean

  /**
   * 请使用 AutoComplete
   * @deprecated
   */
  export type Autocomplete = string
  /**
   * 请使用 MaxLength
   * @deprecated
   */
  export type Maxlength = string | number
}

export interface VxeDatePickerProps {
  size?: VxeDatePickerPropTypes.Size
  value?: VxeDatePickerPropTypes.ModelValue
  className?: VxeDatePickerPropTypes.ClassName
  immediate?: VxeDatePickerPropTypes.Immediate
  name?: VxeDatePickerPropTypes.Name
  type?: VxeDatePickerPropTypes.Type
  clearable?: VxeDatePickerPropTypes.Clearable
  readonly?: VxeDatePickerPropTypes.Readonly
  disabled?: VxeDatePickerPropTypes.Disabled
  placeholder?: VxeDatePickerPropTypes.Placeholder
  maxLength?: VxeDatePickerPropTypes.MaxLength
  multiple?: VxeDatePickerPropTypes.Multiple
  /**
   * 是否显示字数统计
   */
  showWordCount?: VxeDatePickerPropTypes.ShowWordCount
  /**
   * 自定义字数统计方法
   */
  countMethod?: VxeDatePickerPropTypes.CountMethod
  autoComplete?: VxeDatePickerPropTypes.AutoComplete
  align?: VxeDatePickerPropTypes.Align
  form?: VxeDatePickerPropTypes.Form

  // number、integer、float、password
  controls?: VxeDatePickerPropTypes.Controls

  // float
  digits?: VxeDatePickerPropTypes.Digits

  // date、week、month、quarter、year
  startDate?: VxeDatePickerPropTypes.StartDate
  endDate?: VxeDatePickerPropTypes.EndDate
  minDate?: VxeDatePickerPropTypes.MinDate
  maxDate?: VxeDatePickerPropTypes.MaxDate
  /**
   * @deprecated
   */
  startWeek?: VxeDatePickerPropTypes.StartDay
  startDay?: VxeDatePickerPropTypes.StartDay
  labelFormat?: VxeDatePickerPropTypes.LabelFormat
  valueFormat?: VxeDatePickerPropTypes.ValueFormat
  editable?: VxeDatePickerPropTypes.Editable
  festivalMethod?: VxeDatePickerPropTypes.FestivalMethod
  disabledMethod?: VxeDatePickerPropTypes.DisabledMethod

  // week
  selectDay?: VxeDatePickerPropTypes.SelectDay

  prefixIcon?: VxeDatePickerPropTypes.PrefixIcon
  suffixIcon?: VxeDatePickerPropTypes.SuffixIcon
  placement?: VxeDatePickerPropTypes.Placement
  transfer?: VxeDatePickerPropTypes.Transfer

  /**
   * 请使用 autoComplete
   * @deprecated
   */
  autocomplete?: VxeDatePickerPropTypes.AutoComplete
  /**
   * 请使用 autoComplete
   * @deprecated
   */
  maxlength?: VxeDatePickerPropTypes.MaxLength
}

export interface DatePickerPrivateComputed {
}
export interface VxeDatePickerPrivateComputed extends DatePickerPrivateComputed { }

export interface DatePickerReactData {
  initialized: boolean
  panelIndex: number
  visiblePanel: boolean
  isAniVisible: boolean
  panelStyle: VxeComponentStyleType
  panelPlacement: VxeDatePickerPropTypes.Placement
  isActivated: boolean
  inputValue: any
  datetimePanelValue: Date | null
  datePanelValue: Date | null
  datePanelLabel: string
  datePanelType: VxeDatePickerDefines.DatePanelType
  selectMonth: any
  currentDate: any
}

export interface DatePickerInternalData {
  yearSize: number
  monthSize: number
  quarterSize: number
  hpTimeout?: undefined | number
}

export interface DatePickerMethods {
  dispatchEvent(type: ValueOf<VxeDatePickerEmits>, params: Record<string, any>, evnt: Event | null): void
  /**
   * 获取焦点
   */
  focus(): Promise<any>
  /**
   * 失去焦点
   */
  blur(): Promise<any>
  /**
   * 选中内容
   */
  select(): Promise<any>
  /**
   * 弹出面板，用于带下拉面板的功能，
   */
  showPanel(): Promise<any>
  /**
   * 关闭面板，用于带下拉面板的功能，
   */
  hidePanel(): Promise<any>
  updatePlacement(): Promise<any>
}
export interface VxeDatePickerMethods extends DatePickerMethods { }

export interface DatePickerPrivateMethods { }
export interface VxeDatePickerPrivateMethods extends DatePickerPrivateMethods { }

export type VxeDatePickerEmits = [
  'modelValue',
  'input',
  'change',
  'keydown',
  'keyup',
  'wheel',
  'click',
  'focus',
  'blur',
  'clear',
  'prefix-click',
  'suffix-click',
  'date-prev',
  'date-today',
  'date-next'
]

export namespace VxeDatePickerDefines {
  export interface DatePickerEventParams extends VxeComponentEventParams {
    $datePicker: VxeDatePickerConstructor
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
    $datePicker: VxeDatePickerConstructor
    type: string
    viewType: DatePanelType
    date: Date
  }

  export interface DateDisabledParams {
    $datePicker: VxeDatePickerConstructor
    type: string
    viewType: DatePanelType
    date: Date
  }

  export interface DatePickerParams {
    value: string
  }
  export interface InputEventParams extends DatePickerEventParams, DatePickerParams { }

  export interface ChangeParams extends DatePickerParams {}
  export interface ChangeEventParams extends DatePickerEventParams, ChangeParams { }
}

export type VxeDatePickerEventProps = {
  onInput?: VxeDatePickerEvents.Input
  onChange?: VxeDatePickerEvents.Change
}

export interface VxeDatePickerListeners {
  value?: VxeDatePickerEvents.Input
  change?: VxeDatePickerEvents.Change
}

export namespace VxeDatePickerEvents {
  export type Input = (params: VxeDatePickerDefines.InputEventParams) => void
  export type Change = (params: VxeDatePickerDefines.ChangeEventParams) => void
}

export namespace VxeDatePickerSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeDatePickerSlots {
  default?: (params: VxeDatePickerSlotTypes.DefaultSlotParams) => any
}

export const DatePicker: typeof VxeDatePicker
export default VxeDatePicker
