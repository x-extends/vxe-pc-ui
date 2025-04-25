import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, VxeComponentSizeType, VxeComponentStatusType } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeRate: DefineVxeComponentApp<VxeRateProps, VxeRateEventProps, VxeRateSlots, VxeRateMethods>
export type VxeRateComponent = DefineVxeComponentOptions<VxeRateProps>

export type VxeRateInstance = DefineVxeComponentInstance<{
  reactData: RateReactData
}, VxeRateProps, VxeRatePrivateComputed, VxeRateMethods>

export type VxeRateConstructor = VxeRateInstance

export interface RatePrivateRef {
}
export interface VxeRatePrivateRef extends RatePrivateRef { }

export namespace VxeRatePropTypes {
  export type Size = VxeComponentSizeType
  export type ModelValue = number | string
  export type Readonly = boolean
  export type Disabled = boolean
  export type Status = VxeComponentStatusType
}

export interface VxeRateProps {
  size?: VxeRatePropTypes.Size
  value?: VxeRatePropTypes.ModelValue
  readonly?: VxeRatePropTypes.Readonly
  disabled?: VxeRatePropTypes.Disabled
  status?: VxeRatePropTypes.Status
}

export interface RatePrivateComputed {
}
export interface VxeRatePrivateComputed extends RatePrivateComputed { }

export interface RateReactData {
  activeValue: VxeRatePropTypes.ModelValue | null
}

export interface RateMethods {
}
export interface VxeRateMethods extends RateMethods { }

export interface RatePrivateMethods { }
export interface VxeRatePrivateMethods extends RatePrivateMethods { }

export type VxeRateEmits = [
  'input',
  'change'
]

export namespace VxeRateDefines {
  export interface RateEventParams extends VxeComponentEventParams {
    $rate: VxeRateConstructor
  }
}

export type VxeRateEventProps = {}

export interface VxeRateListeners { }

export namespace VxeRateEvents { }

export namespace VxeRateSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeRateSlots {
  default?: (params: VxeRateSlotTypes.DefaultSlotParams) => any
}

export const Rate: typeof VxeRate
export default VxeRate
