import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeTips: defineVxeComponent<VxeTipsProps, VxeTipsEventProps>
export type VxeTipsComponent = DefineComponent<VxeTipsProps, VxeTipsEmits>

export type VxeTipsInstance = ComponentPublicInstance<VxeTipsProps, VxeTipsConstructor>

export interface VxeTipsConstructor extends VxeComponentBaseOptions, VxeTipsMethods {
  props: VxeTipsProps
  context: SetupContext<VxeTipsEmits>
  reactData: TipsReactData
  getRefMaps(): TipsPrivateRef
  getComputeMaps(): TipsPrivateComputed
  renderVN: RenderFunction
}

export interface TipsPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeTipsPrivateRef extends TipsPrivateRef { }

export namespace VxeTipsPropTypes {
  export type Title = string | number
  export type Content = string | number
  export type Status = VxeComponentStatusType
  export type Icon = string
}

export type VxeTipsProps = {
  title?: VxeTipsPropTypes.Title
  content?: VxeTipsPropTypes.Content
  status?: VxeTipsPropTypes.Status
  icon?: VxeTipsPropTypes.Icon
}

export interface TipsPrivateComputed {
}
export interface VxeTipsPrivateComputed extends TipsPrivateComputed { }

export interface TipsReactData {
}

export interface TipsMethods {
  dispatchEvent(type: ValueOf<VxeTipsEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeTipsMethods extends TipsMethods { }

export interface TipsPrivateMethods { }
export interface VxeTipsPrivateMethods extends TipsPrivateMethods { }

export type VxeTipsEmits = []

export namespace VxeTipsDefines {
  export interface TipsEventParams extends VxeComponentEventParams {
    $tips: VxeTipsConstructor
  }
}

export type VxeTipsEventProps = {}

export interface VxeTipsListeners { }

export namespace VxeTipsEvents { }

export namespace VxeTipsSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeTipsSlots {
  default: (params: VxeTipsSlotTypes.DefaultSlotParams) => any
  title: (params: VxeTipsSlotTypes.DefaultSlotParams) => any
  icon: (params: VxeTipsSlotTypes.DefaultSlotParams) => any
}

export const Tips: typeof VxeTips
export default VxeTips
