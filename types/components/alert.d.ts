import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, VxeComponentStatusType, ValueOf } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeAlert: defineVxeComponent<VxeAlertProps, VxeAlertEventProps>
export type VxeAlertComponent = DefineComponent<VxeAlertProps, VxeAlertEmits>

export type VxeAlertInstance = ComponentPublicInstance<VxeAlertProps, VxeAlertConstructor>

export interface VxeAlertConstructor extends VxeComponentBaseOptions, VxeAlertMethods {
  props: VxeAlertProps
  context: SetupContext<VxeAlertEmits>
  reactData: AlertReactData
  getRefMaps(): AlertPrivateRef
  getComputeMaps(): AlertPrivateComputed
  renderVN: RenderFunction
}

export interface AlertPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeAlertPrivateRef extends AlertPrivateRef { }

export namespace VxeAlertPropTypes {
  export type Title = string | number
  export type Content = string | number
  export type Status = VxeComponentStatusType
  export type ShowIcon = boolean
  export type ShowClose = boolean
  export type Icon = string
}

export type VxeAlertProps = {
  title?: VxeAlertPropTypes.Title
  content?: VxeAlertPropTypes.Content
  status?: VxeAlertPropTypes.Status
  showIcon?: VxeAlertPropTypes.ShowIcon
  showClose?: VxeAlertPropTypes.ShowClose
  icon?: VxeAlertPropTypes.Icon
}

export interface AlertPrivateComputed {
}
export interface VxeAlertPrivateComputed extends AlertPrivateComputed { }

export interface AlertReactData {
}

export interface AlertMethods {
  dispatchEvent(type: ValueOf<VxeAlertEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeAlertMethods extends AlertMethods { }

export interface AlertPrivateMethods { }
export interface VxeAlertPrivateMethods extends AlertPrivateMethods { }

export type VxeAlertEmits = [
  'close'
]

export namespace VxeAlertDefines {
  export interface AlertEventParams extends VxeComponentEventParams {
    $alert: VxeAlertConstructor
  }
}

export type VxeAlertEventProps = {}

export interface VxeAlertListeners { }

export namespace VxeAlertEvents { }

export namespace VxeAlertSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeAlertSlots {
  default: (params: VxeAlertSlotTypes.DefaultSlotParams) => any
  title: (params: VxeAlertSlotTypes.DefaultSlotParams) => any
  icon: (params: VxeAlertSlotTypes.DefaultSlotParams) => any
}

export const Alert: typeof VxeAlert
export default VxeAlert
