import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeFlowView: DefineVxeComponentApp<VxeFlowViewProps, VxeFlowViewEventProps, VxeFlowViewSlots>
export type VxeFlowViewComponent = DefineVxeComponentOptions<VxeFlowViewProps>

export type VxeFlowViewInstance = DefineVxeComponentInstance<{
  reactData: FlowViewReactData
}, VxeFlowViewProps, FlowViewPrivateComputed, FlowViewMethods>

export type VxeFlowViewConstructor = VxeFlowViewInstance

export interface FlowViewPrivateRef {
}
export interface VxeFlowViewPrivateRef extends FlowViewPrivateRef { }

export namespace VxeFlowViewPropTypes {
}

export interface VxeFlowViewProps {
}

export interface FlowViewPrivateComputed {
}
export interface VxeFlowViewPrivateComputed extends FlowViewPrivateComputed { }

export interface FlowViewReactData {
}

export interface FlowViewMethods {
  dispatchEvent(type: ValueOf<VxeFlowViewEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeFlowViewMethods extends FlowViewMethods { }

export interface FlowViewPrivateMethods { }
export interface VxeFlowViewPrivateMethods extends FlowViewPrivateMethods { }

export type VxeFlowViewEmits = []

export namespace VxeFlowViewDefines {
  export interface FlowViewEventParams extends VxeComponentEventParams {
    $flowView: VxeFlowViewConstructor
  }

  export type SaveFileFunction = (options: {
    filename: string
    type: string
    content: string | Blob
  }) => Promise<any>

  export type ReadFileFunction = (options?: {
    multiple?: boolean
    types?: string[]
    message?: boolean
  }) => Promise<{
    status: boolean
    files: FileList
    file: File
  }>
}

export type VxeFlowViewEventProps = {}

export interface VxeFlowViewListeners { }

export namespace VxeFlowViewEvents { }

export namespace VxeFlowViewSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeFlowViewSlots {
  default: (params: VxeFlowViewSlotTypes.DefaultSlotParams) => any
}

export const FlowView: typeof VxeFlowView
export default VxeFlowView
