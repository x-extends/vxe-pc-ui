import { RenderFunction, SetupContext, ComputedRef } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'
import { GridPrivateRef, VxeGridProps, VxeGridPropTypes, GridPrivateComputed, GridReactData, GridInternalData, GridMethods, GridPrivateMethods, VxeGridEmits, VxeGridSlots, VxeGridListeners, VxeGridEventProps, VxeGridMethods } from './grid'
import { VxeTablePropTypes } from './table'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeGantt: DefineVxeComponentApp<VxeGanttProps, VxeGanttEventProps, VxeGanttSlots, VxeGanttMethods>
export type VxeGanttComponent = DefineVxeComponentOptions<VxeGanttProps, VxeGanttEventProps>

export type VxeGanttInstance<D = any> = DefineVxeComponentInstance<VxeGanttProps<D>, VxeGanttConstructor<D>>

export interface VxeGanttConstructor<D = any> extends VxeComponentBaseOptions, VxeGanttMethods<D> {
  props: VxeGanttProps
  context: SetupContext<VxeGanttEmits>
  reactData: GanttReactData
  internalData: GanttInternalData
  getRefMaps(): GanttPrivateRef
  getComputeMaps(): GanttPrivateComputed
  renderVN: RenderFunction
}

export interface GanttPrivateRef<D = any> extends GridPrivateRef<D> {
}
export interface VxeGanttPrivateRef<D = any> extends GanttPrivateRef<D> { }

export namespace VxeGanttPropTypes {
  export type Size = VxeGridPropTypes.Size
  export type Layouts = VxeGridPropTypes.Layouts
  export type Column<D = any> = VxeGridPropTypes.Column<D>
  export type Columns<D = any> = Column<D>[]
  export interface PagerConfig extends VxeGridPropTypes.PagerConfig {}
  export interface ProxyConfig<D = any> extends VxeGridPropTypes.ProxyConfig<D> {}
  export interface ToolbarConfig extends VxeGridPropTypes.ToolbarConfig {}
  export interface FormConfig extends VxeGridPropTypes.FormConfig {}
  export interface ZoomConfig extends VxeGridPropTypes.ZoomConfig {}

  export interface TaskConfig {
    /**
     * 标题的字段名
     */
    titleField?: string
    /**
     * 开始日期的字段名
     */
    startField?: string
    /**
     * 结束日期的字段名
     */
    endField?: string
    /**
     * 进度的字段名
     */
    progressField?: string
  }
  export interface TaskViewConfig<D = any> {
    /**
     * 视图的渲染模式
     */
    mode?: 'day' | 'week' | 'month' | 'quarter' | 'year'
    /**
     * 表格样式
     */
    tableStyle?: {
      width?: number | string
      minWidth?: number | string
      maxWidth?: number | string
    }
    /**
     * 视图样式
     */
    viewStyle?: {
      width?: number | string
      minWidth?: number | string
      maxWidth?: number | string
    }
  }
  export interface TaskBarConfig<D = any> {
    /**
     * 是否在进度条显示标题
     */
    showTitle?: boolean
    /**
     * 自定义标题的方法
     */
    titleMethod?(params: {
      title: string
      row: D
    }): string | number
  }
}

export interface VxeGanttProps<D = any> extends VxeGridProps<D> {
  taskConfig?: VxeGanttPropTypes.TaskConfig
  taskViewConfig?: VxeGanttPropTypes.TaskViewConfig
  taskBarConfig?: VxeGanttPropTypes.TaskBarConfig
}

export interface GanttPrivateComputed<D = any> extends GridPrivateComputed<D> {
  computeTaskOpts: ComputedRef<VxeGanttPropTypes.TaskConfig>
  computeTaskViewOpts: ComputedRef<VxeGanttPropTypes.TaskViewConfig>
  computeTaskBarOpts: ComputedRef<VxeGanttPropTypes.TaskBarConfig>
  computeTitleField: ComputedRef<string>
  computeStartField: ComputedRef<string>
  computeEndField: ComputedRef<string>
  computeProgressField: ComputedRef<string>
  computeScrollbarOpts: ComputedRef<VxeTablePropTypes.ScrollbarConfig>
  computeScrollbarXToTop: ComputedRef<boolean>
  computeScrollbarYToLeft: ComputedRef<boolean>
}
export interface VxeGanttPrivateComputed<D = any> extends GanttPrivateComputed<D> { }

export interface GanttReactData<D = any> extends GridReactData<D> {
}

export interface GanttInternalData extends GridInternalData {}

export interface GanttMethods<D = any> extends Omit<GridMethods<D>, 'dispatchEvent'> {
  dispatchEvent(type: ValueOf<VxeGanttEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeGanttMethods<D = any> extends GanttMethods<D>, Omit<VxeGridMethods<D>, 'dispatchEvent'> { }

export interface GanttPrivateMethods extends GridPrivateMethods {
}
export interface VxeGanttPrivateMethods extends GanttPrivateMethods { }

export type VxeGanttEmits = [
  ...VxeGridEmits
]

export namespace VxeGanttDefines {
  export interface GanttEventParams<D = any> extends VxeComponentEventParams {
    $gantt: VxeGanttConstructor<D>
  }

  export interface GroupHeaderColumn<D = any> extends VxeGanttPropTypes.Column<D> {
    children: VxeGanttPropTypes.Column<D>[]
  }
}

export interface VxeGanttEventProps<D = any> extends VxeGridEventProps<D> {}

export interface VxeGanttListeners<D = any> extends VxeGridListeners<D> {
}

export namespace VxeGanttEvents {
}

export namespace VxeGanttSlotTypes {
  export interface DefaultSlotParams<D = any> {
    $gantt: VxeGanttConstructor<D>
  }
}

export interface VxeGanttSlots<D = any> extends VxeGridSlots<D> {
}

export * from './gantt-module'

export const Gantt: typeof VxeGantt
export default VxeGantt
