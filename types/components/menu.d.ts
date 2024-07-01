import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf, VxeComponentPermissionCodeType } from '@vxe-ui/core'
import { VxeLinkPropTypes } from './link'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeMenu: defineVxeComponent<VxeMenuProps, VxeMenuEventProps>
export type VxeMenuComponent = DefineComponent<VxeMenuProps, VxeMenuEmits>

export type VxeMenuInstance = ComponentPublicInstance<VxeMenuProps, VxeMenuConstructor>

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

  export interface MenuOneOption extends MenuOption {
    children?: MenuTwoOption[]
  }

  export interface MenuTwoOption extends MenuOption {
    children?: MenuThreeOption[]
  }

  export interface MenuThreeOption extends MenuOption {
    children?: MenuOption[]
  }

  export interface MenuOption {
    name?: VxeMenuPropTypes.ModelValue
    title?: string | number
    icon?: string
    routerLink?: VxeLinkPropTypes.RouterLink
    expanded?: boolean
    permissionCode?: VxeComponentPermissionCodeType
  }

  export type ExpandAll = boolean
  export type Options = MenuOneOption[]
}

export type VxeMenuProps = {
  modelValue?: VxeMenuPropTypes.ModelValue
  expandAll?: VxeMenuPropTypes.ExpandAll
  options?: VxeMenuPropTypes.Options
}

export interface MenuPrivateComputed {
}
export interface VxeMenuPrivateComputed extends MenuPrivateComputed { }

export interface MenuReactData {
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
}

export type VxeMenuEventProps = {}

export interface VxeMenuListeners { }

export namespace VxeMenuEvents { }

export namespace VxeMenuSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeMenuSlots {
  default: (params: VxeMenuSlotTypes.DefaultSlotParams) => any
}

export const Menu: typeof VxeMenu
export default VxeMenu
