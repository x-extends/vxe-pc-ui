import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'
import { VxeColumnProps, VxeColumnSlots } from './column'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeColgroup: DefineVxeComponentApp<VxeColgroupProps, VxeColgroupEventProps, VxeColgroupSlots, VxeColgroupMethods>
export type VxeColgroupComponent = DefineVxeComponentOptions<VxeColgroupProps>

export type VxeColgroupInstance = DefineVxeComponentInstance<{
  reactData: ColgroupReactData
  columnConfig: any
}, VxeColgroupProps, VxeColgroupPrivateComputed, VxeColgroupMethods>

export type VxeColgroupConstructor = VxeColgroupInstance

export interface ColgroupPrivateRef {
}
export interface VxeColgroupPrivateRef extends ColgroupPrivateRef { }

export namespace VxeColgroupPropTypes {
}

export interface VxeColgroupProps extends VxeColumnProps {
}

export interface ColgroupPrivateComputed {
}
export interface VxeColgroupPrivateComputed extends ColgroupPrivateComputed { }

export interface ColgroupReactData {
}

export interface ColgroupMethods {
  dispatchEvent(type: ValueOf<VxeColgroupEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeColgroupMethods extends ColgroupMethods { }

export interface ColgroupPrivateMethods { }
export interface VxeColgroupPrivateMethods extends ColgroupPrivateMethods { }

export type VxeColgroupEmits = []

export namespace VxeColgroupDefines {
  export interface ColgroupEventParams extends VxeComponentEventParams {
    $colgroup: VxeColgroupConstructor
  }
}

export type VxeColgroupEventProps = {}

export interface VxeColgroupListeners { }

export namespace VxeColgroupEvents { }

export namespace VxeColgroupSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeColgroupSlots<D = any> extends VxeColumnSlots<D> {
}

export const Colgroup: typeof VxeColgroup
export default VxeColgroup
