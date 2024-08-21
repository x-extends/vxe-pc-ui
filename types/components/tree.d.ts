import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, ComputedRef, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, VxeComponentSizeType, ValueOf } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeTree: defineVxeComponent<VxeTreeProps, VxeTreeEventProps, VxeTreeSlots>
export type VxeTreeComponent = DefineComponent<VxeTreeProps & VxeTreeEventProps>

export type VxeTreeInstance = ComponentPublicInstance<VxeTreeProps, VxeTreeConstructor>

export interface VxeTreeConstructor<D = any> extends VxeComponentBaseOptions, VxeTreeMethods<D> {
  props: VxeTreeProps
  context: SetupContext<VxeTreeEmits>
  internalData: TreeInternalData
  reactData: TreeReactData
  getRefMaps(): TreePrivateRef
  getComputeMaps(): TreePrivateComputed
  renderVN: RenderFunction
}

export interface TreePrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeTreePrivateRef extends TreePrivateRef { }

export namespace VxeTreePropTypes {
  export type Data<D = any> = D[]
  export type Loading = boolean
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
  export type ShowRadio = boolean
  export type CheckNodeKey = string | number
  export interface RadioConfig<D = any> {
    checkNodeKey?: string
    strict?: boolean
    visibleMethod?: (params: { node: D }) => boolean
    checkMethod?: (params: { node: D }) => boolean
    highlight?: boolean
    showIcon?: boolean
    trigger?: '' | 'default' | 'node'
  }
  export type CheckNodeKeys = (string | number)[]
  export type ShowCheckbox = boolean
  export interface CheckboxConfig<D = any> {
    showHeader?: boolean
    checkStrictly?: boolean
    highlight?: boolean
    visibleMethod?: (params: { node: D }) => boolean
    checkMethod?: (params: { node: D }) => boolean
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
}

export interface VxeTreeProps<D = any> {
  data?: VxeTreePropTypes.Data<D>
  height?: VxeTreePropTypes.Height
  minHeight?: VxeTreePropTypes.MinHeight
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
}

export interface TreePrivateComputed<D = any> {
  computeRadioOpts: ComputedRef<VxeTreePropTypes.RadioConfig<D>>
  computeCheckboxOpts: ComputedRef<VxeTreePropTypes.CheckboxConfig<D>>
  computeNodeOpts: ComputedRef<VxeTreePropTypes.NodeConfig<D>>
}
export interface VxeTreePrivateComputed extends TreePrivateComputed { }

export interface TreeReactData {
  currentNode: any
  nodeMaps: Record<string, VxeTreeDefines.NodeCacheItem>
  selectRadioKey: VxeTreePropTypes.CheckNodeKey | null
  treeList: any[]
  treeExpandedMaps: Record<string, boolean>
  treeExpandLazyLoadedMaps: Record<string, boolean>
  selectCheckboxMaps: Record<string, boolean>
  indeterminateCheckboxMaps: Record<string, boolean>
}

export interface TreeInternalData {
}

export interface TreeMethods<D = any> {
  dispatchEvent(type: ValueOf<VxeTreeEmits>, params: Record<string, any>, evnt: Event | null): void
  clearRadioNode(): Promise<any>
  setRadioNode(node: any, checked: boolean): Promise<any>
  clearCheckboxNode(): Promise<any>
  setAllCheckboxNode(checked: boolean): Promise<any>
  setCheckboxNode(nodeList: any | any[], checked: boolean): Promise<any>
  setCheckboxByNodeId(nodeKeys: any | any[], checked: boolean): Promise<any>
  clearExpandNode(): Promise<any>
  setExpandByNodeId(nodeKeys: any | any[], expanded: boolean): Promise<any>
  setExpandNode(nodeList: any | any[], expanded: boolean): Promise<any>
  toggleExpandByNodeId(nodeKeys: any | any[]): Promise<any>
  toggleExpandNode(nodeList: any | any[]): Promise<any>
  setAllExpandNode(expanded: boolean): Promise<any>
  reloadExpandNode(node: any): Promise<any>
  clearExpandLoaded(node: any): Promise<any>
  loadChildrenNode(node: any, childRecords: any[]): Promise<any>
  isExpandByNode(node: any): boolean
  isCheckedByRadioNodeId(nodeKey: any): boolean
  isCheckedByRadioNode(node: any): boolean
  isCheckedByCheckboxNodeId(nodeKey: any): boolean
  isIndeterminateByCheckboxNode(node: any): boolean
  isCheckedByCheckboxNode(node: any): boolean
}
export interface VxeTreeMethods<D = any> extends TreeMethods<D> { }

export interface TreePrivateMethods { }
export interface VxeTreePrivateMethods extends TreePrivateMethods { }

export type VxeTreeEmits = [
  'update:modelValue',
  'update:checkNodeKey',
  'update:checkNodeKeys',
  'node-click',
  'node-dblclick',
  'current-change',
  'radio-change',
  'checkbox-change',
  'load-success',
  'load-error'
]

export namespace VxeTreeDefines {
  export interface TreeEventParams<D = any> extends VxeComponentEventParams {
    $tree: VxeTreeConstructor<D>
  }

  export interface NodeCacheItem {
    item: any
    itemIndex: number
    items: any[]
    nodes: any[]
    parent: any
    level: number
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
  }
}

export interface VxeTreeSlots {
  title?: (params: VxeTreeSlotTypes.DefaultSlotParams) => any
  extra?: (params: VxeTreeSlotTypes.DefaultSlotParams) => any
  loading?: (params: {}) => any
}

export const Tree: typeof VxeTree
export default VxeTree
