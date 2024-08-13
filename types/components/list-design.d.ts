import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, VxeComponentSizeType, ValueOf, VxeComponentPermissionCodeType, VxeComponentStatusType } from '@vxe-ui/core'
import { VxeFormDesignDefines } from './form-design'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeListDesign: defineVxeComponent<VxeListDesignProps, VxeListDesignEventProps, VxeListDesignSlots>
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
  export type ActionCodes = string[]
  export interface FormRender {
    name?: string
  }
}

export type VxeListDesignProps = {
  size?: VxeListDesignPropTypes.Size
  height?: VxeListDesignPropTypes.Height
  config?: VxeListDesignPropTypes.Config
  showPc?: VxeListDesignPropTypes.ShowPc
  showMobile?: VxeListDesignPropTypes.ShowMobile
  actionCodes?: VxeListDesignPropTypes.ActionCodes
  formRender?: VxeListDesignPropTypes.FormRender
}

export interface ListDesignPrivateComputed {
}
export interface VxeListDesignPrivateComputed extends ListDesignPrivateComputed { }

export interface ListDesignReactData<D = VxeListDesignDefines.DefaultSettingFormDataObjVO> {
  formData: D
  searchFormItems: VxeListDesignDefines.SearchItemObjItem[]
  listTableColumns: VxeListDesignDefines.ListColumnObjItem[]
}

export interface ListDesignMethods {
  dispatchEvent(type: ValueOf<VxeListDesignEmits>, params: Record<string, any>, evnt: Event | null): void
  /**
   * 加载表单设计器配置
   */
  loadFormDesignConfig(config: Partial<VxeFormDesignDefines.FormDesignConfig>): Promise<any>
  /**
   * 获取列表的搜索区配置
   */
  getSearchItems(): VxeListDesignDefines.SearchItemObjItem[]
  /**
   * 加载列表的搜索区配置
   */
  setSearchItems(searchItems: VxeListDesignDefines.SearchItemObjItem[]): Promise<any>
  /**
   * 获取列表的列配置
   */
  getListColumns(): VxeListDesignDefines.ListColumnObjItem[]
  /**
   * 加载列表的列配置
   */
  setListColumns(listColumns: VxeListDesignDefines.ListColumnObjItem[]): Promise<any>
  /**
   * 获取所有配置
   */
  getConfig (): VxeListDesignDefines.ListDesignConfig
  /**
   * 清除所有配置
   */
  clearConfig (): Promise<any>
  /**
   * 加载配置
   */
  loadConfig(config: Partial<VxeListDesignDefines.ListDesignConfig>): Promise<any>
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

  export interface ListDesignConfig<FC = DefaultSettingFormDataObjVO> {
    formConfig: FC
    searchItems: SearchItemObjItem[]
    listColumns: ListColumnObjItem[]
  }

  export interface SearchItemObjItem {
    field: string
    title: string
  }

  export interface ListColumnObjItem {
    widgetName: string
    field: string
    title: string
    visible: boolean
  }

  export interface DefaultSettingFormActionButton {
    name: string
    icon: string
    type: 'custom' | ''
    classify: '' | 'cellButton' | 'toolbarButton' | 'toolbarTool'
    status: VxeComponentStatusType
    code: string
    permissionCode: VxeComponentPermissionCodeType
  }

  export interface DefaultSettingFormDataObjVO {
    listView: {
      enabled: boolean
    }
    ganttView: {
      enabled: boolean
    }
    chartView: {
      enabled: boolean
    }
    showCheckbox: boolean | 'auto'
    showSeq: boolean
    showSummary: boolean
    mobileDefaultView: 'list' | 'gantt' | 'chart'
    pcDefaultView: 'list' | 'gantt' | 'chart'
    actionButtonList: DefaultSettingFormActionButton[]
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
