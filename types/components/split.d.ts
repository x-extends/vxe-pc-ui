import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'
import { VxeSplitPaneProps, VxeSplitPanePropTypes } from './split-pane'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeSplit: DefineVxeComponentApp<VxeSplitProps, VxeSplitEventProps, VxeSplitSlots, VxeSplitMethods>
export type VxeSplitComponent = DefineVxeComponentOptions<VxeSplitProps>

export type VxeSplitInstance = DefineVxeComponentInstance<{
  reactData: SplitReactData
}, VxeSplitProps, VxeSplitPrivateComputed, VxeSplitMethods>

export type VxeSplitConstructor = VxeSplitInstance

export interface SplitPrivateRef {
}
export interface VxeSplitPrivateRef extends SplitPrivateRef { }

export namespace VxeSplitPropTypes {
  export type Height = string | number
  export type Width = string | number
  export type Padding = boolean
  export type Vertical = boolean
  export type Border = boolean
  export type Resize = boolean
  export type Items = VxeSplitPaneProps[]
  export interface ItemConfig {
    minWidth?: string | number
    minHeight?: string | number
  }
  export interface BarConfig {
    width?: string | number
    height?: string | number
  }
  export interface ActionConfig {
    /**
     * 是否启用
     */
    enabled?: boolean
    /**
     * 触发方式
     */
    trigger?: 'click' | 'dblclick' | '' | null
    /**
     * 折叠方向
     * 支持向前和向后折叠
     */
    direction?: 'prev' | 'next' | '' | null
    /**
     * 自定义展开图标
     */
    openIcon?: string
    /**
     * 自定义关闭图标
     */
    closeIcon?: string
  }
}

export type VxeSplitProps = {
  /**
   * 高度
   */
  height?: VxeSplitPropTypes.Height
  /**
   * 宽度
   */
  width?: VxeSplitPropTypes.Width
  /**
   * 显示边距
   */
  padding?: VxeSplitPropTypes.Padding
  /**
   * 使用垂直布局
   */
  vertical?: VxeSplitPropTypes.Vertical
  /**
   * 是否带有边框
   */
  border?: VxeSplitPropTypes.Border
  /**
   * 是否允许拖拽
   */
  resize?: VxeSplitPropTypes.Resize
  /**
   * 面板列表
   */
  items?: VxeSplitPropTypes.Items
  /**
   * 面板的配置项
   */
  itemConfig?: VxeSplitPropTypes.ItemConfig
  /**
   * 拖动条配置项
   */
  barConfig?: VxeSplitPropTypes.BarConfig
  /**
   * 折叠按钮配置项
   */
  actionConfig?: VxeSplitPropTypes.ActionConfig
}

export interface SplitPrivateComputed {
  computeItemOpts: VxeSplitPropTypes.ItemConfig
  computeBarOpts: VxeSplitPropTypes.BarConfig
  computeActionOpts: VxeSplitPropTypes.ActionConfig
  computeIsFoldNext: boolean
}
export interface VxeSplitPrivateComputed extends SplitPrivateComputed { }

export interface SplitReactData {
  staticItems: VxeSplitDefines.PaneConfig[]
  itemList: VxeSplitDefines.PaneConfig[]
}

export interface SplitInternalData {
  wrapperWidth: number
  wrapperHeight: number
}

export interface SplitMethods {
  dispatchEvent(type: ValueOf<VxeSplitEmits>, params: Record<string, any>, evnt: Event | null): void
  /**
   * 重新计算布局
   */
  recalculate(): Promise<void>
  /**
   * 重置面板
   */
  reset(): Promise<void>
  /**
   * 加载面板配置
   */
  loadItem(list: VxeSplitPaneProps[]): Promise<void>
  /**
   * 重新加载面板配置，区别就是会重置
   */
  reloadItem(list: VxeSplitPaneProps[]): Promise<void>
}
export interface VxeSplitMethods extends SplitMethods { }

export interface SplitPrivateMethods { }
export interface VxeSplitPrivateMethods extends SplitPrivateMethods { }

export type VxeSplitEmits = [
  'action-dblclick',
  'action-click',
  'toggle-expand',
  'resize-start',
  'resize-drag',
  'resize-end'
]

export namespace VxeSplitDefines {
  export interface SplitEventParams extends VxeComponentEventParams {
    $split: VxeSplitConstructor
  }

  export interface PaneConfig extends VxeSplitPaneProps {
    id: string
    isVisible: boolean
    isExpand: boolean
    renderWidth: number
    foldWidth: number
    resizeWidth: number
    renderHeight: number
    resizeHeight: number
    foldHeight: number
  }

  export interface ActionClickEventParams extends SplitEventParams {
    item: PaneConfig
    name: VxeSplitPanePropTypes.Name
  }
  export interface ActionDblclickEventParams extends ActionClickEventParams {}
  export interface ToggleExpandEventParams extends SplitEventParams {
    item: PaneConfig
    name: VxeSplitPanePropTypes.Name
    targetItem: PaneConfig
    targetName: VxeSplitPanePropTypes.Name
    expanded: boolean
  }
  export interface ResizeStartEventParams extends SplitEventParams {
    item: PaneConfig
    name: VxeSplitPanePropTypes.Name
  }
  export interface ResizeDragEventParams extends SplitEventParams {
    item: PaneConfig
    name: VxeSplitPanePropTypes.Name
    offsetHeight: number
    resizeHeight: number
    offsetWidth: number
    resizeWidth: number
  }
  export interface ResizeEndEventParams extends SplitEventParams {
    item: PaneConfig
    name: VxeSplitPanePropTypes.Name
    resizeHeight: number
    resizeWidth: number
  }
}

export type VxeSplitEventProps = {
  onActionDblclick?: VxeSplitEvents.ActionDblclick
  onActionClick?: VxeSplitEvents.ActionClick
  onToggleExpand?: VxeSplitEvents.ToggleExpand
  onResizeStart?: VxeSplitEvents.ResizeStart
  onResizeDrag?: VxeSplitEvents.ResizeDrag
  onResizeEnd?: VxeSplitEvents.ResizeEnd
}

export interface VxeSplitListeners {
  actionDblclick?: VxeSplitEvents.ActionDblclick
  actionClick?: VxeSplitEvents.ActionClick
  toggleExpand?: VxeSplitEvents.ToggleExpand
  resizeStart?: VxeSplitEvents.ResizeStart
  resizeDrag?: VxeSplitEvents.ResizeDrag
  resizeEnd?: VxeSplitEvents.ResizeEnd
}

export namespace VxeSplitEvents {
  export type ActionDblclick = (params: VxeSplitDefines.ActionDblclickEventParams) => void
  export type ActionClick = (params: VxeSplitDefines.ActionClickEventParams) => void
  export type ToggleExpand = (params: VxeSplitDefines.ToggleExpandEventParams) => void
  export type ResizeStart = (params: VxeSplitDefines.ResizeStartEventParams) => void
  export type ResizeDrag = (params: VxeSplitDefines.ResizeDragEventParams) => void
  export type ResizeEnd = (params: VxeSplitDefines.ResizeEndEventParams) => void
}

export namespace VxeSplitSlotTypes {
  export interface DefaultSlotParams {
  }
}

export interface VxeSplitSlots {
  /**
   * 自定义插槽模板
   */
  [key: string]: ((params: {
    name: VxeSplitPanePropTypes.Name
    isVisible: boolean
    isExpand: boolean
  }) => any) | undefined

  default?: (params: VxeSplitSlotTypes.DefaultSlotParams) => any
}

export const Split: typeof VxeSplit
export default VxeSplit
