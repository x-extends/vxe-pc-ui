import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, VxeComponentSizeType } from '@vxe-ui/core'
import { VxeCollapsePaneProps, VxeCollapsePaneDefines, VxeCollapsePanePropTypes } from './collapse-pane'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeCollapse: DefineVxeComponentApp<VxeCollapseProps, VxeCollapseEventProps, VxeCollapseSlots>
export type VxeCollapseComponent = DefineVxeComponentOptions<VxeCollapseProps>

export type VxeCollapseInstance = DefineVxeComponentInstance<{
  reactData: CollapseReactData
}, VxeCollapseProps, VxeCollapsePrivateComputed, VxeCollapseMethods>

export type VxeCollapseConstructor = VxeCollapseInstance

export interface CollapsePrivateRef {
}
export interface VxeCollapsePrivateRef extends CollapsePrivateRef { }

export namespace VxeCollapsePropTypes {
  export type Size = VxeComponentSizeType
  export type ModelValue = VxeCollapsePanePropTypes.Name[]
  export type Options = VxeCollapsePaneProps[]
  export type Padding = boolean
  export interface ExpandConfig {
    accordion?: boolean
    padding?: boolean
    showIcon?: boolean
    iconOpen?: string
    iconClose?: string
  }
}

export type VxeCollapseProps = {
  size?: VxeCollapsePropTypes.Size
  modelValue?: VxeCollapsePropTypes.ModelValue
  options?: VxeCollapsePropTypes.Options
  padding?: VxeCollapsePropTypes.Padding
  expandConfig?: VxeCollapsePropTypes.ExpandConfig
}

export interface CollapsePrivateComputed {
}
export interface VxeCollapsePrivateComputed extends CollapsePrivateComputed { }

export interface CollapseReactData {
  staticPanes: VxeCollapsePaneDefines.CollapseConfig[]
  activeNames: VxeCollapsePanePropTypes.Name[]
  initNames: VxeCollapsePanePropTypes.Name[]
  cachePaneMaps: Record<string, {
    loading: boolean
  }>
}

export interface CollapseMethods {
}
export interface VxeCollapseMethods extends CollapseMethods { }

export interface CollapsePrivateMethods { }
export interface VxeCollapsePrivateMethods extends CollapsePrivateMethods { }

export type VxeCollapseEmits = [
  'load',
  'change'
]

export namespace VxeCollapseDefines {
  export interface CollapseEventParams extends VxeComponentEventParams {
    $collapse: VxeCollapseConstructor
  }
}

export type VxeCollapseEventProps = {}

export interface VxeCollapseListeners { }

export namespace VxeCollapseEvents { }

export namespace VxeCollapseSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeCollapseSlots {
  /**
   * 自定义插槽模板
   */
  [key: string]: ((params: {
    [key: string]: any
  }) => any) | undefined

  default?: (params: VxeCollapseSlotTypes.DefaultSlotParams) => any
}

export const Collapse: typeof VxeCollapse
export default VxeCollapse
