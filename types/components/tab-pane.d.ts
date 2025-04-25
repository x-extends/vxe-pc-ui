import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, VxeComponentPermissionCodeType, VxeComponentAlignType, VxeComponentSlotType } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeTabPane: DefineVxeComponentApp<VxeTabPaneProps, VxeTabPaneEventProps, VxeTabPaneSlots, VxeTabPaneMethods>
export type VxeTabPaneComponent = DefineVxeComponentOptions<VxeTabPaneProps>

export type VxeTabPaneInstance = DefineVxeComponentInstance<{
  reactData: TabPaneReactData
}, VxeTabPaneProps, VxeTabPanePrivateComputed, VxeTabPaneMethods>

export type VxeTabPaneConstructor = VxeTabPaneInstance

export interface TabPanePrivateRef {
}
export interface VxeTabPanePrivateRef extends TabPanePrivateRef { }

export namespace VxeTabPanePropTypes {
  export type Title = string | number
  export type Name = string | number | boolean
  export type Icon = string
  export type TitleWidth = string | number
  export type TitleAlign = VxeComponentAlignType
  export type Preload = boolean
  export type PermissionCode = VxeComponentPermissionCodeType
}

export interface VxeTabPaneProps {
  title?: VxeTabPanePropTypes.Title
  name?: VxeTabPanePropTypes.Name
  icon?: VxeTabPanePropTypes.Icon
  titleWidth?: VxeTabPanePropTypes.TitleWidth
  titleAlign?: VxeTabPanePropTypes.TitleAlign
  preload?: VxeTabPanePropTypes.Preload
  permissionCode?: VxeTabPanePropTypes.PermissionCode

  slots?: {
    title?: string | ((params: { [key: string]: any }) => VxeComponentSlotType | VxeComponentSlotType[])
    default?: string | ((params: { [key: string]: any }) => VxeComponentSlotType | VxeComponentSlotType[])

    /**
     * 已废弃，被 title 替换
     * @deprecated
     */
    tab?: string | ((params: { [key: string]: any }) => VxeComponentSlotType | VxeComponentSlotType[])
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
  export interface TabPaneEventParams extends VxeComponentEventParams {
    $tabPane: VxeTabPaneConstructor
  }

  export interface TabConfig extends VxeTabPaneProps {
    id: string
  }
}

export type VxeTabPaneEventProps = {}

export interface VxeTabPaneListeners { }

export namespace VxeTabPaneEvents { }

export namespace VxeTabPaneSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeTabPaneSlots {
  title?: (params: VxeTabPaneSlotTypes.DefaultSlotParams) => any
  default?: (params: VxeTabPaneSlotTypes.DefaultSlotParams) => any
  /**
   * 已废弃，被 title 替换
   * @deprecated
   */
  tab?: (params: VxeTabPaneSlotTypes.DefaultSlotParams) => any
}

export const TabPane: typeof VxeTabPane
export default VxeTabPane
