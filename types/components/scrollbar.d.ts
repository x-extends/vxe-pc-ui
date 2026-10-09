import { RenderFunction, SetupContext, Ref } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeScrollbar: DefineVxeComponentApp<VxeScrollbarProps, VxeScrollbarEventProps, VxeScrollbarSlots, VxeScrollbarMethods>
export type VxeScrollbarComponent = DefineVxeComponentOptions<VxeScrollbarProps, VxeScrollbarEventProps>

export type VxeScrollbarInstance = DefineVxeComponentInstance<VxeScrollbarProps, VxeScrollbarConstructor>

export interface VxeScrollbarConstructor extends VxeComponentBaseOptions, VxeScrollbarMethods {
  props: VxeScrollbarProps
  context: SetupContext<VxeScrollbarEmits>
  reactData: ScrollbarReactData
  internalData: ScrollbarInternalData
  getRefMaps(): ScrollbarPrivateRef
  getComputeMaps(): ScrollbarPrivateComputed
  renderVN: RenderFunction
}

export interface ScrollbarPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeScrollbarPrivateRef extends ScrollbarPrivateRef { }

export namespace VxeScrollbarPropTypes {
  export type Id = number | string
  export type Width = number | string
  export type Height = number | string
  export type MinWidth = number | string
  export type MinHeight = number | string
  export type MaxWidth = number | string
  export type MaxHeight = number | string
  export type Loading = boolean
  export type Native = boolean
  export interface XConfig {
    height?: number | string
    // showArrows?: boolean
    /**
     * 是否自动隐藏滚动条
     */
    autoHide?: boolean
    visible?: 'auto' | 'hidden' | 'visible' | ''
    /**
     * 滚动到边界触发的阈值会触发 scroll-boundary 事件
     */
    threshold?: string | number
  }
  export interface YConfig {
    width?: number | string
    // showArrows?: boolean
    /**
     * 是否自动隐藏滚动条
     */
    autoHide?: boolean
    visible?: 'auto' | 'hidden' | 'visible' | ''
    /**
     * 滚动到边界触发的阈值会触发 scroll-boundary 事件
     */
    threshold?: string | number
  }
  export type ClassName = string
  export type ViewAttrs = Record<string, any>
  export type ViewClassName = string
  export type ViewInnerClassName = string
  export type AutoResize = boolean
  export type SyncResize = boolean
}

export interface VxeScrollbarProps {
  /**
   * ID
   */
  id?: VxeScrollbarPropTypes.Id
  /**
   * 容器宽度
   */
  width?: VxeScrollbarPropTypes.Width
  /**
   * 容器最小高度
   */
  height?: VxeScrollbarPropTypes.Height
  /**
   * 容器最小宽度
   */
  minWidth?: VxeScrollbarPropTypes.MinWidth
  /**
   * 容器最大高度
   */
  minHeight?: VxeScrollbarPropTypes.MinHeight
  /**
   * 容器最大宽度
   */
  maxWidth?: VxeScrollbarPropTypes.MaxWidth
  /**
   * 容器高度
   */
  maxHeight?: VxeScrollbarPropTypes.MaxHeight
  /**
   * 是否加载中
   */
  loading?: VxeScrollbarPropTypes.Loading
  /**
   * 是否使用原生滚动条
   */
  native?: VxeScrollbarPropTypes.Native
  /**
   * 纵向滚动条宽度
   */
  xConfig?: VxeScrollbarPropTypes.XConfig
  /**
   * 横向滚动条高度
   */
  yConfig?: VxeScrollbarPropTypes.YConfig
  /**
   * 给容器附加 class
   */
  className?: VxeScrollbarPropTypes.ClassName
  /**
   * 给视图元素附加属性
   */
  viewAttrs?: VxeScrollbarPropTypes.ViewAttrs
  /**
   * 给视图元素附加 class
   */
  viewClassName?: VxeScrollbarPropTypes.ViewClassName
  /**
   * 给视图内元素附加 class
   */
  viewInnerClassName?: VxeScrollbarPropTypes.ViewInnerClassName
  /**
   * 自动监听元素的变化去重新计算样式
   */
  autoResize?: VxeScrollbarPropTypes.AutoResize
  /**
   * 自动跟随某个属性的变化去重新计算表格，和手动调用 recalculate 方法是一样的效果（对于通过某个属性来更新内容时可能会用到）
   */
  syncResize?: VxeScrollbarPropTypes.SyncResize
}

export interface ScrollbarPrivateComputed {
}
export interface VxeScrollbarPrivateComputed extends ScrollbarPrivateComputed { }

export interface ScrollbarReactData {
  yThumbHeight: number
  xThumbWidth: number
}
export interface ScrollbarInternalData {
  resizeObserver?: ResizeObserver
  isThumbDrag?: boolean
  thumbDragOffset: number
  yThumbTop: number
  xThumbLeft: number
  lastScrollTop: number
  lastScrollLeft: number
}

export interface ScrollbarMethods {
  dispatchEvent(type: ValueOf<VxeScrollbarEmits>, params: Record<string, any>, evnt: Event | null): void
  /**
   * 滚动到指定位置
   */
  scrollTo(options: ScrollToOptions): void
  scrollTo(left: number, top: number): void
  /**
   * 滚动元素到可见位置
   */
  scrollIntoView(): void
  /**
   * 重新计算样式
   * 对于某些特殊场景可能会用到，比如更新内容
   */
  recalculate(): Promise<void>
}
export interface VxeScrollbarMethods extends ScrollbarMethods { }

export interface ScrollbarPrivateMethods { }
export interface VxeScrollbarPrivateMethods extends ScrollbarPrivateMethods { }

export type VxeScrollbarEmits = [
  'scroll',
  'scroll-boundary'
]

export namespace VxeScrollbarDefines {
  export interface ScrollbarEventParams extends VxeComponentEventParams {
    $scrollbar: VxeScrollbarConstructor
  }

  export interface ScrollEventParams extends ScrollbarEventParams {
    direction: 'top' | 'bottom' | 'left' | 'right'
    isTop: boolean
    isBottom: boolean
    isLeft: boolean
    isRight: boolean
    scrollTop: number
    scrollLeft: number
    clientWidth: number
    clientHeight: number
    scrollHeight: number
    scrollWidth: number
  }
  export interface ScrollBoundaryEventParams extends ScrollEventParams {}
}

export type VxeScrollbarEventProps = {
  onScroll?: VxeScrollbarEvents.Scroll
  onScrolllBoundary?: VxeScrollbarEvents.ScrollBoundary
}

export interface VxeScrollbarListeners {
  scroll?: VxeScrollbarEvents.Scroll
  scrolllBoundary?: VxeScrollbarEvents.ScrollBoundary
}

export namespace VxeScrollbarEvents {
  export type Scroll = (params: VxeScrollbarDefines.ScrollEventParams) => void
  export type ScrollBoundary = (params: VxeScrollbarDefines.ScrollBoundaryEventParams) => void
}

export namespace VxeScrollbarSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeScrollbarSlots {
  default?: (params: VxeScrollbarSlotTypes.DefaultSlotParams) => any
}

export const Scrollbar: typeof VxeScrollbar
export default VxeScrollbar
