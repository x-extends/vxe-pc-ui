import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, VxeComponentSizeType, ValueOf } from '@vxe-ui/core'
import { VxeFormDesignDefines } from './form-design'
import { VxeGridPropTypes } from './grid'
import { VxeFormPropTypes } from './form'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeListDesign: defineVxeComponent<VxeListDesignProps, VxeListDesignEventProps>
export type VxeListDesignComponent = DefineComponent<VxeListDesignProps, VxeListDesignEmits>

export type VxeListDesignInstance = ComponentPublicInstance<VxeListDesignProps, VxeListDesignConstructor>

export interface VxeListDesignConstructor extends VxeComponentBaseOptions, VxeListDesignMethods {
  props: VxeListDesignProps
  context: SetupContext<VxeListDesignEmits>
  reactData: ListDesignReactData
  getRefMaps(): ListDesignPrivateRef
  getComputeMaps(): ListDesignPrivateComputed
  renderVN: RenderFunction
}

export interface ListDesignPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeListDesignPrivateRef extends ListDesignPrivateRef { }

export namespace VxeListDesignPropTypes {
  export type Size = VxeComponentSizeType
  export type Height = string | number
  export type Config = null | VxeListDesignDefines.ListDesignConfig
  export type ShowPc = boolean
  export type ShowMobile = boolean
}

export type VxeListDesignProps = {
  size?: VxeListDesignPropTypes.Size
  height?: VxeListDesignPropTypes.Height
  config?: VxeListDesignPropTypes.Config
  showPc?: VxeListDesignPropTypes.ShowPc
  showMobile?: VxeListDesignPropTypes.ShowMobile
}

export interface ListDesignPrivateComputed {
}
export interface VxeListDesignPrivateComputed extends ListDesignPrivateComputed { }

export interface ListDesignReactData {
  searchFormItems: VxeListDesignDefines.SearchItemObjItem[]
  listTableColumns: VxeListDesignDefines.ListColumnObjItem[]
}

export interface ListDesignMethods {
  dispatchEvent(type: ValueOf<VxeListDesignEmits>, params: Record<string, any>, evnt: Event | null): void
  setFormDesignConfig(config: VxeFormDesignDefines.FormDesignConfig): Promise<any>
  getSearchItems(): VxeListDesignDefines.SearchItemObjItem[]
  setSearchItems(searchItems: VxeListDesignDefines.SearchItemObjItem[]): Promise<any>
  getListColumns(): VxeListDesignDefines.ListColumnObjItem[]
  setListColumns(listColumns: VxeListDesignDefines.ListColumnObjItem[]): Promise<any>
  getConfig (): VxeListDesignDefines.ListDesignConfig
  setConfig(config: VxeListDesignDefines.ListDesignConfig): Promise<any>
}
export interface VxeListDesignMethods extends ListDesignMethods { }

export interface ListDesignPrivateMethods { }
export interface VxeListDesignPrivateMethods extends ListDesignPrivateMethods { }

export type VxeListDesignEmits = [
]

export namespace VxeListDesignDefines {
  export interface ListDesignEventParams extends VxeComponentEventParams {
    $listDesign: VxeListDesignConstructor
  }

  export interface ListDesignConfig {
    formConfig: any
    searchItems: SearchItemObjItem[]
    listColumns: ListColumnObjItem[]
  }

  export interface SearchItemObjItem {
    field: string
    title: string
  }

  export interface ListColumnObjItem {
    field: string
    title: string
    visible: boolean
  }
}

export type VxeListDesignEventProps = {}

export interface VxeListDesignListeners { }

export namespace VxeListDesignEvents { }

export namespace VxeListDesignSlotTypes {}
export interface VxeListDesignSlots {
}

export const ListDesign: typeof VxeListDesign
export default VxeListDesign
