import { CreateElement } from 'vue'
import { NormalizedScopedSlot } from 'vue/types/vnode'
import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, ValueOf, VxeComponentSlotType, VxeComponentAlignType } from '@vxe-ui/core'
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

  export interface TaskViewScaleConfig {
    /**
     * 年配置
     */
    year?: VxeGanttDefines.ScaleDefaultOptions
    /**
     * 季度配置
     */
    quarter?: VxeGanttDefines.ScaleDefaultOptions
    /**
     * 月配置
     */
    month?: VxeGanttDefines.ScaleDefaultOptions
    /**
     * 周配置
     */
    week?: VxeGanttDefines.ScaleWeekOptions
    /**
     * 星期配置
     */
    day?: VxeGanttDefines.ScaleDefaultOptions
    /**
     * 天配置
     */
    date?: VxeGanttDefines.ScaleDefaultOptions
    /**
     * 小时配置
     */
    hour?: VxeGanttDefines.ScaleDefaultOptions
    /**
     * 分钟配置
     */
    minute?: VxeGanttDefines.ScaleDefaultOptions
    /**
     * 秒配置
     */
    second?: VxeGanttDefines.ScaleDefaultOptions
  }

  export interface TaskViewConfig<D = any> {
    /**
     * 高亮此刻线
     */
    showNowLine?: boolean
    /**
     * 日期轴配置项，可以通过 TaskViewScaleConfig.scaleUnit 指定渲染单位
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
      /**
       * 给行附加 className
       */
      rowClassName?: string | ((params: {
        source: string
        type: string
        row: D
        rowIndex: number
        $rowIndex: number
        _rowIndex: number
      }) => void | null | string | { [key: string]: boolean | null | undefined })
      /**
       * 行样式
       */
      rowStyle?: ((params: {
        source: string
        type: string
        row: D
        rowIndex: number
        $rowIndex: number
        _rowIndex: number
      }) => Partial<CSSStyleDeclaration>)
      /**
       * 给单元格附加 className
       */
      cellClassName?: string | ((params: {
        source: string
        type: string
        dateObj: VxeGanttDefines.ScaleDateObj
        column?: VxeGanttDefines.ViewColumn<D>
        row: D
        rowIndex: number
        $rowIndex: number
        _rowIndex: number
      }) => void | null | string | { [key: string]: boolean | null | undefined })
      /**
       * 单元格样式
       */
      cellStyle?: ((params: {
        source: string
        type: string
        dateObj: VxeGanttDefines.ScaleDateObj
        column?: VxeGanttDefines.ViewColumn<D>
        row: D
        rowIndex: number
        $rowIndex: number
        _rowIndex: number
      }) => Partial<CSSStyleDeclaration>)
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

  interface BarStyleConfig {
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
    barStyle?: BarStyleConfig | ((params: {
      $gantt: VxeGanttConstructor<D>
      row: D
    }) => BarStyleConfig)
    /**
     * 是否启用拖拽移动日期
     */
    drag?: boolean
    /**
     * 是否启用拖拽调整日期
     */
    resize?: boolean
  }
  export interface TaskBarResizeConfig<D = any> {
    /**
     * 是否允许拖拽调整任务条起始日期
     */
    allowStart?: boolean
    /**
     * 是否允许拖拽调整任务条结束日期
     */
    allowEnd?: boolean
    /**
     * 拖拽开始时是否允许行拖拽调整任务条日期的方法，该方法的返回值用来决定是否允许被拖拽
     */
    resizeStartMethod?(params: {
      $gantt: VxeGanttConstructor<D>
      row: D
    }): boolean
    /**
     * 拖拽结束时是否允许行拖拽调整任务条日期的方法，该方法的返回值用来决定是否允许被拖拽调整日期范围
     */
    resizeEndMethod?(params: {
      $gantt: VxeGanttConstructor<D>
      row: D
    }): Promise<boolean> | boolean
  }
  export interface TaskBarDragConfig<D = any> {
    /**
     * 拖拽开始时是否允许行拖拽移动任务条日期的方法，该方法的返回值用来决定是否允许被拖拽
     */
    dragStartMethod?(params: {
      $gantt: VxeGanttConstructor<D>
      row: D
    }): boolean
    /**
     * 拖拽结束时是否允许行拖拽移动任务条日期的方法，该方法的返回值用来决定是否允许被拖拽移动到指定日期
     */
    dragEndMethod?(params: {
      $gantt: VxeGanttConstructor<D>
      row: D
    }): Promise<boolean> | boolean
  }
}

export interface VxeGanttProps<D = any> extends Omit<VxeGridProps<D>, 'layouts'> {
  layouts?: VxeGanttPropTypes.Layouts
  taskConfig?: VxeGanttPropTypes.TaskConfig
  taskViewScaleConfig?: VxeGanttPropTypes.TaskViewScaleConfig
  taskViewConfig?: VxeGanttPropTypes.TaskViewConfig<D>
  taskSplitConfig?: VxeGanttPropTypes.TaskSplitConfig
  taskBarConfig?: VxeGanttPropTypes.TaskBarConfig<D>
  taskBarResizeConfig?: VxeGanttPropTypes.TaskBarResizeConfig<D>
  taskBarDragConfig?: VxeGanttPropTypes.TaskBarDragConfig<D>
}

export interface GanttPrivateComputed<D = any> extends GridPrivateComputed<D> {
  computeTaskOpts: VxeGanttPropTypes.TaskConfig
  computeTaskViewOpts: VxeGanttPropTypes.TaskViewConfig<D>
  computeTaskViewScaleOpts: VxeGanttPropTypes.TaskViewScaleConfig
  computeTaskBarOpts: VxeGanttPropTypes.TaskBarConfig<D>
  computeTaskBarDragOpts: VxeGanttPropTypes.TaskBarDragConfig<D>
  computeTaskBarResizeOpts: VxeGanttPropTypes.TaskBarResizeConfig<D>
  computeTaskSplitOpts: VxeGanttPropTypes.TaskSplitConfig
  computeTaskScaleConfs: VxeGanttDefines.ColumnScaleType[] | VxeGanttDefines.ColumnScaleConfig[] | undefined
  computeScaleUnit: VxeGanttDefines.ColumnScaleType
  computeMinScale: VxeGanttDefines.ColumnScaleObj
  computeWeekScale: VxeGanttDefines.ColumnScaleObj | null | undefined
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
  taskScaleList: VxeGanttDefines.ColumnScaleObj[]
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

  /**
   * @private
   */
  handleTaskCellClickEvent(evnt: MouseEvent, params: VxeGanttDefines.TaskCellClickParams): void
  /**
   * @private
   */
  handleTaskCellDblclickEvent(evnt: MouseEvent, params: VxeGanttDefines.TaskCellClickParams): void
  /**
   * @private
   */
  handleTaskHeaderContextmenuEvent(evnt: Event, params: VxeGanttDefines.TaskHeaderContextmenuParams): void
  /**
   * @private
   */
  handleTaskBodyContextmenuEvent(evnt: Event, params: VxeGanttDefines.TaskBodyContextmenuParams): void
  /**
   * @private
   */
  handleTaskFooterContextmenuEvent(evnt: Event, params: VxeGanttDefines.TaskFooterContextmenuParams): void
  /**
   * @private
   */
  handleTaskBarContextmenuEvent(evnt: Event, params: VxeGanttDefines.TaskBarContextmenuParams): void
  /**
   * @private
   */
  handleTaskBarClickEvent(evnt: MouseEvent, params: VxeGanttDefines.TaskBarClickParams): void
  /**
   * @private
   */
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
  'task-bar-dblclick',
  'task-view-cell-click',
  'task-view-cell-dblclick'
]

export namespace VxeGanttDefines {
  export interface GanttEventParams<D = any> extends VxeComponentEventParams {
    $gantt: VxeGanttConstructor<D>
  }

  export type LayoutKey = 'Form' | 'Toolbar' | 'Top' | 'Gantt' | 'Bottom' | 'Pager'

  export interface GroupColumn<D = any> {
    scaleItem: ColumnScaleObj
    columns: ViewColumn<D>[]
  }

  export interface ViewColumn<D = any> {
    field: string
    title: string
    dateObj: VxeGanttDefines.ScaleDateObj
    childCount?: number
    children?: ViewColumn<D>[]
  }

  export interface ScaleDateObj {
    date: Date
    yy: string
    M: string
    d: string
    H: string
    m: string
    s: string
    q: number
    W: number
    e: number
    E: number
  }

  export interface ScaleDefaultOptions {
    /**
     * 自定义时间轴-列头单元格标题
     */
    titleMethod?: (params: VxeGanttSlotTypes.TaskViewCellTitleSlotParams) => string | number
    /**
     * 自定义时间轴-自定义标题日期格式
     */
    titleFormat?: string
    /**
     * 自定义时间轴-列头单元格样式
     */
    headerCellStyle?: CSSStyleDeclaration | ((params: VxeGanttSlotTypes.TaskViewHeaderCellStyleSlotParams) => Partial<CSSStyleDeclaration>)
    /**
     * 自定义插槽模板
     */
    slots?: {
      /**
       * 自定义标题
       */
      title?: string | ((params: VxeGanttSlotTypes.TaskViewCellTitleSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
    }
  }

  export interface ScaleWeekOptions extends ScaleDefaultOptions {
    /**
     * 设置每周的起始日期是星期几
     */
    startDay?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  }

  /**
   * 日期轴类型
   */
  export type ColumnScaleType = 'second' | 'minute' | 'hour' | 'date' | 'day' | 'week' | 'month' | 'quarter' | 'year'

   export interface ColumnScaleConfig extends ScaleDefaultOptions, ScaleWeekOptions {
    type: ColumnScaleType
    align?: VxeComponentAlignType
  }

  export interface ColumnScaleObj extends ScaleDefaultOptions, ScaleWeekOptions {
    type: ColumnScaleType
    align?: VxeComponentAlignType
    level: number
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

  export interface TaskHeaderContextmenuParams<D = any> {
    source: string
    type: string
    column: ViewColumn<D>
    $rowIndex: number
  }
  export interface TaskBodyContextmenuParams<D = any> {
    source: string
    type: string
    row?: D
    rowIndex: number
    $rowIndex: number
    _rowIndex: number
    column?: ViewColumn<D>
  }
  export interface TaskFooterContextmenuParams<D = any> {
    source: string
    type: string
    column?: ViewColumn<D>
    $rowIndex: number
  }
  export interface TaskBarContextmenuParams<D = any> {
    source: string
    type: string
    row: D
    rowIndex: number
    $rowIndex: number
    _rowIndex: number
  }

  export interface TaskViewCellClickEventParams<D = any> extends GanttEventParams {
    row: D
    column: ViewColumn<D>
  }
  export interface TaskViewCellDblClickEventParams<D = any> extends TaskViewCellClickEventParams<D> {}
}

export interface VxeGanttEventProps<D = any> extends VxeGridEventProps<D> {
  onTaskCellClick?: VxeGanttEvents.TaskCellClick<D>
  onTaskCellDblClick?: VxeGanttEvents.TaskCellDblClick<D>
  onTaskBarClick?: VxeGanttEvents.TaskBarClick<D>
  onTaskBarDblClick?: VxeGanttEvents.TaskBarDblClick<D>
  onTaskViewCellClick?: VxeGanttEvents.TaskViewCellClick<D>
  onTaskViewCellDblClick?: VxeGanttEvents.TaskViewCellDblClick<D>
}

export interface VxeGanttListeners<D = any> extends VxeGridListeners<D> {
  taskCellClick?: VxeGanttEvents.TaskCellClick<D>
  taskCellDblClick?: VxeGanttEvents.TaskCellDblClick<D>
  taskBarClick?: VxeGanttEvents.TaskBarClick<D>
  taskBarDblClick?: VxeGanttEvents.TaskBarDblClick<D>
  taskViewCellClick?: VxeGanttEvents.TaskViewCellClick<D>
  taskViewCellDblClick?: VxeGanttEvents.TaskViewCellDblClick<D>
}

export namespace VxeGanttEvents {
  export type TaskCellClick<D = any> = (params: VxeGanttDefines.TaskCellClickEventParams<D>) => void
  export type TaskCellDblClick<D = any> = (params: VxeGanttDefines.TaskCellDblClickEventParams<D>) => void
  export type TaskBarClick<D = any> = (params: VxeGanttDefines.TaskBarClickEventParams<D>) => void
  export type TaskBarDblClick<D = any> = (params: VxeGanttDefines.TaskBarDblClickEventParams<D>) => void
  export type TaskViewCellClick<D = any> = (params: VxeGanttDefines.TaskViewCellClickEventParams<D>) => void
  export type TaskViewCellDblClick<D = any> = (params: VxeGanttDefines.TaskViewCellDblClickEventParams<D>) => void
}

export namespace VxeGanttSlotTypes {
  export interface DefaultSlotParams<D = any> {
    $gantt: VxeGanttConstructor<D>
  }

  export interface TaskBarSlotParams<D = any> {
    row: D
  }

  export interface TaskViewCellTitleSlotParams {
    title: string | number
    dateObj: VxeGanttDefines.ScaleDateObj
    scaleObj: VxeGanttDefines.ColumnScaleObj
    $rowIndex: number
  }
  export interface TaskViewHeaderCellStyleSlotParams extends TaskViewCellTitleSlotParams {}

  export interface TaskViewCellStyleSlotParams<D = any> {
    source: string
    type: string
    row?: D
    rowIndex: number
    $rowIndex: number
    _rowIndex: number
    column?: VxeGanttDefines.ViewColumn<D>
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
export * from './gantt-plugins'

export const Gantt: typeof VxeGantt
export default VxeGantt
