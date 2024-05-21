import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeUpload: defineVxeComponent<VxeUploadProps, VxeUploadEventProps>
export type VxeUploadComponent = DefineComponent<VxeUploadProps, VxeUploadEmits>

export type VxeUploadInstance = ComponentPublicInstance<VxeUploadProps, VxeUploadConstructor>

export interface VxeUploadConstructor extends VxeComponentBaseOptions, VxeUploadMethods {
  props: VxeUploadProps
  context: SetupContext<VxeUploadEmits>
  reactData: UploadReactData
  getRefMaps(): UploadPrivateRef
  getComputeMaps(): UploadPrivateComputed
  renderVN: RenderFunction
}

export interface UploadPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeUploadPrivateRef extends UploadPrivateRef { }

export namespace VxeUploadPropTypes {
}

export type VxeUploadProps = {
}

export interface UploadPrivateComputed {
}
export interface VxeUploadPrivateComputed extends UploadPrivateComputed { }

export interface UploadReactData {
}

export interface UploadMethods {
  dispatchEvent(type: ValueOf<VxeUploadEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeUploadMethods extends UploadMethods { }

export interface UploadPrivateMethods { }
export interface VxeUploadPrivateMethods extends UploadPrivateMethods { }

export type VxeUploadEmits = []

export namespace VxeUploadDefines {
  export interface UploadEventParams extends VxeComponentEventParams {
    $upload: VxeUploadConstructor
  }
}

export type VxeUploadEventProps = {}

export interface VxeUploadListeners { }

export namespace VxeUploadEvents { }

export namespace VxeUploadSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeUploadSlots {
  default: (params: VxeUploadSlotTypes.DefaultSlotParams) => any
}

export const Upload: typeof VxeUpload
export default VxeUpload
