import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, ValueOf, VxeComponentSizeType, VxeComponentIsVScrollbar } from '@vxe-ui/core'
import { VxeBacktopProps, VxeBacktopSlotTypes } from './backtop'
import { VxeScrollbarProps } from './scrollbar'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeLayoutBody: DefineVxeComponentApp<VxeLayoutBodyProps, VxeLayoutBodyEventProps, VxeLayoutBodySlots, VxeLayoutBodyMethods>
export type VxeLayoutBodyComponent = DefineVxeComponentOptions<VxeLayoutBodyProps>

export type VxeLayoutBodyInstance = DefineVxeComponentInstance<
  {
    internalData: LayoutBodyInternalData
    reactData: LayoutBodyReactData
  },
  VxeLayoutBodyProps,
  VxeLayoutBodyPrivateComputed,
  VxeLayoutBodyMethods
>

export type VxeLayoutBodyConstructor = VxeLayoutBodyInstance

export interface LayoutBodyPrivateRef {}
export interface VxeLayoutBodyPrivateRef extends LayoutBodyPrivateRef {}

export namespace VxeLayoutBodyPropTypes {
  export type Size = VxeComponentSizeType
  export type Loading = boolean
  export type Padding = boolean
  export type ShowBacktop = boolean
  export interface BacktopConfig extends Omit<VxeBacktopProps, 'target'> {}
  export type UseScrollbar = VxeComponentIsVScrollbar
  export interface ScrollbarConfig extends Pick<VxeScrollbarProps, 'xConfig' | 'yConfig' | 'padding' | 'autoHide' | 'fluentOverlay' | 'visible' | 'className' | 'viewAttrs' | 'viewClassName' | 'viewInnerClassName'> {
    /**
     * 滚动条宽度
     */
    width?: number | string
    /**
     * 滚动条高度
     */
    height?: number | string
  }
}
export interface VxeLayoutBodyProps {
  size?: VxeLayoutBodyPropTypes.Size
  /**
   * 加载中
   */
  loading?: VxeLayoutBodyPropTypes.Loading
  padding?: VxeLayoutBodyPropTypes.Padding
  showBacktop?: VxeLayoutBodyPropTypes.ShowBacktop
  backtopConfig?: VxeLayoutBodyPropTypes.BacktopConfig
  /**
   * 使用虚拟滚动条
   */
  useScrollbar?: VxeLayoutBodyPropTypes.UseScrollbar
  /**
   * 滚动条配置项
   */
  scrollbarConfig?: VxeLayoutBodyPropTypes.ScrollbarConfig
}

export interface LayoutBodyPrivateComputed {}
export interface VxeLayoutBodyPrivateComputed extends LayoutBodyPrivateComputed {}

export interface LayoutBodyInternalData {}
export interface LayoutBodyReactData {}

export interface LayoutBodyMethods {
  dispatchEvent(type: ValueOf<VxeLayoutBodyEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeLayoutBodyMethods extends LayoutBodyMethods {}

export interface LayoutBodyPrivateMethods {}
export interface VxeLayoutBodyPrivateMethods extends LayoutBodyPrivateMethods {}

export type VxeLayoutBodyEmits = []

export namespace VxeLayoutBodyDefines {
  export interface LayoutBodyEventParams extends VxeComponentEventParams {
    $layoutBody: VxeLayoutBodyConstructor
  }
}

export type VxeLayoutBodyEventProps = {}

export interface VxeLayoutBodyListeners {}

export namespace VxeLayoutBodyEvents {}

export namespace VxeLayoutBodySlotTypes {
  export interface DefaultSlotParams {}
  export interface BacktopSlotParams extends VxeBacktopSlotTypes.DefaultSlotParams {}
  export interface BacktopTopSlotParams extends VxeBacktopSlotTypes.TopSlotParams {}
  export interface BacktopBottomSlotParams extends VxeBacktopSlotTypes.BottomParams {}
}

export interface VxeLayoutBodySlots {
  default: (params: VxeLayoutBodySlotTypes.DefaultSlotParams) => any
  backtop: (params: VxeLayoutBodySlotTypes.BacktopSlotParams) => any
  backtopTop: (params: VxeLayoutBodySlotTypes.BacktopTopSlotParams) => any
  'backtop-top': (params: VxeLayoutBodySlotTypes.BacktopTopSlotParams) => any
  backtopBottom: (params: VxeLayoutBodySlotTypes.BacktopBottomSlotParams) => any
  'backtop-bottom': (params: VxeLayoutBodySlotTypes.BacktopBottomSlotParams) => any
}

export const LayoutBody: typeof VxeLayoutBody
export default VxeLayoutBody
