import { RenderFunction, SetupContext, Ref, ComputedRef, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf, VxeComponentStatusType, VxeComponentSizeType } from '@vxe-ui/core'
import { DateDiffResult } from 'xe-utils'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeCountdown: defineVxeComponent<VxeCountdownProps, VxeCountdownEventProps, VxeCountdownSlots>
export type VxeCountdownComponent = DefineComponent<VxeCountdownProps & VxeCountdownEventProps>

export type VxeCountdownInstance = ComponentPublicInstance<VxeCountdownProps, VxeCountdownConstructor>

export interface VxeCountdownConstructor extends VxeComponentBaseOptions, VxeCountdownMethods {
  props: VxeCountdownProps
  context: SetupContext<VxeCountdownEmits>
  reactData: CountdownReactData
  getRefMaps(): CountdownPrivateRef
  getComputeMaps(): CountdownPrivateComputed
  renderVN: RenderFunction
}

export interface CountdownPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeCountdownPrivateRef extends CountdownPrivateRef { }

export namespace VxeCountdownPropTypes {
  export type ModelValue = number | string
  export type Format = string
  export type Size = VxeComponentSizeType
  export interface PrefixConfig {
    content?: string | number
    icon?: string
    status?: VxeComponentStatusType
  }
  export interface SuffixConfig extends PrefixConfig {}
}

export type VxeCountdownProps = {
  modelValue?: VxeCountdownPropTypes.ModelValue
  format?: VxeCountdownPropTypes.Format
  size?: VxeCountdownPropTypes.Size
  prefixConfig?: VxeCountdownPropTypes.PrefixConfig
  suffixConfig?: VxeCountdownPropTypes.SuffixConfig
}

export interface CountdownPrivateComputed {
  computeSize: ComputedRef<VxeCountdownPropTypes.Size>
}
export interface VxeCountdownPrivateComputed extends CountdownPrivateComputed { }

export interface CountdownReactData {
  currNum: number
  secondNum: number
}

export interface CountdownMethods {
  dispatchEvent(type: ValueOf<VxeCountdownEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeCountdownMethods extends CountdownMethods { }

export interface CountdownPrivateMethods { }
export interface VxeCountdownPrivateMethods extends CountdownPrivateMethods { }

export type VxeCountdownEmits = [
  'update:modelValue',
  'start',
  'end'
]

export namespace VxeCountdownDefines {
  export interface CountdownEventParams extends VxeComponentEventParams {
    $countdown: VxeCountdownConstructor
  }
}

export type VxeCountdownEventProps = {}

export interface VxeCountdownListeners { }

export namespace VxeCountdownEvents { }

export namespace VxeCountdownSlotTypes {
  export interface DefaultSlotParams {
    diffConf: DateDiffResult
    currentValue: number
  }
}

export interface VxeCountdownSlots {
  default?: (params: VxeCountdownSlotTypes.DefaultSlotParams) => any
}

export const Countdown: typeof VxeCountdown
export default VxeCountdown
