import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeSteps: DefineVxeComponentApp<VxeStepsProps, VxeStepsEventProps, VxeStepsSlots, VxeStepsMethods>
export type VxeStepsComponent = DefineVxeComponentOptions<VxeStepsProps>

export type VxeStepsInstance = DefineVxeComponentInstance<{
  reactData: StepsReactData
}, VxeStepsProps, VxeStepsPrivateComputed, VxeStepsMethods>

export type VxeStepsConstructor = VxeStepsInstance

export interface StepsPrivateRef {
}
export interface VxeStepsPrivateRef extends StepsPrivateRef { }

export namespace VxeStepsPropTypes {
}

export interface VxeStepsProps {
}

export interface StepsPrivateComputed {
}
export interface VxeStepsPrivateComputed extends StepsPrivateComputed { }

export interface StepsReactData {
}

export interface StepsMethods {
}
export interface VxeStepsMethods extends StepsMethods { }

export interface StepsPrivateMethods { }
export interface VxeStepsPrivateMethods extends StepsPrivateMethods { }

export type VxeStepsEmits = []

export namespace VxeStepsDefines {
  export interface StepsEventParams extends VxeComponentEventParams {
    $steps: VxeStepsConstructor
  }
}

export type VxeStepsEventProps = {}

export interface VxeStepsListeners { }

export namespace VxeStepsEvents { }

export namespace VxeStepsSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeStepsSlots {
  default?: (params: VxeStepsSlotTypes.DefaultSlotParams) => any
}

export const Steps: typeof VxeSteps
export default VxeSteps
