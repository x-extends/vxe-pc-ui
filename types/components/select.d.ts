import { RenderFunction, SetupContext, Ref } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentBaseOptions, VxeComponentEventParams, VxeComponentSizeType, VxeComponentStyleType, ValueOf } from '@vxe-ui/core'
import { VxeOptgroupProps } from './optgroup'
import { VxeOptionProps, VxeOptionPropTypes } from './option'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeSelect: DefineVxeComponentApp<VxeSelectProps, VxeSelectEventProps, VxeSelectSlots>
export type VxeSelectComponent = DefineVxeComponentOptions<VxeSelectProps, VxeSelectEventProps>

export type VxeSelectInstance = DefineVxeComponentInstance<VxeSelectProps, VxeSelectConstructor>

export interface VxeSelectConstructor extends VxeComponentBaseOptions, VxeSelectMethods {
  props: VxeSelectProps
  context: SetupContext<VxeSelectEmits>
  reactData: SelectReactData
  getRefMaps(): SelectPrivateRef
  getComputeMaps(): SelectPrivateComputed
  renderVN: RenderFunction
}

export interface SelectPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeSelectPrivateRef extends SelectPrivateRef { }

export namespace VxeSelectPropTypes {
  export type Size = VxeComponentSizeType
  export type ModelValue = string | number | boolean | null | (string | number | boolean)[]
  export type Clearable = boolean
  export type Placeholder = string
  export type Readonly = boolean
  export type Loading = boolean
  export type Disabled = boolean
  export type ClassName = string | ((params: { $select: VxeSelectConstructor }) => string)
  export type PopupClassName = string | ((params: { $select: VxeSelectConstructor }) => string)
  export type Multiple = boolean
  export type MultiCharOverflow = number | string
  export type PrefixIcon = string
  export type Placement = 'top' | 'bottom' | ''
  export type Options = VxeSelectDefines.SelectOptions[]
  export type OptionProps = {
    value?: string
    label?: string
    disabled?: string
  }
  export type OptionGroups = VxeSelectDefines.SelectOptgroups[]
  export type OptionGroupProps = {
    options?: string
    label?: string
    key?: string
  }
  export type Filterable = boolean
  export type FilterMethod = (params: { group: any, option: any, searchValue: string }) => boolean
  export type Remote = boolean
  export type RemoteMethod = (params: { searchValue: string }) => Promise<void> | void
  export type Max = number | string
  /**
   * 选项配置项
   */
  export interface OptionConfig {
    useKey?: boolean
    keyField?: string
  }
  export type EmptyText = string
  export type OptionId = string
  export type OptionKey = boolean
  export type Transfer = boolean
}

export interface VxeSelectProps {
  size?: VxeSelectPropTypes.Size
  modelValue?: VxeSelectPropTypes.ModelValue
  clearable?: VxeSelectPropTypes.Clearable
  placeholder?: VxeSelectPropTypes.Placeholder
  readonly?: VxeSelectPropTypes.Readonly
  loading?: VxeSelectPropTypes.Loading
  disabled?: VxeSelectPropTypes.Disabled
  className?: VxeSelectPropTypes.ClassName
  popupClassName?: VxeSelectPropTypes.PopupClassName
  multiple?: VxeSelectPropTypes.Multiple
  multiCharOverflow?: VxeSelectPropTypes.MultiCharOverflow
  prefixIcon?: VxeSelectPropTypes.PrefixIcon
  placement?: VxeSelectPropTypes.Placement
  options?: VxeSelectPropTypes.Options
  optionProps?: VxeSelectPropTypes.OptionProps
  optionGroups?: VxeSelectPropTypes.OptionGroups
  optionGroupProps?: VxeSelectPropTypes.OptionGroupProps
  optionConfig?: VxeSelectPropTypes.OptionConfig
  emptyText?: VxeSelectPropTypes.EmptyText
  filterable?: VxeSelectPropTypes.Filterable
  filterMethod?: VxeSelectPropTypes.FilterMethod
  remote?: VxeSelectPropTypes.Remote
  remoteMethod?: VxeSelectPropTypes.RemoteMethod
  max?: VxeSelectPropTypes.Max
  /**
   * 已废弃，被 optionConfig.keyField 替换
   * @deprecated
   */
  optionId?: VxeSelectPropTypes.OptionId
  /**
   * 已废弃，被 optionConfig.useKey 替换
   * @deprecated
   */
  optionKey?: VxeSelectPropTypes.OptionKey
  transfer?: VxeSelectPropTypes.Transfer
}

export interface SelectPrivateComputed {
}
export interface VxeSelectPrivateComputed extends SelectPrivateComputed { }

export interface SelectReactData {
  initialized: boolean
  staticOptions: VxeSelectDefines.OptionInfo[]
  fullGroupList: any[]
  fullOptionList: any[]
  visibleGroupList: any[]
  visibleOptionList: any[]
  remoteValueList: {
    key: string
    result: any
  }[]
  panelIndex: number
  panelStyle: VxeComponentStyleType
  panelPlacement: any
  currentOption: any
  currentValue: any
  triggerFocusPanel: boolean
  visiblePanel: boolean
  isAniVisible: boolean
  isActivated: boolean
  searchValue: string,
  searchLoading: boolean
}

export interface SelectMethods {
  dispatchEvent(type: ValueOf<VxeSelectEmits>, params: Record<string, any>, evnt: Event | null): void
  /**
   * 判断下拉面板是否可视
   */
  isPanelVisible(): boolean
  /**
   * 切换下拉面板
   */
  togglePanel(): Promise<any>
  /**
   * 显示下拉面板
   */
  showPanel(): Promise<any>
  /**
   * 隐藏下拉面板
   */
  hidePanel(): Promise<any>
  /**
   * 刷新选项，当选项被动态显示/隐藏时可能会用到
   */
  refreshOption(): Promise<any>
  /**
   * 获取焦点
   */
  focus(): Promise<any>
  /**
   * 失去焦点
   */
  blur(): Promise<any>
}
export interface VxeSelectMethods extends SelectMethods { }

export interface SelectPrivateMethods { }
export interface VxeSelectPrivateMethods extends SelectPrivateMethods { }

export type VxeSelectEmits = [
  'update:modelValue',
  'change',
  'clear',
  'blur',
  'focus',
  'click'
]

export namespace VxeSelectDefines {
  export class OptionInfo {
    id: string

    value: any
    label: VxeOptionPropTypes.Label
    visible: VxeOptionPropTypes.Visible
    className: VxeOptionPropTypes.ClassName
    disabled: VxeOptionPropTypes.Disabled

    options: OptionInfo[]
  }

  export interface SelectOptions extends VxeOptionProps {
    slots?: VxeOptionPropTypes.Slots

    [key: string]: any
  }

  export interface SelectOptgroups extends VxeOptgroupProps {
    options?: VxeOptionProps[]
    slots?: VxeOptionPropTypes.Slots

    [key: string]: any
  }

  interface SelectEventParams extends VxeComponentEventParams {
    $select: VxeSelectConstructor
  }

  export interface ChangeEventParams extends SelectEventParams {
    value: any
  }

  export interface ClearEventParams extends SelectEventParams {
    value: any
  }

  export interface FocusEventParams extends SelectEventParams { }
  export interface BlurEventParams extends SelectEventParams { }
  export interface ClickEventParams extends SelectEventParams { }
}

export type VxeSelectEventProps = {
  onChange?: VxeSelectEvents.Change
  onClear?: VxeSelectEvents.Clear
  onFocus?: VxeSelectEvents.Focus
  onBlur?: VxeSelectEvents.Blur
  onClick?: VxeSelectEvents.Click
}

export interface VxeSelectListeners {
  change?: VxeSelectEvents.Change
  clear?: VxeSelectEvents.Clear
  focus?: VxeSelectEvents.Focus
  blur?: VxeSelectEvents.Blur
  click?: VxeSelectEvents.Click
}

export namespace VxeSelectEvents {
  export type Change = (params: VxeSelectDefines.ChangeEventParams) => void
  export type Clear = (params: VxeSelectDefines.ClearEventParams) => void
  export type Focus = (params: VxeSelectDefines.FocusEventParams) => void
  export type Blur = (params: VxeSelectDefines.BlurEventParams) => void
  export type Click = (params: VxeSelectDefines.ClickEventParams) => void
}

export namespace VxeSelectSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeSelectSlots {
  /**
   * 自定义插槽模板
   */
  [key: string]: ((params: {
    option: any
    group: any
    [key: string]: any
  }) => any) | undefined

  /**
   * 自定义前缀图标模板
   */
  prefix?: (params: {
    [key: string]: any
  }) => any
  /**
   * 自定义弹窗容器头部模板
   */
  header?: (params: {
    [key: string]: any
  }) => any
  /**
   * 自定义弹窗容器选项模板
   */
  option?: ((params: {
    option: any
    group: any
    [key: string]: any
  }) => any) | undefined
  /**
   * 自定义弹窗容器底部模板
   */
  footer?: ((params: {
    [key: string]: any
  }) => any) | undefined
}

export const Select: typeof VxeSelect
export default VxeSelect
