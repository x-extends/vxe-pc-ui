import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams } from '@vxe-ui/core'
import { VxeTabPaneProps, VxeTabPaneDefines, VxeTabPanePropTypes } from './tab-pane'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeTabs: defineVxeComponent<VxeTabsProps, VxeTabsEventProps>
export type VxeTabsComponent = DefineComponent<VxeTabsProps, VxeTabsEmits>

export type VxeTabsInstance = ComponentPublicInstance<VxeTabsProps, VxeTabsConstructor>

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
  export type Type = null | '' | 'default' | 'card' | 'border-card' | 'round-card'
}

export type VxeTabsProps = {
  modelValue?: VxeTabsPropTypes.ModelValue
  options?: VxeTabsPropTypes.Options
  destroyOnClose?: VxeTabsPropTypes.DestroyOnClose
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
}

export interface TabsMethods {
  dispatchEvent(type: ValueOf<VxeTabsEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeTabsMethods extends TabsMethods { }

export interface TabsPrivateMethods { }
export interface VxeTabsPrivateMethods extends TabsPrivateMethods { }

export type VxeTabsEmits = [
  'update:modelValue',
  'change',
  'tab-click',
  'tab-load'
]

export namespace VxeTabsDefines {
  export interface TabsEventParams extends VxeComponentEventParams {
    $tabs: VxeTabsConstructor
  }
}

export type VxeTabsEventProps = {}

export interface VxeTabsListeners { }

export namespace VxeTabsEvents { }

export namespace VxeTabsSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeTabsSlots {
  default: (params: VxeTabsSlotTypes.DefaultSlotParams) => any
}

export const Tabs: typeof VxeTabs
export default VxeTabs
