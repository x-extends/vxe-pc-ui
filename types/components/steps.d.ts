import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, VxeComponentSizeType, ValueOf } from '@vxe-ui/core'
import { VxeStepItemPropTypes } from './step-item'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeSteps: DefineVxeComponentApp<VxeStepsProps, VxeStepsEventProps, VxeStepsSlots, VxeStepsMethods>
export type VxeStepsComponent = DefineVxeComponentOptions<VxeStepsProps>

export type VxeStepsInstance = DefineVxeComponentInstance<
  {
    reactData: StepsReactData
  },
  VxeStepsProps,
  VxeStepsPrivateComputed,
  VxeStepsMethods
>

export type VxeStepsConstructor = VxeStepsInstance

export interface StepsPrivateRef {
}
export interface VxeStepsPrivateRef extends StepsPrivateRef {}

export namespace VxeStepsPropTypes {
  export type Size = VxeComponentSizeType
  export type ModelValue = string | number | null
  export type Type = '' | 'simple' | string
  export type Vertical = boolean
  export interface OptionProps {
    title?: string
    content?: string
    status?: string
  }
  type Option = Record<string, any>
  export type Options = Option[]

  export type Separator = string | number
  export type ShowNumber = boolean
  export type ShowIcon = boolean
}

export interface VxeStepsProps {
  size?: VxeStepsPropTypes.Size
  modelValue?: VxeStepsPropTypes.ModelValue
  options?: VxeStepsPropTypes.Options
  type?: VxeStepsPropTypes.Type
  vertical?: VxeStepsPropTypes.Vertical
  optionProps?: VxeStepsPropTypes.OptionProps
  /**
   * 步骤条分割符
   */
  separator?: VxeStepsPropTypes.Separator
  showNumber?: VxeStepsPropTypes.ShowNumber
  showIcon?: VxeStepsPropTypes.ShowIcon
}

export interface StepsPrivateComputed {}
export interface VxeStepsPrivateComputed extends StepsPrivateComputed {}

export interface StepsReactData {
  itemList: any[]
  staticItems: VxeStepsDefines.ItemInfo[]
  isOptConf: boolean
}
export interface StepsInternalData {
  fullData: any[]
}

export interface StepsMethods {
  dispatchEvent(type: ValueOf<VxeStepsEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeStepsMethods extends StepsMethods {}

export interface StepsPrivateMethods {}
export interface VxeStepsPrivateMethods extends StepsPrivateMethods {}

export type VxeStepsEmits = []

export namespace VxeStepsDefines {
  export interface ItemInfo {
    id: string
    title?: string | number
    content?: string | number
    status?: VxeStepItemPropTypes.Status
    [key: string]: any
  }

  export interface StepsEventParams extends VxeComponentEventParams {
    $steps: VxeStepsConstructor
  }
}

export type VxeStepsEventProps = {}

export interface VxeStepsListeners {}

export namespace VxeStepsEvents {}

export namespace VxeStepsSlotTypes {
  export interface TitleSlotParams {
    item: any
  }
  export interface ContentSlotParams {
    item: any
  }
  export interface SeparatorSlotParams {}
}

export interface VxeStepsSlots {
  default?: (params: Record<string, any>) => any
  title?: (params: VxeStepsSlotTypes.TitleSlotParams) => any
  content?: (params: VxeStepsSlotTypes.ContentSlotParams) => any
  separator?: (params: VxeStepsSlotTypes.SeparatorSlotParams) => any
}

export const Steps: typeof VxeSteps
export default VxeSteps
