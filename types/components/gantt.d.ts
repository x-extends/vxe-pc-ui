import { RenderFunction, SetupContext, Ref } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf, VxeComponentSizeType } from '@vxe-ui/core'
import { VxeTableInstance } from './table'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeGantt: DefineVxeComponentApp<VxeGanttProps, VxeGanttEventProps, VxeGanttSlots, VxeGanttMethods>
export type VxeGanttComponent = DefineVxeComponentOptions<VxeGanttProps, VxeGanttEventProps>

export type VxeGanttInstance = DefineVxeComponentInstance<VxeGanttProps, VxeGanttConstructor>

export interface VxeGanttConstructor extends VxeComponentBaseOptions, VxeGanttMethods {
  props: VxeGanttProps
  context: SetupContext<VxeGanttEmits>
  reactData: GanttReactData
  internalData: GanttInternalData
  getRefMaps(): GanttPrivateRef
  getComputeMaps(): GanttPrivateComputed
  renderVN: RenderFunction
}

export interface GanttPrivateRef<D = any> {
  refElem: Ref<HTMLDivElement | undefined>
  refTable: Ref<VxeTableInstance<D> | undefined>
}
export interface VxeGanttPrivateRef extends GanttPrivateRef { }

export namespace VxeGanttPropTypes {
  export type Size = VxeComponentSizeType
}

export type VxeGanttProps = {
  size?: VxeGanttPropTypes.Size
}

export interface GanttPrivateComputed {
}
export interface VxeGanttPrivateComputed extends GanttPrivateComputed { }

export interface GanttReactData {
}

export interface GanttInternalData {
}

export interface GanttMethods {
  dispatchEvent(type: ValueOf<VxeGanttEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeGanttMethods extends GanttMethods { }

export interface GanttPrivateMethods { }
export interface VxeGanttPrivateMethods extends GanttPrivateMethods { }

export type VxeGanttEmits = []

export namespace VxeGanttDefines {
  export interface GanttEventParams extends VxeComponentEventParams {
    $gantt: VxeGanttConstructor
  }
}

export type VxeGanttEventProps = {}

export interface VxeGanttListeners { }

export namespace VxeGanttEvents { }

export namespace VxeGanttSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeGanttSlots {
  default?: (params: VxeGanttSlotTypes.DefaultSlotParams) => any
}

export const Gantt: typeof VxeGantt
export default VxeGantt
