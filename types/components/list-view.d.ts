import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeListView: defineVxeComponent<VxeListViewProps, VxeListViewEventProps>
export type VxeListViewComponent = DefineComponent<VxeListViewProps, VxeListViewEmits>

export type VxeListViewInstance = ComponentPublicInstance<VxeListViewProps, VxeListViewConstructor>

export interface VxeListViewConstructor extends VxeComponentBaseOptions, VxeListViewMethods {
  props: VxeListViewProps
  context: SetupContext<VxeListViewEmits>
  reactData: ListViewReactData
  getRefMaps(): ListViewPrivateRef
  getComputeMaps(): ListViewPrivateComputed
  renderVN: RenderFunction
}

export interface ListViewPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeListViewPrivateRef extends ListViewPrivateRef { }

export namespace VxeListViewPropTypes {
}

export type VxeListViewProps = {
}

export interface ListViewPrivateComputed {
}
export interface VxeListViewPrivateComputed extends ListViewPrivateComputed { }

export interface ListViewReactData {
}

export interface ListViewMethods {
  dispatchEvent(type: ValueOf<VxeListViewEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeListViewMethods extends ListViewMethods { }

export interface ListViewPrivateMethods { }
export interface VxeListViewPrivateMethods extends ListViewPrivateMethods { }

export type VxeListViewEmits = []

export namespace VxeListViewDefines {
  export interface ListViewEventParams extends VxeComponentEventParams {
    $listView: VxeListViewConstructor
  }
}

export type VxeListViewEventProps = {}

export interface VxeListViewListeners { }

export namespace VxeListViewEvents { }

export namespace VxeListViewSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeListViewSlots {
  default: (params: VxeListViewSlotTypes.DefaultSlotParams) => any
}

export const ListView: typeof VxeListView
export default VxeListView
