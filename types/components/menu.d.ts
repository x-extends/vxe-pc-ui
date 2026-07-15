import { CreateElement } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, ValueOf, VxeComponentSizeType, VxeComponentStyleType, VxeComponentPermissionCodeType, VxeComponentSlotType } from '@vxe-ui/core'
import { VxeLinkPropTypes } from './link'
import { VxeContextMenuPropTypes, VxeContextMenuDefines } from './context-menu'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeMenu: DefineVxeComponentApp<VxeMenuProps, VxeMenuEventProps, VxeMenuSlots, VxeMenuMethods>
export type VxeMenuComponent = DefineVxeComponentOptions<VxeMenuProps>

export type VxeMenuInstance = DefineVxeComponentInstance<{
  internalData: MenuInternalData
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
  export type Border = boolean | 'first' | 'first-group' | 'group' | 'all'
  export type Accordion = boolean
  export interface OptionProps {
   name?: string
   title?: string
   icon?: string
   children?: string
   linkUrl?: string
   linkTarget?: string
   routerLink?: string
   routerTarget?: string
  }

  export interface MenuOption {
    name?: VxeMenuPropTypes.ModelValue
    title?: string | number
    icon?: string
    linkUrl?: string
    linkTarget?: VxeLinkPropTypes.Target
    routerLink?: VxeLinkPropTypes.RouterLink
    expanded?: boolean
    permissionCode?: VxeComponentPermissionCodeType
    children?: MenuOption[]
    slots?: {
      icon?: string | ((params: VxeMenuSlotTypes.IconSlotParams, h: CreateElement) => VxeComponentSlotType | VxeComponentSlotType[]) | null
      title?: string | ((params: VxeMenuSlotTypes.TitleSlotParams, h: CreateElement) => VxeComponentSlotType | VxeComponentSlotType[]) | null
      default?: string | ((params: VxeMenuSlotTypes.TitleSlotParams, h: CreateElement) => VxeComponentSlotType | VxeComponentSlotType[]) | null
    }

    [key: string]: any
  }

  export type Collapsed = boolean
  export type CollapseFixed = boolean
  export type ExpandAll = boolean
  export type ExpandKeys = (string | number)[]
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
      currentOption: VxeMenuPropTypes.MenuOption
    }): boolean
  }
}

export interface VxeMenuProps {
  modelValue?: VxeMenuPropTypes.ModelValue
  size?: VxeMenuPropTypes.Size
  loading?: VxeMenuPropTypes.Loading
  border?: VxeMenuPropTypes.Border
  accordion?: VxeMenuPropTypes.Accordion
  optionProps?: VxeMenuPropTypes.OptionProps
  collapsed?: VxeMenuPropTypes.Collapsed
  collapseFixed?: VxeMenuPropTypes.CollapseFixed
  /**
   * 默认展开所有菜单项（只会在初始化时被触发一次）
   */
  expandAll?: VxeMenuPropTypes.ExpandAll
  /**
   * 默认展开指定菜单项（只会在初始化时被触发一次）
   */
  expandKeys?: VxeMenuPropTypes.ExpandKeys
  options?: VxeMenuPropTypes.Options
  menuConfig?: VxeMenuPropTypes.MenuConfig
}

export interface MenuPrivateComputed {
}
export interface VxeMenuPrivateComputed extends MenuPrivateComputed { }

export interface MenuInternalData {
  lastActiveTime: number
  menuInitMaps: Record<number, boolean>
  menuCacheMaps: Record<string, VxeMenuDefines.MenuItem>
  menuKeyMaps: Record<string, VxeMenuDefines.MenuItem>
  menuEffectMaps: Record<number, number>
}

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
  /**
   * 设置指定菜单 key 为展开状态，第二个参数为选中与否
   */
  setExpandByMenuKey(menuKeys: string | number | (string | number)[], expanded: boolean): Promise<any>
  /**
   * 手动清除所有菜单的展开状态
   */
  clearAllExpandMenu(): Promise<any>
  /**
   * 自动滚动到指定菜单
   */
  scrollToMenuKey(menuKey: string | number): Promise<any>
  /**
   * 自动滚动到旋转的菜单
   */
  scrollToActiveMenu(): Promise<any>
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
    itemConf: VxeMenuPropTypes.MenuOption
    itemId: number
    itemKey: string | number
    level: number,
    parentKey: string | number
    isExactActive: boolean
    isActive: boolean
    isExpand: boolean
    hasChild: boolean
    childList: MenuItem[]
  }

  export interface ClickParams {
    currentMenu: VxeMenuDefines.MenuItem
    currentOption: VxeMenuPropTypes.MenuOption
    option: VxeMenuPropTypes.MenuOption

    /**
     * 已废弃
     * @deprecated
     */
    menu: VxeMenuDefines.MenuItem
  }
  export interface ClickEventParams extends MenuEventParams, ClickParams { }

  export interface OptionMenuEventParams extends MenuEventParams {
    currentMenu: VxeMenuDefines.MenuItem
    currentOption: VxeMenuPropTypes.MenuOption
    option: VxeMenuPropTypes.MenuOption
  }
  export interface MenuClickEventParams extends MenuEventParams {
    currentMenu: VxeMenuDefines.MenuItem
    currentOption: VxeMenuPropTypes.MenuOption
    menu: VxeContextMenuDefines.MenuFirstOption | VxeContextMenuDefines.MenuChildOption
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
    currentMenu: VxeMenuDefines.MenuItem
    option: VxeMenuPropTypes.MenuOption
    collapsed: boolean
  }
  export interface IconSlotParams extends DefaultSlotParams {}
  export interface TitleSlotParams extends DefaultSlotParams {}

  export interface HeaderSlotParams {
    collapsed: boolean
  }
  export interface FooterSlotParams extends HeaderSlotParams {}
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

  header?: (params: VxeMenuSlotTypes.HeaderSlotParams) => any
  footer?: (params: VxeMenuSlotTypes.FooterSlotParams) => any
}

export const Menu: typeof VxeMenu
export default VxeMenu
