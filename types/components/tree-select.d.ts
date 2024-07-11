import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeTreeSelect: defineVxeComponent<VxeTreeSelectProps, VxeTreeSelectEventProps>
export type VxeTreeSelectComponent = DefineComponent<VxeTreeSelectProps, VxeTreeSelectEmits>

export type VxeTreeSelectInstance = ComponentPublicInstance<VxeTreeSelectProps, VxeTreeSelectConstructor>

export interface VxeTreeSelectConstructor extends VxeComponentBaseOptions, VxeTreeSelectMethods {
  props: VxeTreeSelectProps
  context: SetupContext<VxeTreeSelectEmits>
  reactData: TreeSelectReactData
  getRefMaps(): TreeSelectPrivateRef
  getComputeMaps(): TreeSelectPrivateComputed
  renderVN: RenderFunction
}

export interface TreeSelectPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeTreeSelectPrivateRef extends TreeSelectPrivateRef { }

export namespace VxeTreeSelectPropTypes {
  export type Size = VxeComponentSizeType
  export type ModelValue = any
  export type Clearable = boolean
  export type Placeholder = string
  export type Readonly = boolean
  export type Loading = boolean
  export type Disabled = boolean
  export type ClassName = string | ((params: { $select: VxeSelectConstructor }) => string)
  export type PopupClassName = string | ((params: { $select: VxeSelectConstructor }) => string)
  export type Multiple = boolean
  export type PrefixIcon = string
  export type Placement = 'top' | 'bottom'
  export type Options = VxeSelectDefines.SelectOptions[]
  export type OptionProps = {
    value?: string
    label?: string
    disabled?: string
  }
  export type Remote = boolean
  export type RemoteMethod = (params: { searchValue: string }) => Promise<void> | void
  export type Transfer = boolean
}

export type VxeTreeSelectProps = {
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
  prefixIcon?: VxeSelectPropTypes.PrefixIcon
  placement?: VxeSelectPropTypes.Placement
  options?: VxeSelectPropTypes.Options
  optionProps?: VxeSelectPropTypes.OptionProps
  remote?: VxeSelectPropTypes.Remote
  remoteMethod?: VxeSelectPropTypes.RemoteMethod
  transfer?: VxeSelectPropTypes.Transfer
}

export interface TreeSelectPrivateComputed {
}
export interface VxeTreeSelectPrivateComputed extends TreeSelectPrivateComputed { }

export interface TreeSelectReactData {
  initialized: boolean
  fullOptionList: any[]
  fullNodeMaps: Record<string, {
    item: any
    index: number
    items: any[]
    parent: any
    nodes: any[]
  }>
  visibleOptionList: any[]
  panelIndex: number
  panelStyle: any
  panelPlacement: any
  visiblePanel: boolean
  animatVisible: boolean
  isActivated: boolean
}

export interface TreeSelectMethods {
  dispatchEvent(type: ValueOf<VxeTreeSelectEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeTreeSelectMethods extends TreeSelectMethods { }

export interface TreeSelectPrivateMethods { }
export interface VxeTreeSelectPrivateMethods extends TreeSelectPrivateMethods { }

export type VxeTreeSelectEmits = [
  'update:modelValue',
  'change',
  'clear',
  'blur',
  'focus'
]

export namespace VxeTreeSelectDefines {
  export interface TreeSelectEventParams extends VxeComponentEventParams {
    $treeSelect: VxeTreeSelectConstructor
  }
}

export type VxeTreeSelectEventProps = {}

export interface VxeTreeSelectListeners { }

export namespace VxeTreeSelectEvents { }

export namespace VxeTreeSelectSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeTreeSelectSlots {
  default: (params: VxeTreeSelectSlotTypes.DefaultSlotParams) => any
}

export const TreeSelect: typeof VxeTreeSelect
export default VxeTreeSelect
