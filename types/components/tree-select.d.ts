import { RenderFunction, SetupContext, Ref } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentBaseOptions, VxeComponentEventParams, VxeComponentSizeType, ValueOf } from '@vxe-ui/core'
import { VxeTreeProps } from './tree'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeTreeSelect: DefineVxeComponentApp<VxeTreeSelectProps, VxeTreeSelectEventProps, VxeTreeSelectSlots>
export type VxeTreeSelectComponent = DefineVxeComponentOptions<VxeTreeSelectProps, VxeTreeSelectEventProps>

export type VxeTreeSelectInstance = DefineVxeComponentInstance<VxeTreeSelectProps, VxeTreeSelectConstructor>

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
  export type ClassName = string | ((params: { $treeSelect: VxeTreeSelectConstructor }) => string)
  export type PopupClassName = string | ((params: { $treeSelect: VxeTreeSelectConstructor }) => string)
  export type Multiple = boolean
  export type PrefixIcon = string
  export type Placement = 'top' | 'bottom'
  export interface Option {
    value?: string | number
    label?: string | number
    children?: Option[]

    [key: string]: any
  }
  export type Options = Option[]
  export interface OptionProps {
    value?: string
    label?: string
    disabled?: string
    children?: string

    /**
     * @deprecated
     */
    hasChild?: string
    /**
     * @deprecated
     */
    parent?: string
  }
  export type Remote = boolean
  export type RemoteMethod = (params: { searchValue: string }) => Promise<void> | void
  export type Transfer = boolean
  export type TreeConfig<D = any> = VxeTreeProps<D>
}

export interface VxeTreeSelectProps<D = any> {
  size?: VxeTreeSelectPropTypes.Size
  modelValue?: VxeTreeSelectPropTypes.ModelValue
  clearable?: VxeTreeSelectPropTypes.Clearable
  placeholder?: VxeTreeSelectPropTypes.Placeholder
  readonly?: VxeTreeSelectPropTypes.Readonly
  loading?: VxeTreeSelectPropTypes.Loading
  disabled?: VxeTreeSelectPropTypes.Disabled
  className?: VxeTreeSelectPropTypes.ClassName
  popupClassName?: VxeTreeSelectPropTypes.PopupClassName
  multiple?: VxeTreeSelectPropTypes.Multiple
  prefixIcon?: VxeTreeSelectPropTypes.PrefixIcon
  placement?: VxeTreeSelectPropTypes.Placement
  options?: VxeTreeSelectPropTypes.Options
  optionProps?: VxeTreeSelectPropTypes.OptionProps
  remote?: VxeTreeSelectPropTypes.Remote
  remoteMethod?: VxeTreeSelectPropTypes.RemoteMethod
  transfer?: VxeTreeSelectPropTypes.Transfer
  treeConfig?: VxeTreeSelectPropTypes.TreeConfig<D>
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
  triggerFocusPanel: boolean
  visiblePanel: boolean
  visibleAnimate: boolean
  isActivated: boolean
}

export interface TreeSelectInternalData {
  hpTimeout?: undefined | number
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
  'focus',
  'click',
  'node-click'
]

export namespace VxeTreeSelectDefines {
  export interface TreeSelectEventParams extends VxeComponentEventParams {
    $treeSelect: VxeTreeSelectConstructor
  }

  export interface ChangeEventParams<D = any> extends TreeSelectEventParams {
    value: any
    option: D
  }

  export interface ClearEventParams extends TreeSelectEventParams {
    value: any
  }

  export interface FocusEventParams extends TreeSelectEventParams { }
  export interface BlurEventParams extends TreeSelectEventParams { }
  export interface ClickEventParams extends TreeSelectEventParams { }
}

export interface VxeTreeSelectEventProps<D = any> {
  onChange?: VxeTreeSelectEvents.Change<D>
  onClear?: VxeTreeSelectEvents.Clear
  onFocus?: VxeTreeSelectEvents.Focus
  onBlur?: VxeTreeSelectEvents.Blur
  onClick?: VxeTreeSelectEvents.Click
}

export interface VxeTreeSelectListeners<D = any> {
  change?: VxeTreeSelectEvents.Change<D>
  clear?: VxeTreeSelectEvents.Clear
  focus?: VxeTreeSelectEvents.Focus
  blur?: VxeTreeSelectEvents.Blur
  click?: VxeTreeSelectEvents.Click
}

export namespace VxeTreeSelectEvents {
  export type Change<D = any> = (params: VxeTreeSelectDefines.ChangeEventParams<D>) => void
  export type Clear = (params: VxeTreeSelectDefines.ClearEventParams) => void
  export type Focus = (params: VxeTreeSelectDefines.FocusEventParams) => void
  export type Blur = (params: VxeTreeSelectDefines.BlurEventParams) => void
  export type Click = (params: VxeTreeSelectDefines.ClickEventParams) => void
}

export namespace VxeTreeSelectSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeTreeSelectSlots {
  default?: (params: VxeTreeSelectSlotTypes.DefaultSlotParams) => any
}

export const TreeSelect: typeof VxeTreeSelect
export default VxeTreeSelect
