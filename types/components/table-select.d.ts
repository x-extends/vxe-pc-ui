import { RenderFunction, SetupContext, Ref } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentSizeType, VxeComponentBaseOptions, VxeComponentEventParams, interceptor } from '@vxe-ui/core'
import { VxeGridProps, VxeGridPropTypes } from './grid'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeTableSelect: DefineVxeComponentApp<VxeTableSelectProps, VxeTableSelectEventProps, VxeTableSelectSlots>
export type VxeTableSelectComponent = DefineVxeComponentOptions<VxeTableSelectProps, VxeTableSelectEventProps>

export type VxeTableSelectInstance = DefineVxeComponentInstance<VxeTableSelectProps, VxeTableSelectConstructor>

export interface VxeTableSelectConstructor extends VxeComponentBaseOptions, VxeTableSelectMethods {
  props: VxeTableSelectProps
  context: SetupContext<VxeTableSelectEmits>
  reactData: TableSelectReactData
  getRefMaps(): TableSelectPrivateRef
  getComputeMaps(): TableSelectPrivateComputed
  renderVN: RenderFunction
}

export interface TableSelectPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeTableSelectPrivateRef extends TableSelectPrivateRef { }

export namespace VxeTableSelectPropTypes {
  export type Size = VxeComponentSizeType
  export type ModelValue = any
  export type Clearable = boolean
  export type Placeholder = string
  export type Readonly = boolean
  export type Loading = boolean
  export type Disabled = boolean
  export type ClassName = string | ((params: { $tableSelect: VxeTableSelectConstructor }) => string)
  export type Multiple = boolean
  export type PrefixIcon = string
  export type Placement = 'top' | 'bottom'
  export type Columns<D = any> = VxeGridPropTypes.Columns<D>
  export type Options<D = any> = D[]
  export interface OptionProps {
    value?: string
    label?: string
    disabled?: string
    children?: string
  }
  export type Transfer = boolean
  export interface PopupConfig {
    width?: number | string
    height?: number | string
    className?: string | ((params: { $tableSelect: VxeTableSelectConstructor }) => string)
  }
  export type GridConfig<D = any> = Omit<VxeGridProps<D>, 'data' | 'columns' | 'height' | 'maxHeight' | 'minHeight' | 'size'>
}

export interface VxeTableSelectProps<D = any> {
  size?: VxeTableSelectPropTypes.Size
  modelValue?: VxeTableSelectPropTypes.ModelValue
  clearable?: VxeTableSelectPropTypes.Clearable
  placeholder?: VxeTableSelectPropTypes.Placeholder
  readonly?: VxeTableSelectPropTypes.Readonly
  loading?: VxeTableSelectPropTypes.Loading
  disabled?: VxeTableSelectPropTypes.Disabled
  className?: VxeTableSelectPropTypes.ClassName
  multiple?: VxeTableSelectPropTypes.Multiple
  prefixIcon?: VxeTableSelectPropTypes.PrefixIcon
  placement?: VxeTableSelectPropTypes.Placement
  options?: VxeTableSelectPropTypes.Options
  optionProps?: VxeTableSelectPropTypes.OptionProps
  transfer?: VxeTableSelectPropTypes.Transfer
  popupConfig?: VxeTableSelectPropTypes.PopupConfig
  gridConfig?: VxeTableSelectPropTypes.GridConfig<D>
}

export interface TableSelectPrivateComputed {
}
export interface VxeTableSelectPrivateComputed extends TableSelectPrivateComputed { }

export interface TableSelectReactData {
  initialized: boolean
  fullOptionList: any[]
  fullRowMaps: Record<string, {
    item: any
    index: number
    items: any[]
    parent: any
    nodes: any[]
  }>
  panelIndex: number
  panelStyle: any
  panelPlacement: any
  triggerFocusPanel: boolean
  visiblePanel: boolean
  isAniVisible: boolean
  isActivated: boolean
}
export interface TableSelectInternalData {
  hpTimeout?: undefined | number
}

export interface TableSelectMethods {
}
export interface VxeTableSelectMethods extends TableSelectMethods { }

export interface TableSelectPrivateMethods { }
export interface VxeTableSelectPrivateMethods extends TableSelectPrivateMethods { }

export type VxeTableSelectEmits = [
  'update:modelValue',
  'change',
  'clear',
  'blur',
  'focus',
  'click',
]

export namespace VxeTableSelectDefines {
  export interface TableSelectEventParams extends VxeComponentEventParams {
    $tableSelect: VxeTableSelectConstructor
  }
}

export type VxeTableSelectEventProps = {}

export interface VxeTableSelectListeners { }

export namespace VxeTableSelectEvents { }

export namespace VxeTableSelectSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeTableSelectSlots {
  default?: (params: VxeTableSelectSlotTypes.DefaultSlotParams) => any
}

export const TableSelect: typeof VxeTableSelect
export default VxeTableSelect
