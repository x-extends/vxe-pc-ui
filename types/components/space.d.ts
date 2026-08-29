import { RenderFunction, SetupContext, Ref } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentSizeType, VxeComponentBaseOptions, VxeComponentEventParams } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeSpace: DefineVxeComponentApp<VxeSpaceProps, VxeSpaceEventProps, VxeSpaceSlots, VxeSpaceMethods>
export type VxeSpaceComponent = DefineVxeComponentOptions<VxeSpaceProps, VxeSpaceEventProps>

export type VxeSpaceInstance = DefineVxeComponentInstance<VxeSpaceProps, VxeSpaceConstructor>

export interface VxeSpaceConstructor extends VxeComponentBaseOptions, VxeSpaceMethods {
  props: VxeSpaceProps
  context: SetupContext<VxeSpaceEmits>
  reactData: SpaceReactData
  getRefMaps(): SpacePrivateRef
  getComputeMaps(): SpacePrivateComputed
  renderVN: RenderFunction
}

export interface SpacePrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeSpacePrivateRef extends SpacePrivateRef { }

export namespace VxeSpacePropTypes {
  export type Size = VxeComponentSizeType
  export type Wrap = boolean
  export type Gap = number | string | number[] | VxeSpaceDefines.GapObj
  export type Vertical = boolean
  export type ClassName = string
  export type ItemClassName = string
  export type Separator = string
  export type Align = 'stretch' | 'start' | 'end' | 'center' | 'baseline' | '' | null
}

export interface VxeSpaceProps {
  size?: VxeSpacePropTypes.Size
  /**
   * 是否自动换行
   */
  wrap?: VxeSpacePropTypes.Wrap
  /**
   * 自定义间距
   */
  gap?: VxeSpacePropTypes.Gap
  /**
   * 是否垂直布局
   */
  vertical?: VxeSpacePropTypes.Vertical
  className?: VxeSpacePropTypes.ClassName
  itemClassName?: VxeSpacePropTypes.ItemClassName
  /**
   * 分隔符
   */
  separator?: VxeSpacePropTypes.Separator
  align?: VxeSpacePropTypes.Align
}

export interface SpacePrivateComputed {
}
export interface VxeSpacePrivateComputed extends SpacePrivateComputed { }

export interface SpaceReactData {
}

export interface SpaceMethods {
}
export interface VxeSpaceMethods extends SpaceMethods { }

export interface SpacePrivateMethods { }
export interface VxeSpacePrivateMethods extends SpacePrivateMethods { }

export type VxeSpaceEmits = [
]

export namespace VxeSpaceDefines {
  export interface GapObj {
    /**
     * 行间距
     */
    rowGap?: number | string
    /**
     * 列间距
     */
    columGap?: number | string
  }
  export interface SpaceEventParams extends VxeComponentEventParams {
    $space: VxeSpaceConstructor
  }
}

export type VxeSpaceEventProps = {
}

export interface VxeSpaceListeners {
}

export namespace VxeSpaceEvents {
}

export namespace VxeSpaceSlotTypes {
  export interface DefaultSlotParams {}
  export interface SeparatorSlotParams {}
}

export interface VxeSpaceSlots {
  default?: (params: VxeSpaceSlotTypes.DefaultSlotParams) => any
  separator?: (params: VxeSpaceSlotTypes.SeparatorSlotParams) => any
}

export const Space: typeof VxeSpace
export default VxeSpace
