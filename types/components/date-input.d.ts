import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeDateInput: defineVxeComponent<VxeDateInputProps, VxeDateInputEventProps>
export type VxeDateInputComponent = DefineComponent<VxeDateInputProps, VxeDateInputEmits>

export type VxeDateInputInstance = ComponentPublicInstance<VxeDateInputProps, VxeDateInputConstructor>

export interface VxeDateInputConstructor extends VxeComponentBaseOptions, VxeDateInputMethods {
  props: VxeDateInputProps
  context: SetupContext<VxeDateInputEmits>
  reactData: DateInputReactData
  getRefMaps(): DateInputPrivateRef
  getComputeMaps(): DateInputPrivateComputed
  renderVN: RenderFunction
}

export interface DateInputPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeDateInputPrivateRef extends DateInputPrivateRef { }

export namespace VxeDateInputPropTypes {
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
  export type Maxlength = string | number
  export type Multiple = boolean
  export type ShowWordCount = boolean
  export type CountMethod = (params: {
    value: string
  }) => number
  export type Autocomplete = string
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
  export type FestivalMethod = (params: VxeDateInputDefines.DateFestivalParams) => VxeDateInputDefines.DateFestivalInfo | null | void
  export type DisabledMethod = (params: VxeDateInputDefines.DateDisabledParams) => boolean
  export type PrefixIcon = string
  export type SuffixIcon = string
  export type Placement = 'top' | 'bottom' | '' | null
  export type Transfer = boolean
}

export type VxeDateInputProps = {
  size?: VxeDateInputPropTypes.Size
  modelValue?: VxeDateInputPropTypes.ModelValue
  className?: VxeDateInputPropTypes.ClassName
  immediate?: VxeDateInputPropTypes.Immediate
  name?: VxeDateInputPropTypes.Name
  type?: VxeDateInputPropTypes.Type
  clearable?: VxeDateInputPropTypes.Clearable
  readonly?: VxeDateInputPropTypes.Readonly
  disabled?: VxeDateInputPropTypes.Disabled
  placeholder?: VxeDateInputPropTypes.Placeholder
  maxlength?: VxeDateInputPropTypes.Maxlength
  multiple?: VxeDateInputPropTypes.Multiple
  /**
   * 是否显示字数统计
   */
  showWordCount?: VxeDateInputPropTypes.ShowWordCount
  /**
   * 自定义字数统计方法
   */
  countMethod?: VxeDateInputPropTypes.CountMethod
  autocomplete?: VxeDateInputPropTypes.Autocomplete
  align?: VxeDateInputPropTypes.Align
  form?: VxeDateInputPropTypes.Form

  // number、integer、float、password
  controls?: VxeDateInputPropTypes.Controls

  // float
  digits?: VxeDateInputPropTypes.Digits

  // date、week、month、quarter、year
  startDate?: VxeDateInputPropTypes.StartDate
  endDate?: VxeDateInputPropTypes.EndDate
  minDate?: VxeDateInputPropTypes.MinDate
  maxDate?: VxeDateInputPropTypes.MaxDate
  /**
   * @deprecated
   */
  startWeek?: VxeDateInputPropTypes.StartDay
  startDay?: VxeDateInputPropTypes.StartDay
  labelFormat?: VxeDateInputPropTypes.LabelFormat
  valueFormat?: VxeDateInputPropTypes.ValueFormat
  editable?: VxeDateInputPropTypes.Editable
  festivalMethod?: VxeDateInputPropTypes.FestivalMethod
  disabledMethod?: VxeDateInputPropTypes.DisabledMethod

  // week
  selectDay?: VxeDateInputPropTypes.SelectDay

  prefixIcon?: VxeDateInputPropTypes.PrefixIcon
  suffixIcon?: VxeDateInputPropTypes.SuffixIcon
  placement?: VxeDateInputPropTypes.Placement
  transfer?: VxeDateInputPropTypes.Transfer
}

export interface DateInputPrivateComputed {
}
export interface VxeDateInputPrivateComputed extends DateInputPrivateComputed { }

export interface DateInputReactData {
}

export interface DateInputMethods {
  dispatchEvent(type: ValueOf<VxeDateInputEmits>, params: Record<string, any>, evnt: Event | null): void
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
export interface VxeDateInputMethods extends DateInputMethods { }

export interface DateInputPrivateMethods { }
export interface VxeDateInputPrivateMethods extends DateInputPrivateMethods { }

export type VxeDateInputEmits = []

export namespace VxeDateInputDefines {
  export interface DateInputEventParams extends VxeComponentEventParams {
    $dateInput: VxeDateInputConstructor
  }

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
    $input: VxeInputConstructor
    type: string
    viewType: DatePanelType
    date: Date
  }

  export interface DateDisabledParams {
    $input: VxeInputConstructor
    type: string
    viewType: DatePanelType
    date: Date
  }
}

export type VxeDateInputEventProps = {}

export interface VxeDateInputListeners { }

export namespace VxeDateInputEvents { }

export namespace VxeDateInputSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeDateInputSlots {
  default: (params: VxeDateInputSlotTypes.DefaultSlotParams) => any
}

export const DateInput: typeof VxeDateInput
export default VxeDateInput
