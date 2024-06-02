import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'

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
  export type Trigger = '' | 'default' | 'row'
  export type IsCurrent = boolean
  export type IsHover = boolean
  export type ShowLine = boolean
  export type Indent = number
  export interface RadioConfig {
    checkRowKey?: string
    strict?: boolean
    visibleMethod: (params: { row: any }) => boolean
    checkMethod: (params: { row: any }) => boolean
    highlight?: boolean
    trigger?: '' | 'default' | 'row'
  }
  export interface CheckboxConfig {
    showHeader?: boolean
    checkAll?: boolean
    checkRowKeys?: string[]
    checkStrictly?: boolean
    strict?: boolean
    highlight?: boolean
    visibleMethod: (params: { row: any }) => boolean
    checkMethod: (params: { row: any }) => boolean
    trigger?: '' | 'default' | 'row'
  }
  export type ToggleMethod = (params: { row: any }) => boolean
  export type ShowIcon = boolean
  export type IconOpen = string
  export type IconClose = string
  export type IconLoaded = string
}

export type VxeTreeProps = {
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
  radioConfig?: VxeTreePropTypes.RadioConfig
  checkboxConfig?: VxeTreePropTypes.CheckboxConfig
  toggleMethod?: VxeTreePropTypes.ToggleMethod
  showIcon?: VxeTreePropTypes.ShowIcon
  iconOpen?: VxeTreePropTypes.IconOpen
  iconClose?: VxeTreePropTypes.IconClose
  iconLoaded?: VxeTreePropTypes.IconLoaded
}

export interface TreePrivateComputed {
}
export interface VxeTreePrivateComputed extends TreePrivateComputed { }

export interface TreeReactData {
  treeList: any[],
  treeExpandedMaps: Record<string, boolean>
}

export interface TreeInternalData {
  nodeMaps: Record<string, {
    row: any
    rowIndex: number
    parent: any
    level: number
  }>
}

export interface TreeMethods {
  dispatchEvent(type: ValueOf<VxeTreeEmits>, params: Record<string, any>, evnt: Event | null): void
  isExpandByRow(row: any): boolean
}
export interface VxeTreeMethods extends TreeMethods { }

export interface TreePrivateMethods { }
export interface VxeTreePrivateMethods extends TreePrivateMethods { }

export type VxeTreeEmits = []

export namespace VxeTreeDefines {
  export interface TreeEventParams extends VxeComponentEventParams {
    $tree: VxeTreeConstructor
  }
}

export type VxeTreeEventProps = {}

export interface VxeTreeListeners { }

export namespace VxeTreeEvents { }

export namespace VxeTreeSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeTreeSlots {
  default: (params: VxeTreeSlotTypes.DefaultSlotParams) => any
}

export const Tree: typeof VxeTree
export default VxeTree
