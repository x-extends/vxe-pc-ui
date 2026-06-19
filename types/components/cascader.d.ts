import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, VxeComponentSizeType, ValueOf } from '@vxe-ui/core'
import { VxeListPropTypes } from './list'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeCascader: DefineVxeComponentApp<VxeCascaderProps, VxeCascaderEventProps, VxeCascaderSlots, VxeCascaderMethods>
export type VxeCascaderComponent = DefineVxeComponentOptions<VxeCascaderProps>

export type VxeCascaderInstance = DefineVxeComponentInstance<{
  reactData: CascaderReactData
}, VxeCascaderProps, VxeCascaderPrivateComputed, VxeCascaderMethods>

export type VxeCascaderConstructor = VxeCascaderInstance

export interface CascaderPrivateRef {
}
export interface VxeCascaderPrivateRef extends CascaderPrivateRef { }

export namespace VxeCascaderPropTypes {
  export type Size = VxeComponentSizeType
  export type ModelValue = any
  export type Clearable = boolean
  export type Placeholder = string
  export type Readonly = boolean
  export type Loading = boolean
  export type Disabled = boolean
  export type CheckedClosable = boolean
  export type ClearClosable = boolean
  export type ShowCloseButton = boolean
  export type ShowTotalButton = boolean
  export type ShowCheckedButton = boolean
  export type ShowClearButton = boolean
  export type ClassName = string | ((params: { $cascader: VxeCascaderConstructor }) => string)
  export type Multiple = boolean
  export type PrefixIcon = string
  export type Filterable = boolean
  /**
   * 根据指定值来筛选数据
   */
  type FilterValue = string | number | null | undefined
  export interface FilterConfig<D = any> {
    /**
     * 过滤后是否自动展开第一个节点
     */
    autoExpandMode?: 'first' | 'last' | ''
    /**
     * 过滤之前的方法
     */
    beforeFilterMethod?(params: {
      $cascader: VxeCascaderConstructor
      filterValue: FilterValue
    }): void
    /**
     * 自定义过滤数据方法
     */
    filterMethod?:(params: {
      $cascader: VxeCascaderConstructor
      node: D
      filterValue: FilterValue
    }) => boolean
    /**
     * 过滤之后的方法
     */
    afterFilterMethod?(params: {
      $cascader: VxeCascaderConstructor
      filterValue: FilterValue
    }): void
  }
  export type ShowFullLabel = boolean
  export type Separator = string

  export interface Option {
    value?: string | number
    label?: string | number
    children?: Option[]

    [key: string]: any
  }
  export type LazyOptions<D = Option> = D[]
  export type Options<D = Option> = D[]
  export interface OptionProps {
    value?: string
    label?: string
    disabled?: string
  }
  export type Remote = boolean
  export type ShowRadio = boolean
  export interface RadioConfig<D = any> {
    strict?: boolean
    visibleMode?: 'all' | 'first' | 'last' | '' | null
    visibleMethod?: (params: {
      $cascader: VxeCascaderConstructor
      node: D
    }) => boolean
    checkMode?: 'all' | 'first' | 'last' | '' | null
    checkMethod?: (params: {
      $cascader: VxeCascaderConstructor
      node: D
    }) => boolean
    trigger?: '' | 'default' | 'node'
  }
  export type ShowCheckbox = boolean
  export interface CheckboxConfig<D = any> {
    checkStrictly?: boolean
    visibleMode?: 'all' | 'first' | 'last' | '' | null
    visibleMethod?: (params: {
      $cascader: VxeCascaderConstructor
      node: D
    }) => boolean
    checkMode?: 'all' | 'first' | 'last' | '' | null
    checkMethod?: (params: {
      $cascader: VxeCascaderConstructor
      node: D
    }) => boolean
    trigger?: '' | 'default' | 'node'
  }
  export interface RemoteConfig {
    /**
     * 是否启用
     */
    enabled?: boolean
    /**
     * 当列表为空时，是否默认自动调用远程查询方法
     */
    autoLoad?: boolean
    /**
     * 远程查询方法
     */
    queryMethod?(params: {
      $cascader: VxeCascaderConstructor
      searchValue: string
      value: ModelValue | undefined
    }): Promise<void> | void
  }

  export interface PopupConfig {
    /**
     * 设置弹出面板方向
     */
    placement?: 'top' | 'bottom' | '' | null
    /**
     * 默认弹出面板方向
     */
    defaultPlacement?: 'top' | 'bottom' | '' | null
    transfer?: boolean
    height?: number | string
    nodeWidth?: number | string
    nodeHeight?: number | string
    className?: string | ((params: { $cascader: VxeCascaderConstructor }) => string)
    zIndex?: number
  }
  export interface TreeConfig<D = any> {
    transform?: boolean
    lazy?: boolean
    parentField?: string
    keyField?: string
    childrenField?: string
    hasChildField?: string
    mapChildrenField?: string
    rootParentValue?: string | number | null
    rootValues?: (string | number)[]
    trigger?: '' | 'default' | 'node' | 'icon'
    showIcon?: boolean
    iconOpen?: string
    iconClose?: string
    iconLoaded?: string
    toggleMethod?(params: {
      $cascader: VxeCascaderConstructor
      expanded: boolean
      node: D
    }): boolean
    loadMethod?(params: {
      $cascader: VxeCascaderConstructor
      node: D
    }): Promise<any[]>
  }
}

export interface VxeCascaderProps<D = any> {
  size?: VxeCascaderPropTypes.Size
  modelValue?: VxeCascaderPropTypes.ModelValue
  clearable?: VxeCascaderPropTypes.Clearable
  placeholder?: VxeCascaderPropTypes.Placeholder
  readonly?: VxeCascaderPropTypes.Readonly
  loading?: VxeCascaderPropTypes.Loading
  disabled?: VxeCascaderPropTypes.Disabled
  checkedClosable?: VxeCascaderPropTypes.CheckedClosable
  clearClosable?: VxeCascaderPropTypes.ClearClosable
  showCloseButton?: VxeCascaderPropTypes.ShowCloseButton
  showTotalButton?: VxeCascaderPropTypes.ShowTotalButton
  showCheckedButton?: VxeCascaderPropTypes.ShowCheckedButton
  showClearButton?: VxeCascaderPropTypes.ShowClearButton
  className?: VxeCascaderPropTypes.ClassName
  multiple?: VxeCascaderPropTypes.Multiple
  prefixIcon?: VxeCascaderPropTypes.PrefixIcon
  filterable?: VxeCascaderPropTypes.Filterable
  filterConfig?: VxeCascaderPropTypes.FilterConfig
  showFullLabel?: VxeCascaderPropTypes.ShowFullLabel
  separator?: VxeCascaderPropTypes.Separator
  lazyOptions?: VxeCascaderPropTypes.LazyOptions<D>
  options?: VxeCascaderPropTypes.Options<D>
  optionProps?: VxeCascaderPropTypes.OptionProps
  remote?: VxeCascaderPropTypes.Remote
  showRadio?: VxeCascaderPropTypes.ShowRadio
  radioConfig?: VxeCascaderPropTypes.RadioConfig
  showCheckbox?: VxeCascaderPropTypes.ShowCheckbox
  checkboxConfig?: VxeCascaderPropTypes.CheckboxConfig
  remoteConfig?: VxeCascaderPropTypes.RemoteConfig
  popupConfig?: VxeCascaderPropTypes.PopupConfig
  treeConfig?: VxeCascaderPropTypes.TreeConfig<D>
}

export interface CascaderPrivateComputed {
}
export interface VxeCascaderPrivateComputed extends CascaderPrivateComputed { }

export interface CascaderReactData {
  initialized: boolean
  searchValue: string
  searchLoading: boolean
  currentCunkList: any[][]
  currentItems: string[]
  currentNode: any
  panelIndex: number
  panelStyle: any
  panelPlacement: any
  triggerFocusPanel: boolean
  visiblePanel: boolean
  isAniVisible: boolean
  isActivated: boolean
  selectRadioKey: any
  treeList: any[]
  updateExpandedFlag: number
  updateCheckboxFlag: number
  fullOptFlag: number
  lazyOptFlag: number
}

export interface CascaderInternalData {
  hpTimeout?: undefined | number
  listVirtualYOpts: VxeListPropTypes.VirtualYConfig
  afterTreeList: any[]
  treeFullData: any[]
  afterVisibleList: any[]
  nodeMaps: Record<string, VxeCascaderDefines.NodeCacheItem>
  fullNodeMaps: Record<string, VxeCascaderDefines.NodeCacheItem>
  lazyNodeMaps: Record<string, VxeCascaderDefines.NodeCacheItem>
  lastFilterValue?: string
  indeterminateRowMaps: Record<string, any>
  selectCheckboxMaps: Record<string, any>
  treeExpandedMaps: Record<string, boolean>
  treeExpandLazyLoadedMaps: Record<string, boolean>
}

export interface CascaderMethods {
  dispatchEvent(type: ValueOf<VxeCascaderEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeCascaderMethods extends CascaderMethods { }

export interface CascaderPrivateMethods {
  /**
   * @private
   */
  loadChildrenNode(node: any, childRecords: any[]): Promise<any>
  /**
   * @private
   */
  isCheckedByCheckboxNodeId(nodeKey: string | number | null): boolean
}
export interface VxeCascaderPrivateMethods extends CascaderPrivateMethods { }

export type VxeCascaderEmits = [
  'input',
  'change',
  'all-change',
  'clear',
  'blur',
  'focus',
  'click',
  'node-click',
  'node-expand',
  'current-change',
  'radio-change',
  'checkbox-change',
  'load-success',
  'load-error',
  'visible-change'
]

export namespace VxeCascaderDefines {
  export interface NodeCacheItem {
    item: any
    index: number
    $index: number
    _index: number
    items: any[]
    nodes: any[]
    parent: any
    level: number
    treeIndex: number
    lineCount: number
    treeLoaded: boolean
    fullLabel: string
  }

  export interface CascaderEventParams extends VxeComponentEventParams {
    $cascader: VxeCascaderConstructor
  }

  export interface ChangeEventParams<D = any> extends CascaderEventParams {
    value: any
    option: D
  }

  export interface ClearEventParams extends CascaderEventParams {
    value: any
  }

  export interface FocusEventParams extends CascaderEventParams { }
  export interface BlurEventParams extends CascaderEventParams { }
  export interface ClickEventParams extends CascaderEventParams { }

  export interface VisibleChangeEventParams extends CascaderEventParams {
    visible: boolean
  }
}

export interface VxeCascaderEventProps<D = any> {
  onChange?: VxeCascaderEvents.Change<D>
  onClear?: VxeCascaderEvents.Clear
  onFocus?: VxeCascaderEvents.Focus
  onBlur?: VxeCascaderEvents.Blur
  onClick?: VxeCascaderEvents.Click
  onVisibleChange?: VxeCascaderEvents.VisibleChange
}

export interface VxeCascaderListeners<D = any> {
  change?: VxeCascaderEvents.Change<D>
  clear?: VxeCascaderEvents.Clear
  focus?: VxeCascaderEvents.Focus
  blur?: VxeCascaderEvents.Blur
  click?: VxeCascaderEvents.Click
  visibleChange?: VxeCascaderEvents.VisibleChange
}

export namespace VxeCascaderEvents {
  export type Change<D = any> = (params: VxeCascaderDefines.ChangeEventParams<D>) => void
  export type Clear = (params: VxeCascaderDefines.ClearEventParams) => void
  export type Focus = (params: VxeCascaderDefines.FocusEventParams) => void
  export type Blur = (params: VxeCascaderDefines.BlurEventParams) => void
  export type Click = (params: VxeCascaderDefines.ClickEventParams) => void
  export type VisibleChange = (params: VxeCascaderDefines.VisibleChangeEventParams) => void
}

export namespace VxeCascaderSlotTypes {
  export interface DefaultSlotParams {}
  export interface PrefixSlotParams {}
  export interface HeaderSlotParams {}
  export interface FooterSlotParams {}
}

export interface VxeCascaderSlots {
  default?: (params: VxeCascaderSlotTypes.DefaultSlotParams) => any

  prefix?: (params: VxeCascaderSlotTypes.PrefixSlotParams) => any
  header?: (params: VxeCascaderSlotTypes.HeaderSlotParams) => any
  footer?: (params: VxeCascaderSlotTypes.FooterSlotParams) => any
}

export const Cascader: typeof VxeCascader
export default VxeCascader
