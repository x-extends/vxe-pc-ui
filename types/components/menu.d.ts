import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeMenu: defineVxeComponent<VxeMenuProps, VxeMenuEventProps>
export type VxeMenuComponent = DefineComponent<VxeMenuProps, VxeMenuEmits>

export type VxeMenuInstance = ComponentPublicInstance<VxeMenuProps, VxeMenuConstructor>

export interface VxeMenuConstructor extends VxeComponentBase, VxeMenuMethods {
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
}

export type VxeMenuProps = {
}

export interface MenuPrivateComputed {
}
export interface VxeMenuPrivateComputed extends MenuPrivateComputed { }

export interface MenuReactData {
}

export interface MenuMethods {
}
export interface VxeMenuMethods extends MenuMethods { }

export interface MenuPrivateMethods { }
export interface VxeMenuPrivateMethods extends MenuPrivateMethods { }

export type VxeMenuEmits = []

export namespace VxeMenuDefines {
  export interface MenuEventParams extends VxeComponentEvent {
    $menu: VxeMenuConstructor
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
