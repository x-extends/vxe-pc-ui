import { RenderFunction, SetupContext, Ref } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'
import { VxeTabPaneProps, VxeTabPaneDefines, VxeTabPanePropTypes } from './tab-pane'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeTabs: DefineVxeComponentApp<VxeTabsProps, VxeTabsEventProps, VxeTabsSlots, VxeTabsMethods>
export type VxeTabsComponent = DefineVxeComponentOptions<VxeTabsProps, VxeTabsEventProps>

export type VxeTabsInstance = DefineVxeComponentInstance<VxeTabsProps, VxeTabsConstructor>

export interface VxeTabsConstructor extends VxeComponentBaseOptions, VxeTabsMethods {
  props: VxeTabsProps
  context: SetupContext<VxeTabsEmits>
  reactData: TabsReactData
  getRefMaps(): TabsPrivateRef
  getComputeMaps(): TabsPrivateComputed
  renderVN: RenderFunction
}

export interface TabsPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeTabsPrivateRef extends TabsPrivateRef { }

export namespace VxeTabsPropTypes {
  export type ModelValue = undefined | null | VxeTabPanePropTypes.Name
  export type Options = VxeTabPaneProps[]
  export type DestroyOnClose = boolean
  export type Height = string | number
  export type TitleWidth = VxeTabPanePropTypes.TitleWidth
  export type TitleAlign = VxeTabPanePropTypes.TitleAlign
  export type Type = null | '' | 'default' | 'card' | 'border-card' | 'round-card'
  export type ShowClose = boolean
  export type Padding = boolean
  export type Trigger = '' | 'default' | 'click' | 'manual'
  export type BeforeChangeMethod = (params: {
    $tabs: VxeTabsConstructor
    name: VxeTabsPropTypes.ModelValue
    oldName: VxeTabsPropTypes.ModelValue
    newName: VxeTabsPropTypes.ModelValue
    option: Omit<VxeTabPaneProps, 'slots'>
  }) => boolean | Promise<boolean>
  /**
   * 请使用 closeConfig.beforeMethod
   * @deprecated
   */
  export type BeforeCloseMethod = (params: {
    $tabs: VxeTabsConstructor
    value: VxeTabsPropTypes.ModelValue
    name: VxeTabsPropTypes.ModelValue
    nextName: VxeTabsPropTypes.ModelValue | null
    option: Omit<VxeTabPaneProps, 'slots'>
  }) => boolean
  export interface CloseConfig {
    /**
     * 是否启用
     */
    enabled?: boolean
    /**
     * 页签关闭之前方法，该方法的返回值用来决定当前页签是否允许关闭
     * @returns boolean
     */
    beforeMethod?: (params: {
      $tabs: VxeTabsConstructor
      value: VxeTabsPropTypes.ModelValue
      name: VxeTabsPropTypes.ModelValue
      nextName: VxeTabsPropTypes.ModelValue | null
      option: Omit<VxeTabPaneProps, 'slots'>
    }) => boolean | Promise<boolean>
    /**
     * 显示关闭按钮方法，该方法的返回值用来决定当前页签的关闭按钮是否显示
     * @returns boolean
     */
    visibleMethod?: (params: {
      $tabs: VxeTabsConstructor
      value: VxeTabsPropTypes.ModelValue
      name: VxeTabsPropTypes.ModelValue
      option: Omit<VxeTabPaneProps, 'slots'>
    }) => boolean
  }
  export interface RefreshConfig {
    /**
     * 是否启用
     */
    enabled?: boolean
    /**
     * 查询方法
     */
    queryMethod?: (params: {
      $tabs: VxeTabsConstructor
      value: VxeTabsPropTypes.ModelValue
      name: VxeTabsPropTypes.ModelValue
      option: Omit<VxeTabPaneProps, 'slots'>
    }) => Promise<any> | void
    /**
     * 显示刷新按钮方法，该方法的返回值用来决定当前页签的刷新按钮是否显示
     * @returns boolean
     */
    visibleMethod?: (params: {
      $tabs: VxeTabsConstructor
      value: VxeTabsPropTypes.ModelValue
      name: VxeTabsPropTypes.ModelValue
      option: Omit<VxeTabPaneProps, 'slots'>
    }) => boolean
  }
}

export type VxeTabsProps = {
  modelValue?: VxeTabsPropTypes.ModelValue
  options?: VxeTabsPropTypes.Options
  destroyOnClose?: VxeTabsPropTypes.DestroyOnClose
  height?: VxeTabsPropTypes.Height
  titleWidth?: VxeTabsPropTypes.TitleWidth
  titleAlign?: VxeTabsPropTypes.TitleAlign
  type?: VxeTabsPropTypes.Type
  showClose?: VxeTabsPropTypes.ShowClose
  padding?: VxeTabsPropTypes.Padding
  trigger?: VxeTabsPropTypes.Trigger
  beforeChangeMethod?: VxeTabsPropTypes.BeforeChangeMethod
  /**
   * 关闭配置项
   */
  closeConfig?: VxeTabsPropTypes.CloseConfig
  /**
   * 刷新配置项
   */
  refreshConfig?: VxeTabsPropTypes.RefreshConfig

  /**
   * 请使用 closeConfig.beforeMethod
   * @deprecated
   */
  beforeCloseMethod?: VxeTabsPropTypes.BeforeCloseMethod
}

export interface TabsPrivateComputed {
}
export interface VxeTabsPrivateComputed extends TabsPrivateComputed { }

export interface TabsReactData {
  staticTabs: VxeTabPaneDefines.TabConfig[]
  activeName: VxeTabsPropTypes.ModelValue
  initNames: VxeTabsPropTypes.ModelValue[]
  lintLeft: number
  lintWidth: number
  isTabOver: boolean
  resizeFlag: number
  cacheTabMaps: Record<string, {
    loading: boolean
  }>
}

export interface TabsInternalData {
  slTimeout?: undefined | number
}

export interface TabsMethods {
  dispatchEvent(type: ValueOf<VxeTabsEmits>, params: Record<string, any>, evnt: Event | null): void
  /**
   * 定位到指定页签
   */
  scrollToTab(name: VxeTabsPropTypes.ModelValue): Promise<any>
  /**
   * 切换到上一个
   */
  prev(): Promise<any>
  /**
   * 请使用 prev
   * @deprecated
   */
  prevTab(): Promise<any>
  /**
   * 切换到下一个
   */
  next(): Promise<any>
  /**
   * 请使用 next
   * @deprecated
   */
  nextTab(): Promise<any>
}
export interface VxeTabsMethods extends TabsMethods { }

export interface TabsPrivateMethods { }
export interface VxeTabsPrivateMethods extends TabsPrivateMethods { }

export type VxeTabsEmits = [
  'update:modelValue',
  'change',
  'tab-change',
  'tab-change-fail',
  'tab-close',
  'tab-close-fail',
  'tab-click',
  'tab-load'
]

export namespace VxeTabsDefines {
  export interface TabsEventParams extends VxeComponentEventParams {
    $tabs: VxeTabsConstructor
  }

  export interface ChangeEventParams extends TabsEventParams {
    value: VxeTabsPropTypes.ModelValue
    name: VxeTabsPropTypes.ModelValue
    oldName: VxeTabsPropTypes.ModelValue
    newName: VxeTabsPropTypes.ModelValue
  }

  export interface TabChangeEventParams extends ChangeEventParams {}

  export interface TabChangeFailEventParams extends TabsEventParams {
    value: VxeTabsPropTypes.ModelValue
    name: VxeTabsPropTypes.ModelValue
  }

  export interface TabCloseEventParams extends TabsEventParams {
    value: VxeTabsPropTypes.ModelValue
    name: VxeTabsPropTypes.ModelValue
    nextName: VxeTabsPropTypes.ModelValue | null
  }

  export interface TabCloseFailEventParams extends TabsEventParams {
    name: VxeTabsPropTypes.ModelValue
    nextName: VxeTabsPropTypes.ModelValue | null
  }

  export interface TabClickEventParams extends TabsEventParams {
    name: VxeTabsPropTypes.ModelValue
  }

  export interface TabLoadEventParams extends TabsEventParams {
    name: VxeTabsPropTypes.ModelValue
  }
}

export type VxeTabsEventProps = {
  onChange?: VxeTabsEvents.Change
  onTabChange?: VxeTabsEvents.TabChange
  onTabChangeFail?: VxeTabsEvents.TabChangeFail
  onTabClose?: VxeTabsEvents.TabClose
  onTabCloseFail?: VxeTabsEvents.TabCloseFail
  onTabClick?: VxeTabsEvents.TabClick
  onTabLoad?: VxeTabsEvents.TabLoad
}

export interface VxeTabsListeners {
  change?: VxeTabsEvents.Change
  tabChange?: VxeTabsEvents.TabChange
  tabChangeFail?: VxeTabsEvents.TabChangeFail
  tabClose?: VxeTabsEvents.TabClose
  tabCloseFail?: VxeTabsEvents.TabCloseFail
  tabClick?: VxeTabsEvents.TabClick
  tabLoad?: VxeTabsEvents.TabLoad
}

export namespace VxeTabsEvents {
  export type Change = (params: VxeTabsDefines.ChangeEventParams) => void
  export type TabChange = (params: VxeTabsDefines.TabChangeEventParams) => void
  export type TabChangeFail = (params: VxeTabsDefines.TabChangeFailEventParams) => void
  export type TabClose = (params: VxeTabsDefines.TabCloseEventParams) => void
  export type TabCloseFail = (params: VxeTabsDefines.TabCloseFailEventParams) => void
  export type TabClick = (params: VxeTabsDefines.TabClickEventParams) => void
  export type TabLoad = (params: VxeTabsDefines.TabLoadEventParams) => void
}

export namespace VxeTabsSlotTypes {
  export interface DefaultSlotParams {
    name: VxeTabsPropTypes.ModelValue
  }
  export interface TabSlotParams {
    name: VxeTabsPropTypes.ModelValue
  }
  export interface ExtraSlotParams {}
  export interface FooterSlotParams {}
}

export interface VxeTabsSlots {
  /**
   * 自定义插槽模板
   */
  [key: string]: ((params: {
    name: VxeTabsPropTypes.ModelValue

    [key: string]: any
  }) => any) | undefined

  default?: (params: VxeTabsSlotTypes.DefaultSlotParams) => any
  extra?: (params: VxeTabsSlotTypes.ExtraSlotParams) => any
  /**
   * 自定义页签底部模板
   */
  footer?(params: VxeTabsSlotTypes.FooterSlotParams): any
}

export const Tabs: typeof VxeTabs
export default VxeTabs
