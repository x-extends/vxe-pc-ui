import { RenderFunction, SetupContext, Ref } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'
import { VxeColumnProps, VxeColumnSlots } from './column'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeColgroup: DefineVxeComponentApp<VxeColgroupProps, VxeColgroupEventProps, VxeColgroupSlots, VxeColgroupMethods>
export type VxeColgroupComponent = DefineVxeComponentOptions<VxeColgroupProps, VxeColgroupEventProps>

export type VxeColgroupInstance = DefineVxeComponentInstance<VxeColgroupProps, VxeColgroupConstructor>

export interface VxeColgroupConstructor extends VxeComponentBaseOptions, VxeColgroupMethods {
  props: VxeColgroupProps
  context: SetupContext<VxeColgroupEmits>
  reactData: ColgroupReactData
  getRefMaps(): ColgroupPrivateRef
  getComputeMaps(): ColgroupPrivateComputed
  renderVN: RenderFunction
}

export interface ColgroupPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
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
