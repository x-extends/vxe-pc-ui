import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'
import { VxeListDesignDefines } from './list-design'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeListView: defineVxeComponent<VxeListViewProps, VxeListViewEventProps, VxeListViewSlots>
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
  export type Config = null | VxeListDesignDefines.ListDesignConfig
  export type Data = any[]
  export type ViewRender = {
    name?: string
  }
}

export type VxeListViewProps = {
  config?: VxeListViewPropTypes.Config
  viewRender?: VxeListViewPropTypes.ViewRender
}

export interface ListViewPrivateComputed {
}
export interface VxeListViewPrivateComputed extends ListViewPrivateComputed { }

export interface ListViewReactData {
  searchFormItems: VxeListDesignDefines.SearchItemObjItem[]
  listTableColumns: VxeListDesignDefines.ListColumnObjItem[]
}

export interface ListViewMethods {
  dispatchEvent(type: ValueOf<VxeListViewEmits>, params: Record<string, any>, evnt: Event | null): void
  loadConfig(config: VxeListDesignDefines.ListDesignConfig): Promise<any>
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
