import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, VxeComponentSizeType, VxeComponentStyleType, ValueOf } from '@vxe-ui/core'
import { VxeOptgroupProps } from './optgroup'
import { VxeOptionProps, VxeOptionPropTypes } from './option'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeSelect: DefineVxeComponentApp<VxeSelectProps, VxeSelectEventProps, VxeSelectSlots, VxeSelectMethods>
export type VxeSelectComponent = DefineVxeComponentOptions<VxeSelectProps>

export type VxeSelectInstance = DefineVxeComponentInstance<{
  reactData: SelectReactData
}, VxeSelectProps, VxeSelectPrivateComputed, VxeSelectMethods>

export type VxeSelectConstructor = VxeSelectInstance

export interface SelectPrivateRef {
}
export interface VxeSelectPrivateRef extends SelectPrivateRef { }

export namespace VxeSelectPropTypes {
  export type Size = VxeComponentSizeType
  export type ModelValue = string | number | boolean | null | (string | number | boolean)[]
  export interface DefaultConfig {
    /**
     * 默认选择模式，默认选中行为只会在初始化时触发一次
     */
    selectMode?: 'first' | 'last'
  }
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
  export type AllowCreate = boolean
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
  export type FilterMethod = (params: {
    $select: VxeSelectConstructor
    group: any
    option: any
    searchValue: string
    value: ModelValue | undefined
  }) => boolean
  export type Remote = boolean
  /**
   * 已废弃，被 remote-config.queryMethod 替换
   * @deprecated
   */
  export type RemoteMethod = (params: { searchValue: string }) => Promise<void> | void

  export interface RemoteConfig {
    /**
     * 是否启用
     */
    enabled?: boolean
    /**
     * 当列表为空时，是否默认自动调用远程方法
     */
    autoLoad?: boolean
    /**
     * 远程方法
     */
    queryMethod?(params: {
      $select: VxeSelectConstructor
      searchValue: string
      value: ModelValue | undefined
    }): Promise<void> | void
  }

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

  /**
   * 已被 VirtualYConfig 替换
   * @deprecated
   */
  export interface ScrollY {
    /**
     * 指定大于指定行时自动启动纵向虚拟滚动，如果为 0 则总是启用，如果为 -1 则关闭
     */
    gt?: number
    /**
     * 指定每次渲染的数据偏移量，偏移量越大渲染次数就越少，但每次渲染耗时就越久
     */
    oSize?: number
    /**
     * 指定列表项的 className
     */
    sItem?: string
    /**
     * 是否启用
     */
    enabled?: boolean
  }

  export interface VirtualYConfig {
    /**
     * 指定大于指定行时自动启动纵向虚拟滚动，如果为 0 则总是启用，如果为 -1 则关闭
     */
    gt?: number
    /**
     * 指定每次渲染的数据偏移量，偏移量越大渲染次数就越少，但每次渲染耗时就越久
     */
    oSize?: number
    /**
     * 指定列表项的 className
     */
    sItem?: string
    /**
     * 是否启用
     */
    enabled?: boolean

  }
}

export interface VxeSelectProps {
  size?: VxeSelectPropTypes.Size
  value?: VxeSelectPropTypes.ModelValue
  defaultConfig?: VxeSelectPropTypes.DefaultConfig
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
  allowCreate?: VxeSelectPropTypes.AllowCreate
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
  /**
   * 已废弃，被 remote-config.queryMethod 替换
   * @deprecated
   */
  remoteMethod?: VxeSelectPropTypes.RemoteMethod
  remoteConfig?: VxeSelectPropTypes.RemoteConfig
  max?: VxeSelectPropTypes.Max
  /**
   * 已废弃，被 option-config.keyField 替换
   * @deprecated
   */
  optionId?: VxeSelectPropTypes.OptionId
  /**
   * 已废弃，被 option-config.useKey 替换
   * @deprecated
   */
  optionKey?: VxeSelectPropTypes.OptionKey
  transfer?: VxeSelectPropTypes.Transfer
  virtualYConfig?: VxeSelectPropTypes.VirtualYConfig

  /**
   * 已废弃，被 virtual-y-config 替换
   * @deprecated
   */
  scrollY?: VxeSelectPropTypes.ScrollY
}

export interface SelectPrivateComputed {
}
export interface VxeSelectPrivateComputed extends SelectPrivateComputed { }

export interface SelectReactData {
  initialized: boolean
  scrollYLoad: boolean
  bodyHeight: number
  topSpaceHeight: number
  optList: any[]
  afterVisibleList: any[]
  staticOptions: any[]
  reactFlag: number

  currentOption: any
  searchValue: string
  searchLoading: boolean

  panelIndex: number
  panelStyle: VxeComponentStyleType
  panelPlacement: any
  triggerFocusPanel: boolean
  visiblePanel: boolean
  isAniVisible: boolean
  isActivated: boolean
}

export interface SelectInternalData {
  isLoaded?: boolean
  synchData: any[]
  fullData: any[]
  optAddMaps: Record<string, any>
  optGroupKeyMaps: Record<string, any>
  optFullValMaps: Record<string, VxeSelectDefines.OptCacheItem>
  remoteValMaps: Record<string, VxeSelectDefines.OptCacheItem>
  lastScrollLeft: number
  lastScrollTop: number
  scrollYStore: {
    startIndex: number
    endIndex: number
    visibleSize: number
    offsetSize: number
    rowHeight: number
  }
  lastScrollTime: number
  hpTimeout?: undefined | number
}

export interface SelectMethods {
  dispatchEvent(type: ValueOf<VxeSelectEmits>, params: Record<string, any>, evnt: Event | null): void
  /**
   * 加载数据
   * @param data 列表数据
   */
  loadData(data: any[]): Promise<any>
  /**
   * 加载数据
   * @param data 列表数据
   */
  reloadData(data: any[]): Promise<any>
  /**
   * 重新计算列表
   */
  recalculate(): Promise<void>
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
   * 手动清除滚动相关信息，还原到初始状态
   */
  clearScroll(): Promise<void>
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
  'input',
  'change',
  'clear',
  'blur',
  'focus',
  'click',
  'scroll',
  'visible-change'
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

  export interface OptCacheItem<D = any> {
    key: string
    _index: number
    item: D
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
  export interface ClickEventParams extends SelectEventParams {
    triggerButton: boolean
    visible: boolean
  }
  export interface ScrollEventParams extends SelectEventParams { }
  export interface VisibleChangeEventParams extends SelectEventParams {
    visible: boolean
  }
}

export type VxeSelectEventProps = {
  onChange?: VxeSelectEvents.Change
  onClear?: VxeSelectEvents.Clear
  onFocus?: VxeSelectEvents.Focus
  onBlur?: VxeSelectEvents.Blur
  onClick?: VxeSelectEvents.Click
  onScroll?: VxeSelectEvents.Scroll
  onVisibleChange?: VxeSelectEvents.VisibleChange
}

export interface VxeSelectListeners {
  change?: VxeSelectEvents.Change
  clear?: VxeSelectEvents.Clear
  focus?: VxeSelectEvents.Focus
  blur?: VxeSelectEvents.Blur
  click?: VxeSelectEvents.Click
  scroll?: VxeSelectEvents.Scroll
  visibleChange?: VxeSelectEvents.VisibleChange
}

export namespace VxeSelectEvents {
  export type Change = (params: VxeSelectDefines.ChangeEventParams) => void
  export type Clear = (params: VxeSelectDefines.ClearEventParams) => void
  export type Focus = (params: VxeSelectDefines.FocusEventParams) => void
  export type Blur = (params: VxeSelectDefines.BlurEventParams) => void
  export type Click = (params: VxeSelectDefines.ClickEventParams) => void
  export type Scroll = (params: VxeSelectDefines.ScrollEventParams) => void
  export type VisibleChange = (params: VxeSelectDefines.VisibleChangeEventParams) => void
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
