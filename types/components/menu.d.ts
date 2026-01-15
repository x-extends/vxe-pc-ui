import { CreateElement } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, ValueOf, VxeComponentSizeType, VxeComponentStyleType, VxeComponentPermissionCodeType, VxeComponentSlotType } from '@vxe-ui/core'
import { VxeLinkPropTypes } from './link'
import { VxeContextMenuPropTypes, VxeContextMenuDefines } from './context-menu'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeMenu: DefineVxeComponentApp<VxeMenuProps, VxeMenuEventProps, VxeMenuSlots, VxeMenuMethods>
export type VxeMenuComponent = DefineVxeComponentOptions<VxeMenuProps>

export type VxeMenuInstance = DefineVxeComponentInstance<{
  reactData: MenuReactData
}, VxeMenuProps, VxeMenuPrivateComputed, VxeMenuMethods>

export type VxeMenuConstructor = VxeMenuInstance

export interface MenuPrivateRef {
}
export interface VxeMenuPrivateRef extends MenuPrivateRef { }

export namespace VxeMenuPropTypes {
  export type ModelValue = string | number | null
  export type Size = VxeComponentSizeType
  export type Loading = boolean
  export type Accordion = boolean

  export interface MenuOption {
    name?: VxeMenuPropTypes.ModelValue
    title?: string | number
    icon?: string
    routerLink?: VxeLinkPropTypes.RouterLink
    expanded?: boolean
    permissionCode?: VxeComponentPermissionCodeType
    children?: MenuOption[]
    slots?: {
      icon?: string | ((params: VxeMenuSlotTypes.IconSlotParams, h: CreateElement) => VxeComponentSlotType | VxeComponentSlotType[]) | null
      title?: string | ((params: VxeMenuSlotTypes.TitleSlotParams, h: CreateElement) => VxeComponentSlotType | VxeComponentSlotType[]) | null
      default?: string | ((params: VxeMenuSlotTypes.TitleSlotParams, h: CreateElement) => VxeComponentSlotType | VxeComponentSlotType[]) | null
    }
  }

  export type Collapsed = boolean
  export type CollapseFixed = boolean
  export type ExpandAll = boolean
  export type Options = MenuOption[]
  export interface MenuConfig {
    /**
     * 是否启用
     */
    enabled?: boolean
    /**
     * 菜单配置
     */
    options: VxeContextMenuPropTypes.Options
    /**
     * 该函数的返回值用来决定是否允许显示右键菜单（对于需要对菜单进行权限控制时可能会用到）
     */
    visibleMethod?(params: {
      $menu: VxeMenuConstructor
      options: VxeContextMenuPropTypes.Options
      currentMenu: VxeMenuDefines.MenuItem
    }): boolean
  }
}

export interface VxeMenuProps {
  value?: VxeMenuPropTypes.ModelValue
  size?: VxeMenuPropTypes.Size
  loading?: VxeMenuPropTypes.Loading
  accordion?: VxeMenuPropTypes.Accordion
  collapsed?: VxeMenuPropTypes.Collapsed
  CollapseFixed?: VxeMenuPropTypes.CollapseFixed
  expandAll?: VxeMenuPropTypes.ExpandAll
  options?: VxeMenuPropTypes.Options
  menuConfig?: VxeMenuPropTypes.MenuConfig
}

export interface MenuPrivateComputed {
}
export interface VxeMenuPrivateComputed extends MenuPrivateComputed { }

export interface MenuReactData {
  initialized: boolean
  collapseStyle: VxeComponentStyleType
  isEnterCollapse: boolean
  collapseZindex: number
  activeName: undefined | null | VxeMenuPropTypes.ModelValue
  menuList: VxeMenuDefines.MenuItem[]
  itemHeight: number
}

export interface MenuMethods {
  dispatchEvent(type: ValueOf<VxeMenuEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeMenuMethods extends MenuMethods { }

export interface MenuPrivateMethods { }
export interface VxeMenuPrivateMethods extends MenuPrivateMethods { }

export type VxeMenuEmits = [
  'model-value',
  'modelValue',
  'click',
  'option-menu',
  'menu-click'
]

export namespace VxeMenuDefines {
  export interface MenuEventParams extends VxeComponentEventParams {
    $menu: VxeMenuConstructor
  }

  export interface MenuItem extends VxeMenuPropTypes.MenuOption {
    itemKey: string | number
    level: number,
    parentKey: string | number
    isExactActive: boolean
    isActive: boolean
    isExpand: boolean
    hasChild: boolean
    childList: MenuItem[]
    allChildSize: number
    childHeight: number
  }

  export interface ClickParams {
    currentMenu: VxeMenuDefines.MenuItem

    /**
     * 已废弃，请使用 currentMenu
     * @deprecated
     */
    menu: VxeMenuDefines.MenuItem
  }
  export interface ClickEventParams extends MenuEventParams, ClickParams { }

  export interface OptionMenuEventParams extends MenuEventParams {
    currentMenu: VxeMenuDefines.MenuItem
  }
  export interface MenuClickEventParams extends MenuEventParams {
    currentMenu: VxeMenuDefines.MenuItem
    option: VxeContextMenuDefines.MenuFirstOption | VxeContextMenuDefines.MenuChildOption
  }
}

export type VxeMenuEventProps = {
  onClick?: VxeMenuEvents.Click
  onOptionMenu?: VxeMenuEvents.OptionMenu
  onMenuClick?: VxeMenuEvents.MenuClick
}

export interface VxeMenuListeners {
  click?: VxeMenuEvents.Click
  optioMenu?: VxeMenuEvents.OptionMenu
  menuClick?: VxeMenuEvents.MenuClick
}

export namespace VxeMenuEvents {
  export type Click = (params: VxeMenuDefines.ClickEventParams) => void
  export type OptionMenu = (params: VxeMenuDefines.OptionMenuEventParams) => void
  export type MenuClick = (params: VxeMenuDefines.MenuClickEventParams) => void
}

export namespace VxeMenuSlotTypes {
  export interface DefaultSlotParams {
    currentMenu: Required<VxeMenuPropTypes.MenuOption>
    collapsed: boolean

    /**
     * 已废弃，请使用 currentMenu
     * @deprecated
     */
    option: Required<VxeMenuPropTypes.MenuOption>
  }
  export interface IconSlotParams extends DefaultSlotParams {}
  export interface TitleSlotParams extends DefaultSlotParams {}
}

export interface VxeMenuSlots {
  [key: string]: ((params: VxeMenuSlotTypes.DefaultSlotParams) => any) | undefined

  /**
   * 自定义菜单图标模板
   */
  optionIcon?: (params: VxeMenuSlotTypes.IconSlotParams) => any
  /**
   * 自定义菜单图标模板
   */
  'option-icon'?: (params: VxeMenuSlotTypes.IconSlotParams) => any
  /**
   * 自定义菜单标题模板
   */
  optionTitle?: (params: VxeMenuSlotTypes.TitleSlotParams) => any
  /**
   * 自定义菜单标题模板
   */
  'option-title'?: (params: VxeMenuSlotTypes.TitleSlotParams) => any

  option?: (params: VxeMenuSlotTypes.TitleSlotParams) => any
}

export const Menu: typeof VxeMenu
export default VxeMenu
