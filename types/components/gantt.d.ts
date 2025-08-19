import { CreateElement } from 'vue'
import { NormalizedScopedSlot } from 'vue/types/vnode'
import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, ValueOf, VxeComponentSlotType } from '@vxe-ui/core'
import { GridPrivateRef, VxeGridProps, VxeGridPropTypes, GridPrivateComputed, GridReactData, GridInternalData, GridMethods, GridPrivateMethods, VxeGridEmits, VxeGridSlots, VxeGridListeners, VxeGridEventProps, VxeGridMethods } from './grid'
import { VxeTablePropTypes } from './table'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types,@typescript-eslint/no-unused-vars */

export declare const VxeGantt: DefineVxeComponentApp<VxeGanttProps, VxeGanttEventProps, VxeGanttSlots, VxeGanttMethods>
export type VxeGanttComponent = DefineVxeComponentOptions<VxeGanttProps>

export type VxeGanttInstance<D = any> = DefineVxeComponentInstance<{
  reactData: GanttReactData<D>
  internalData: GanttInternalData
}, VxeGanttProps<D>, VxeGanttPrivateComputed<D>, VxeGanttMethods<D>>

export type VxeGanttConstructor<D = any> = VxeGanttInstance<D>

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
    /**
     * 自定义解析日期的格式
     */
    dateFormat?: string
  }

  export interface TaskViewConfig<D = any> {
    mode?: string
    /**
     * 日期列头颗粒度配置
     */
    scales?: VxeGanttDefines.ColumnScaleType[] | VxeGanttDefines.ColumnScaleConfig[]
    /**
     * 表格样式
     */
    tableStyle?: {
      /**
       * 边框
       */
      border?: VxeTablePropTypes.Border
      /**
       * 宽度
       */
      width?: number | string
      minWidth?: number | string
      maxWidth?: number | string
    }
    /**
     * 任务视图样式
     */
    viewStyle?: {
      /**
       * 边框
       */
      border?: VxeTablePropTypes.Border
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
  computeTaskOpts: VxeGanttPropTypes.TaskConfig
  computeTaskViewOpts: VxeGanttPropTypes.TaskViewConfig
  computeTaskBarOpts: VxeGanttPropTypes.TaskBarConfig
  computeTaskSplitOpts: VxeGanttPropTypes.TaskSplitConfig
  computeTitleField: string
  computeStartField: string
  computeEndField: string
  computeProgressField: string
  computeScrollbarOpts: VxeTablePropTypes.ScrollbarConfig
  computeScrollbarXToTop: boolean
  computeScrollbarYToLeft: boolean
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

  /**
   * 表格视图是否显示
   */
  hasTableViewVisible(): boolean
  /**
   * 显示表格视图
   */
  showTableView(): Promise<void>
  /**
   * 隐藏表格视图
   */
  hideTableView(): Promise<void>
  /**
   * 任务视图是否显示
   */
  hasTaskViewVisible(): boolean
  /**
   * 显示任务视图
   */
  showTaskView(): Promise<void>
  /**
   * 隐藏任务视图
   */
  hideTaskView(): Promise<void>
}
export interface VxeGanttMethods<D = any> extends GanttMethods<D>, Omit<VxeGridMethods<D>, 'dispatchEvent'> { }

export interface GanttPrivateMethods extends GridPrivateMethods {
  callSlot<T = any>(slotFunc: NormalizedScopedSlot | ((params: T) => VxeComponentSlotType | VxeComponentSlotType[]) | string | null, params: T, h: CreateElement): VxeComponentSlotType[]

  handleTaskCellClickEvent(evnt: MouseEvent, params: VxeGanttDefines.TaskCellClickParams): void
  handleTaskCellDblclickEvent(evnt: MouseEvent, params: VxeGanttDefines.TaskCellClickParams): void
  handleTaskBarClickEvent(evnt: MouseEvent, params: VxeGanttDefines.TaskBarClickParams): void
  handleTaskBarDblclickEvent(evnt: MouseEvent, params: VxeGanttDefines.TaskBarClickParams): void
}
export interface VxeGanttPrivateMethods extends GanttPrivateMethods {
  handleTaskClickEvent(evnt: MouseEvent, params: {
    row: any
  }): void
}

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

  /**
   * 日期轴类型
   */
  export type ColumnScaleType = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year' | '' | null

  export interface ColumnScaleConfig {
    type: ColumnScaleType
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

  export interface TaskBarSlotParams<D = any> {
    row: D
  }
}

export interface VxeGanttSlots<D = any> extends VxeGridSlots<D> {
  /**
   * 自定义任务条模板
   */
  taskBar?(params: VxeGanttSlotTypes.TaskBarSlotParams<D>): any
  'task-bar'?(params: VxeGanttSlotTypes.TaskBarSlotParams<D>): any
}

export * from './gantt-module'

export const Gantt: typeof VxeGantt
export default VxeGantt
