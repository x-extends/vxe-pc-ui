import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, VxeComponentSizeType, ValueOf } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeTree: defineVxeComponent<VxeTreeProps, VxeTreeEventProps>
export type VxeTreeComponent = DefineComponent<VxeTreeProps, VxeTreeEmits>

export type VxeTreeInstance = ComponentPublicInstance<VxeTreeProps, VxeTreeConstructor>

export interface VxeTreeConstructor extends VxeComponentBaseOptions, VxeTreeMethods {
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
  export type Data = any[]
  export type ParentField = string
  export type KeyField = string
  export type TitleField = string
  export type ChildrenField = string
  export type Trigger = '' | 'default' | 'node'
  export type IsCurrent = boolean
  export type IsHover = boolean
  export type ShowLine = boolean
  export type Indent = number
  export type ShowRadio = boolean
  export type RadioCheckNodeKey = string | number
  export interface RadioConfig {
    checkNodeKey?: string
    strict?: boolean
    visibleMethod?: (params: { node: any }) => boolean
    checkMethod?: (params: { node: any }) => boolean
    highlight?: boolean
    showIcon?: boolean
    trigger?: '' | 'default' | 'node'
  }
  export type CheckboxCheckNodeKeys = (string | number)[]
  export type ShowCheckbox = boolean
  export interface CheckboxConfig {
    showHeader?: boolean
    checkStrictly?: boolean
    highlight?: boolean
    visibleMethod?: (params: { node: any }) => boolean
    checkMethod?: (params: { node: any }) => boolean
    showIcon?: boolean
    trigger?: '' | 'default' | 'node'
  }
  export type ToggleMethod = (params: { node: any }) => boolean
  export type ShowIcon = boolean
  export type IconOpen = string
  export type IconClose = string
  export type IconLoaded = string
  export type Size = VxeComponentSizeType
}

export interface VxeTreeProps {
  data?: VxeTreePropTypes.Data
  parentField?: VxeTreePropTypes.ParentField
  keyField?: VxeTreePropTypes.KeyField
  titleField?: VxeTreePropTypes.TitleField
  childrenField?: VxeTreePropTypes.ChildrenField
  trigger?: VxeTreePropTypes.Trigger
  isCurrent?: VxeTreePropTypes.IsCurrent
  isHover?: VxeTreePropTypes.IsHover
  showLine?: VxeTreePropTypes.ShowLine
  indent?: VxeTreePropTypes.Indent
  showRadio?: VxeTreePropTypes.ShowRadio
  radioCheckNodeKey?: VxeTreePropTypes.RadioCheckNodeKey
  radioConfig?: VxeTreePropTypes.RadioConfig
  showCheckbox?: VxeTreePropTypes.ShowCheckbox
  checkboxCheckNodeKeys?: VxeTreePropTypes.CheckboxCheckNodeKeys
  checkboxConfig?: VxeTreePropTypes.CheckboxConfig
  toggleMethod?: VxeTreePropTypes.ToggleMethod
  showIcon?: VxeTreePropTypes.ShowIcon
  iconOpen?: VxeTreePropTypes.IconOpen
  iconClose?: VxeTreePropTypes.IconClose
  iconLoaded?: VxeTreePropTypes.IconLoaded
  size?: VxeTreePropTypes.Size
}

export interface TreePrivateComputed {
}
export interface VxeTreePrivateComputed extends TreePrivateComputed { }

export interface TreeReactData {
  currentNode: any
  selectRadioKey: VxeTreePropTypes.RadioCheckNodeKey
  treeList: any[]
  treeExpandedMaps: Record<string, boolean>
  selectCheckboxMaps: Record<string, boolean>
  indeterminateCheckboxMaps: Record<string, boolean>
}

export interface TreeInternalData {
  nodeMaps: Record<string, {
    node: any
    nodeIndex: number
    parent: any
    level: number
  }>
}

export interface TreeMethods {
  dispatchEvent(type: ValueOf<VxeTreeEmits>, params: Record<string, any>, evnt: Event | null): void
  clearExpand(): Promise<any>
  setExpandByNodeid(nodeids: any, expanded: boolean): Promise<any>
  setExpand(nodes: any, expanded: boolean): Promise<any>
  toggleExpandByNodeid(nodeids: any): Promise<any>
  toggleExpand(nodes: any): Promise<any>
  setAllExpand(expanded: boolean): Promise<any>
  isExpandByNode(node: any): boolean
  isCheckedByRadioNodeid(nodeid: any): boolean
  isCheckedByRadioNode(node: any): boolean
  isCheckedByCheckboxNodeid(nodeid: any): boolean
  isIndeterminateByCheckboxNode(node: any): boolean
  isCheckedByCheckboxNode(node: any): boolean
}
export interface VxeTreeMethods extends TreeMethods { }

export interface TreePrivateMethods { }
export interface VxeTreePrivateMethods extends TreePrivateMethods { }

export type VxeTreeEmits = [
  'update:modelValue',
  'update:radioCheckNodeKey',
  'update:checkboxCheckNodeKeys',
  'node-click',
  'node-dblclick',
  'radio-change',
  'checkbox-change'
]

export namespace VxeTreeDefines {
  export interface TreeEventParams extends VxeComponentEventParams {
    $tree: VxeTreeConstructor
  }

  export interface NodeClickParams<D = any> {
    node: D
  }
  export interface NodeClickEventParams<D = any> extends TreeEventParams, NodeClickParams<D> { }

  export interface NodeDblclickEventParams<D = any> extends NodeClickEventParams<D> { }

  export interface RadioChangeEventParams<D = any> extends TreeEventParams<D> {
    value: VxeTreePropTypes.RadioCheckNodeKey
   }
  export interface CheckboxChangeEventParams<D = any> extends TreeEventParams<D> {
    value: VxeTreePropTypes.CheckboxCheckNodeKeys
  }
}

export type VxeTreeEventProps = {
  onNodeClick?: VxeTreeEvents.NodeClick
  onNodeDblclick?: VxeTreeEvents.NodeDblclick
  onRadioChange?: VxeTreeEvents.RadioChange
  onCheckboxChange?: VxeTreeEvents.CheckboxChange
}

export interface VxeTreeListeners {
  nodeClick?: VxeTreeEvents.NodeClick
  nodeDblclick?: VxeTreeEvents.NodeDblclick
  radioChange?: VxeTreeEvents.RadioChange
  checkboxChange?: VxeTreeEvents.CheckboxChange
}

export namespace VxeTreeEvents {
  export type NodeClick<D = any> = (params: VxeTreeDefines.NodeClickEventParams<D>) => void
  export type NodeDblclick<D = any> = (params: VxeTreeDefines.NodeDblclickEventParams<D>) => void
  export type RadioChange<D = any> = (params: VxeTreeDefines.RadioChangeEventParams<D>) => void
  export type CheckboxChange<D = any> = (params: VxeTreeDefines.CheckboxChangeEventParams<D>) => void
}

export namespace VxeTreeSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeTreeSlots {
  default: (params: VxeTreeSlotTypes.DefaultSlotParams) => any
}

export const Tree: typeof VxeTree
export default VxeTree
