import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentBaseOptions, VxeComponentEventParams, VxeComponentSizeType, ValueOf } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeRadio: DefineVxeComponentApp<VxeRadioProps, VxeRadioEventProps, VxeRadioSlots>
export type VxeRadioComponent = DefineVxeComponentOptions<VxeRadioProps, VxeRadioEventProps>

export type VxeRadioInstance = DefineVxeComponentInstance<VxeRadioProps, VxeRadioConstructor>

export interface VxeRadioConstructor extends VxeComponentBaseOptions, VxeRadioProps, VxeRadioMethods {
  reactData: RadioReactData
}

export interface RadioPrivateRef {
}
export interface VxeRadioPrivateRef extends RadioPrivateRef { }

export namespace VxeRadioPropTypes {
  export type Size = VxeComponentSizeType
  export type Strict = boolean
  export type ModelValue = any
  export type Label = any
  export type Title = string | number
  export type Content = string | number
  export type Disabled = boolean
  export type Name = string
}

export interface VxeRadioProps {
  size?: VxeRadioPropTypes.Size
  /**
   * 严格模式，不允许取消
   */
  strict?: VxeRadioPropTypes.Strict
  /**
   * 绑定值
   */
  value?: VxeRadioPropTypes.ModelValue
  /**
   * 值
   */
  label?: VxeRadioPropTypes.Label
  /**
   * 原生 title 属性
   */
  title?: VxeRadioPropTypes.Title
  /**
   * 内容
   */
  content?: VxeRadioPropTypes.Content
  /**
   * 是否禁用
   */
  disabled?: VxeRadioPropTypes.Disabled
  /**
   * 原生 title 属性
   */
  name?: VxeRadioPropTypes.Name
}

export interface RadioPrivateComputed {
}
export interface VxeRadioPrivateComputed extends RadioPrivateComputed { }

export interface RadioReactData {
}

export interface RadioMethods {
  dispatchEvent(type: ValueOf<VxeRadioEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeRadioMethods extends RadioMethods { }

export interface RadioPrivateMethods { }
export interface VxeRadioPrivateMethods extends RadioPrivateMethods { }

export type VxeRadioEmits = [
  'update:modelValue',
  'change'
]

export namespace VxeRadioDefines {
  interface RadioEventParams extends VxeComponentEventParams {
    $radio: VxeRadioConstructor
  }

  export interface ChangeParams {
    label: any
  }
  export interface ChangeEventParams extends RadioEventParams, ChangeParams { }
}

export type VxeRadioEventProps = {
  onChange?: VxeRadioEvents.Change
}

export interface VxeRadioListeners {
  change?: VxeRadioEvents.Change
}

export namespace VxeRadioEvents {
  export type Change = (params: VxeRadioDefines.ChangeEventParams) => void
}

export namespace VxeRadioSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeRadioSlots {
  default?: (params: VxeRadioSlotTypes.DefaultSlotParams) => any
}

export const Radio: typeof VxeRadio
export default VxeRadio
