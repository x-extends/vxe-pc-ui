import { RenderFunction, SetupContext, Ref } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentSlotType, VxeComponentStyleType, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf, VxeComponentSizeType, VxeComponentPermissionCodeType } from '@vxe-ui/core'
import { VxeLinkPropTypes } from './link'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeMenu: DefineVxeComponentApp<VxeMenuProps, VxeMenuEventProps, VxeMenuSlots>
export type VxeMenuComponent = DefineVxeComponentOptions<VxeMenuProps, VxeMenuEventProps>

export type VxeMenuInstance = DefineVxeComponentInstance<VxeMenuProps, VxeMenuConstructor>

export interface VxeMenuConstructor extends VxeComponentBaseOptions, VxeMenuMethods {
  props: VxeMenuProps
  context: SetupContext<VxeMenuEmits>
  reactData: MenuReactData
  getRefMaps(): MenuPrivateRef
  getComputeMaps(): MenuPrivateComputed
  renderVN: RenderFunction
}

export interface MenuPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeMenuPrivateRef extends MenuPrivateRef { }

export namespace VxeMenuPropTypes {
  export type ModelValue = string | number | null
  export type Size = VxeComponentSizeType
  export type Loading = boolean

  export interface MenuOption {
    name?: VxeMenuPropTypes.ModelValue
    title?: string | number
    icon?: string
    routerLink?: VxeLinkPropTypes.RouterLink
    expanded?: boolean
    permissionCode?: VxeComponentPermissionCodeType
    children?: MenuOption[]
    slots?: {
      default?: string | ((params: {
        option: Required<MenuOption>
        collapsed: boolean
      }) => VxeComponentSlotType | VxeComponentSlotType[]) | null
    }
  }

  export type Collapsed = boolean
  export type CollapseFixed = boolean
  export type ExpandAll = boolean
  export type Options = MenuOption[]
}

export interface VxeMenuProps {
  modelValue?: VxeMenuPropTypes.ModelValue
  size?: VxeMenuPropTypes.Size
  loading?: VxeMenuPropTypes.Loading
  collapsed?: VxeMenuPropTypes.Collapsed
  CollapseFixed?: VxeMenuPropTypes.CollapseFixed
  expandAll?: VxeMenuPropTypes.ExpandAll
  options?: VxeMenuPropTypes.Options
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
  'update:modelValue',
  'click'
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
    menu: VxeMenuDefines.MenuItem
  }
  export interface ClickEventParams extends MenuEventParams, ClickParams { }
}

export type VxeMenuEventProps = {
  onClick?: VxeMenuEvents.Click
}

export interface VxeMenuListeners {
  click?: VxeMenuEvents.Click
}

export namespace VxeMenuEvents {
  export type Click = (params: VxeMenuDefines.ClickEventParams) => void
}

export namespace VxeMenuSlotTypes {
  export interface DefaultSlotParams {}
  export interface OptionSlotParams {
    option: Required<VxeMenuPropTypes.MenuOption>
    collapsed: boolean
  }
}

export interface VxeMenuSlots {
  default?: (params: VxeMenuSlotTypes.DefaultSlotParams) => any
  /**
   * 自定义菜单项的模板
   */
  option?: (params: VxeMenuSlotTypes.OptionSlotParams) => any
}

export const Menu: typeof VxeMenu
export default VxeMenu
