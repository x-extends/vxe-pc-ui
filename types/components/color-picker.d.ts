import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeColorPicker: DefineVxeComponentApp<VxeColorPickerProps, VxeColorPickerEventProps, VxeColorPickerSlots>
export type VxeColorPickerComponent = DefineVxeComponentOptions<VxeColorPickerProps>

export type VxeColorPickerInstance = DefineVxeComponentInstance<{
  reactData: ColorPickerReactData
}, VxeColorPickerProps, VxeColorPickerPrivateComputed, VxeColorPickerMethods>

export type VxeColorPickerConstructor = VxeColorPickerInstance

export interface ColorPickerPrivateRef {
}
export interface VxeColorPickerPrivateRef extends ColorPickerPrivateRef { }

export namespace VxeColorPickerPropTypes {
}

export interface VxeColorPickerProps {
}

export interface ColorPickerPrivateComputed {
}
export interface VxeColorPickerPrivateComputed extends ColorPickerPrivateComputed { }

export interface ColorPickerReactData {
}

export interface ColorPickerMethods {
}
export interface VxeColorPickerMethods extends ColorPickerMethods { }

export interface ColorPickerPrivateMethods { }
export interface VxeColorPickerPrivateMethods extends ColorPickerPrivateMethods { }

export type VxeColorPickerEmits = []

export namespace VxeColorPickerDefines {
  export interface ColorPickerEventParams extends VxeComponentEventParams {
    $colorPicker: VxeColorPickerConstructor
  }
}

export type VxeColorPickerEventProps = {}

export interface VxeColorPickerListeners { }

export namespace VxeColorPickerEvents { }

export namespace VxeColorPickerSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeColorPickerSlots {
  default?: (params: VxeColorPickerSlotTypes.DefaultSlotParams) => any
}

export const ColorPicker: typeof VxeColorPicker
export default VxeColorPicker
