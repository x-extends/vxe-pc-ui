import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, VxeComponentSizeType, ValueOf } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types,@typescript-eslint/no-unused-vars */

export declare const VxeTree: DefineVxeComponentApp<VxeTreeProps, VxeTreeEventProps, VxeTreeSlots, VxeTreeMethods>
export type VxeTreeComponent = DefineVxeComponentOptions<VxeTreeProps>

export type VxeTreeInstance<D = any> = DefineVxeComponentInstance<{
  reactData: TreeReactData
  internalData: TreeInternalData
}, VxeTreeProps<D>, VxeTreePrivateComputed, VxeTreeMethods<D>>

export type VxeTreeConstructor<D = any> = VxeTreeInstance<D>

export interface TreePrivateRef {
}
export interface VxeTreePrivateRef extends TreePrivateRef { }

export namespace VxeTreePropTypes {
  export type Data<D = any> = D[]
  export type Loading = boolean
  export type AutoResize = boolean
  export interface LoadingConfig {
    /**
     * 显示图标
     */
    icon?: string
    /**
     * 显示文字
     */
    text?: string
  }
  export type Accordion = boolean
  export type Height = string | number
  export type MinHeight = string | number
  export type MaxHeight = string | number
  export type ParentField = string
  export type ValueField = string
  export type KeyField = string
  export type TitleField = string
  export type ChildrenField = string
  export type HasChildField = string
  export type MapChildrenField = string
  export type Transform = boolean
  export type Trigger = '' | 'default' | 'node'
  /**
   * 已废弃，请使用 nodeConfig.isCurrent
   * @deprecated
   */
  export type IsCurrent = boolean
  /**
   * 已废弃，请使用 nodeConfig.isHover
   * @deprecated
   */
  export type IsHover = boolean
  export type ShowLine = boolean
  export type Indent = number
  export type ExpandAll = boolean
  export type ShowRadio = boolean
  export type CheckNodeKey = string | number | null
  export interface RadioConfig<D = any> {
    strict?: boolean
    visibleMethod?: (params: {
      $tree: VxeTreeConstructor
      node: D
     }) => boolean
    checkMethod?: (params: {
      $tree: VxeTreeConstructor
      node: D
     }) => boolean
    highlight?: boolean
    showIcon?: boolean
    trigger?: '' | 'default' | 'node'
  }
  export type CheckNodeKeys = (string | number | null)[]
  export type ShowCheckbox = boolean
  export interface CheckboxConfig<D = any> {
    showHeader?: boolean
    checkStrictly?: boolean
    highlight?: boolean
    visibleMethod?: (params: {
      $tree: VxeTreeConstructor
      node: D
     }) => boolean
    checkMethod?: (params: {
      $tree: VxeTreeConstructor
      node: D
    }) => boolean
    showIcon?: boolean
    trigger?: '' | 'default' | 'node'
  }
  export interface NodeConfig<D = any> {
    isHover?: boolean
    isCurrent?: boolean
    currentMethod?: (params: { node: D }) => boolean
    trigger?: '' | 'default' | 'all' | 'parent' | 'child'
  }
  export type Lazy = boolean
  export type ToggleMethod<D = any> = (params: {
    $tree: VxeTreeConstructor
    expanded: boolean
    node: D
  }) => boolean
  export type LoadMethod<D = any> = (params: {
    $tree: VxeTreeConstructor
    node: D
  }) => Promise<any[]>
  export type ShowIcon = boolean
  export type IconOpen = string
  export type IconClose = string
  export type IconLoaded = string
  export type Size = VxeComponentSizeType

  /**
   * 根据指定值来筛选数据
   */
  export type FilterValue = string | number | null | undefined
  export interface FilterConfig<D = any> {
    /**
     * 过滤后是否自动展开与收起所有节点
     */
    autoExpandAll?: boolean
    /**
     * 过滤之前的方法
     */
    beforeFilterMethod?(params: {
      $tree: VxeTreeConstructor
      filterValue: FilterValue
    }): void
    /**
     * 自定义过滤数据方法
     */
    filterMethod?:(params: {
      $tree: VxeTreeConstructor
      node: D
      filterValue: FilterValue
    }) => boolean
    /**
     * 过滤之后的方法
     */
    afterFilterMethod?(params: {
      $tree: VxeTreeConstructor
      filterValue: FilterValue
    }): void
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
     * 是否启用
     */
    enabled?: boolean
  }
}

export interface VxeTreeProps<D = any> {
  data?: VxeTreePropTypes.Data<D>
  autoResize?: VxeTreePropTypes.AutoResize
  height?: VxeTreePropTypes.Height
  minHeight?: VxeTreePropTypes.MinHeight
  maxHeight?: VxeTreePropTypes.MaxHeight
  loading?: VxeTreePropTypes.Loading
  loadingConfig?: VxeTreePropTypes.LoadingConfig
  accordion?: VxeTreePropTypes.Accordion
  parentField?: VxeTreePropTypes.ParentField
  valueField?: VxeTreePropTypes.ValueField
  keyField?: VxeTreePropTypes.KeyField
  titleField?: VxeTreePropTypes.TitleField
  childrenField?: VxeTreePropTypes.ChildrenField
  hasChildField?: VxeTreePropTypes.HasChildField
  mapChildrenField?: VxeTreePropTypes.MapChildrenField
  expandAll?: VxeTreePropTypes.ExpandAll
  transform?: VxeTreePropTypes.Transform
  trigger?: VxeTreePropTypes.Trigger
  /**
   * 已废弃，请使用 nodeConfig.isCurrent
   * @deprecated
   */
  isCurrent?: VxeTreePropTypes.IsCurrent
  /**
   * 已废弃，请使用 nodeConfig.isHover
   * @deprecated
   */
  isHover?: VxeTreePropTypes.IsHover
  showLine?: VxeTreePropTypes.ShowLine
  indent?: VxeTreePropTypes.Indent
  showRadio?: VxeTreePropTypes.ShowRadio
  checkNodeKey?: VxeTreePropTypes.CheckNodeKey
  radioConfig?: VxeTreePropTypes.RadioConfig<D>
  showCheckbox?: VxeTreePropTypes.ShowCheckbox
  checkNodeKeys?: VxeTreePropTypes.CheckNodeKeys
  checkboxConfig?: VxeTreePropTypes.CheckboxConfig<D>
  nodeConfig?: VxeTreePropTypes.NodeConfig<D>
  filterValue?: VxeTreePropTypes.FilterValue
  filterConfig?: VxeTreePropTypes.FilterConfig
  lazy?: VxeTreePropTypes.Lazy
  toggleMethod?: VxeTreePropTypes.ToggleMethod<D>
  /**
   * 该方法用于异步加载子节点
   */
  loadMethod?: VxeTreePropTypes.LoadMethod<D>
  showIcon?: VxeTreePropTypes.ShowIcon
  iconOpen?: VxeTreePropTypes.IconOpen
  iconClose?: VxeTreePropTypes.IconClose
  iconLoaded?: VxeTreePropTypes.IconLoaded
  size?: VxeTreePropTypes.Size
  virtualYConfig?: VxeTreePropTypes.VirtualYConfig
}

export interface TreePrivateComputed<D = any> {
  computeChildrenField: string
  computeMapChildrenField: string
  computeRadioOpts: VxeTreePropTypes.RadioConfig<D>
  computeCheckboxOpts: VxeTreePropTypes.CheckboxConfig<D>
  computeNodeOpts: VxeTreePropTypes.NodeConfig<D>
}
export interface VxeTreePrivateComputed extends TreePrivateComputed { }

export interface TreeReactData {
  parentHeight: number
  customHeight: number
  customMinHeight: number
  customMaxHeight: number
  currentNode: any
  scrollYLoad: boolean
  bodyHeight: number
  topSpaceHeight: number
  selectRadioKey: VxeTreePropTypes.CheckNodeKey | null
  treeList: any[]
  updateExpandedFlag: number
  updateCheckboxFlag: number
}

export interface TreeInternalData {
  initialized?: boolean
  resizeObserver?: ResizeObserver
  lastFilterValue?: string
  afterTreeList: any[]
  treeFullData: any[]
  afterVisibleList: any[]
  nodeMaps: Record<string, VxeTreeDefines.NodeCacheItem>
  indeterminateRowMaps: Record<string, any>
  selectCheckboxMaps: Record<string, any>
  treeExpandedMaps: Record<string, boolean>
  treeExpandLazyLoadedMaps: Record<string, boolean>
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

export interface TreeMethods<D = any> {
  dispatchEvent(type: ValueOf<VxeTreeEmits>, params: Record<string, any>, evnt: Event | null): void
  /**
   * 加载数据
   */
  loadData(data: any[]): Promise<any>
  /**
   * 加载数据并清除所有状态
   */
  reloadData(data: any[]): Promise<any>
  /**
   * 根据节点获取的主键
   * @param node
   */
  getNodeId(node: any): string
  /**
   * 根据唯一主键获取节点
   * @param nodeid
   */
  getNodeById(nodeid: string): D
  /**
   * 获取当前选中节点的主键
   */
  getCurrentNodeId(): string | number | null
  /**
   * 获取当前选中节点
   */
  getCurrentNode(): any | null
  /**
   * 清除当前选中节点
   */
  clearCurrentNode(): Promise<any>
  /**
   * 根据主键设置当前节点是否被选中
   */
  setCurrentNodeId(nodeKey: string | number | null): Promise<any>
  /**
   * 根据节点设置当前节点是否被选中
   */
  setCurrentNode(node: any): Promise<any>
  /**
   * 只对 show-radio 有效，获取单选框的节点对应的键值
   */
  getRadioNodeId(): string | number | null
  /**
   * 只对 show-radio 有效，获取单选框的节点
   */
  getRadioNode(): any | null
  /**
   * 用于 showRadio，手动清空单选框的
   */
  clearRadioNode(): Promise<any>
  /**
   * 只对 show-radio 有效，通过键值设置节点是否被选中
   */
  setRadioNodeId(nodeKey: string | number | null): Promise<any>
  /**
   * 用于 showRadio 单选框，设置指定节点为选中状态
   */
  setRadioNode(node: any): Promise<any>
  /**
   * 只对 show-checkbox 有效，获取复选框的节点对应的键值
   */
  getCheckboxNodeIds(): (string | number)[]
  /**
   * 只对 show-checkbox 有效，获取复选框的节点
   */
  getCheckboxNodes(): D[]
  /**
   * 用于 showCheckbox，手动清空复选框的
   */
  clearCheckboxNode(): Promise<{
    checkNodeKeys: (string | number)[]
  }>
  /**
   * 用于 showCheckbox，设置所有节点的选中状态
   */
  setAllCheckboxNode(checked: boolean): Promise<{
    checkNodeKeys: (string | number)[]
  }>
  /**
   * 用于 showCheckbox 复选框，设置指定节点为选中状态，第二个参数为选中与否
   */
  setCheckboxNode(nodeList: any | any[], checked: boolean): Promise<any>
  /**
   * 用于 showCheckbox 复选框，设置指定节点 key 为选中状态，第二个参数为选中与否
   */
  setCheckboxByNodeId(nodeKeys: string | number | null | (string | number | null)[], checked: boolean): Promise<any>
  /**
   * 已废弃，请使用 clearAllExpandNode
   * @deprecated
   */
  clearExpandNode(): Promise<any>
  /**
   * 手动清除所有树节点的展开状态
   */
  clearAllExpandNode(): Promise<any>
  /**
   * 设置指定节点 key 为展开状态，第二个参数为选中与否
   */
  setExpandByNodeId(nodeKeys: string | number | null | (string | number | null)[], expanded: boolean): Promise<any>
  /**
   * 设置指定节点为展开状态
   */
  setExpandNode(nodeList: any | any[], expanded: boolean): Promise<any>
  /**
   * 根据节点主键切换指定节点为展开状态
   */
  toggleExpandByNodeId(nodeKeys: string | number | null | (string | number | null)[]): Promise<any>
  /**
   * 切换指定节点为展开状态
   */
  toggleExpandNode(nodeList: any | any[]): Promise<any>
  /**
   * 设置全部节点为展开状态
   */
  setAllExpandNode(expanded: boolean): Promise<any>
  /**
   * 获取已展开的节点对应的键值
   */
  getExpandNodeIds(): (string | number)[]
  /**
   * 获取已展开的节点
   */
  getExpandNodes(): D[]
  /**
   * 重新懒加载展开节点
   */
  reloadExpandNode(node: any): Promise<any>
  /**
   * 清除指定节点的懒加载状态，恢复成未加载之前状态
   */
  clearExpandLoaded(node: any): Promise<any>
  loadChildrenNode(node: any, childRecords: any[]): Promise<any>
  /**
   * 判断指定节点是否为展开状态
   */
  isExpandByNode(node: any): boolean
  /**
   * 用于 show-radio，根据节点主键判断指定节点是否为选中状态
   */
  isCheckedByRadioNodeId(nodeKey: string | number | null): boolean
  /**
   * 用于 show-radio，判断指定节点是否为选中状态
   */
  isCheckedByRadioNode(node: any): boolean
  /**
   * 用于 show-checkbox，根据节点主键判断指定节点是否为选中状态
   */
  isCheckedByCheckboxNodeId(nodeKey: string | number | null): boolean
  /**
   * 用于 show-checkbox，判断指定节点是否为半选状态
   */
  isIndeterminateByCheckboxNode(node: any): boolean
  /**
   * 用于 show-checkbox，判断指定节点是否为选中状态
   */
  isCheckedByCheckboxNode(node: any): boolean
  /**
   * 用于 show-checkbox，获取半选状态的节点
   */
  getCheckboxIndeterminateNodes(): D[]
  /**
   * 重新计算列表
   */
  recalculate(): Promise<void>

  /**
   * 如果有滚动条，则滚动到对应的位置
   */
  scrollTo(x: {
    top?: number | null
    left?: number | null
  } | number | null | undefined, y?: number | null): Promise<void>
  /**
   * 如果有滚动条，则滚动到指定的节点位置
   */
  scrollToNode(node: any): Promise<void>
  /**
   * 如果有滚动条，则根据节点主键滚动到对应的节点位置
   */
  scrollToNodeId(nodeKey: string | number | null): Promise<void>

  /**
   * 手动清除滚动相关信息，还原到初始状态
   */
  clearScroll(): Promise<void>
}
export interface VxeTreeMethods<D = any> extends TreeMethods<D> { }

export interface TreePrivateMethods { }
export interface VxeTreePrivateMethods extends TreePrivateMethods { }

export type VxeTreeEmits = [
  'input',
  'update:checkNodeKey',
  'update:checkNodeKeys',
  'node-click',
  'node-dblclick',
  'current-change',
  'radio-change',
  'checkbox-change',
  'load-success',
  'load-error',
  'scroll'
]

export namespace VxeTreeDefines {
  export interface TreeEventParams<D = any> extends VxeComponentEventParams {
    $tree: VxeTreeConstructor<D>
  }

  export interface NodeCacheItem {
    item: any
    index: number
    items: any[]
    nodes: any[]
    parent: any
    level: number
    treeIndex: number
    lineCount: number
    treeLoaded: boolean
  }

  export interface NodeClickParams<D = any> {
    node: D
  }
  export interface NodeClickEventParams<D = any> extends TreeEventParams<D>, NodeClickParams<D> { }

  export interface NodeDblclickEventParams<D = any> extends NodeClickEventParams<D> { }

  export interface CurrentChangeEventParams<D = any> extends TreeEventParams<D> {
    node: D
    checked: boolean
  }

  export interface RadioChangeEventParams<D = any> extends TreeEventParams<D> {
    node: D
    checked: boolean
    value: VxeTreePropTypes.CheckNodeKey
  }
  export interface CheckboxChangeEventParams<D = any> extends TreeEventParams<D> {
    node: D
    checked: boolean
    value: VxeTreePropTypes.CheckNodeKeys
  }

  export interface LoadSuccessEventParams<D = any> extends TreeEventParams<D> {
    node: D
  }

  export interface LoadErrorEventParams<D = any> extends TreeEventParams<D> {
    node: D
  }
}

export type VxeTreeEventProps = {
  onNodeClick?: VxeTreeEvents.NodeClick
  onNodeDblclick?: VxeTreeEvents.NodeDblclick
  onCurrentChange?: VxeTreeEvents.CurrentChange
  onRadioChange?: VxeTreeEvents.RadioChange
  onCheckboxChange?: VxeTreeEvents.CheckboxChange
  onLoadSuccess?: VxeTreeEvents.LoadSuccess
  onLoadError?: VxeTreeEvents.LoadError
}

export interface VxeTreeListeners<D = any> {
  nodeClick?: VxeTreeEvents.NodeClick<D>
  nodeDblclick?: VxeTreeEvents.NodeDblclick<D>
  currentChange?: VxeTreeEvents.CurrentChange<D>
  radioChange?: VxeTreeEvents.RadioChange<D>
  checkboxChange?: VxeTreeEvents.CheckboxChange<D>
  loadSuccess?: VxeTreeEvents.LoadSuccess<D>
  loadError?: VxeTreeEvents.LoadError<D>
}

export namespace VxeTreeEvents {
  export type NodeClick<D = any> = (params: VxeTreeDefines.NodeClickEventParams<D>) => void
  export type NodeDblclick<D = any> = (params: VxeTreeDefines.NodeDblclickEventParams<D>) => void
  export type CurrentChange<D = any> = (params: VxeTreeDefines.CurrentChangeEventParams<D>) => void
  export type RadioChange<D = any> = (params: VxeTreeDefines.RadioChangeEventParams<D>) => void
  export type CheckboxChange<D = any> = (params: VxeTreeDefines.CheckboxChangeEventParams<D>) => void
  export type LoadSuccess<D = any> = (params: VxeTreeDefines.LoadSuccessEventParams<D>) => void
  export type LoadError<D = any> = (params: VxeTreeDefines.LoadErrorEventParams<D>) => void
}

export namespace VxeTreeSlotTypes {
  export interface DefaultSlotParams {
    node: any
    isExpand: boolean
  }
  export interface IconSlotParams {
    node: any
    isExpand: boolean
  }
}

export interface VxeTreeSlots {
  icon?: (params: VxeTreeSlotTypes.IconSlotParams) => any
  title?: (params: VxeTreeSlotTypes.DefaultSlotParams) => any
  extra?: (params: VxeTreeSlotTypes.DefaultSlotParams) => any
  header?: (params: VxeTreeSlotTypes.DefaultSlotParams) => any
  footer?: (params: VxeTreeSlotTypes.DefaultSlotParams) => any
  loading?: (params: {}) => any
}

export const Tree: typeof VxeTree
export default VxeTree
