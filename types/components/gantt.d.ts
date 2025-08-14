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
  export type Layouts = VxeGanttDefines.LayoutKey[] | VxeGanttDefines.LayoutKey[][]
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
  }

  export interface TaskSplitConfig {
    /**
     * 是否启用
     */
    enabled?: boolean
    /**
     * 是否允许拖拽调整视图宽度
     */
    resize?: boolean
    /**
     * 是否显示左侧表格的折叠按钮
     */
    showCollapseTableButton?: boolean
    /**
     * 是否显示右侧任务的折叠按钮
     */
    showCollapseTaskButton?: boolean
  }

  export interface TaskBarConfig<D = any> {
    /**
     * 是否显示进度条
     */
    showProgress?: boolean
    /**
     * 是否在任务条显示内容
     */
    showContent?: boolean
    /**
     * 自定义任务条内容方法
     */
    contentMethod?(params: {
      title: string
      progress?: string | number
      row: D
    }): string | number
    /**
     * 任务条样式
     */
    barStyle?: {
      /**
       * 圆角
       */
      round?: boolean
      /**
       * 任务条的背景颜色
       */
      bgColor?: string
      /**
       * 任务条的字体颜色
       */
      fontColor?: string
      /**
       * 已完成部分任务条的背景颜色
       */
      completedBgColor?: string
    }
  }
}

export interface VxeGanttProps<D = any> extends Omit<VxeGridProps<D>, 'layouts'> {
  layouts?: VxeGanttPropTypes.Layouts
  taskConfig?: VxeGanttPropTypes.TaskConfig
  taskViewConfig?: VxeGanttPropTypes.TaskViewConfig
  taskSplitConfig?: VxeGanttPropTypes.TaskSplitConfig
  taskBarConfig?: VxeGanttPropTypes.TaskBarConfig
}

export interface GanttPrivateComputed<D = any> extends GridPrivateComputed<D> {
  computeTaskOpts: ComputedRef<VxeGanttPropTypes.TaskConfig>
  computeTaskViewOpts: ComputedRef<VxeGanttPropTypes.TaskViewConfig>
  computeTaskBarOpts: ComputedRef<VxeGanttPropTypes.TaskBarConfig>
  computeTaskSplitOpts: ComputedRef<VxeGanttPropTypes.TaskSplitConfig>
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
  showLeftView: boolean
  showRightView: boolean
}

export interface GanttInternalData extends GridInternalData {
  resizeTableWidth: number
}

export interface GanttMethods<D = any> extends Omit<GridMethods<D>, 'dispatchEvent'> {
  dispatchEvent(type: ValueOf<VxeGanttEmits>, params: Record<string, any>, evnt: Event | null): void
  /**
   * 刷新任务视图
   */
  refreshTaskView(): Promise<any>
}
export interface VxeGanttMethods<D = any> extends GanttMethods<D>, Omit<VxeGridMethods<D>, 'dispatchEvent'> { }

export interface GanttPrivateMethods extends GridPrivateMethods {
  handleTaskCellClickEvent(evnt: MouseEvent, params: VxeGanttDefines.TaskCellClickParams): void
  handleTaskCellDblclickEvent(evnt: MouseEvent, params: VxeGanttDefines.TaskCellClickParams): void
  handleTaskBarClickEvent(evnt: MouseEvent, params: VxeGanttDefines.TaskBarClickParams): void
  handleTaskBarDblclickEvent(evnt: MouseEvent, params: VxeGanttDefines.TaskBarClickParams): void
}
export interface VxeGanttPrivateMethods extends GanttPrivateMethods {}

export type VxeGanttEmits = [
  ...VxeGridEmits,

  'task-cell-click',
  'task-cell-dblclick',
  'task-bar-click',
  'task-bar-dblclick'
]

export namespace VxeGanttDefines {
  export interface GanttEventParams<D = any> extends VxeComponentEventParams {
    $gantt: VxeGanttConstructor<D>
  }

  export type LayoutKey = 'Form' | 'Toolbar' | 'Top' | 'Gantt' | 'Bottom' | 'Pager'

  export interface GroupHeaderColumn<D = any> extends VxeGanttPropTypes.Column<D> {
    children: VxeGanttPropTypes.Column<D>[]
  }

  export interface RowCacheItem<D = any> {
    row: D
    rowid: string
    oLeftSize: number
    oWidthSize: number
  }

  export interface TaskCellClickParams<D = any> {
    row: D
    column: VxeGanttPropTypes.Column<D>
  }
  export interface TaskBarClickParams<D = any> {
    row: D
  }
  export interface TaskCellClickEventParams<D = any> extends TaskCellClickParams<D>, GanttEventParams {}
  export interface TaskCellDblClickEventParams<D = any> extends TaskCellClickEventParams<D> {}
  export interface TaskBarClickEventParams<D = any> extends TaskBarClickParams<D>, GanttEventParams {}
  export interface TaskBarDblClickEventParams<D = any> extends TaskBarClickEventParams<D> {}
}

export interface VxeGanttEventProps<D = any> extends VxeGridEventProps<D> {
  onTaskCellClick?: VxeGanttEvents.TaskCellClick<D>
  onTaskCellDblClick?: VxeGanttEvents.TaskCellDblClick<D>
  onTaskBarClick?: VxeGanttEvents.TaskBarClick<D>
  onTaskBarDblClick?: VxeGanttEvents.TaskBarDblClick<D>
}

export interface VxeGanttListeners<D = any> extends VxeGridListeners<D> {
  taskCellClick?: VxeGanttEvents.TaskCellClick<D>
  taskCellDblClick?: VxeGanttEvents.TaskCellDblClick<D>
  taskBarClick?: VxeGanttEvents.TaskBarClick<D>
  taskBarDblClick?: VxeGanttEvents.TaskBarDblClick<D>
}

export namespace VxeGanttEvents {
  export type TaskCellClick<D = any> = (params: VxeGanttDefines.TaskCellClickEventParams<D>) => void
  export type TaskCellDblClick<D = any> = (params: VxeGanttDefines.TaskCellDblClickEventParams<D>) => void
  export type TaskBarClick<D = any> = (params: VxeGanttDefines.TaskBarClickEventParams<D>) => void
  export type TaskBarDblClick<D = any> = (params: VxeGanttDefines.TaskBarDblClickEventParams<D>) => void
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
