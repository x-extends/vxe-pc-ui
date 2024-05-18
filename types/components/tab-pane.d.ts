import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent, VxeComponentSlot } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeTabPane: defineVxeComponent<VxeTabPaneProps, VxeTabPaneEventProps>
export type VxeTabPaneComponent = DefineComponent<VxeTabPaneProps, VxeTabPaneEmits>

export type VxeTabPaneInstance = ComponentPublicInstance<VxeTabPaneProps, VxeTabPaneConstructor>

export interface VxeTabPaneConstructor extends VxeComponentBase, VxeTabPaneMethods {
  props: VxeTabPaneProps
  context: SetupContext<VxeTabPaneEmits>
  reactData: TabPaneReactData
  getRefMaps(): TabPanePrivateRef
  getComputeMaps(): TabPanePrivateComputed
  renderVN: RenderFunction
}

export interface TabPanePrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeTabPanePrivateRef extends TabPanePrivateRef { }

export namespace VxeTabPanePropTypes {
  export type Title = string | number
  export type Name = string | number
}

export type VxeTabPaneProps = {
  title?: VxeTabPanePropTypes.Title
  name?: VxeTabPanePropTypes.Name

  slots?: {
    tab?: string | ((params: { [key: string]: any }) => VxeComponentSlot | VxeComponentSlot[])
    default?: string | ((params: { [key: string]: any }) => VxeComponentSlot | VxeComponentSlot[])
  }
}

export interface TabPanePrivateComputed {
}
export interface VxeTabPanePrivateComputed extends TabPanePrivateComputed { }

export interface TabPaneReactData {
}

export interface TabPaneMethods {
}
export interface VxeTabPaneMethods extends TabPaneMethods { }

export interface TabPanePrivateMethods { }
export interface VxeTabPanePrivateMethods extends TabPanePrivateMethods { }

export type VxeTabPaneEmits = []

export namespace VxeTabPaneDefines {
  export interface TabPaneEventParams extends VxeComponentEvent {
    $tabPane: VxeTabPaneConstructor
  }

  export interface TabConfig {
    id: string
    title?: VxeTabPanePropTypes.Title
    name?: VxeTabPanePropTypes.Name
    slots?: Readonly<VxeTabPaneSlots>
  }
}

export type VxeTabPaneEventProps = {}

export interface VxeTabPaneListeners { }

export namespace VxeTabPaneEvents { }

export namespace VxeTabPaneSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeTabPaneSlots {
  tab?: (params: VxeTabPaneSlotTypes.DefaultSlotParams) => any
  default?: (params: VxeTabPaneSlotTypes.DefaultSlotParams) => any
}

export const TabPane: typeof VxeTabPane
export default VxeTabPane
