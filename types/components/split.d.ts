import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'
import { VxeSplitItemProps, VxeSplitItemPropTypes } from './split-item'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeSplit: DefineVxeComponentApp<VxeSplitProps, VxeSplitEventProps, VxeSplitSlots>
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
  height?: VxeSplitPropTypes.Height
  width?: VxeSplitPropTypes.Width
  padding?: VxeSplitPropTypes.Padding
  vertical?: VxeSplitPropTypes.Vertical
  border?: VxeSplitPropTypes.Border
  itemConfig?: VxeSplitPropTypes.ItemConfig
  barConfig?: VxeSplitPropTypes.BarConfig
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
  staticItems: VxeSplitDefines.ChunkConfig[]
}

export interface SplitInternalData {
}

export interface SplitMethods {
  dispatchEvent(type: ValueOf<VxeSplitEmits>, params: Record<string, any>, evnt: Event | null): void
  recalculate(): Promise<void>
}
export interface VxeSplitMethods extends SplitMethods { }

export interface SplitPrivateMethods { }
export interface VxeSplitPrivateMethods extends SplitPrivateMethods { }

export type VxeSplitEmits = [
  'action-dblclick',
  'action-click',
  'resize-start',
  'resize-drag',
  'resize-end'
]

export namespace VxeSplitDefines {
  export interface SplitEventParams extends VxeComponentEventParams {
    $split: VxeSplitConstructor
  }

  export interface ChunkConfig extends VxeSplitItemProps {
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
    item: ChunkConfig
    name: VxeSplitItemPropTypes.Name
    targetItem: ChunkConfig
    targetName: VxeSplitItemPropTypes.Name
    expanded: boolean
  }
  export interface ActionDblclickEventParams extends ActionClickEventParams {}
  export interface ResizeStartEventParams extends SplitEventParams {
    item: ChunkConfig
    name: VxeSplitItemPropTypes.Name
  }
  export interface ResizeDragEventParams extends SplitEventParams {
    item: ChunkConfig
    name: VxeSplitItemPropTypes.Name
    offsetHeight: number
    resizeHeight: number
    offsetWidth: number
    resizeWidth: number
  }
  export interface ResizeEndEventParams extends SplitEventParams {
    item: ChunkConfig
    name: VxeSplitItemPropTypes.Name
    resizeHeight: number
    resizeWidth: number
  }
}

export type VxeSplitEventProps = {
  onActionDblclick?: VxeSplitEvents.ActionDblclick
  onActionClick?: VxeSplitEvents.ActionClick
  onResizeStart?: VxeSplitEvents.ResizeStart
  onResizeDrag?: VxeSplitEvents.ResizeDrag
  onResizeEnd?: VxeSplitEvents.ResizeEnd
}

export interface VxeSplitListeners {
  actionDblclick?: VxeSplitEvents.ActionDblclick
  actionClick?: VxeSplitEvents.ActionClick
  resizeStart?: VxeSplitEvents.ResizeStart
  resizeDrag?: VxeSplitEvents.ResizeDrag
  resizeEnd?: VxeSplitEvents.ResizeEnd
}

export namespace VxeSplitEvents {
  export type ActionDblclick = (params: VxeSplitDefines.ActionDblclickEventParams) => void
  export type ActionClick = (params: VxeSplitDefines.ActionClickEventParams) => void
  export type ResizeStart = (params: VxeSplitDefines.ResizeStartEventParams) => void
  export type ResizeDrag = (params: VxeSplitDefines.ResizeDragEventParams) => void
  export type ResizeEnd = (params: VxeSplitDefines.ResizeEndEventParams) => void
}

export namespace VxeSplitSlotTypes {
  export interface DefaultSlotParams {
  }
}

export interface VxeSplitSlots {
  default?: (params: VxeSplitSlotTypes.DefaultSlotParams) => any
}

export const Split: typeof VxeSplit
export default VxeSplit
