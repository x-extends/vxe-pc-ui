import { RenderFunction, SetupContext, Ref, ComputedRef, ComponentPublicInstance, VNode } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentBaseOptions, VxeComponentEventParams, VxeComponentSizeType, ValueOf, VxeGlobalConfig, VxeComponentStyleType, VxeComponentSlotType, VxeComponentAlignType } from '@vxe-ui/core'
import { VxeColumnPropTypes, VxeColumnProps, VxeColumnSlotTypes } from './column'
import { VxeTableProDefines, VxeTableProEmits } from './table-plugins'
import { VxeGridConstructor } from './grid'
import { VxeTooltipInstance, VxeTooltipPropTypes } from './tooltip'
import { VxeModalPropTypes } from './modal'
import { VxeDrawerPropTypes } from './drawer'
import { VxeToolbarConstructor, VxeToolbarInstance } from './toolbar'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeTable: DefineVxeComponentApp<VxeTableProps, VxeTableEventProps, VxeTableSlots>
export type VxeTableComponent = DefineVxeComponentOptions<VxeTableProps, VxeTableEventProps>

export type VxeTableInstance<D = any> = DefineVxeComponentInstance<VxeTableProps<D>, VxeTableConstructor>

export interface VxeTableConstructor<D = any> extends VxeComponentBaseOptions, VxeTableMethods {
  props: VxeTableProps
  context: SetupContext<VxeTableEmits>
  reactData: TableReactData
  internalData: TableInternalData<D>
  getRefMaps(): TablePrivateRef
  getComputeMaps(): TablePrivateComputed
  renderVN: RenderFunction

  xegrid: VxeGridConstructor<D> | null
}

export interface TablePrivateRef {
  refElem: Ref<HTMLDivElement>
  refTooltip: Ref<VxeTooltipInstance>
  refValidTooltip: Ref<VxeTooltipInstance>
  refTableFilter: Ref<ComponentPublicInstance>
  refTableCustom: Ref<ComponentPublicInstance>
  refTableMenu: Ref<any>
  refTableHeader: Ref<ComponentPublicInstance>
  refTableBody: Ref<ComponentPublicInstance>
  refTableFooter: Ref<ComponentPublicInstance>
  refTableLeftHeader: Ref<ComponentPublicInstance>
  refTableLeftBody: Ref<ComponentPublicInstance>
  refTableLeftFooter: Ref<ComponentPublicInstance>
  refTableRightHeader: Ref<ComponentPublicInstance>
  refTableRightBody: Ref<ComponentPublicInstance>
  refTableRightFooter: Ref<ComponentPublicInstance>
  refLeftContainer: Ref<HTMLDivElement>
  refRightContainer: Ref<HTMLDivElement>
  refColResizeBar: Ref<HTMLDivElement>
  refRowResizeBar: Ref<HTMLDivElement>
  refScrollXVirtualElem: Ref<HTMLDivElement | undefined>
  refScrollYVirtualElem: Ref<HTMLDivElement | undefined>
  refScrollXHandleElem: Ref<HTMLDivElement | undefined>
  refScrollYHandleElem: Ref<HTMLDivElement | undefined>
  refScrollXSpaceElem: Ref<HTMLDivElement | undefined>
  refScrollYSpaceElem: Ref<HTMLDivElement | undefined>
}

export interface VxeTablePrivateRef extends TablePrivateRef { }

/**
 * 已废弃，被 VxeTablePropTypes.Row 替换
 * @deprecated
 */
export type VxeTableDataRow = VxeTablePropTypes.Row

export namespace VxeTablePropTypes {
  export type Size = VxeComponentSizeType
  export type ID<D = any> = string | ((params: {
    $table: VxeTableConstructor<D>
    $grid: VxeGridConstructor<D> | null | undefined
  }) => string | number | null)

  export interface Row {
    [key: string]: any
  }

  export type Data<T = Row> = T[]
  export type Height = number | string
  export type MinHeight = number | string
  export type MaxHeight = number | string
  export type Resizable = boolean
  export type Stripe = boolean
  export type Round = boolean
  export type Padding = boolean
  export type Border = boolean | 'default' | 'full' | 'outer' | 'inner' | 'none' | ''
  export type Loading = boolean
  export type Align = VxeComponentAlignType
  export type HeaderAlign = Align
  export type FooterAlign = Align
  export type ShowHeader = boolean
  export type HighlightCurrentRow = boolean
  export type HighlightHoverRow = boolean
  export type HighlightCurrentColumn = boolean
  export type HighlightHoverColumn = boolean
  export type HighlightCell = boolean
  export type ShowFooter = boolean
  export type FooterData = Record<string, any>[]

  export type FooterMethod<D = any> = (params: {
    $table: VxeTableConstructor<D>
    $grid: VxeGridConstructor<D> | null | undefined
    columns: VxeTableDefines.ColumnInfo<D>[]
    data: D[]
  }) => Array<string | number | null>[] | any[]

  export type RowClassName<D = VxeTablePropTypes.Row> = string | ((params: {
    $table: VxeTableConstructor<D>
    row: D
    rowIndex: number
    $rowIndex: number
    _rowIndex: number
  }) => void | null | string | { [key: string]: boolean | null | undefined })

  export type CellClassName<D = VxeTablePropTypes.Row> = string | ((params: {
    $table: VxeTableConstructor<D>
    row: D
    rowIndex: number
    $rowIndex: number
    _rowIndex: number
    column: VxeTableDefines.ColumnInfo<D>
    columnIndex: number
    $columnIndex: number
    _columnIndex: number
  }) => void | null | string | { [key: string]: boolean | null | undefined })

  export type HeaderRowClassName<D = VxeTablePropTypes.Row> = string | ((params: {
    $table: VxeTableConstructor<D>
    $rowIndex: number
    fixed: VxeColumnPropTypes.Fixed
    type: string
  }) => void | null | string | { [key: string]: boolean | null | undefined })

  export type HeaderCellClassName<D = VxeTablePropTypes.Row> = string | ((params: {
    $table: VxeTableConstructor<D>
    $rowIndex: number
    column: VxeTableDefines.ColumnInfo<D>
    columnIndex: number
    $columnIndex: number
    _columnIndex: number
    fixed: VxeColumnPropTypes.Fixed
    type: string
  }) => void | null | string | { [key: string]: boolean | null | undefined })

  export type FooterRowClassName<D = VxeTablePropTypes.Row> = string | ((params: {
    $table: VxeTableConstructor<D>
    row: D
    $rowIndex: number
    _rowIndex: number
    fixed: VxeColumnPropTypes.Fixed
    type: string
  }) => void | null | string | { [key: string]: boolean | null | undefined })

  export type FooterCellClassName<D = VxeTablePropTypes.Row> = string | ((params: {
    $table: VxeTableConstructor<D>
    row: D
    $rowIndex: number
    _rowIndex: number
    column: VxeTableDefines.ColumnInfo<D>
    columnIndex: number
    $columnIndex: number
    _columnIndex: number
  }) => void | null | string | { [key: string]: boolean | null | undefined })

  export type CellStyle<D = VxeTablePropTypes.Row> = VxeComponentStyleType | ((params: {
    row: D
    rowIndex: number
    $rowIndex: number
    _rowIndex: number
    column: VxeTableDefines.ColumnInfo<D>
    columnIndex: number
    $columnIndex: number
    _columnIndex: number
  }) => void | null | VxeComponentStyleType)

  export type HeaderCellStyle<D = VxeTablePropTypes.Row> = VxeComponentStyleType | ((params: {
    $table: VxeTableConstructor<D>
    $rowIndex: number
    column: VxeTableDefines.ColumnInfo<D>
    columnIndex: number
    _columnIndex: number
  }) => void | null | VxeComponentStyleType)

  export type FooterCellStyle<D = any> = VxeComponentStyleType | ((params: {
    $table: VxeTableConstructor<D>
    row: D
    $rowIndex: number
    column: VxeTableDefines.ColumnInfo<D>
    columnIndex: number
    $columnIndex: number
    _columnIndex: number
  }) => void | null | VxeComponentStyleType)

  export type RowStyle<D = VxeTablePropTypes.Row> = VxeComponentStyleType | ((params: {
    $table: VxeTableConstructor<D>
    row: D
    rowIndex: number
    $rowIndex: number
    _rowIndex: number
  }) => void | null | VxeComponentStyleType)

  export type HeaderRowStyle<D = VxeTablePropTypes.Row> = VxeComponentStyleType | ((params: {
    $table: VxeTableConstructor<D>
    $rowIndex: number
    fixed: VxeColumnPropTypes.Fixed
    type: string
  }) => void | null | VxeComponentStyleType)

  export type FooterRowStyle<D = any> = VxeComponentStyleType | ((params: {
    $table: VxeTableConstructor<D>
    row: D
    $rowIndex: number
    _rowIndex: number
    fixed: VxeColumnPropTypes.Fixed
    type: string
  }) => void | null | VxeComponentStyleType)

  export type MergeCell<D = VxeTablePropTypes.Row> = VxeTableDefines.MergeOptions<D>
  export type MergeCells<D = VxeTablePropTypes.Row> = MergeCell<D>[]
  export type MergeFooterItem<D = any> = VxeTableDefines.MergeOptions<D>
  export type MergeFooterItems<D = any> = MergeFooterItem<D>[]

  export type SpanMethod<D = VxeTablePropTypes.Row> = (params: {
    $table: VxeTableConstructor<D>
    column: VxeTableDefines.ColumnInfo<D>
    columnIndex: number
    $columnIndex: number
    row: D
    rowIndex: number
    $rowIndex: number
    _rowIndex: number
    isHidden: boolean
    fixed: VxeColumnPropTypes.Fixed
    type: string
    visibleData: D[]
  }) => void | { rowspan: number, colspan: number }

  export type FooterSpanMethod<D = any> = (params: {
    $table: VxeTableConstructor<D>
    column: VxeTableDefines.ColumnInfo<D>
    columnIndex: number
    _columnIndex: number
    $columnIndex: number
    row: D
    $rowIndex: number
    _rowIndex: number
    items: any[]
    data: D[][]
  }) => void | { rowspan: number, colspan: number }

  export type ShowOverflow = boolean | 'ellipsis' | 'title' | 'tooltip' | '' | null
  export type ShowHeaderOverflow = ShowOverflow
  export type ShowFooterOverflow = ShowOverflow
  export type ColumnKey = boolean
  export type RowKey = boolean
  export type RowId = string
  export type KeepSource = boolean
  export type AutoResize = boolean
  export type SyncResize = boolean | string | number

  /**
   * 响应式布局配置项
   */
  export interface ResizeConfig {
    refreshDelay?: number
  }
  export interface ResizeOpts extends ResizeConfig { }

  /**
   * 列配置信息
   */
  export interface ColumnConfig<D = any> {
    /**
     * 是否需要为每一列的 VNode 设置 key 属性
     */
    useKey?: boolean
    /**
     * 当鼠标点击列头时，是否要高亮当前列
     */
    isCurrent?: boolean
    /**
     * 当鼠标移到列头时，是否要高亮当前头
     */
    isHover?: boolean
    currentMethod?(params: {
      column: VxeTableDefines.ColumnInfo<D>
    }): boolean
    /**
     * 每一列是否启用列宽调整
     */
    resizable?: VxeColumnPropTypes.Resizable
    /**
     * 每一列的宽度
     */
    width?: VxeColumnPropTypes.Width
    /**
     * 每一列的最小宽度
     */
    minWidth?: VxeColumnPropTypes.MinWidth
    /**
     * 每一列的最大宽度
     */
    maxWidth?: VxeColumnPropTypes.MaxWidth
    /**
     * 固定列允许设置的最大数量（如果是分组，则一个分组算一个）
     */
    maxFixedSize?: number
    /**
     * 是否启用列拖拽排序
     */
    drag?: boolean
    /**
     * 每一列的自定义表头单元格数据导出方法，返回自定义的标题
     */
    headerExportMethod?: VxeColumnPropTypes.HeaderExportMethod<any>
    /**
     * 每一列的自定义单元格数据导出方法，返回自定义的值
     */
    exportMethod?: VxeColumnPropTypes.ExportMethod<any>
    /**
     * 每一列的自定义表尾单元格数据导出方法，返回自定义的值
     */
    footerExportMethod?: VxeColumnPropTypes.FooterExportMethod<any>
  }
  export interface ColumnOpts<D = any> extends ColumnConfig<D> { }

  /**
   * 行配置信息
   */
  export interface RowConfig<D = any> {
    /**
     * 是否需要为每一行的 VNode 设置 key 属性
     */
    useKey?: boolean
    /**
     * 自定义行数据唯一主键的字段名（默认自动生成）
     */
    keyField?: string
    /**
     * 当鼠标点击行时，是否要高亮当前行
     */
    isCurrent?: boolean
    /**
     * 是否允许高亮当前行的方法，该方法的返回值用来决定这一行是否可以高亮当前行
     */
    currentMethod?(params: {
      row: D
    }): boolean
    /**
     * 当鼠标移到行时，是否要高亮当前行
     */
    isHover?: boolean
    /**
     * 每一行开启调整行高度
     */
    resizable?: boolean
    /**
     * 已废弃，被 cell-config.height 替换
     * @deprecated
     */
    height?: number
    /**
     * 是否启用行拖拽排序
     */
    drag?: boolean
  }
  export interface RowOpts<D = any> extends RowConfig<D> { }

  /**
   * 当前行配置项
   */
  export interface CurrentConfig<D = any>{
  }

  /**
   * 单元格配置项
   */
  export interface CellConfig<D = any>{
    /**
     * 单元格默认高度
     */
    height?: number
    /**
     * 是否显示间距
     */
    padding?: VxeColumnPropTypes.Padding
    /**
     * 垂直对齐方式
     */
    verticalAlign?: VxeColumnPropTypes.VerticalAlign
  }

  /**
   * 表头单元格配置项
   */
  export interface HeaderCellConfig<D = any>{
    /**
     * 单元格默认高度
     */
    height?: number | 'unset'
    /**
     * 是否显示间距
     */
    padding?: boolean
  }

  /**
   * 表尾单元格配置项
   */
  export interface FooterCellConfig<D = any>{
    /**
     * 单元格默认高度
     */
    height?: number | 'unset'
    /**
     * 是否显示间距
     */
    padding?: boolean
  }

  /**
   * 已废弃，被 RowDragConfig 替换
   * @deprecated
   */
  export interface DragConfig<D = any>{
    /**
     * 自定义图标
     * @deprecated
     */
    rowIcon?: string
    /**
     * 是否显示拖拽按钮图标
     * @deprecated
     */
    showRowIcon?: boolean
    /**
     * 是否禁用拖拽按钮
     * @deprecated
     */
    rowDisabledMethod?(params: {
      row: D
      column: VxeTableDefines.ColumnInfo<D>
    }): boolean
    /**
     * 是否显示拖拽按钮
     * @deprecated
     */
    rowVisibleMethod?(params: {
      row: D
      column: VxeTableDefines.ColumnInfo<D>
    }): boolean
    /**
     * 自定义提示内容
     * @deprecated
     */
    rowTooltipMethod?(params: {
      row: D
    }): string | number | null
    /**
     * 拖拽开始时是否允许行拖拽调整顺序的方法，该方法的返回值用来决定是否允许被拖拽
     * @deprecated
     */
    dragStartMethod?(params: VxeTableDefines.RowDragstartEventParams<D>): boolean
    /**
     * 拖拽结束时是否允许行拖拽调整顺序的方法，该方法的返回值用来决定是否允许被拖拽调整顺序
     * @deprecated
     */
    dragEndMethod?(params: Omit<VxeTableDefines.RowDragendEventParams<D>, '_index'>): Promise<boolean> | boolean
    /**
     * 自定义插槽模板
     * @deprecated
     */
    slots?: {
      rowTip?: string | ((params: VxeTableDefines.RowDragSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
    }
  }

  /**
   * 行拖拽排序配置项
   */
  export interface RowDragConfig<D = any>{
    /**
     * 自定义图标
     */
    icon?: string
    /**
     * 是否显示拖拽按钮图标
     */
    showIcon?: boolean
    /**
     * 显示拖拽提示，拖拽过程中显示信息
     */
    showDragTip?: boolean
    /**
     * 触发拖拽方式
     */
    trigger?: 'default' | 'cell' | 'row' | '' | null
    /**
     * 只对 tree-config 启用有效，是否允许同级行拖拽，用于树结构，启用后允许同层级之间进行拖拽
     */
    isPeerDrag?: boolean
    /**
     * 只对 tree-config 启用有效，是否允许同级/跨层行拖拽，用于树结构，启用后允许跨层级拖拽（除了上级拖到子级）
     */
    isCrossDrag?: boolean
    /**
     * 需要 isCrossDrag，只对 tree-config 启用有效，是否允许拖拽成目标行的子级
     */
    isToChildDrag?: boolean
    /**
     * 需要 isCrossDrag，只对 tree-config 启用有效，是否允许将自己拖拽到子级行中
     */
    isSelfToChildDrag?: boolean
    /**
     * 是否显示拖拽辅助状态显示
     */
    showGuidesStatus?: boolean
    /**
     * 是否显示拖拽动画，启用后由数据量的大小来影响渲染性能
     */
    animation?: boolean
    /**
     * 是否禁用拖拽按钮
     */
    disabledMethod?(params: {
      row: D
      column: VxeTableDefines.ColumnInfo<D>
    }): boolean
    /**
     * 是否显示拖拽按钮
     */
    visibleMethod?(params: {
      row: D
      column: VxeTableDefines.ColumnInfo<D>
    }): boolean
    /**
     * 自定义提示内容
     */
    tooltipMethod?(params: {
      row: D
    }): string | number | null
    /**
     * 拖拽开始时是否允许行拖拽调整顺序的方法，该方法的返回值用来决定是否允许被拖拽
     */
    dragStartMethod?(params: VxeTableDefines.RowDragstartEventParams<D>): boolean
    /**
     * 拖拽结束时是否允许行拖拽调整顺序的方法，该方法的返回值用来决定是否允许被拖拽调整顺序
     */
    dragEndMethod?(params: Omit<VxeTableDefines.RowDragendEventParams<D>, '_index'>): Promise<boolean> | boolean
    /**
     * 用于 isToChildDrag，在拖拽完成后，该方法的返回值用于决定是否拖拽成子级
     */
    dragToChildMethod?(params: Omit<VxeTableDefines.RowDragToChildMethod<D>, '_index'>): boolean
    /**
     * 自定义插槽模板
     */
    slots?: {
      tip?: string | ((params: VxeTableDefines.RowDragSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
    }
  }

  /**
   * 列拖拽排序配置项
   */
  export interface ColumnDragConfig<D = any>{
    /**
     * 自定义图标
     */
    icon?: string
    /**
     * 是否显示拖拽按钮图标
     */
    showIcon?: boolean
    /**
     * 显示拖拽提示，拖拽过程中显示信息
     */
    showDragTip?: boolean
    /**
     * 触发拖拽方式
     */
    trigger?: 'default' | 'cell' | '' | null
    /**
     * 用于分组表头，是否允许同级列拖拽，启用后允许同层级列之间进行拖拽
     */
    isPeerDrag?: boolean
    /**
     * 需要 isCrossDrag，用于分组表头，是否同级/跨层列拖拽，启用后允许跨拖拽列拖拽（除了上级拖到子级）
     */
    isCrossDrag?: boolean
    /**
     * 需要 isCrossDrag，是否允许拖拽成目标列的子级
     */
    isToChildDrag?: boolean
    /**
     * 用于分组表头，是否允许将自己拖拽到子孙列中
     */
    isSelfToChildDrag?: boolean
    /**
     * 是否显示拖拽辅助状态显示
     */
    showGuidesStatus?: boolean
    /**
     * 是否显示拖拽动画，启用后由数据量的大小来影响渲染性能
     */
    animation?: boolean
    /**
     * 是否禁用拖拽按钮
     */
    disabledMethod?(params: {
      column: VxeTableDefines.ColumnInfo<D>
    }): boolean
    /**
     * 是否显示拖拽按钮
     */
    visibleMethod?(params: {
      column: VxeTableDefines.ColumnInfo<D>
    }): boolean
    /**
     * 自定义提示内容
     */
    tooltipMethod?(params: {
      column: VxeTableDefines.ColumnInfo<D>
    }): string | number | null
    /**
     * 拖拽开始时是否允许行拖拽调整顺序的方法，该方法的返回值用来决定是否允许被拖拽
     */
    dragStartMethod?(params: VxeTableDefines.ColumnDragstartEventParams<D>): boolean
    /**
     * 拖拽结束时是否允许行拖拽调整顺序的方法，该方法的返回值用来决定是否允许被拖拽调整顺序
     */
    dragEndMethod?(params: Omit<VxeTableDefines.ColumnDragendEventParams<D>, '_index'>): Promise<boolean> | boolean
    /**
     * 用于 isToChildDrag，在拖拽完成后，该方法的返回值用于决定是否拖拽成子级
     */
    dragToChildMethod?(params: Omit<VxeTableDefines.ColumnDragToChildMethod<D>, '_index'>): boolean
    /**
     * 自定义插槽模板
     */
    slots?: {
      tip?: string | ((params: VxeTableDefines.ColumnDragSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
    }
  }

  /**
   * 自定义列配置项
   */
  export interface CustomConfig<D = VxeTablePropTypes.Row> {
    /**
     * 是否启用，支持局部/全局启用
     */
    enabled?: boolean
    /**
     * 是否启用 localStorage 本地保存，会将列操作状态保留在本地（需要有 id）
     */
    storage?: boolean | VxeTableDefines.VxeTableCustomStorageObj
    restoreStore?(params: {
      id: string
      type: 'restore'
      storeData: VxeTableDefines.CustomStoreData
    }): VxeTableDefines.CustomStoreData | Promise<VxeTableDefines.CustomStoreData>
    updateStore?(params: {
      id: string
      type: 'reset' | 'confirm' | 'update:width' | 'update:fixed' | 'update:sort' | 'update:visible'
      storeData: VxeTableDefines.CustomStoreData
    }): Promise<any>
    mode?: 'default' | 'modal' | 'drawer' | 'simple' | 'popup' | '' | null
    modalOptions?: {
      title?: VxeModalPropTypes.Title
      width?: VxeModalPropTypes.Width
      minWidth?: VxeModalPropTypes.MinWidth
      height?: VxeModalPropTypes.Height
      minHeight?: VxeModalPropTypes.MinHeight
      className?: VxeModalPropTypes.ClassName
      showZoom?: VxeModalPropTypes.ShowZoom
      showMaximize?: VxeModalPropTypes.ShowMaximize
      showMinimize?: VxeModalPropTypes.ShowMinimize
      mask?: VxeModalPropTypes.Mask
      lockView?: VxeModalPropTypes.LockView
      resize?: VxeModalPropTypes.Resize
      escClosable?: VxeModalPropTypes.EscClosable
      maskClosable?: VxeModalPropTypes.MaskClosable
    }
    drawerOptions?: {
      title?: VxeDrawerPropTypes.Title
      width?: VxeDrawerPropTypes.Width
      className?: VxeDrawerPropTypes.ClassName
      position?: VxeDrawerPropTypes.Position
      mask?: VxeDrawerPropTypes.Mask
      lockView?: VxeDrawerPropTypes.LockView
      resize?: VxeDrawerPropTypes.Resize
      escClosable?: VxeDrawerPropTypes.EscClosable
      maskClosable?: VxeDrawerPropTypes.MaskClosable
    }
    trigger?: 'manual' | 'hover' | 'click' | '' | null
    immediate?: boolean
    placement?: 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    /**
     * 自定义列是否允许列选中的方法，该方法的返回值用来决定这一列的 checkbox 是否可以选中
     */
    checkMethod?(params: { column: VxeTableDefines.ColumnInfo<D> }): boolean
    /**
     * 自定义列是否的方法，该方法的返回值用来决定这一列是否显示
     */
    visibleMethod?(params: { column: VxeTableDefines.ColumnInfo<D> }): boolean
    allowVisible?: boolean
    allowFixed?: boolean
    allowSort?: boolean
    allowResizable?: boolean
    showFooter?: boolean
    icon?: string
    resetButtonText?: string
    closeButtonText?: string
    cancelButtonText?: string
    confirmButtonText?: string

    /**
     * 自定义列的插槽模板
     */
    slots?: {
      header?: string | ((params: VxeTableDefines.CustomSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      top?: string | ((params: VxeTableDefines.CustomSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      bottom?: string | ((params: VxeTableDefines.CustomSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      default?: string | ((params: VxeTableDefines.CustomSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      footer?: string | ((params: VxeTableDefines.CustomSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
    }
  }
  export interface CustomOpts<D = VxeTablePropTypes.Row> extends CustomConfig<D> { }

  /**
   * 列调整配置项
   */
  export interface ResizableConfig<D = VxeTablePropTypes.Row> {
    /**
     * 拖拽模式，如果是列拖拽，则支持自适应和固定模式
     */
    dragMode?: 'auto' | 'fixed' | ''
    /**
     * 所有单元格默认允许拖拽调整行高
     */
    isAllRowDrag?: boolean
    /**
     * 所有单元格默认允许拖拽调整列宽
     */
    isAllColumnDrag?: boolean
    /**
     * 显示列宽拖拽提示，拖拽过程中实时显示列宽
     */
    showDragTip?: boolean
    /**
     * 双击自适应列宽，启用后双击拖拽线，自动根据整列的内容自适应调整列宽
     */
    isDblclickAutoWidth?: boolean
    /**
     * 双击自适应行高，启用后双击拖拽线，自动根据整列的内容自适应调整行高
     */
    isDblclickAutoHeight?: boolean
    /**
     * 当拖拽调整列宽时，是否自动同步更新所选区域的所有列宽
     */
    isSyncAutoWidth?: boolean
    /**
     * 当拖拽调整行高时，是否自动同步更新所选区域的所有行高
     */
    isSyncAutoHeight?: boolean
    /**
     * 行高拖动的最小高度
     */
    minHeight?: number | string | ((params: {
      $table: VxeTableConstructor<D>
      column: VxeTableDefines.ColumnInfo<D>
      columnIndex: number
      $columnIndex: number
      $rowIndex: number
      rowIndex: number
      row: any
    }) => number | string)
    /**
     * 行高拖动的最大高度
     */
    maxHeight?: number | string | ((params: {
      $table: VxeTableConstructor<D>
      column: VxeTableDefines.ColumnInfo<D>
      columnIndex: number
      $columnIndex: number
      $rowIndex: number
      rowIndex: number
      row: any
    }) => number | string)
    /**
     * 列宽拖动的最小宽度
     */
    minWidth?: number | string | ((params: {
      $table: VxeTableConstructor<D>
      column: VxeTableDefines.ColumnInfo<D>
      columnIndex: number
      $columnIndex: number
      $rowIndex: number
      cell?: HTMLElement
    }) => number | string)
    /**
     * 列宽拖动的最大宽度
     */
    maxWidth?: number | string | ((params: {
      $table: VxeTableConstructor<D>
      column: VxeTableDefines.ColumnInfo<D>
      columnIndex: number
      $columnIndex: number
      $rowIndex: number
      cell?: HTMLElement
    }) => number | string)
  }
  export interface ResizableOpts<D = VxeTablePropTypes.Row> extends ResizableConfig<D> { }

  /**
   * 序号配置项
   */
  export interface SeqConfig<D = VxeTablePropTypes.Row> {
    startIndex?: number
    seqMethod?(params: {
      column: VxeTableDefines.ColumnInfo<D>
      columnIndex: number
      $columnIndex: number
      row: D
      rowIndex: number
      $rowIndex: number
    }): number | string
  }
  export interface SeqOpts<D = VxeTablePropTypes.Row> extends SeqConfig<D> { }

  interface SortConfigDefaultSort {
    field: string
    order: SortOrder
  }

  /**
   * 排序配置项
   */
  export interface SortConfig<D = VxeTablePropTypes.Row> {
    defaultSort?: SortConfigDefaultSort | SortConfigDefaultSort[]
    orders?: SortOrder[]
    sortMethod?(params: {
      $table: VxeTableConstructor<D>
      data: D[]
      sortList: VxeTableDefines.SortCheckedParams[]
    }): any[]
    remote?: boolean
    multiple?: boolean
    /**
     * 只对 multiple 有效，是否按照先后触发顺序进行排序
     */
    chronological?: boolean
    /**
     * 只对 allowBtn 有效，是否启用当点击排序图标时，如果与当前一致，则取消排序
     */
    allowClear?: boolean
    /**
     * 是否允许点击排序图标进行操作
     */
    allowBtn?: boolean
    trigger?: 'default' | 'cell'
    /**
     * 是否显示排序按钮图标
     */
    showIcon?: boolean
    /**
     * 排序按钮图标的显示方法，该方法的返回值用于决定该列是否显示排序按钮图标
     * @param params
     */
    iconVisibleMethod?(params: {
      $table: VxeTableConstructor<D>
      column: VxeTableDefines.ColumnInfo<D>
    }): boolean
    iconLayout?: 'horizontal' | 'vertical'
    iconAsc?: string
    iconDesc?: string
  }
  export type SortOrder = 'asc' | 'desc' | '' | null
  export interface SortOpts<D = VxeTablePropTypes.Row> extends SortConfig<D> {
    orders: SortOrder[]
  }

  /**
   * 筛选配置项
   */
  export interface FilterConfig<D = VxeTablePropTypes.Row> {
    filterMethod?:(params: {
      options: VxeTableDefines.FilterOption[]
      values: any[]
      cellValue: any
      row: D
      column: VxeTableDefines.ColumnInfo<D>
    }) => any
    remote?: boolean
    /**
     * 是否显示筛选按钮图标
     */
    showIcon?: boolean
    /**
     * 筛选按钮图标的显示方法，该方法的返回值用于决定该列是否显示筛选按钮图标
     * @param params
     */
    iconVisibleMethod?(params: {
      $table: VxeTableConstructor<D>
      column: VxeTableDefines.ColumnInfo<D>
    }): boolean
    iconNone?: string
    iconMatch?: string
    destroyOnClose?: boolean
    confirmButtonText?: string
    resetButtonText?: string
  }
  export interface FilterOpts<D = VxeTablePropTypes.Row> extends FilterConfig<D> { }

  /**
   * 单选框配置
   */
  export interface RadioConfig<D = VxeTablePropTypes.Row> {
    reserve?: boolean
    labelField?: string
    checkRowKey?: string | number
    checkMethod?(params: {
      row: D
    }): boolean
    visibleMethod?(params: {
      row: D
    }): boolean
    trigger?: 'default' | 'cell' | 'row' | 'manual' | '' | null
    highlight?: boolean
    strict?: boolean
  }
  export interface RadioOpts<D = VxeTablePropTypes.Row> extends RadioConfig<D> { }

  /**
   * 复选框配置项
   */
  export interface CheckboxConfig<D = VxeTablePropTypes.Row> {
    reserve?: boolean
    labelField?: string
    checkField?: string
    indeterminateField?: string
    showHeader?: boolean
    checkAll?: boolean
    checkRowKeys?: string[] | number[]
    checkStrictly?: boolean
    strict?: boolean
    isShiftKey?: boolean
    checkMethod?(params: {
      row: D
    }): boolean
    visibleMethod?(params: {
      row: D
    }): boolean
    trigger?: 'default' | 'cell' | 'row' | 'manual' | '' | null
    highlight?: boolean
    range?: boolean

    /**
     * 请使用 indeterminateField
     * @deprecated
     */
    halfField?: string
  }
  export interface CheckboxOpts<D = VxeTablePropTypes.Row> extends CheckboxConfig<D> { }

  /**
   * 提示信息配置项
   */
  export interface TooltipConfig<D = VxeTablePropTypes.Row> {
    showAll?: boolean
    theme?: 'dark' | 'light' | '' | null
    enterable?: boolean
    enterDelay?: number
    leaveDelay?: number
    contentMethod?(params: {
      items: any[]
      row: D
      rowIndex: number
      $rowIndex: number
      _rowIndex: number
      column: VxeTableDefines.ColumnInfo<D>
      columnIndex: number
      $columnIndex: number
      _columnIndex: number
      type: 'header' | 'body' | 'footer' | '' | null
      cell: HTMLElement
      $event: any
    }): string | null | void
  }
  export interface TooltipOpts<D = any> extends TooltipConfig<D> { }

  /**
   * 展开行配置项
   */
  export interface ExpandConfig<D = any> {
    labelField?: string
    expandAll?: boolean
    expandRowKeys?: string[] | number[]
    accordion?: boolean
    trigger?: 'default' | 'cell' | 'row' | 'manual' |'' | null
    lazy?: boolean
    reserve?: boolean
    height?: number
    padding?: boolean
    /**
     * @deprecated
     * @private
     */
    mode?: 'inside' | 'fixed' | '' | null
    loadMethod?(params: {
      $table: VxeTableConstructor<D>
      row: D
      rowIndex: number
      $rowIndex: number
    }): Promise<void>
    toggleMethod?(params: {
      $table: VxeTableConstructor<D>
      expanded: boolean
      row: D
      rowIndex: number
      $rowIndex: number
      column: VxeTableDefines.ColumnInfo<D>
      columnIndex: number
      $columnIndex: number
    }): boolean
    visibleMethod?(params: VxeTableDefines.CellRenderBodyParams<D>): boolean
    showIcon?: boolean
    iconOpen?: string
    iconClose?: string
    iconLoaded?: string
  }
  export interface ExpandOpts<D = any> extends ExpandConfig<D> { }

  /**
   * 树形结构配置项
   */
  export interface TreeConfig<D = any> {
    /**
     * 自动将列表转为树结构
     */
    transform?: boolean
    /**
     * 用于 tree-config.transform，树节点的字段名
     */
    rowField?: string
    /**
     * 用于 tree-config.transform，树父节点的字段名
     */
    parentField?: string
    /**
     * 树子节点的字段名
     */
    childrenField?: string
    /**
     * 用于 tree-config.transform，树子节点映射的字段名
     */
    mapChildrenField?: string
    /**
     * 树节点的缩进
     */
    indent?: number
    /**
     * 树节点的连接线（启用连接线会降低渲染性能）
     */
    showLine?: boolean
    /**
     * 树结构序号显示模式，支持层级序号和自增序号（仅支持 transform）
     */
    seqMode?: 'default' | 'increasing' | ''
    /**
     * 默认展开所有子孙树节点（只会在初始化时被触发一次）
     */
    expandAll?: boolean
    /**
     * 默认展开指定树节点（只会在初始化时被触发一次，需要有 row-config.keyField）
     */
    expandRowKeys?: string[] | number[]
    /**
     * 对于同一级的节点，每次只能展开一个
     */
    accordion?: boolean
    /**
     * 触发方式（注：当多种功能重叠时，会同时触发）
     */
    trigger?: 'default' | 'cell' | 'row' | 'manual' |'' | null
    /**
     * 是否使用懒加载（启用后只有指定 hasChildField 字段的节点才允许被点击）
     */
    lazy?: boolean
    /**
     * 只对 lazy 启用后有效，标识是否存在子节点，从而控制是否允许被点击
     */
    hasChildField?: string
    /**
     * 是否保留展开状态，对于某些场景可能会用到，比如数据被刷新之后还保留之前展开的状态（需要有 row-config.keyField）
     */
    reserve?: boolean
    /**
     * 该方法用于异步加载子节点
     */
    loadMethod?(params: {
      $table: VxeTableConstructor<D>
      row: D
    }): Promise<any[]>
    /**
     * 该方法在展开或关闭触发之前调用，可以通过返回值来决定是否允许继续执行
     */
    toggleMethod?(params: {
      $table: VxeTableConstructor<D>
      expanded: boolean
      row: D
      column: VxeTableDefines.ColumnInfo<D>
      columnIndex: number
      $columnIndex: number
    }): boolean
    /**
     * 是否显示图标按钮
     */
    showIcon?: boolean
    /**
     * 自定义展开后显示的图标
     */
    iconOpen?: string
    /**
     * 自定义收起后显示的图标
     */
    iconClose?: string
    /**
     * 自定义懒加载中显示的图标
     */
    iconLoaded?: string

    /**
     * 已废弃，请使用 showLine
     * @deprecated
     */
    line?: boolean
    /**
     * 已废弃，请使用 hasChildField
     * @deprecated
     */
    hasChild?: string
    /**
     * 已废弃，请使用 childrenField
     * @deprecated
     */
    children?: string
  }
  export type TreeOpts<D = any> = Required<TreeConfig<D>>

  /**
   * 快捷菜单配置项
   */
  export interface MenuConfig<D = any> {
    /**
     * 是否启用
     */
    enabled?: boolean
    /**
     * 表头的右键菜单
     */
    header?: VxeTableDefines.MenuOptions
    /**
     * 内容的右键菜单
     */
    body?: VxeTableDefines.MenuOptions
    /**
     * 表尾的右键菜单
     */
    footer?: VxeTableDefines.MenuOptions
    /**
     * 触发方式
     * default（默认右键表格触发）, cell（右键单元格触发）
     */
    trigger?: 'default' | 'cell' | '' | null
    /**
     * 菜单面板的 className
     */
    className?: string
    /**
     * 该函数的返回值用来决定是否允许显示右键菜单（对于需要对菜单进行权限控制时可能会用到）
     */
    visibleMethod?(params: {
      type: string
      options: VxeTableDefines.MenuFirstOption[][]
      columns: VxeTableDefines.ColumnInfo<D>[]
      row?: D
      rowIndex?: number
      column?: VxeTableDefines.ColumnInfo<D>
      columnIndex?: number
    }): boolean
  }
  export type MenuOpts<D = any> = Required<MenuConfig<D>>

  /**
   * 鼠标配置项
   */
  export interface MouseConfig {
    /**
     * 开启单元格选中功能（只对 edit-config.mode=cell 有效）
     */
    selected?: boolean
    /**
     * 如果功能被支持，则开启单元格区域选取功能，非连续的区域，按住 Ctrl 键，用鼠标逐一选取
     */
    area?: boolean
    /**
     * 只对 area 启用后有效，是否开启区域扩展选取功能，开启后可以通过鼠标左键按住区域内右下角扩展按钮，将区域横向或纵向扩大（支持扩大区域并复制值）
     */
    extension?: boolean
  }
  export interface MouseOpts extends MouseConfig { }

  /**
   * 区域配置项
   */
  export interface AreaConfig<D = any> {
    /**
     * 只对 mouse-config.area 启用后有效，启用多区域选取功能
     */
    multiple?: boolean
    /**
     * 用于指定哪些列允许被选取
     */
    includeFields?: string[]
    /**
     * 用于排除指定列允许不允许被选取
     */
    excludeFields?: string[]
    /**
     * 单元格选取的方法，返回是否允许被选取
     */
    selectedMethod?(params: {
      row: D
      column: VxeTableDefines.ColumnInfo<D>
      $table: VxeTableConstructor<D>
      $grid: VxeGridConstructor<D> | null | undefined
    }): boolean
    /**
     * 只对 mouse-config.area 启用后有效，表格头部选取功能
     */
    selectCellByHeader?: boolean
    /**
     * 只对 mouse-config.area 启用后有效，表格单元格选取功能
     */
    selectCellByBody?: boolean
    /**
     * 只对 mouse-config.area 启用后有效，
     * 如果为 true，则选中第一列单元格自动选取一整行，
     * 如果为指定字段，则选中指定单元格自动选取一整行
     */
    selectCellToRow?: boolean | string
    /**
     * 只对 mouse-config.area 启用后有效，选择单元格后显示列状态
     */
    showColumnStatus?: boolean
    /**
     * 只对 mouse-config.area 启用后有效，选择单元格后显示行状态
     */
    showRowStatus?: boolean
    /**
     * 只对 mouse-config.extension 启用后有效，将被选取区域的值复制到扩展区域中
     */
    extendByCopy?: boolean
    /**
     * 只对 mouse-config.extension 启用后有效，扩展区域时将自动识别数字规则进行计算
     */
    extendByCalc?: boolean
    /**
     * 只对 mouse-config.extension 启用后有效，扩展区域的方向控制
     */
    extendDirection?: boolean | {
      /**
       * 是否允许向上扩展
       */
      top?: boolean
      /**
       * 是否允许向下扩展
       */
      bottom?: boolean
      /**
       * 是否允许向左扩展
       */
      left?: boolean
      /**
       * 是否允许向右扩展
       */
      right?: boolean
    }
    /**
     * 只对 mouse-config.extension 启用后有效，扩展区域之前的方法，可以通过返回 false 阻止扩展行为
     * @param params
     */
    beforeExtendMethod?(params: VxeTableProDefines.CellAreaExtensionStartParams<D>): boolean
    /**
     * 只对 mouse-config.extension 启用后有效，扩展区域之后的方法
     * @param params
     */
    afterExtendMethod?(params: VxeTableProDefines.CellAreaExtensionEndParams<D>): void
    /**
     * 当点击表格之外，是否自动清除单元格的选取状态
     */
    autoClear?: boolean
    /**
     * 只对 extendByCalc 启用后有效，重写单元格扩展区域计算值的方法
     * @param params
     */
    extendCalcMethod?(params: VxeTableProDefines.ExtendCellAreaCalcBaseParams<D>): any[][]
    /**
     * 只对 extendByCopy | extendByCalc 启用后有效，重写单元格扩展区域赋值的方法
     * @param params
     */
    extendSetMethod?(params: {
      cellValue: any
      row: D
      column: VxeTableDefines.ColumnInfo<D>
    } & VxeTableProDefines.ExtendCellAreaCalcBaseParams<D>): void
    /**
     * 只对 extendByCopy | extendByCalc 启用后有效，自定义单元格扩展区域赋值之前的方法，可以通过返回 false 阻止扩展赋值行为
     * @param params
     */
    beforeExtendSetMethod?(params: VxeTableProDefines.ExtendCellAreaCalcBaseParams<D>): boolean
    /**
     * 只对 extendByCopy | extendByCalc 启用后有效，自定义单元格扩展区域赋值之后的方法
     * @param params
     */
    afterExtendSetMethod?(params: {
      extendValues: any[][]
    } & VxeTableProDefines.ExtendCellAreaCalcBaseParams<D>): void
  }
  export interface AreaOpts<D = any> extends AreaConfig<D> { }

  /**
   * 按键配置项
   */
  export interface KeyboardConfig<D = any> {
    /**
     * 是否开启非编辑状态下，上下左右移动功能
     */
    isArrow?: boolean
    /**
     * 是否开启Esc键退出编辑功能
     */
    isEsc?: boolean
    /**
     * 是否开启删除键功能
     */
    isDel?: boolean
    /**
     * 是否开启回退键功能
     */
    isBack?: boolean
    /**
     * 是否开启回车移动上下行移动
     */
    isEnter?: boolean
    /**
     * 如果功能被支持，用于 mouse-config.area，开启同时按住方向键以活动区域为起始，向指定方向延伸单元格区域
     */
    isShift?: boolean
    /**
     * 是否开启TAB键左右移动功能
     */
    isTab?: boolean
    /**
     * 是否开启单元格选择编辑
     */
    isEdit?: boolean
    /**
     * 用于 mouse-config.area，开启合并和取消合并功能
     */
    isMerge?: boolean
    /**
     * 用于 mouse-config.area，开启复制/剪贴/粘贴功能
     */
    isClip?: boolean
    /**
     * 如果功能被支持，用于 mouse-config.area，开启查找和替换功能
     */
    isFNR?: boolean
    /**
     * 用于 mouse-config.area & column.type=checkbox|radio，开启空格键切换复选框或单选框状态功能
     */
    isChecked?: boolean
    /**
     * 用于 mouse-config.area，方向键光标锁，开启后将支持两种状态
     * 非聚焦式输入状态：默认情况下，可以按方向键移动单元格。
     * 聚焦式输入状态：如果需要移动光标，可以按 F2 键或者鼠标左键点击输入框，切换为聚焦输入状态，就可以用方向键左右移动光标
     */
    arrowCursorLock?: boolean
    /**
     * 用于 mouse-config.area，是否将回车键行为改成 Tab 键行为
     */
    enterToTab?: boolean
    /**
     * 只有 isEdit 有效，编辑模式，支持覆盖式和末端插入式编辑
     */
    editMode?: 'coverage' | 'insert' | '' | null
    /**
     * 当在最后一行按下回车键时，自动插入新行
     */
    isLastEnterAppendRow?: boolean
    /**
     * 只对 isEnter=true 有效，用于回车键执行之前的方法，返回 false 可以阻止默认行为
     */
    beforeEnterMethod?(params: {
      row: D
      rowIndex: number
      $rowIndex: number
      _rowIndex: number
      column: VxeTableDefines.ColumnInfo<D>
      columnIndex: number
      $columnIndex: number
      _columnIndex: number
      $table: VxeTableConstructor<D>
    }): boolean
    /**
     * 只对 isEnter=true 有效，用于重写回车键的方法
     */
    enterMethod?(params: {
      row: D
      rowIndex: number
      $rowIndex: number
      _rowIndex: number
      column: VxeTableDefines.ColumnInfo<D>
      columnIndex: number
      $columnIndex: number
      _columnIndex: number
      $table: VxeTableConstructor<D>
    }): void
    /**
     * 只对 isDel=true 有效，用于重写删除键的方法
     */
    delMethod?(params: {
      row: D
      rowIndex: number
      column: VxeTableDefines.ColumnInfo<D>
      columnIndex: number
      $table: VxeTableConstructor<D>
    }): void
    /**
     * 只对 isDel=true 有效，用于重写回退键清空单元格内容并激活为编辑状态方法
     */
    backMethod?(params: {
      row: D
      rowIndex: number
      column: VxeTableDefines.ColumnInfo<D>
      columnIndex: number
      $table: VxeTableConstructor<D>
    }): void
    /**
     * 只对 isEdit=true 有效，用于重写编辑单元格方法
     */
    editMethod?(params: {
      row: D
      rowIndex: number
      column: VxeTableDefines.ColumnInfo<D>
      columnIndex: number
      $table: VxeTableConstructor<D>
      $grid: VxeGridConstructor<D> | null | undefined
    }): void
  }
  export interface KeyboardOpts<D = any> extends KeyboardConfig<D> { }

  /**
   * 复制/粘贴配置项
   */
  export interface ClipConfig<DT = any> {
    /**
     * 是否启用复制功能
     */
    isCopy?: boolean
    /**
     * 是否启用剪贴功能
     */
    isCut?: boolean
    /**
     * 是否启用粘贴功能
     */
    isPaste?: boolean
    /**
     * 只对 tree-config 启用有效，是否深层粘贴，用于树结构，启用后粘贴时会覆盖到子级数据进行粘贴
     */
    isDeepPaste?: boolean
    /**
     * 是否填充粘贴，如果启用了，当被选取的粘贴单元格与粘贴单元格的行与列数量不匹配时，会将内容强制粘贴所选的单元格
     */
    isFillPaste?: boolean
    /**
     * 是否启用行自增，当粘贴的行数超出表格时自动插入新行
     */
    isRowIncrement?: boolean
    /**
     * 是否启用列自增，当粘贴的列数超出表格时自动插入新列（需要注意自增的列自字段是否定义，否则将无法响应）
     */
    isColumnIncrement?: boolean
    /**
     * 用于指定哪些列允许被复制粘贴
     */
    includeFields?: string[]
    /**
     * 用于排除指定列允许不允许被复制粘贴
     */
    excludeFields?: string[]
    /**
     * 重写单元格复制取值的方法，将单元格复制到剪贴板
     */
    copyMethod?(params: {
      isCut: boolean
      row: DT
      column: VxeTableDefines.ColumnInfo<DT>
      cellValue: any
      $table: VxeTableConstructor<DT> & VxeTablePrivateMethods<DT>
      $grid: VxeGridConstructor<DT> | null | undefined
    }): string
    /**
     * 自定义单元格复制取值之前的方法，可以通过返回 false 阻止复制行为
     */
    beforeCopyMethod?(params: {
      isCut: boolean
      activeArea: VxeTableProDefines.MouseActiveCellArea
      targetAreas: VxeTableProDefines.CellAreaParams<DT>[]
      $table: VxeTableConstructor<DT> & VxeTablePrivateMethods<DT>
      $grid: VxeGridConstructor<DT> | null | undefined
    }): boolean
    /**
     * 自定义单元格复制到剪贴板之后的方法
     */
    afterCopyMethod?(params: {
      isCut: boolean
      targetAreas: VxeTableProDefines.CellAreaParams<DT>[]
      $table: VxeTableConstructor<DT> & VxeTablePrivateMethods<DT>
      $grid: VxeGridConstructor<DT> | null | undefined
    }): boolean
    /**
     * 重写单元格剪贴值清除的方法，将剪贴单元格的值清除
     */
    cutMethod?:(params: {
      row: DT,
      column: VxeTableDefines.ColumnInfo<DT>
      cellValue: any
      clipData: {
        text?: string
        html?: string
      }
      $table: VxeTableConstructor<DT> & VxeTablePrivateMethods<DT>
      $grid: VxeGridConstructor<DT> | null | undefined
    }) => void
    /**
     * 自定义单元格剪贴值清除之前的方法，可以通过返回 false 阻止清除行为
     */
    beforeCutMethod?:(params: {
      activeArea: VxeTableProDefines.MouseActiveCellArea
      cutAreas: VxeTableProDefines.CellAreaParams<DT>[]
      currentAreas: VxeTableProDefines.CellAreaParams<DT>[]
      clipData: {
        text?: string
        html?: string
      }
      $table: VxeTableConstructor<DT> & VxeTablePrivateMethods<DT>
      $grid: VxeGridConstructor<DT> | null | undefined
    }) => boolean
    /**
     * 自定义单元格剪贴值清除之后的方法
     */
    afterCutMethod?:(params: {
      cutAreas: VxeTableProDefines.CellAreaParams<DT>[]
      currentAreas: VxeTableProDefines.CellAreaParams<DT>[]
      $table: VxeTableConstructor<DT> & VxeTablePrivateMethods<DT>
      $grid: VxeGridConstructor<DT> | null | undefined
    }) => void
    /**
     * 重写单元格粘贴赋值的方法，从剪贴板赋值到单元格
     */
    pasteMethod?(params: {
      isCut: boolean
      row: DT,
      column: VxeTableDefines.ColumnInfo<DT>
      cellValue: any
      clipData: {
        text?: string
        html?: string
      }
      $table: VxeTableConstructor<DT> & VxeTablePrivateMethods<DT>
      $grid: VxeGridConstructor<DT> | null | undefined
    }): void
    /**
     * 自定义单元格粘贴赋值之前的方法，可以通过返回 false 阻止复制行为
     */
    beforePasteMethod?(params: {
      isCut: boolean
      activeArea: VxeTableProDefines.MouseActiveCellArea
      cutAreas: VxeTableProDefines.CellAreaParams<DT>[]
      currentAreas: VxeTableProDefines.CellAreaParams<DT>[]
      targetAreas: VxeTableProDefines.CellAreaParams<DT>[]
      cellValues: string[][]
      pasteCells: string[][]
      clipData: {
        text?: string
        html?: string
      }
      $table: VxeTableConstructor<DT> & VxeTablePrivateMethods<DT>
      $grid: VxeGridConstructor<DT> | null | undefined
    }): boolean
    /**
     * 自定义单元格粘贴赋值之后的方法
     */
    afterPasteMethod?(params: {
      isCut: boolean
      currentAreas: VxeTableProDefines.CellAreaParams<DT>[]
      cutAreas: VxeTableProDefines.CellAreaParams<DT>[]
      targetAreas: VxeTableProDefines.CellAreaParams<DT>[]
      cellValues: any[][]
      pasteCells: string[][]
      insertRows: DT[]
      insertColumns: VxeTableDefines.ColumnInfo<DT>[]
      $table: VxeTableConstructor<DT> & VxeTablePrivateMethods<DT>
      $grid: VxeGridConstructor<DT> | null | undefined
    }): boolean
    /**
     * 只对 isRowIncrement 有效，自定义创建自增行数据的方法
     */
    createRowsMethod?(params: {
      currentAreas: VxeTableProDefines.CellAreaParams<DT>[]
      targetAreas: VxeTableProDefines.CellAreaParams<DT>[]
      cellValues: any[][]
      pasteCells: string[][]
      insertRows: DT[]
      $table: VxeTableConstructor<DT> & VxeTablePrivateMethods<DT>
      $grid: VxeGridConstructor<DT> | null | undefined
    }): DT[]
    /**
     * 只对 isColumnIncrement 有效，自定义创建自增列配置的方法
     */
    createColumnsMethod?(params: {
      currentAreas: VxeTableProDefines.CellAreaParams<DT>[]
      targetAreas: VxeTableProDefines.CellAreaParams<DT>[]
      cellValues: any[][]
      pasteCells: string[][]
      insertColumns: VxeTableDefines.ColumnOptions[]
      $table: VxeTableConstructor<DT> & VxeTablePrivateMethods<DT>
      $grid: VxeGridConstructor<DT> | null | undefined
    }): VxeTableDefines.ColumnOptions<DT>[]
  }
  export interface ClipOpts<D = any> extends ClipConfig<D> { }

  /**
   * 查找/替换配置项
   */
  export interface FNRConfig<DT = any> {
    /**
     * 是否启用查找功能
     */
    isFind?: boolean
    /**
     * 自定义单元格查找方法
     */
    findMethod?(params: {
      cellValue: any
      isWhole: boolean
      isRE: boolean
      isSensitive: boolean
      findValue: string | null
      findRE: RegExp | null
    }): boolean
    /**
     * 自定义单元格查找之前的方法，可以通过返回 false 阻止查找行为
     */
    beforeFindMethod?(params: {
      isAll: boolean
      findValue: string | null
      $table: VxeTableConstructor<DT> & VxeTablePrivateMethods<DT>
      $grid: VxeGridConstructor<DT> | null | undefined
    }): boolean
    /**
     * 自定义单元格查找之后的方法
     */
    afterFindMethod?(params: {
      isAll: boolean
      findValue: string | null
      result: VxeTableProDefines.FindAndReplaceResult[]
      $table: VxeTableConstructor<DT> & VxeTablePrivateMethods<DT>
      $grid: VxeGridConstructor<DT> | null | undefined
    }): void
    /**
     * 是否启用替换功能
     */
    isReplace?: boolean
    /**
     * 自定义单元格替换方法
     */
    replaceMethod?:(params: {
      row: DT
      column: VxeTableDefines.ColumnInfo<DT>
      cellValue: any
      findValue: string
      replaceValue: string
    }) => void
    /**
     * 自定义单元格替换之前的方法，可以通过返回 false 阻止替换行为
     */
    beforeReplaceMethod?:(params: {
      isAll: boolean
      findValue: string
      replaceValue: string
      $table: VxeTableConstructor<DT> & VxeTablePrivateMethods<DT>
      $grid: VxeGridConstructor<DT> | null | undefined
    }) => boolean
    /**
     * 自定义单元格替换之后的方法
     */
    afterReplaceMethod?:(params: {
      isAll: boolean
      findValue: string
      replaceValue: string
      result: VxeTableProDefines.FindAndReplaceResult[]
      $table: VxeTableConstructor<DT> & VxeTablePrivateMethods<DT>
      $grid: VxeGridConstructor<DT> | null | undefined
    }) => void
  }
  export interface FNROpts<D = any> extends FNRConfig<D> { }

  /**
   * 编辑配置项
   */
  export interface EditConfig<DT = any> {
    /**
     * 触发方式
     * - manual（手动触发方式，只能用于 mode=row）
     * - click（点击触发编辑）
     * - dblclick（双击触发编辑）
     */
    trigger?: 'manual' | 'click' | 'dblclick' | '' | null
    /**
     * 是否启用
     */
    enabled?: boolean
    /**
     * 编辑模式
     * - cell（单元格编辑模式）
     * - row（行编辑模式）
     */
    mode?: 'cell' | 'row' | '' | null
    /**
     * 自定义可编辑列的状态图标
     */
    icon?: string
    /**
     * 是否显示列头编辑图标
     */
    showIcon?: boolean
    /**
     * 只对 keep-source 开启有效，是否显示单元格新增与修改状态
     */
    showStatus?: boolean
    /**
     * 只对 keep-source 开启有效，是否显示单元格修改状态
     */
    showUpdateStatus?: boolean
    /**
     * 只对 keep-source 开启有效，是否显示单元格新增状态
     */
    showInsertStatus?: boolean
    /**
     * 是否显示必填字段的红色星号
     */
    showAsterisk?: boolean
    /**
     * 当单元格被激活为编辑状态时，是否自动聚焦，默认 input，可以通过 item-render.autoFocus 指定
     */
    autoFocus?: boolean
    /**
     * 当单元格被激活为编辑状态时，是否自动定位
     */
    autoPos?: boolean
    /**
     * 当点击表格之外或者非编辑列之后，是否自动清除单元格的激活状态
     */
    autoClear?: boolean
    /**
     * 自定义编辑之前逻辑，该方法的返回值用来决定该单元格是否允许编辑
     */
    beforeEditMethod?(params: {
      row: DT
      rowIndex: number
      column: VxeTableDefines.ColumnInfo<DT>
      columnIndex: number
      $table: VxeTableConstructor<DT> & VxeTablePrivateMethods<DT>
      $grid: VxeGridConstructor<DT> | null | undefined
    }): boolean
    /**
     * 自定义编辑之后逻辑
     */
    afterEditMethod?(params: {
      row: DT
      rowIndex: number
      column: VxeTableDefines.ColumnInfo<DT>
      columnIndex: number
      $table: VxeTableConstructor<DT> & VxeTablePrivateMethods<DT>
      $grid: VxeGridConstructor<DT> | null | undefined
    }): void

    /**
     * 请使用 beforeEditMethod
     * @deprecated
     */
    activeMethod?(params: {
      row: DT
      rowIndex: number
      column: VxeTableDefines.ColumnInfo<DT>
      columnIndex: number
      $table: VxeTableConstructor<DT> & VxeTablePrivateMethods<DT>
      $grid: VxeGridConstructor<DT> | null | undefined
    }): boolean
  }
  export interface EditOpts<D = any> extends EditConfig<D> { }

  /**
   * 校验配置项
   */
  export interface ValidConfig<D = any> {
    /**
     * 是否自动定位到校验不通过的单元格
     */
    autoPos?: boolean
    /**
     * 是否显示错误显示
     */
    showMessage?: boolean
    /**
     * 校验消息提示方式
     * - single 单个提示
     * - full - 全量提示
     */
    msgMode?: 'single' | 'full' | null | ''
    /**
     * 提示消息主题样式
     */
    theme?: 'normal' | 'beautify' | ''
    /**
     * 当点击表格之外或者其他列之后，是否自动清除单元格的校验消息
     */
    autoClear?: boolean
    /**
     * 校验提示框的最大宽度
     */
    maxWidth?: number
    /**
     * 给校验提示框附加 class
     */
    className?: string | ((params: VxeColumnSlotTypes.ValidSlotParams<D>) => string)

    /**
     * 不建议使用，已废弃
     * @deprecated
     */
    message?: 'inline' | 'default' | 'tooltip' | '' | null
  }
  export interface ValidOpts<D = any> extends ValidConfig<D> { }

  /**
   * 校验规则配置项
   */
  export interface EditRules<D = any> {
    [field: string]: VxeTableDefines.ValidatorRule<D>[]
  }

  export type ZIndex = number
  export type EmptyText = string

  export interface LoadingConfig {
    /**
     * 显示图标
     */
    icon?: string
    /**
     * 显示文字
     */
    text?: string
  }
  export interface LoadingOpts extends LoadingConfig { }

  export interface EmptyRender {
    /**
     * 渲染器名称
     */
    name?: string
    /**
     * 目标组件渲染的参数
     */
    props?: { [key: string]: any }
    /**
     * 目标组件渲染的属性
     */
    attrs?: { [key: string]: any }
    /**
     * 目标组件渲染的事件
     */
    events?: { [key: string]: (...args: any[]) => any }
  }
  export interface EmptyOpts extends EmptyRender { }

  export type Fit = boolean
  export type Animat = boolean
  export type DelayHover = number

  export interface ScrollX {
    /**
     * 指定大于指定列时自动启动横向虚拟滚动，如果为 0 则总是启用；如果需要关闭，可以设置 enabled 为 false
     */
    gt?: number
    /**
     * 指定每次渲染的数据偏移量，偏移量越大渲染次数就越少，但每次渲染耗时就越久（对于低性能浏览器可以设置大一点，减低渲染次数）
     */
    oSize?: number
    /**
     * 是否启用，支持局部/全局启用
     */
    enabled?: boolean
    /**
     * 是否开启实时渲染，当单元格渲染量太大时应该关闭，避免卡顿
     */
    immediate?: boolean
    /**
     * 当数据源被更改时，自动将横向滚动条滚动到左侧
     */
    scrollToLeftOnChange?: boolean
    /**
     * 滚动到边界触发的阈值会触发 scroll-boundary 事件
     */
    threshold?: string | number
  }
  export interface SXOpts extends ScrollX {
    gt: number
    oSize: number
  }

  export interface ScrollY {
    /**
     * 默认行为，无需设置
     * @deprecated
     * @private
     */
    mode?: 'default' | 'wheel'
    /**
     * 指定大于指定行时自动启动纵向虚拟滚动，如果为 0 则总是启用；如果需要关闭，可以设置 enabled 为 false（注：启用纵向虚拟滚动之后将不能支持动态行高）
     */
    gt?: number
    /**
     * 指定每次渲染的数据偏移量，偏移量越大渲染次数就越少，但每次渲染耗时就越久（对于低性能浏览器可以设置大一点，减低渲染次数）
     */
    oSize?: number
    /**
     * 是否启用，支持局部/全局启用
     */
    enabled?: boolean
    /**
     * 是否开启实时渲染，当单元格渲染量太大时应该关闭，避免卡顿
     */
    immediate?: boolean
    /**
     * 当数据源被更改时，自动将纵向滚动条复原到顶部
     */
    scrollToTopOnChange?: boolean
    /**
     * 滚动到边界触发的阈值会触发 scroll-boundary 事件
     */
    threshold?: string | number

    /**
     * 已废弃，请使用 row-config.height
     * @deprecated
     */
    rHeight?: number
    /**
     * 已废弃，不建议使用
     * @deprecated
     */
    adaptive?: boolean
  }
  export interface SYOpts extends ScrollY {
    gt: number
    oSize: number
  }

  export interface VirtualXConfig {
    /**
     * 指定大于指定列时自动启动横向虚拟滚动，如果为 0 则总是启用；如果需要关闭，可以设置 enabled 为 false
     */
    gt?: number
    /**
     * 指定每次渲染的数据偏移量，偏移量越大渲染次数就越少，但每次渲染耗时就越久
     */
    oSize?: number
    /**
     * 预加载数量
     */
    preSize?: Number
    /**
     * 是否启用，支持局部/全局启用
     */
    enabled?: boolean
    /**
     * 是否开启实时渲染，当单元格渲染量太大时应该关闭，避免卡顿
     */
    immediate?: boolean
    /**
     * 当数据源被更改时，自动将横向滚动条滚动到左侧
     */
    scrollToLeftOnChange?: boolean
    /**
     * 滚动到边界触发的阈值会触发 scroll-boundary 事件
     */
    threshold?: string | number
  }

  export interface VirtualYConfig {
    /**
     * 指定大于指定行时自动启动纵向虚拟滚动，如果为 0 则总是启用；如果需要关闭，可以设置 enabled 为 false（注：启用纵向虚拟滚动之后将不能支持动态行高）
     */
    gt?: number
    /**
     * 指定每次渲染的数据偏移量，偏移量越大渲染次数就越少，但每次渲染耗时就越久
     */
    oSize?: number
    /**
     * 预加载数量
     */
    preSize?: Number
    /**
     * 是否启用，支持局部/全局启用
     */
    enabled?: boolean
    /**
     * 是否开启实时渲染，当单元格渲染量太大时应该关闭，避免卡顿
     */
    immediate?: boolean
    /**
     * 当数据源被更改时，自动将纵向滚动条复原到顶部
     */
    scrollToTopOnChange?: boolean
    /**
     * 滚动到边界触发的阈值会触发 scroll-boundary 事件
     */
    threshold?: string | number
  }

  /**
   * 滚动条配置项
   */
  export interface ScrollbarConfig {
    /**
     * 滚动条宽度
     */
    width?: number
    /**
     * 滚动条高度
     */
    height?: number
    /**
     * 横向滚动条
     */
    x?: {
      /**
       * 滚动条显示位置
       */
      position?: 'top' | 'bottom' | ''
    }
    /**
     * 纵向滚动条
     */
    y?: {
      /**
       * 滚动条显示位置
       */
      position?: 'left' | 'right' | ''
    }
  }

  export type Params = any

  /**
     * 导入参数
     */
  export interface ImportConfig {
    // 内置属性
    _typeMaps?: Record<string, number>

    /**
     * 可选文件类型列表
     */
    types?: string[]
    /**
     * 导入数据的方式
     */
    mode?: string
    /**
     * 导入数据的方式列表
     */
    modes?: (string | {
      label?: string | number
      value: string | number
    })[]
    /**
     * 是否显示内置的消息提示
     */
    message?: boolean
    /**
     * 是否服务端导出
     */
    remote?: boolean
    encoding?: string
    /**
     * 自定义参数
     */
    params?: Record<string, any>
    /**
     * 只对 remote=true 有效，用于自定义导入逻辑
     */
    importMethod?(params: {
      $table: VxeTableConstructor
      $grid: VxeGridConstructor | null | undefined
      file: File
      options: ImportHandleOptions
    }): Promise<any>
    beforeImportMethod?(params: {
      $table: VxeTableConstructor
      options: any
    }): void
    afterImportMethod?(params: {
      $table: VxeTableConstructor
      options: any
      status: boolean
    }): void

    /**
     * 自定义高级导入窗口的插槽模板
     */
    slots?: {
      top?: string | ((params: VxeTableDefines.ImportSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      bottom?: string | ((params: VxeTableDefines.ImportSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      default?: string | ((params: VxeTableDefines.ImportSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      footer?: string | ((params: VxeTableDefines.ImportSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
    }
  }
  export interface ImportOpts extends ImportConfig {}
  export interface ImportHandleOptions extends ImportConfig {
    data: any[]
    columns: VxeTableDefines.ColumnInfo[]
    colgroups: VxeTableDefines.ColumnInfo[][]
  }

  export interface ExportOrPrintColumnOption {
    colid?: number
    type?: string
    field?: string
  }

  /**
   * 导出参数
   */
  export interface ExportConfig {
    // 内置属性
    _typeMaps?: Record<string, number>

    /**
     * 文件名
     */
    filename?: string | ((params: {
      $table: VxeTableConstructor
      $grid: VxeGridConstructor | null | undefined
      options: ExportOpts
    }) => string)
    /**
     * 表名
     */
    sheetName?: string | ((params: {
      $table: VxeTableConstructor
      $grid: VxeGridConstructor | null | undefined
      options: ExportOpts
    }) => string)
    /**
     * 文件类型
     */
    type?: string
    /**
     * 可选文件类型列表
     */
    types?: string[]
    /**
     * 导出数据的方式
     */
    mode?: string
    /**
     * 导出数据的方式列表
     */
    modes?: (string | {
      label?: string | number
      value: string | number
    })[]
    /**
     * 是否为源数据
     */
    original?: boolean
    /**
     * 是否显示内置的消息提示
     */
    message?: boolean
    /**
     * 是否需要表头
     */
    isHeader?: boolean
    /**
     * 是否需要表尾
     */
    isFooter?: boolean
    isMerge?: boolean
    isColgroup?: boolean
    /**
     * 是否马上下载，如果设置为 false 则通过返回结果为内容的 Promise
     */
    download?: boolean
    /**
     * 自定义数据
     */
    data?: any[]
    /**
     * 自定义列
     */
    columns?: VxeTableDefines.ColumnInfo[] | ExportOrPrintColumnOption[]
    /**
     * 指定列
     */
    includeFields?: string[]
    /**
     * 排序列
     */
    excludeFields?: string[]
    /**
     * 列过滤方法
     */
    columnFilterMethod?(params: { column: VxeTableDefines.ColumnInfo, $columnIndex: number }): boolean
    /**
     * 数据过滤方法
     */
    dataFilterMethod?(params: { row: any, $rowIndex: number }): boolean
    /**
     * 表尾过滤方法
     */
    footerFilterMethod?(params: { items: any[], $rowIndex: number }): boolean
    /**
     * 是否服务端导出
     */
    remote?: boolean
    /**
     * 只对 remote=html,xlsx 有效，是否使用样式
     */
    useStyle?: boolean
    sheetMethod?(params: VxeTableDefines.ExtortSheetMethodParams): void
    /**
     * 自定义参数
     */
    params?: Record<string, any>
    /**
     * 只对 remote=true 有效，用于自定义导出逻辑
     */
    exportMethod?(params: {
      $table: VxeTableConstructor
      $grid: VxeGridConstructor | null | undefined
      options: ExportHandleOptions
    }): Promise<any>
    beforeExportMethod?(params: {
      $table: VxeTableConstructor
      $grid: VxeGridConstructor | null | undefined
      options: ExportHandleOptions
    }): void
    afterExportMethod?(params: {
      $table: VxeTableConstructor
      $grid: VxeGridConstructor | null | undefined
      status: boolean
      options: ExportHandleOptions
    }): void

    /**
     * 自定义高级导出窗口的插槽模板
     */
    slots?: {
      top?: string | ((params: VxeTableDefines.ExtortSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      bottom?: string | ((params: VxeTableDefines.ExtortSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      default?: string | ((params: VxeTableDefines.ExtortSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      footer?: string | ((params: VxeTableDefines.ExtortSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      parameter?: string | ((params: VxeTableDefines.ExtortSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
    }
  }
  export interface ExportOpts extends ExportConfig { }
  export interface ExportHandleOptions extends Exclude<ExportConfig, 'filename' | 'sheetName'> {
    filename: string
    sheetName: string
    data: any[]
    columns: VxeTableDefines.ColumnInfo[]
    colgroups: VxeTableDefines.ColumnInfo[][]

    /**
     * @private
     */
    isAllExpand?: boolean
    /**
     * @private
     */
    _isCustomColumn?: boolean
    /**
     * @private
     */
    print?: boolean
  }

  /**
   * 打印参数
   */
  export interface PrintConfig {
    /**
     * 表名
     */
    sheetName?: string | ((params: {
      $table: VxeTableConstructor
      $grid: VxeGridConstructor | null | undefined
      options: ExportOpts
    }) => string)
    /**
     * 导出数据的方式
     */
    mode?: string
    /**
     * 导出数据的方式列表
     */
    modes?: (string | {
      label?: string | number
      value: string | number
    })[]
    /**
     * 是否为源数据
     */
    original?: boolean
    /**
     * 是否需要表头
     */
    isHeader?: boolean
    /**
     * 是否需要表尾
     */
    isFooter?: boolean
    /**
     * 自定义数据
     */
    data?: any[]
    /**
     * 自定义列
     */
    columns?: VxeTableDefines.ColumnInfo[] | ExportOrPrintColumnOption[]
    /**
     * 打印样式
     */
    style?: string
    /**
     * 自定义打印内容
     */
    html?: string
    /**
     * 自定义参数
     */
    params?: Record<string, any>
    /**
     * 指定列
     */
    includeFields?: string[]
    /**
     * 排序列
     */
    excludeFields?: string[]
    /**
     * 列过滤方法
     */
    columnFilterMethod?(params: { column: VxeTableDefines.ColumnInfo, $columnIndex: number }): boolean
    /**
     * 数据过滤方法
     */
    dataFilterMethod?(params: { row: any, $rowIndex: number }): boolean
    /**
     * 表尾过滤方法
     */
    footerFilterMethod?(params: { items: any[], $rowIndex: number }): boolean
    /**
     * 打印之前的方法，可以通过返回自定义打印的内容
     */
    beforePrintMethod?(params: {
      $table: VxeTableConstructor | null
      html: string
      options: PrintHandleOptions

      /**
       * 已被 html 替换
       * @deprecated
       */
      content: string
    }): string

    /**
     * 自定义高级导出窗口的插槽模板
     */
    slots?: {
      top?: string | ((params: VxeTableDefines.PrintSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      bottom?: string | ((params: VxeTableDefines.PrintSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      default?: string | ((params: VxeTableDefines.PrintSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      footer?: string | ((params: VxeTableDefines.PrintSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      parameter?: string | ((params: VxeTableDefines.PrintSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
    }

    /**
     * 已被 html 替换
     * @deprecated
     */
    content?: string
  }
  export interface PrintOpts extends PrintConfig { }
  export interface PrintHandleOptions extends PrintConfig { }
}

export interface VxeTableProps<D = any> {
  size?: VxeTablePropTypes.Size
  /**
   * 唯一标识
   * 当使用某个特定功能时，需要设置才能生效
   */
  id?: VxeTablePropTypes.ID<D>
  /**
   * 表格数据
   * 与 loadData 行为一致，更新数据是不会重置状态
   */
  data?: VxeTablePropTypes.Data<D>
  /**
   * 表格的高度；支持铺满父容器或者固定高度，如果设置 auto 为铺满父容器（如果设置为 auto，则必须确保存在父节点且不允许存在相邻元素）
   */
  height?: VxeTablePropTypes.Height
  /**
   * 表格最小高度
   */
  minHeight?: VxeTablePropTypes.MinHeight
  /**
   * max-height
   */
  maxHeight?: VxeTablePropTypes.MaxHeight
  /**
   * 是否带有斑马纹（需要注意的是，在可编辑表格场景下，临时插入的数据不会有斑马纹样式）
   */
  stripe?: VxeTablePropTypes.Stripe
  /**
   * 已废弃，被 cell-config.padding 替换
   * @deprecated
   */
  padding?: VxeTablePropTypes.Padding
  /**
   * 是否为圆角边框
   */
  round?: VxeTablePropTypes.Round
  /**
   * 是否带有边框
   */
  border?: VxeTablePropTypes.Border
  /**
   * 表格是否显示加载中
   */
  loading?: VxeTablePropTypes.Loading
  /**
   * 所有的列对齐方式
   */
  align?: VxeTablePropTypes.Align
  /**
   * 所有的表头列的对齐方式
   */
  headerAlign?: VxeTablePropTypes.HeaderAlign
  /**
   * 所有的表尾列的对齐方式
   */
  footerAlign?: VxeTablePropTypes.FooterAlign
  /**
   * 是否显示表头
   */
  showHeader?: VxeTablePropTypes.ShowHeader
  /**
   * 是否显示表尾
   */
  showFooter?: VxeTablePropTypes.ShowFooter
  /**
   * 表尾数据
   */
  footerData?: VxeTablePropTypes.FooterData
  /**
   * 表尾的数据获取方法，返回一个二维数组
   */
  footerMethod?: VxeTablePropTypes.FooterMethod<D>
  /**
   * 给行附加 className
   */
  rowClassName?: VxeTablePropTypes.RowClassName<D>
  /**
   * 给单元格附加 className
   */
  cellClassName?: VxeTablePropTypes.CellClassName<D>
  /**
   * 给表头的行附加 className
   */
  headerRowClassName?: VxeTablePropTypes.HeaderRowClassName<D>
  /**
   * 给表头的单元格附加 className
   */
  headerCellClassName?: VxeTablePropTypes.HeaderCellClassName<D>
  /**
   * 给表尾的行附加 className
   */
  footerRowClassName?: VxeTablePropTypes.FooterRowClassName<D>
  /**
   * 给表尾的单元格附加 className
   */
  footerCellClassName?: VxeTablePropTypes.FooterCellClassName<D>
  /**
   * 给单元格附加样式
   */
  cellStyle?: VxeTablePropTypes.CellStyle<D>
  /**
   * 给行附加样式，也可以是函数
   */
  rowStyle?: VxeTablePropTypes.RowStyle<D>
  /**
   * 给表头单元格附加样式
   */
  headerCellStyle?: VxeTablePropTypes.HeaderCellStyle<D>
  /**
   * 给表头行附加样式
   */
  headerRowStyle?: VxeTablePropTypes.HeaderRowStyle<D>
  /**
   * 给表尾行附加样式
   */
  footerRowStyle?: VxeTablePropTypes.FooterRowStyle<D>
  /**
   * 给表尾单元格附加样式
   */
  footerCellStyle?: VxeTablePropTypes.FooterCellStyle<D>
  /**
   * 临时合并指定的单元格 (不能用于展开行，不建议用于固定列、树形结构)
   */
  mergeCells?: VxeTablePropTypes.MergeCells<D>
  /**
   * 临时合并表尾 (不能用于展开行，不建议用于固定列、树形结构)
   */
  mergeFooterItems?: VxeTablePropTypes.MergeFooterItems<D>
  /**
   * 自定义合并函数，返回计算后的值 (不能用于虚拟滚动、展开行，不建议用于固定列、树形结构)
   */
  spanMethod?: VxeTablePropTypes.SpanMethod<D>
  /**
   * 表尾合并行或列，返回计算后的值 (不能用于虚拟滚动、展开行，不建议用于固定列、树形结构)
   */
  footerSpanMethod?: VxeTablePropTypes.FooterSpanMethod<D>
  /**
   * 设置所有内容过长时显示为省略号（如果是固定列建议设置该值，提升渲染速度）
   */
  showOverflow?: VxeTablePropTypes.ShowOverflow
  /**
   * 设置表头所有内容过长时显示为省略号
   */
  showHeaderOverflow?: VxeTablePropTypes.ShowHeaderOverflow
  /**
   * 设置表尾所有内容过长时显示为省略号
   */
  showFooterOverflow?: VxeTablePropTypes.ShowFooterOverflow
  /**
   * 保持原始值的状态，被某些功能所依赖，比如编辑状态、还原数据等
   */
  keepSource?: VxeTablePropTypes.KeepSource
  /**
   * 自动监听父元素的变化去重新计算表格（对于父元素可能存在动态变化、显示隐藏的容器中、列宽异常等场景中的可能会用到）
   */
  autoResize?: VxeTablePropTypes.AutoResize
  /**
   * 自动跟随某个属性的变化去重新计算表格，和手动调用 recalculate 方法是一样的效果（对于通过某个属性来控制显示/隐藏切换时可能会用到）
   */
  syncResize?: VxeTablePropTypes.SyncResize
  /**
   * 列配置信息
   */
  columnConfig?: VxeTablePropTypes.ColumnConfig<D>
  /**
   * 行配置信息
   */
  rowConfig?: VxeTablePropTypes.RowConfig<D>
  /**
   * 单元格配置信息
   */
  cellConfig?: VxeTablePropTypes.CellConfig<D>
  /**
   * 表头单元格配置信息
   */
  headerCellConfig?: VxeTablePropTypes.HeaderCellConfig<D>
  /**
   * 表尾单元格配置信息
   */
  footerCellConfig?: VxeTablePropTypes.FooterCellConfig<D>
  /**
   * 当前行配置项
   */
  currentConfig?: VxeTablePropTypes.CurrentConfig<D>
  /**
   * 已废弃，被 rowDragConfig 替换
   * @deprecated
   */
  dragConfig?: VxeTablePropTypes.DragConfig<D>
  /**
   * 行拖拽排序配置项
   */
  rowDragConfig?: VxeTablePropTypes.RowDragConfig<D>
  /**
   * 列拖拽排序配置项
   */
  columnDragConfig?: VxeTablePropTypes.ColumnDragConfig<D>
  /**
   * 个性化信息配置项
   */
  customConfig?: VxeTablePropTypes.CustomConfig<D>
  /**
   * 响应式布局配置项
   */
  resizeConfig?: VxeTablePropTypes.ResizeConfig
  /**
   * 列宽拖动配置项
   */
  resizableConfig?: VxeTablePropTypes.ResizableConfig<D>
  /**
   * 序号配置项
   */
  seqConfig?: VxeTablePropTypes.SeqConfig<D>
  /**
   * 排序配置项
   */
  sortConfig?: VxeTablePropTypes.SortConfig<D>
  /**
   * 筛选配置项
   */
  filterConfig?: VxeTablePropTypes.FilterConfig<D>
  /**
   * 单选框配置项
   */
  radioConfig?: VxeTablePropTypes.RadioConfig<D>
  /**
   * 复选框配置项
   */
  checkboxConfig?: VxeTablePropTypes.CheckboxConfig<D>
  /**
   * 工具提示配置项
   */
  tooltipConfig?: VxeTablePropTypes.TooltipConfig<D>
  /**
   * 导出配置项
   */
  exportConfig?: VxeTablePropTypes.ExportConfig
  /**
   * 导入配置项
   */
  importConfig?: VxeTablePropTypes.ImportConfig
  /**
   * 打印配置项
   */
  printConfig?: VxeTablePropTypes.PrintConfig
  /**
   * 展开行配置项
   */
  expandConfig?: VxeTablePropTypes.ExpandConfig<D>
  /**
   * 树形结构配置项
   */
  treeConfig?: VxeTablePropTypes.TreeConfig<D>
  /**
   * 右键菜单配置项
   */
  menuConfig?: VxeTablePropTypes.MenuConfig<D>
  /**
   * 鼠标配置项
   */
  mouseConfig?: VxeTablePropTypes.MouseConfig
  /**
   * 区域选取配置项
   */
  areaConfig?: VxeTablePropTypes.AreaConfig<D>
  /**
   * 查找/替换配置项
   */
  fnrConfig?: VxeTablePropTypes.FNRConfig<D>
  /**
   * 按键配置项
   */
  keyboardConfig?: VxeTablePropTypes.KeyboardConfig<D>
  /**
   * 复制/粘贴配置项
   */
  clipConfig?: VxeTablePropTypes.ClipConfig<D>
  /**
   * 可编辑配置项
   */
  editConfig?: VxeTablePropTypes.EditConfig<D>
  /**
   * 校验配置项
   */
  validConfig?: VxeTablePropTypes.ValidConfig<D>
  /**
   * 校验规则配置项
   */
  editRules?: VxeTablePropTypes.EditRules<D>
  /**
   * 空数据时显示的内容
   */
  emptyText?: VxeTablePropTypes.EmptyText
  /**
   * 空内容渲染配置项，empty-render 的优先级大于 empty-text
   */
  emptyRender?: VxeTablePropTypes.EmptyRender
  /**
   * 加载中配置项
   */
  loadingConfig?: VxeTablePropTypes.LoadingConfig
  /**
   * 已废弃，不建议使用，被 virtual-x-config 替换
   * @deprecated
   */
  scrollX?: VxeTablePropTypes.ScrollX
  /**
   * 已废弃，不建议使用，被 virtual-y-config 替换
   * @deprecated
   */
  scrollY?: VxeTablePropTypes.ScrollY
  /**
   * 横向虚拟滚动配置
   */
  virtualXConfig?: VxeTablePropTypes.VirtualXConfig
  /**
   * 纵向虚拟滚动配置
   */
  virtualYConfig?: VxeTablePropTypes.VirtualYConfig
  /**
   * 滚动条配置项
   */
  scrollbarConfig?: VxeTablePropTypes.ScrollbarConfig
  /**
   * 自定义参数（可以用来存放一些自定义的数据）
   */
  params?: VxeTablePropTypes.Params

  /**
   * 已废弃，不建议使用，被 column-config.resizable 替换
   * @deprecated
   */
  resizable?: VxeTablePropTypes.Resizable
  /**
   * 已废弃，不建议使用，被 row-config.isCurrent 替换
   * @deprecated
   */
  highlightCurrentRow?: VxeTablePropTypes.HighlightCurrentRow
  /**
   * 已废弃，不建议使用，被 row-config.isHover 替换
   * @deprecated
   */
  highlightHoverRow?: VxeTablePropTypes.HighlightHoverRow
  /**
   * 已废弃，不建议使用，被 column-config.isCurrent 替换
   * @deprecated
   */
  highlightCurrentColumn?: VxeTablePropTypes.HighlightCurrentColumn
  /**
   * 已废弃，不建议使用，被 column-config.isHover 替换
   * @deprecated
   */
  highlightHoverColumn?: VxeTablePropTypes.HighlightHoverColumn
  /**
   * 已废弃
   * @deprecated
   */
  highlightCell?: VxeTablePropTypes.HighlightCell
  /**
   * 已废弃，请使用 column-config.useKey
   * @deprecated
   */
  columnKey?: VxeTablePropTypes.ColumnKey
  /**
   * 已废弃，请使用 row-config.useKey
   * @deprecated
   */
  rowKey?: VxeTablePropTypes.RowKey
  /**
   * 已废弃，请使用 row-config.keyField
   * @deprecated
   */
  rowId?: VxeTablePropTypes.RowId
  /**
   * 已废弃，已废弃
   * @deprecated
   */
  fit?: VxeTablePropTypes.Fit
  /**
   * 已废弃，已废弃
   * @deprecated
   */
  animat?: VxeTablePropTypes.Animat
  /**
   * 已废弃，已废弃
   * @deprecated
   */
  delayHover?: VxeTablePropTypes.DelayHover
}

export interface TablePrivateComputed<D = any> {
  computeSize: ComputedRef<VxeTablePropTypes.Size>
  computeTableId: ComputedRef<string>
  computeValidOpts: ComputedRef<VxeTablePropTypes.ValidOpts<D>>
  computeVirtualXOpts: ComputedRef<VxeTablePropTypes.VirtualXConfig>
  computeVirtualYOpts: ComputedRef<VxeTablePropTypes.VirtualYConfig>
  computeScrollbarOpts: ComputedRef<VxeTablePropTypes.ScrollbarConfig>
  computeScrollbarXToTop: ComputedRef<boolean>
  computeScrollbarYToLeft: ComputedRef<boolean>
  computeColumnOpts: ComputedRef<VxeTablePropTypes.ColumnOpts>
  computeScrollXThreshold: ComputedRef<number>
  computeScrollYThreshold: ComputedRef<number>
  computeDefaultRowHeight: ComputedRef<number>
  computeCellOpts: ComputedRef<VxeTablePropTypes.CellConfig>
  computeHeaderCellOpts: ComputedRef<VxeTablePropTypes.HeaderCellConfig>
  computeFooterCellOpts: ComputedRef<VxeTablePropTypes.FooterCellConfig>
  computeRowOpts: ComputedRef<VxeTablePropTypes.RowOpts>
  computeRowDragOpts: ComputedRef<VxeTablePropTypes.RowDragConfig>
  computeColumnDragOpts: ComputedRef<VxeTablePropTypes.ColumnDragConfig>
  computeResizeOpts: ComputedRef<VxeTablePropTypes.ResizeOpts>
  computeResizableOpts: ComputedRef<VxeTablePropTypes.ResizableOpts<D>>
  computeSeqOpts: ComputedRef<VxeTablePropTypes.SeqOpts<D>>
  computeRadioOpts: ComputedRef<VxeTablePropTypes.RadioOpts<D>>
  computeCheckboxOpts: ComputedRef<VxeTablePropTypes.CheckboxOpts<D>>
  computeTooltipOpts: ComputedRef<VxeTablePropTypes.TooltipOpts<D>>
  computeEditOpts: ComputedRef<VxeTablePropTypes.EditOpts<D>>
  computeSortOpts: ComputedRef<VxeTablePropTypes.SortConfig<D>>
  computeFilterOpts: ComputedRef<VxeTablePropTypes.FilterOpts<D>>
  computeMouseOpts: ComputedRef<VxeTablePropTypes.MouseOpts>
  computeAreaOpts: ComputedRef<VxeTablePropTypes.AreaOpts>
  computeKeyboardOpts: ComputedRef<VxeTablePropTypes.KeyboardOpts>
  computeClipOpts: ComputedRef<VxeTablePropTypes.ClipOpts<D>>
  computeFNROpts: ComputedRef<VxeTablePropTypes.FNROpts<D>>
  computeHeaderMenu: ComputedRef<VxeTableDefines.MenuFirstOption>
  computeBodyMenu: ComputedRef<VxeTableDefines.MenuFirstOption>
  computeFooterMenu: ComputedRef<VxeTableDefines.MenuFirstOption>
  computeIsMenu: ComputedRef<boolean>
  computeMenuOpts: ComputedRef<VxeTablePropTypes.MenuOpts<D>>
  computeExportOpts: ComputedRef<VxeTablePropTypes.ExportOpts>
  computeImportOpts: ComputedRef<VxeTablePropTypes.ImportOpts>
  computePrintOpts: ComputedRef<VxeTablePropTypes.PrintOpts>
  computeExpandOpts: ComputedRef<VxeTablePropTypes.ExpandOpts<D>>
  computeTreeOpts: ComputedRef<VxeTablePropTypes.TreeOpts<D>>
  computeEmptyOpts: ComputedRef<VxeTablePropTypes.EmptyOpts>
  computeLoadingOpts: ComputedRef<VxeTablePropTypes.LoadingOpts>
  computeCellOffsetWidth: ComputedRef<number>
  computeCustomOpts: ComputedRef<VxeTablePropTypes.CustomOpts<D>>
  computeLeftFixedWidth: ComputedRef<number>
  computeRightFixedWidth: ComputedRef<number>
  computeFixedColumnSize: ComputedRef<number>
  computeIsMaxFixedColumn: ComputedRef<boolean>
  computeIsAllCheckboxDisabled: ComputedRef<boolean>
  computeVirtualScrollBars: ComputedRef<{
    x: boolean
    y: boolean
  }>

  /**
   * @deprecated
   */
  computeSXOpts: ComputedRef<VxeTablePropTypes.SXOpts>
  /**
   * @deprecated
   */
  computeSYOpts: ComputedRef<VxeTablePropTypes.SYOpts>
}
export interface VxeTablePrivateComputed extends TablePrivateComputed { }

export interface TableReactData<D = any> {
  // 低性能的静态列
  staticColumns: any[]
  // 渲染的列分组
  tableGroupColumn: any[]
  // 可视区渲染的列
  tableColumn: any[]
  // 渲染中的数据
  tableData: D[]
  // 是否启用了横向 X 可视渲染方式加载
  scrollXLoad: boolean
  // 是否启用了纵向 Y 可视渲染方式加载
  scrollYLoad: boolean
  // 是否存在纵向滚动条
  overflowY: boolean
  // 是否存在横向滚动条
  overflowX: boolean
  // 纵向滚动条的宽度
  scrollbarWidth: number
  // 横向滚动条的高度
  scrollbarHeight: number
  // 最后滚动时间戳
  lastScrollTime: number
  /**
   * 行高
   * @deprecated
   * @property
   */
  rowHeight: number
  // 表格父容器的高度
  parentHeight: number
  // 是否使用分组表头
  isGroup: boolean
  isAllOverflow: boolean
  // 复选框属性，是否全选
  isAllSelected: boolean
  // 复选框属性，有选中且非全选状态
  isIndeterminate: boolean
  // 复选框属性，已选中的行集合
  selectCheckboxMaps: Record<string, D>
  // 当前行
  currentRow: D | null
  // 单选框属性，选中列
  currentColumn: any
  // 单选框属性，选中行
  selectRadioRow: D | null
  // 表尾合计数据
  footerTableData: any[][]
  // 展开列信息
  expandColumn: any
  hasFixedColumn: boolean
  // 已展开的行
  rowExpandedMaps: Record<string, D | null>
  // 懒加载中的展开行
  rowExpandLazyLoadedMaps: Record<string, D | null>
  // 树节点列信息
  treeNodeColumn: any
  // 已展开树节点
  treeExpandedMaps: Record<string, D | null>
  // 懒加载中的树节点的集合
  treeExpandLazyLoadedMaps: Record<string, D | null>
  // 树节点不确定状态的集合
  treeIndeterminateMaps: Record<string, D | null>
  // 合并单元格的对象集
  mergeList: VxeTableDefines.MergeItem<D>[]
  // 合并表尾数据的对象集
  mergeFooterList: VxeTableDefines.MergeItem<D>[]
  // 刷新列标识，当列筛选被改变时，触发表格刷新数据
  upDataFlag: number
  // 刷新列标识，当列的特定属性被改变时，触发表格刷新列
  reColumnFlag: number
  // 已标记的对象集
  pendingRowMaps: Record<string, D | null>
  // 初始化标识
  initStore: {
    filter: boolean
    import: boolean
    export: boolean
    custom: boolean
  }
  // 自定义列相关的信息
  customStore: VxeTableDefines.VxeTableCustomStoreObj
  customColumnList: VxeTableDefines.ColumnInfo<D>[]
  // 当前选中的筛选列
  filterStore: {
    isAllSelected: boolean
    isIndeterminate: boolean
    style: any
    options: any[]
    column: any
    multiple: boolean
    visible: boolean
    maxHeight: number | null
    [key: string]: any
  }
  // 存放列相关的信息
  columnStore: {
    leftList: VxeTableDefines.ColumnInfo<D>[]
    centerList: VxeTableDefines.ColumnInfo<D>[]
    rightList: VxeTableDefines.ColumnInfo<D>[]
    resizeList: VxeTableDefines.ColumnInfo<D>[]
    pxList: VxeTableDefines.ColumnInfo<D>[]
    pxMinList: VxeTableDefines.ColumnInfo<D>[]
    autoMinList: VxeTableDefines.ColumnInfo<D>[]
    scaleList: VxeTableDefines.ColumnInfo<D>[]
    scaleMinList: VxeTableDefines.ColumnInfo<D>[]
    autoList: VxeTableDefines.ColumnInfo<D>[]
    remainList: VxeTableDefines.ColumnInfo<D>[]
  }
  // 存放快捷菜单的信息
  ctxMenuStore: {
    selected: any
    visible: boolean
    showChild: boolean
    selectChild: any
    list: any[][]
    style: any
    [key: string]: any
  }
  // 存放可编辑相关信息
  editStore: {
    indexs: {
      columns: any[]
    }
    titles: {
      columns: any[]
    }
    // 选中源
    selected: {
      row: D | null
      column: any
      [key: string]: any
    }
    // 已复制源
    copyed: {
      cut: boolean
      rows: D[]
      columns: any[]
      [key: string]: any
    }
    // 激活
    actived: {
      row: D | null
      column: any
      [key: string]: any
    }
    // 当前被强制聚焦单元格，只会在鼠标点击后算聚焦
    focused: {
      row: D | null
      column: any
      [key: string]: any
    }
    insertMaps: {
      [key: string]: any
    }
    removeMaps: {
      [key: string]: any
    }
  }
  // 存放 tooltip 相关信息
  tooltipStore: {
    row: D | null
    column: any
    content: any
    visible: boolean,
    currOpts: {
      useHTML?: VxeTooltipPropTypes.UseHTML
      enterable?: VxeTooltipPropTypes.Enterable
      theme?: VxeTooltipPropTypes.Theme
    }
  }
  // 存放数据校验相关信息
  validStore: {
    visible: boolean
  }
  validErrorMaps: {
    [key: string]: {
      row: D | null
      column: any
      rule: any
      content: any
    }
  }
  // 导入相关信息
  importStore: {
    inited: boolean
    file: any
    type: any
    modeList: any[]
    typeList: any[]
    filename: string
    visible: boolean
  },
  importParams: {
    mode: any
    types: any
    message: boolean
  }
  // 导出相关信息
  exportStore: {
    inited: boolean
    name: any
    modeList: any[]
    typeList: any[]
    columns: any[]
    isPrint: boolean
    hasFooter: boolean
    hasMerge: boolean
    hasTree: boolean
    hasColgroup: boolean
    visible: boolean
  }
  exportParams: {
    filename: string
    sheetName: string
    mode: any
    type: any
    isColgroup: boolean
    isMerge: boolean
    isAllExpand: boolean
    useStyle: boolean
    original: boolean
    message: boolean
    isHeader: boolean
    isFooter: boolean
  }
  rowHeightStore: {
    default: number
    medium: number
    small: number
    mini: number
  }

  scrollVMLoading: boolean

  rowExpandHeightFlag: number
  calcCellHeightFlag: number
  resizeHeightFlag: number

  isCustomStatus: boolean

  isDragRowMove: Boolean
  dragRow: any
  isDragColMove: boolean
  dragCol: VxeTableDefines.ColumnInfo | null
  dragTipText: string

  isDragResize: boolean
  isRowLoading: boolean
  isColLoading: boolean
}

export interface TableInternalData<D = any> {
  tZindex: number
  elemStore: {
    [key: string]: Ref<HTMLElement> |Ref<ComponentPublicInstance> | null
  }
  // 存放横向 X 虚拟滚动相关的信息
  scrollXStore: {
    preloadSize: number
    offsetSize: number
    visibleSize: number
    visibleStartIndex: number
    visibleEndIndex: number
    startIndex: number
    endIndex: number
  }
  // 存放纵向 Y 虚拟滚动相关信息
  scrollYStore: {
    adaptive?: boolean
    preloadSize: number
    offsetSize: number
    visibleSize: number
    visibleStartIndex: number
    visibleEndIndex: number
    startIndex: number
    endIndex: number
  }
  // 表格宽度
  tableWidth: number
  // 表格高度
  tableHeight: number
  // 表头高度
  headerHeight: number
  // 表尾高度
  footerHeight: number
  customHeight: number
  customMinHeight: number
  customMaxHeight: number
  // 当前 hover 行
  hoverRow: any
  // 最后滚动位置
  lastScrollLeft: number
  lastScrollTop: number
  // 单选框属性，已选中保留的行
  radioReserveRow: any
  // 复选框属性，已选中保留的行
  checkboxReserveRowMap: any
  // 行数据，已展开保留的行集合
  rowExpandedReserveRowMap: Record<string, D>
  // 树结构数据，已展开保留的行集合
  treeExpandedReserveRowMap: Record<string, D>
  // 树结构数据，不确定状态的集合
  treeIndeterminateRowMaps: Record<string, D>
  // 列表完整数据、条件处理后
  tableFullData: D[]
  afterFullData: D[]
  afterTreeFullData: D[]
  // 列表条件处理后数据集合
  afterFullRowMaps: Record<string, D>
  tableSynchData: D[]
  tableSourceData: D[]
  // 树的全量数据、条件处理后
  tableFullTreeData: D[]
  // 收集的列配置（带分组）
  collectColumn: VxeTableDefines.ColumnInfo<D>[],
  // 完整所有列（不带分组）
  tableFullColumn: VxeTableDefines.ColumnInfo<D>[]
  // 渲染所有列
  visibleColumn: VxeTableDefines.ColumnInfo<D>[]
  // 缓存数据集
  fullAllDataRowIdData: Record<string, VxeTableDefines.RowCacheItem<D>>
  sourceDataRowIdData: Record<string, D>
  fullDataRowIdData: Record<string, VxeTableDefines.RowCacheItem<D>>
  fullColumnIdData: Record<string, VxeTableDefines.ColumnCacheItem<D>>
  fullColumnFieldData: Record<string, VxeTableDefines.ColumnCacheItem<D>>

  // 上一个拖动的行
  prevDragRow?: any
  // 上一个拖动的列
  prevDragCol?: VxeTableDefines.ColumnInfo
  prevDragToChild?: boolean
  prevDragPos?: 'top' | 'bottom' | 'left' | 'right' | ''

  // 特殊标识
  inited: boolean
  tooltipTimeout: any
  initStatus: boolean
  isActivated: boolean

  keyCtxTimeout?: undefined | number

  // 刷新布局
  rceTimeout?: undefined | number
  rceRunTime?: undefined | number

  // 滚动属性
  intoRunScroll?: boolean
  inVirtualScroll?: boolean
  inWheelScroll?: boolean

  inHeaderScroll?: boolean
  inBodyScroll?: boolean
  inFooterScroll?: boolean
  scrollRenderType?: '' | 'left' | 'right'
  // 同步滚动
  lcsTimeout?: undefined | number
  lcsRunTime?: undefined | number

  // 横向虚拟
  lxRunTime?: undefined | number
  lxTimeout?: undefined | number
  // 纵向虚拟
  lyRunTime?: undefined | number
  lyTimeout?: undefined | number

  // 动态高度
  chRunTime?: undefined | number
  chTimeout?: undefined | number

  isResizeCellHeight?: boolean

  // 内部属性
  _lastResizeTime?: any
  _keyCtx?: any
  _lastCallTime?: any
  _importResolve?: ((...args: any[]) => any) | null
  _importReject?: ((...args: any[]) => any) | null
  _currFilterParams?: any
  _currMenuParams?: any
}

export interface TableMethods<DT = any> {
  dispatchEvent(type: ValueOf<VxeTableEmits>, params: Record<string, any>, evnt: Event | null): void
  /**
   * 手动清除表格所有条件，还原到初始状态
   * 对于增删改查的场景中可能会用到，比如在数据保存之后清除表格缓存
   */
  clearAll(): Promise<void>
  /**
   * 该方法已废弃！！！
   * 同步 data 数据；如果用了该方法，那么组件将不再记录增删改的状态，只能自行实现对应逻辑
   * 对于某些特殊的场景，比如深层树节点元素发生变动时可能会用到
   * @deprecated
   */
  syncData(): Promise<void>
  /**
   * 手动处理数据，用于手动排序与筛选
   * 对于手动更改了排序、筛选...等条件后需要重新处理数据时可能会用到
   */
  updateData(): Promise<void>
  /**
   * 加载数据
   * @param data 数据
   */
  loadData(data: any[]): Promise<any>
  /**
   * 加载数据并恢复到初始状态
   * @param data 数据
   */
  reloadData(data: any[]): Promise<void>
  /**
   * 修改行数据
   * @param rows 行对象
   * @param record 新数据
   */
  setRow(rows: any | any[], record?: any): Promise<void>
  /**
   * 修改行数据并恢复到初始状态，比如编辑之后需要修改成未编辑状态
   * @param rows 行对象
   * @param record 新数据
   * @param field 指定字段名
   */
  reloadRow(rows: any | any[], record?: any, field?: string): Promise<void>
  /**
   * 获取自定义的 params 属性
   */
  getParams (): any
  /**
   * 用于树结构，给行数据加载子节点
   * @param row 行对象
   * @param children 子节点
   */
  loadTreeChildren(row: any, children: any[]): Promise<any[]>
  /**
   * 加载列配置
   * @param columns 列对象
   */
  loadColumn(columns: (VxeTableDefines.ColumnOptions<any> | VxeTableDefines.ColumnInfo<any>)[]): Promise<any>
  /**
   * 加载列配置并恢复到初始状态
   * @param columns 列对象
   */
  reloadColumn(columns: (VxeTableDefines.ColumnOptions<any> | VxeTableDefines.ColumnInfo<any>)[]): Promise<any>
  /**
   * 根据 tr 元素获取对应的 row 信息
   * @param tr 行节点元素
   */
  getRowNode(trElem: HTMLElement): {
    rowid: string
    item: any
    items: any[]
    index: number
    parent?: any
  } | null
  /**
   * 根据 th/td 元素获取对应的 column 信息
   * @param cell 单元格节点元素
   */
  getColumnNode(cellElem: HTMLElement): {
    colid: string
    item: VxeTableDefines.ColumnInfo<DT>
    items: VxeTableDefines.ColumnInfo<DT>[]
    index: number
    parent: VxeTableDefines.ColumnInfo<DT> | null
  } | null
  /**
   * 根据 row 获取行的序号
   * @param row 行对象
   */
  getRowSeq(row: any): string | number
  /**
   * 根据 row 获取相对于 data 中的索引
   * @param row 行对象
   */
  getRowIndex(row: any): number
  /**
   * 根据 row 获取相对于当前数据中的索引
   * @param row 行对象
   */
  getVTRowIndex(row: any): number
  /**
   * 根据 row 获取渲染中的虚拟索引
   * @param row 行对象
   */
  getVMRowIndex(row: any): number
  /**
   * 根据 column 获取相对于 columns 中的索引
   * @param column 列对象
   */
  getColumnIndex(column: VxeTableDefines.ColumnInfo<any>): number
  /**
   * 根据 column 获取相对于当前表格列中的索引
   * @param column 列对象
   */
  getVTColumnIndex(column: VxeTableDefines.ColumnInfo<any>): number
  /**
   * 根据 column 获取渲染中的虚拟索引
   * @param column 列对象
   */
  getVMColumnIndex(column: VxeTableDefines.ColumnInfo<any>): number
  /**
   * 创建 data 对象
   * 对于某些特殊场景可能会用到，会自动对数据的字段名进行检测，如果不存在就自动定义
   * @param records 数据
   */
  createData(records: any[]): Promise<any[]>
  /**
   * 创建 Row|Rows 对象
   * 对于某些特殊场景需要对数据进行手动插入时可能会用到
   * @param records 数据
   */
  createRow(records: any | any[]): Promise<any | any[]>
  // /**
  //  * 将表格数据转成原始数据
  //  * 会自动去掉主键等内部属性
  //  * @param rows
  //  */
  // toOriginalRecords(rows: any[]): DT[]
  /**
   * 只对 keep-source 开启有效，还原指定行 row 或者整个表格的数据
   * @param rows 指定行
   * @param field 字段名
   */
  revertData(rows?: any | any[], field?: string): Promise<any>
  /**
   * 手动清空单元格内容，如果不传参数，则清空整个表格内容，如果传了行则清空指定行内容，如果传了指定字段，则清空该字段内容
   * @param rows 指定行
   * @param field 字段名
   */
  clearData(rows?: any | any[], field?: string): Promise<any>
  /**
   * 获取单元格 td 元素
   */
  getCellElement(row: any, fieldOrColumn: VxeColumnPropTypes.Field | VxeTableDefines.ColumnInfo<any> | null): HTMLTableDataCellElement | null
  /**
   * 获取单元格显示值
   */
  getCellLabel(row: any, fieldOrColumn: VxeColumnPropTypes.Field | VxeTableDefines.ColumnInfo<any> | null): string | number | null
  /**
   * 用于 edit-config，判断行是否为新增的临时数据
   * @param row 指定行
   */
  isInsertByRow(row: any | null): boolean
  /**
   * 删除所有新增的临时数据
   */
  removeInsertRow(): Promise<{ row: any, rows: any[] }>
  /**
   * 只对 keep-source 开启有效，判断行数据是否发生改变
   * @param row 指定行
   * @param field 指定字段
   */
  isUpdateByRow(row: any, field?: string | null): boolean
  /**
   * 获取表格的可视列，也可以指定索引获取列
   * @param columnIndex 列索引
   */
  getColumns(): VxeTableDefines.ColumnInfo<DT>[]
  getColumns(columnIndex?: number): VxeTableDefines.ColumnInfo<DT>
  /**
   * 根据列获取列的唯一主键
   * @param fieldOrColumn
   */
  getColid(fieldOrColumn: VxeColumnPropTypes.Field | VxeTableDefines.ColumnInfo<any> | null): string | null
  /**
   * 根据列的唯一主键获取列
   * @param colid 列主键
   */
  getColumnById(colid: string | null): VxeTableDefines.ColumnInfo<DT> | null
  /**
   * 根据列的字段名获取列
   * @param field 字段名
   */
  getColumnByField(field: VxeColumnPropTypes.Field | null): VxeTableDefines.ColumnInfo<DT> | null
  /**
   * 根据列获取列的唯一主键
   * @param fieldOrColumn
   */
  getParentColumn(fieldOrColumn: VxeColumnPropTypes.Field | VxeTableDefines.ColumnInfo<any> | null): VxeTableDefines.ColumnInfo<DT> | null
  /**
   * 获取当前表格的列
   * 收集到的全量列、全量表头列、处理条件之后的全量表头列、当前渲染中的表头列
   */
  getTableColumn(): {
    collectColumn: VxeTableDefines.ColumnInfo<DT>[]
    fullColumn: VxeTableDefines.ColumnInfo<DT>[]
    visibleColumn: VxeTableDefines.ColumnInfo<DT>[]
    tableColumn: VxeTableDefines.ColumnInfo<DT>[]
  }
  /**
   * 获取表格的全量列
   */
  getFullColumns(): VxeTableDefines.ColumnInfo[]
  /**
   * 获取数据，和 data 的行为一致，也可以指定索引获取数据
   */
  getData(): DT[]
  getData(rowIndex: number): DT
  /**
   * 用于 type=checkbox，获取已选中的行数据
   */
  getCheckboxRecords(isFull?: boolean): DT[]
  /**
   * 只对 tree-config 有效，用于树形结构，获取指定行的子级
   */
  getTreeRowChildren(rowOrRowid: any): DT[]
  /**
   * 只对 tree-config 有效，用于树形结构，获取指定行的父级
   */
  getTreeParentRow(rowOrRowid: any): DT | null
   /**
    * 已废弃，请使用 getTreeParentRow
    * @deprecated
    */
   getParentRow(rowOrRowid: any): DT | null
  /**
   * 根据行的唯一主键获取行
   * @param rowid 行主键
   */
  getRowById(rowid: string | number | null): DT | null
  /**
   * 根据行获取行的唯一主键
   * @param row 行对象
   */
  getRowid(row: any | null): string
  /**
   * 获取当前表格的数据
   * 完整的全量表体数据、处理条件之后的全量表体数据、当前渲染中的表体数据、当前渲染中的表尾数据
   */
  getTableData(): {
    fullData: DT[]
    visibleData: DT[]
    tableData: DT[]
    footerData: DT[][]
  }
  /**
   * 获取表格的全量数据，如果是 tree-config 则返回带层级的树结构
   */
  getFullData(): DT[]
  /**
   * 设置指定列为固定列
   * @param fieldOrColumns 列对象或字段名,支持传多个
   */
  setColumnFixed(fieldOrColumns: VxeColumnPropTypes.Field | VxeTableDefines.ColumnInfo<any> | VxeColumnPropTypes.Field[] | VxeTableDefines.ColumnInfo<any>[], fixed: VxeColumnPropTypes.Fixed): Promise<void>
  /**
   * 取消指定的固定列
   * @param fieldOrColumns 列对象或字段名,支持传多个
   */
  clearColumnFixed(fieldOrColumns: VxeColumnPropTypes.Field | VxeTableDefines.ColumnInfo<any> | VxeColumnPropTypes.Field[] | VxeTableDefines.ColumnInfo<any>[]): Promise<void>
  /**
   * 隐藏指定列
   * @param fieldOrColumns 列对象或字段名,支持传多个
   */
  hideColumn(fieldOrColumns: VxeColumnPropTypes.Field | VxeTableDefines.ColumnInfo<any> | VxeColumnPropTypes.Field[] | VxeTableDefines.ColumnInfo<any>[]): Promise<void>
  /**
   * 显示指定列
   * @param fieldOrColumns 列对象或字段名,支持传多个
   */
  showColumn(fieldOrColumn: VxeColumnPropTypes.Field | VxeTableDefines.ColumnInfo<any> | VxeColumnPropTypes.Field[] | VxeTableDefines.ColumnInfo<any>[]): Promise<void>
  /**
   * 设置列宽
   * @param fieldOrColumns 列对象或字段名,支持传多个
   * @param width 宽度 %，px
   */
  setColumnWidth(fieldOrColumns: VxeColumnPropTypes.Field | VxeTableDefines.ColumnInfo<any> | VxeColumnPropTypes.Field[] | VxeTableDefines.ColumnInfo<any>[], width: number | string): Promise<{ status: boolean }>
  /**
   * 获取列宽
   * @param fieldOrColumn 列对象或字段名
   */
  getColumnWidth(fieldOrColumn: VxeColumnPropTypes.Field | VxeTableDefines.ColumnInfo<any>): number;
  /**
   * 已废弃，被 resetCustom 替换
   * @deprecated
   */
  resetColumn(options?: boolean | {
    visible?: boolean
    resizable?: boolean
    fixed?: boolean
    order?: boolean
  }): Promise<void>
  /**
   * 刷新列配置
   * 对于动态修改属性、显示/隐藏列等场景下可能会用到
   * 如果传 true 则会检查列顺序并排序
   */
  refreshColumn(resiveOrder?: boolean): Promise<void>
  /**
   * 批量设置行高
   * @param heightConf
   */
  setRowHeightConf(heightConf: Record<string, number>): Promise<{ status: boolean }>
  /**
   * 批量获取行高
   */
  getRowHeightConf(isFull?: boolean): Record<string, number>
  /**
   * 设置行高
   * @param rowOrId 指定单行或多行
   * @param height 高度
   */
  setRowHeight(rowOrId: any | any[], height: number | string): Promise<{ status: boolean }>
  /**
   * 获取指定行的高度
   * @param rowOrId
   */
  getRowHeight(rowOrId: any): number
  /**
   * 刷新滚动操作，手动同步滚动相关位置
   * 对于某些特殊的操作，比如滚动条错位、固定列不同步
   */
  refreshScroll(): Promise<void>
  /**
   * 重新计算表格，如果传 true 则进行完整计算
   * 对于某些特殊场景可能会用到，比如隐藏的表格、重新计算列宽...等
   */
  recalculate(refull?: boolean): Promise<void>
  /**
   * 打开 tooltip 提示
   * @param target 目标元素
   * @param content 内容
   */
  openTooltip(target: HTMLElement, content: string | number): Promise<any>
  /**
   * 关闭 tooltip 提示
   */
  closeTooltip(): Promise<any>
  /**
   * 用于 type=checkbox，设置行为选中状态，第二个参数为选中与否
   * @param rows 指定行
   * @param checked 是否选中
   */
  setCheckboxRow(rows: any | any[], checked: boolean): Promise<any>
  /**
   * 用于 type=checkbox，设置行为选中状态，第二个参数为选中与否
   * @param keys 指定主键
   * @param checked 是否选中
   */
  setCheckboxRowKey(keys: string | number | (string | number)[] | null | undefined, checked: boolean): Promise<any>
  /**
   * 用于 type=checkbox，判断列头复选框是否被选中
   */
  isAllCheckboxChecked(): boolean
  /**
   * 用于 type=checkbox，判断列头复选框是否被半选
   */
  isAllCheckboxIndeterminate(): boolean
  /**
   * 用于 type=checkbox，判断复选行数据是否勾选
   * @param row 指定行
   */
  isCheckedByCheckboxRow(row: any): boolean
  /**
   * 用于 type=checkbox，判断复选行数据是否勾选
   * @param key 指定主键
   */
  isCheckedByCheckboxRowKey(key: string | number | null | undefined): boolean
  /**
   * 用于 type=checkbox，判断复选行数据是否半选
   * @param row 指定行
   */
  isIndeterminateByCheckboxRow(row: any): boolean
  /**
   * 用于 type=checkbox，判断复选行数据是否半选
   * @param key 指定主键
   */
  isIndeterminateByCheckboxRowKey(key: string | number | null | undefined): boolean
  /**
   * 用于 type=checkbox，切换某一行的选中状态
   * @param row 指定行
   */
  toggleCheckboxRow(row: any): Promise<any>
  /**
   * 用于 type=checkbox，设置所有行的选中状态
   * @param checked 是否选中
   */
  setAllCheckboxRow(checked: boolean): Promise<any>
  /**
   * 用于 radio-config.reserve，获取已保留选中的行数据
   */
  getRadioReserveRecord(isFull?: boolean): any[]
  /**
   * 用于 radio-config.reserve，手动清空用户保留选中的行数据
   */
  clearRadioReserve(): Promise<any>
  /**
   * 用于 checkbox-config.reserve，获取已保留选中的行数据
   */
  getCheckboxReserveRecords(isFull?: boolean): any[]
  /**
   * 用于 type=checkbox，获取半选状态的行数据
   */
  getCheckboxIndeterminateRecords(isFull?: boolean): any[]
  /**
   * 用于 checkbox-config.reserve，手动清空用户保留选中的行数据
   */
  clearCheckboxReserve(): Promise<any>
  /**
   * 用于 type=checkbox，切换所有行的选中状态
   */
  toggleAllCheckboxRow(): Promise<any>
  /**
   * 用于 type=checkbox，手动清空用户的选择
   */
  clearCheckboxRow(): Promise<any>
  /**
   * 用于 row-config.isCurrent，设置某一行为高亮状态
   * @param row 指定行
   */
  setCurrentRow(row: any): Promise<any>
  /**
   * 用于 type=radio，判断单选行数据是否勾选
   * @param row 指定行
   */
  isCheckedByRadioRow(row: any | null): boolean
  /**
   * 用于 type=radio，判断单选行数据是否勾选
   * @param key 指定主键
   */
  isCheckedByRadioRowKey(key: string | number | null | undefined): boolean
  /**
   * 用于 type=radio，设置某一行为选中状态
   * @param row 指定行
   */
  setRadioRow(row: any): Promise<any>
  /**
   * 用于 type=radio，设置某一行为选中状态
   * @param key 指定主键
   */
  setRadioRowKey(key: string | number | null | undefined): Promise<any>
  /**
   * 将指定行设置为取消/标记待删除状态
   */
  setPendingRow(rows: any | any[], status: boolean): Promise<any>
  /**
   * 切换指定行的取消/标记待删除状态
   */
  togglePendingRow(rows: any | any[]): Promise<any>
  /**
   * 获取待删除状态的数据
   */
  getPendingRecords(): DT[]
  /**
   * 请使用 isPendingByRow
   * @deprecated
   */
  hasPendingByRow(row: any): boolean
  /**
   * 判断行是否为待删除状态
   * @param row 指定行
   */
  isPendingByRow(row: any): boolean
  /**
   * 清除所有标记状态
   */
  clearPendingRow(): Promise<any>
  /**
   * 手动清除临时合并的单元格
   */
  clearMergeCells(): Promise<any>
  /**
   * 手动清除临时合并的表尾
   */
  clearMergeFooterItems(): Promise<any>
  /**
   * 用于 row-config.isCurrent，手动清空当前高亮的状态
   */
  clearCurrentRow(): Promise<any>
  /**
   * 用于 type=radio，手动清空用户的选择
   */
  clearRadioRow(): Promise<any>
  /**
   * 获取临时合并的单元格
   */
  getMergeCells(): VxeTableDefines.MergeInfo[]
  /**
   * 获取临时合并的表尾
   */
  getMergeFooterItems(): VxeTableDefines.MergeInfo[]
  /**
   * 用于 column-config.isCurrent，获取当前列
   */
  getCurrentColumn(): VxeTableDefines.ColumnInfo<DT> | null
  /**
   * 用于 row-config.isCurrent，获取当前行的行数据
   */
  getCurrentRecord(): DT | null
  /**
   * 用于 type=radio，获取当已选中的行数据
   */
  getRadioRecord(isFull?: boolean): DT | null
  /**
   * 用于 column-config.isCurrent，设置某列行为高亮状态
   * @param columnOrField 列对象或字段名
   */
  setCurrentColumn(fieldOrColumn: VxeColumnPropTypes.Field | VxeTableDefines.ColumnInfo<any>): Promise<void>
  /**
   * 用于 column-config.isCurrent，手动清空当前高亮的状态
   */
  clearCurrentColumn(): Promise<void>
  /**
   * 手动对表格进行排序，建议使用 setSort 方法
   * @param sortConfs 字段名、多列排序
   * @param order 排序方式
   */
  sort(field: string, order?: VxeTablePropTypes.SortOrder): Promise<void>
  sort(sortConfs: VxeTableDefines.SortConfs, order?: VxeTablePropTypes.SortOrder): Promise<void>
  sort(sortConfs: VxeTableDefines.SortConfs[], order?: VxeTablePropTypes.SortOrder): Promise<void>

  /**
   * 手动对表格进行排序
   * @param sortConfs
   * @param update 是否同时更新数据，如果不传，则可以手动调用 updateData() 更新数据
   */
  setSort(sortConfs: VxeTableDefines.SortConfs | VxeTableDefines.SortConfs[], update?: boolean): Promise<void>
  /**
   * 手动清空排序条件，数据会恢复成未排序的状态
   * @param columnOrField 列对象或字段名
   */
  clearSort(fieldOrColumn?: VxeColumnPropTypes.Field | VxeTableDefines.ColumnInfo<any> | null): Promise<void>
  /**
   * 判断指定列是否为排序状态，如果为空则判断所有列
   * @param columnOrField 列对象或字段名
   */
  isSort(fieldOrColumn: VxeColumnPropTypes.Field | VxeTableDefines.ColumnInfo<any>): boolean
  /**
   * 获取当前排序的列信息
   */
  getSortColumns(): VxeTableDefines.SortCheckedParams[]
  /**
   * 手动关闭筛选面板
   */
  closeFilter(): Promise<any>
  /**
   * 已废弃，请使用 isActiveFilterByColumn
   * @deprecated
   */
  isFilter(fieldOrColumn: VxeColumnPropTypes.Field | VxeTableDefines.ColumnInfo<any> | null): boolean
  /**
   * 判断指定列是否为筛选状态，如果为空则判断所有列
   * @param columnOrField 列对象或字段名
   */
  isActiveFilterByColumn(fieldOrColumn: VxeColumnPropTypes.Field | VxeTableDefines.ColumnInfo<any> | null): boolean
  /**
   * 用于 expand-config.lazy，用于懒加载展开行，判断展开行是否懒加载完成
   * @param row 指定行
   */
  isRowExpandLoaded(row: any | null): boolean
  /**
   * 用于 expand-config.lazy，手动清空懒加载展开行的状态，数据会恢复成未展开的状态，当再次展开时会重新加载
   */
  clearRowExpandLoaded(row: any): Promise<void>
  /**
   * 重新懒加载展开行，并展开内容
   * @param row 指定行
   */
  reloadRowExpand(row: any): Promise<void>
  /**
   * @deprecated 已废弃，请使用 reloadRowExpand
   */
  reloadExpandContent(row: any): Promise<void>
  /**
   * 用于 type=expand，切换展开行的状态
   * @param row 指定行
   */
  toggleRowExpand(row: any): Promise<void>
  /**
   * 用于 expand-config，设置所有行的展开与否
   * 如果是关闭所有行，可以使用 clearRowExpand 快速清除
   * @param checked 是否选中
   */
  setAllRowExpand(checked: boolean): Promise<void>
  /**
   * 用于 expand-config，设置展开行，二个参数设置这一行展开与否
   * @param rows 指定行
   * @param checked 是否选中
   */
  setRowExpand(rows: any | any[], checked: boolean): Promise<void>
  /**
   * 用于 expand-config，判断行是否为展开状态
   * @param row 指定行
   */
  isRowExpandByRow(row: any | null): boolean
  /**
   * @deprecated 已废弃，请使用 isRowExpandByRow
   */
  isExpandByRow(row: any | null): boolean
  /**
   * 用于 type=expand，手动清空展开行状态，数据会恢复成未展开的状态
   */
  clearRowExpand(): Promise<void>
  /**
   * 用于 type=expand，手动清空用户保留行的展开状态
   */
  clearRowExpandReserve(): Promise<void>
  /**
   * 用于 expand-config，用于展开行，获取已展开的行数据
   */
  getRowExpandRecords(): DT[]
  /**
   * 用于 tree-config，用于树表格，获取已展开的节点
   * 注意，即使父节点被收起，只要该节点还处于展开状态都能获取到
   */
  getTreeExpandRecords(): DT[]
  /**
   * 用于 tree-config.lazy，用于懒加载树表格，判断树节点是否懒加载完成
   */
  isTreeExpandLoaded(row: any | null): boolean
  /**
   * 用于 tree-config.lazy，手动清空懒加载树节点的状态，数据会恢复成未展开的状态，当再次展开时会重新加载
   */
  clearTreeExpandLoaded(rows: any | any[]): Promise<any>
  /**
   * 重新懒加载树节点，并展开该节点
   * @param rows 指定行
   */
  reloadTreeExpand(row: any): Promise<any>
  /**
   * @deprecated 已废弃，请使用 reloadTreeExpand
   */
  reloadTreeChilds(row: any): Promise<any>
  /**
   * 用于 tree-config，切换展开树形节点的状态
   * @param row 指定行
   */
  toggleTreeExpand(row: any): Promise<any>
  /**
   * 用于 tree-config，设置所有树节点的展开与否
   * 如果是关闭所有树节点，可以使用 clearTreeExpand 快速清除
   * @param checked 是否选中
   */
  setAllTreeExpand(checked: boolean): Promise<void>
  /**
   * 用于 tree-config，设置展开树形节点，二个参数设置这一行展开与否
   * @param rows 指定行
   * @param checked 是否选中
   */
  setTreeExpand(rows: any | any[], checked: boolean): Promise<void>
  /**
   * 用于 tree-config，判断行是否为树形节点展开状态
   * @param row 指定行
   */
  isTreeExpandByRow(row: any | null): boolean
  /**
   * 用于 tree-config，手动清空树形节点的展开状态，数据会恢复成未展开的状态
   */
  clearTreeExpand(): Promise<void>
  /**
   * 用于 tree-config.reserve，手动清空用户保留树节点的展开状态
   */
  clearTreeExpandReserve(): Promise<void>
  /**
   * 获取表格的滚动状态
   */
  getScroll(): {
    virtualX: boolean
    virtualY: boolean
    scrollTop: number
    scrollLeft: number
  }
  /**
   * 如果有滚动条，则滚动到对应的位置
   * @param scrollLeft 左边距离
   * @param scrollTop 顶部距离
   */
  scrollTo(scrollLeft: number | null, scrollTop?: number | null): Promise<void>
  /**
   * 如果有滚动条，则滚动到对应的行
   * @param row 指定行
   * @param columnOrField 列对象或字段名
   */
  scrollToRow(row: any, fieldOrColumn?: VxeColumnPropTypes.Field | VxeTableDefines.ColumnInfo<any>): Promise<any>
  /**
   * 如果有滚动条，则滚动到对应的列
   * @param columnOrField 列对象或字段名
   */
  scrollToColumn(fieldOrColumn: VxeColumnPropTypes.Field | VxeTableDefines.ColumnInfo<any>): Promise<any>
  /**
   * 手动清除滚动相关信息，还原到初始状态
   */
  clearScroll(): Promise<any>
  /**
   * 手动更新表尾
   */
  updateFooter(): Promise<any>
  /**
   * 更新单元格状态
   * @param params 插槽对象
   */
  updateStatus(
    params: {
      row: DT
      column: VxeTableDefines.ColumnInfo<DT>
    },
    cellValue?: any
  ): Promise<any>
  /**
   * 取消单元格的临时合并状态，如果为数组，则取消多个合并
   */
  removeMergeCells(merges: VxeTableDefines.MergeOptions<any> | VxeTableDefines.MergeOptions<any>[]): Promise<VxeTableDefines.MergeInfo[]>
  /**
   * 取消表尾的临时合并状态，如果为数组，则取消多个合并
   */
  removeMergeFooterItems(merges: VxeTableDefines.MergeOptions<any> | VxeTableDefines.MergeOptions<any>[]): Promise<VxeTableDefines.MergeInfo[]>
  /**
   * 临时合并单元格，如果为数组则合并多个
   */
  setMergeCells(merges: VxeTableDefines.MergeOptions<any> | VxeTableDefines.MergeOptions<any>[]): Promise<any>
  /**
   * 临时合并表尾，如果为数组则合并多个
   */
  setMergeFooterItems(merges: VxeTableDefines.MergeOptions<any> | VxeTableDefines.MergeOptions<any>[]): Promise<any>
  /**
   * 用于 mouse-config.area，更新已选区域的单元格样式
   */
  updateCellAreas(): Promise<void>
  /**
   * 连接工具栏
   * @param toolbar 工具栏组件实例
   */
  connect(toolbar: VxeToolbarConstructor | VxeToolbarInstance): Promise<void>
  /**
   * 使表格获取焦点
   */
  focus(): Promise<void>
  /**
   * 使表格失去焦点
   */
  blur(): Promise<void>

  /**
   * 用于 custom-config，用于获取自定义列设置信息，用于服务端保持
   */
  getCustomStoreData(): VxeTableDefines.CustomStoreData
}
export interface VxeTableMethods<D = any> extends TableMethods<D> { }

export interface TablePrivateMethods<D = any> {
  /**
   * @deprecated
   */
  getSetupOptions(): Required<VxeGlobalConfig>
  /**
   * @private
   */
  updateAfterDataIndex(): void
  /**
   * @private
   */
  callSlot<T>(slotFunc: ((params: T) => VxeComponentSlotType | VxeComponentSlotType[]) | string | null, params: T): VxeComponentSlotType[]

  /**
   * @private
   */
  getParentElem(): Element | null
  /**
   * @private
   */
  getParentHeight(): number
  /**
   * @private
   */
  getExcludeHeight(): number
  /**
   * @private
   */
  defineField(records: any[]): any[]
  /**
   * @private
   */
  handleTableData(force?: boolean): Promise<any>
  /**
   * @private
   */
  cacheRowMap(isReset: boolean, isSource?: boolean, force?: boolean): void
  /**
   * @private
   */
  cacheSourceMap(fullData: any[]): void
  /**
   * @private
   */
  saveCustomStore(type: 'confirm' | 'reset' | 'update:width' | 'update:fixed' | 'update:sort' | 'update:visible'): Promise<any>
  /**
   * @private
   */
  analyColumnWidth(): void
  /**
   * @private
   */
  updateCheckboxStatus(): void
  /**
   * @private
   */
  updateAllCheckboxStatus(): void
  /**
   * @private
   */
  checkSelectionStatus(): void
  /**
   * @private
   */
  handleBatchSelectRows(rows: any[], value: any, isForce?: boolean): void
  /**
   * @private
   */
  handleColResizeMousedownEvent(evnt: MouseEvent, fixedType: 'left' | 'right' | '', params: (VxeTableDefines.CellRenderHeaderParams | VxeTableDefines.CellRenderBodyParams | VxeTableDefines.CellRenderFooterParams) & { $table: VxeTableConstructor & VxeTablePrivateMethods }): void
  /**
   * @private
   */
  handleColResizeDblclickEvent(evnt: MouseEvent, params: (VxeTableDefines.CellRenderHeaderParams | VxeTableDefines.CellRenderBodyParams | VxeTableDefines.CellRenderFooterParams) & { $table: VxeTableConstructor & VxeTablePrivateMethods }): void
  /**
   * @private
   */
  handleRowResizeMousedownEvent(evnt: MouseEvent, params: VxeTableDefines.CellRenderBodyParams & { $table: VxeTableConstructor & VxeTablePrivateMethods }): void
  /**
   * @private
   */
  handleRowResizeDblclickEvent(evnt: MouseEvent, params: VxeTableDefines.CellRenderBodyParams & { $table: VxeTableConstructor & VxeTablePrivateMethods }): void
  /**
   * use handleBatchSelectRows
   * @deprecated
   */
  handleSelectRow(params: any, value: any, isForce?: boolean): void
  handleCustom(): Promise<void>
  handleUpdateDataQueue(): void
  handleRefreshColumnQueue(): void
  preventEvent(evnt: any, type: any, args?: any, next?: any, end?: any): any
  triggerHeaderTitleEvent(evnt: MouseEvent, iconParams: VxeColumnPropTypes.TitlePrefix | VxeColumnPropTypes.TitleSuffix, params: VxeTableDefines.CellRenderHeaderParams<any>): void
  triggerHeaderTooltipEvent(evnt: MouseEvent, params: VxeTableDefines.CellRenderHeaderParams<any>): void
  triggerBodyTooltipEvent(evnt: MouseEvent, params: VxeTableDefines.CellRenderBodyParams<any>): void
  triggerFooterTooltipEvent(evnt: MouseEvent, params: VxeTableDefines.CellRenderFooterParams<any>): void
  handleTargetLeaveEvent(evnt: MouseEvent): void
  triggerHeaderCellClickEvent(evnt: MouseEvent, params: VxeTableDefines.CellRenderHeaderParams<any>): void
  triggerHeaderCellDblclickEvent(evnt: MouseEvent, params: VxeTableDefines.CellRenderHeaderParams<any>): void
  triggerCellClickEvent(evnt: MouseEvent, params: VxeTableDefines.CellRenderBodyParams<any>): void
  triggerCellDblclickEvent(evnt: MouseEvent, params: VxeTableDefines.CellRenderBodyParams<any>): void
  handleToggleCheckRowEvent(evnt: Event | null, params: { row: any }): void
  triggerCheckRowEvent(evnt: Event, params: { row: any }, value: boolean): void
  triggerCheckAllEvent(evnt: MouseEvent | null, value: boolean): void
  triggerRadioRowEvent(evnt: Event, params: { row: any }): void
  triggerCurrentColumnEvent(evnt: Event, params: {
    column: VxeTableDefines.ColumnInfo<any>
  }): void
  triggerCurrentRowEvent(evnt: Event, params: {
    $table: VxeTableConstructor<any>
    row: any
    rowIndex: number
    $rowIndex: number
  }): void
  triggerRowExpandEvent(evnt: Event, params: VxeTableDefines.CellRenderBodyParams<any>): void
  triggerTreeExpandEvent(evnt: Event, params: VxeTableDefines.CellRenderBodyParams<any>): void
  handleColumnSortEvent(evnt: Event, column: VxeTableDefines.ColumnInfo): void
  triggerSortEvent(evnt: Event, column: VxeTableDefines.ColumnInfo<any>, order: VxeTablePropTypes.SortOrder): void
  triggerHeaderCellMousedownEvent(evnt: any, params: any): void
  triggerCellMousedownEvent(evnt: MouseEvent, params: any): void
  triggerCellMouseupEvent(evnt: MouseEvent): void
  handleRowDragSwapEvent (evnt: DragEvent, isSyncRow: boolean | undefined, dragRow: any, prevDragRow: any, prevDragPos: '' | 'top' | 'bottom' | 'left' | 'right' | undefined, prevDragToChild: boolean | undefined): Promise<void>
  handleRowDragDragstartEvent (evnt: DragEvent): void
  handleRowDragDragendEvent(evnt: DragEvent): void
  handleRowDragDragoverEvent(evnt: DragEvent,): void
  handleCellDragMousedownEvent (evnt: MouseEvent, params: {
    row: any
    column: VxeTableDefines.ColumnInfo
  }): void
  handleCellDragMouseupEvent (evnt: MouseEvent): void
  handleHeaderCellDragDragstartEvent (evnt: DragEvent): void
  handleColDragSwapColumn(): void
  handleColDragSwapEvent (evnt: DragEvent, isSyncColumn: boolean | undefined, dragCol: VxeTableDefines.ColumnInfo | null | undefined, prevDragCol: VxeTableDefines.ColumnInfo | undefined, prevDragPos: '' | 'top' | 'bottom' | 'left' | 'right' | undefined, prevDragToChild: boolean | undefined): Promise<void>
  handleHeaderCellDragDragendEvent(evnt: DragEvent): void
  handleHeaderCellDragDragoverEvent(evnt: DragEvent,): void
  handleHeaderCellDragMousedownEvent (evnt: MouseEvent, params: {
    column: VxeTableDefines.ColumnInfo
  }): void
  handleHeaderCellDragMouseupEvent (evnt: MouseEvent): void
  handleScrollEvent(evnt: Event, isRollY: boolean, isRollX: boolean, scrollTop: number, scrollLeft: number, params: {
    type: string
    fixed: VxeColumnPropTypes.Fixed
  }): void
  /**
   * @private
   */
  handleCellRuleUpdateStatus(type: 'change' | 'blur', cellParams: {
    row: any
    column: VxeTableDefines.ColumnInfo<any>
  }, cellValue?: any): Promise<any>
  triggerScrollXEvent(evnt: Event): void
  triggerScrollYEvent(evnt: Event): void
  triggerHeaderScrollEvent(evnt: Event, fixedType: 'right' | 'left' | ''): void
  triggerBodyScrollEvent(evnt: Event, fixedType: 'right' | 'left' | ''): void
  triggerFooterScrollEvent(evnt: Event, fixedType: 'right' | 'left' | ''): void
  triggerBodyWheelEvent(evnt: WheelEvent): void
  triggerVirtualScrollXEvent(evnt: Event): void
  triggerVirtualScrollYEvent(evnt: Event): void
  scrollToTreeRow(row: any): Promise<any>
  updateScrollYStatus(fullData?: any[]): boolean
  updateScrollXSpace(): void
  updateScrollYSpace(): void
  updateScrollXData(): Promise<any>
  updateScrollYData(): Promise<any>
  checkScrolling(): void
  updateZindex(): void
  handleCheckedCheckboxRow(rows: any, value: boolean, isForce?: boolean): Promise<any>
  triggerHoverEvent(evnt: any, params: any): void
  setHoverRow(row: any): void
  clearHoverRow(): void
  /**
   * 已废弃，被 getCellElement 替换
   * @deprecated
   */
  getCell(row: any, column: VxeTableDefines.ColumnInfo<any>): HTMLTableDataCellElement | null
  findRowIndexOf(list: any[], row: any): number
  eqRow(row1: any, row2: any): boolean
}
export interface VxeTablePrivateMethods<D = any> extends TablePrivateMethods<D> { }

export type VxeTableEmits = [
  'update:data',
  'keydown-start',
  'keydown',
  'keydown-end',
  'paste',
  'copy',
  'cut',
  'current-change',
  'radio-change',
  'checkbox-change',
  'checkbox-all',
  'checkbox-range-start',
  'checkbox-range-change',
  'checkbox-range-end',
  'checkbox-range-select',
  'cell-click',
  'cell-dblclick',
  'cell-menu',
  'cell-mouseenter',
  'cell-mouseleave',
  'cell-selected',
  'cell-delete-value',
  'cell-backspace-value',
  'header-cell-click',
  'header-cell-dblclick',
  'header-cell-menu',
  'footer-cell-click',
  'footer-cell-dblclick',
  'footer-cell-menu',
  'clear-merge',
  'sort-change',
  'clear-sort',
  'filter-change',
  'filter-visible',
  'clear-filter',

  'resizable-change', // 已废弃

  'column-resizable-change',
  'row-resizable-change',
  'toggle-row-expand',
  'toggle-tree-expand',
  'menu-click',
  'edit-closed',
  'row-dragstart',
  'row-dragover',
  'row-dragend',
  'column-dragstart',
  'column-dragover',
  'column-dragend',
  'enter-append-row',

  'edit-actived', // 已废弃

  'edit-activated',
  'edit-disabled',
  'valid-error',
  'scroll',
  'scroll-boundary',
  'custom',

  ...VxeTableProEmits
]

export namespace VxeTableDefines {
  export interface SortConfs {
    field: string
    order?: VxeTablePropTypes.SortOrder
  }

  export interface MergeOptions<D = any> {
    row: any | number
    col: VxeTableDefines.ColumnInfo<D> | number
    rowspan: number
    colspan: number
  }

  export interface MergeInfo {
    row: number
    col: number
    rowspan: number
    colspan: number
  }

  export interface MergeItem<D = any> extends MergeInfo {
    _row: any
    _col: VxeTableDefines.ColumnInfo<D>
    _rowspan: number
    _colspan: number
  }

  export interface ColumnOptions<D = any> extends VxeColumnProps<D> {
    children?: ColumnOptions<D>[]
    slots?: VxeColumnPropTypes.Slots<D>
  }

  export interface RowCacheItem<D = any> {
    row: D
    rowid: string
    seq: string | number
    index: number
    $index: number
    _index: number
    treeIndex: number
    items: any[]
    parent: any
    level: number
    height: number
    resizeHeight: number
    oTop: number
    expandHeight: number
    treeLoaded?: boolean
    expandLoaded?: boolean
    formatData?: {
      [key: string]: {
        value: any
        label: any
      }
    }
  }

  export interface ColumnCacheItem<D = any> {
    column: VxeTableDefines.ColumnInfo<D>
    colid: string
    index: number
    $index: number
    _index: number
    items: VxeTableDefines.ColumnInfo<D>[]
    parent: VxeTableDefines.ColumnInfo<D> | null
    width: number
  }

  /**
   * 列对象
   */
  export class ColumnInfo<D = any> {
    /**
     * 该属性已废弃，该属性被 field 替换
     * @deprecated
     */
    property: VxeColumnPropTypes.Field

    /**
     * 公开属性
     */
    type: VxeColumnPropTypes.Type
    field: VxeColumnPropTypes.Field
    title: VxeColumnPropTypes.Title
    width: VxeColumnPropTypes.Width
    minWidth: VxeColumnPropTypes.MinWidth
    maxWidth: VxeColumnPropTypes.MaxWidth
    resizable: VxeColumnPropTypes.Resizable
    fixed: VxeColumnPropTypes.Fixed
    align: VxeColumnPropTypes.Align
    headerAlign: VxeColumnPropTypes.HeaderAlign
    footerAlign: VxeColumnPropTypes.FooterAlign
    showOverflow: VxeColumnPropTypes.ShowOverflow
    showHeaderOverflow: VxeColumnPropTypes.ShowHeaderOverflow
    showFooterOverflow: VxeColumnPropTypes.ShowFooterOverflow
    className: VxeColumnPropTypes.ClassName
    headerClassName: VxeColumnPropTypes.HeaderClassName
    footerClassName: VxeColumnPropTypes.FooterClassName
    formatter: VxeColumnPropTypes.Formatter<D>
    footerFormatter: VxeColumnPropTypes.FooterFormatter<D>
    padding: VxeColumnPropTypes.Padding
    verticalAlign: VxeColumnPropTypes.VerticalAlign
    sortable: VxeColumnPropTypes.Sortable
    sortBy: VxeColumnPropTypes.SortBy
    sortType: VxeColumnPropTypes.SortType
    filters: VxeColumnPropTypes.FilterItem[]
    filterMultiple: VxeColumnPropTypes.FilterMultiple
    filterMethod: VxeColumnPropTypes.FilterMethod<D>
    filterRender: VxeColumnPropTypes.FilterRender
    treeNode: VxeColumnPropTypes.TreeNode
    dragSort: VxeColumnPropTypes.DragSort
    rowResize: VxeColumnPropTypes.RowResize
    visible: VxeColumnPropTypes.Visible
    exportMethod: VxeColumnPropTypes.ExportMethod<D>
    footerExportMethod: VxeColumnPropTypes.FooterExportMethod
    /**
     * 已废弃，请使用 titlePrefix
     * @deprecated
     */
    titleHelp: VxeColumnPropTypes.TitleHelp
    titlePrefix: VxeColumnPropTypes.TitlePrefix
    titleSuffix: VxeColumnPropTypes.TitleSuffix
    cellType: VxeColumnPropTypes.CellType
    cellRender: VxeColumnPropTypes.CellRender<D>
    editRender: VxeColumnPropTypes.EditRender
    contentRender: VxeColumnPropTypes.ContentRender
    params: VxeColumnPropTypes.Params
    slots: VxeColumnPropTypes.Slots<D>

    /**
     * 以下内部属性
     * 内部属性随时都会调整，不应该被使用
     */
    /**
     * @private
     */
    id: string
    /**
     * @private
     */
    parentId: string
    /**
     * @private
     */
    level: number
    /**
     * @private
     */
    rowSpan: number
    /**
     * @private
     */
    colSpan: number
    /**
     * @private
     */
    halfVisible: boolean
    /**
     * @private
     */
    defaultVisible: any
    /**
     * @private
     */
    defaultFixed: any
    /**
     * @private
     */
    checked: boolean
    /**
     * @private
     */
    halfChecked: boolean
    /**
     * @private
     */
    disabled: boolean

    // 数据排序
    /**
     * @private
     */
    order: VxeTablePropTypes.SortOrder
    /**
     * @private
     */
    sortTime: number

    // 列排序
    sortNumber: number
    /**
     * @private
     */
    renderSortNumber: number

    /**
     * @private
     */
    renderFixed: VxeColumnPropTypes.Fixed
    /**
     * @private
     */
    renderVisible: VxeColumnPropTypes.Visible

    /**
     * @private
     */
    renderWidth: number
    /**
     * @private
     */
    renderHeight: number
    /**
     * @private
     */
    renderAutoWidth: number
    /**
     * @private
     */
    renderResizeWidth: number
    /**
     * @private
     */
    resizeWidth: number
    /**
     * @private
     */
    model: {
      update: boolean
      value: any
    }

    children: ColumnInfo<D>[]

    /**
     * @private
     */
    renderHeader(params: CellRenderHeaderParams<D>): VNode[]
    /**
     * @private
     */
    renderCell(params: CellRenderCellParams<D>): VNode[]
    /**
     * @private
     */
    renderData(params: CellRenderDataParams<D>): VNode[]
    /**
     * @private
     */
    renderFooter(params: CellRenderFooterParams<D>): VNode[]

    /**
     * 获取列标题
     */
    getTitle(): string
    /**
     * 获取列主键
     */
    getKey(): string
  }

  export interface CellRenderHeaderParams<D = any> {
    $table: VxeTableConstructor<D>
    $grid: VxeGridConstructor<D> | null | undefined
    $rowIndex: number
    column: ColumnInfo<D>
    columnIndex: number
    $columnIndex: number
    _columnIndex: number
    fixed: VxeColumnPropTypes.Fixed
    type: string
    isHidden: boolean
    hasFilter: boolean
    firstFilterOption: VxeColumnPropTypes.FilterItem | null

    checked?: boolean
    indeterminate?: boolean
  }

  export interface CellRenderBodyParams<D = any> {
    $table: VxeTableConstructor<D>
    $grid: VxeGridConstructor<D> | null | undefined
    seq: string | number
    rowid: string
    row: D
    rowIndex: number
    $rowIndex: number
    _rowIndex: number
    column: ColumnInfo<D>
    columnIndex: number
    $columnIndex: number
    _columnIndex: number
    fixed: VxeColumnPropTypes.Fixed
    type: string
    isHidden: boolean
    isEdit: boolean
    level: number

    /**
     * 已废弃
     * @deprecated
     * @private
     */
    visibleData: D[]
    /**
     * 已废弃
     * @deprecated
     * @private
     */
    data: D[]
    /**
     * 已废弃
     * @deprecated
     */
    items: any[]
  }

  export interface CellRenderDataParams<D = any> extends CellRenderBodyParams<D> { }
  export interface CellRenderCellParams<D = any> extends CellRenderBodyParams<D> { }

  export interface CellRenderFooterParams<D = any> {
    $table: VxeTableConstructor<D>
    $grid: VxeGridConstructor<D> | null | undefined
    row: D
    rowIndex: number
    _rowIndex: number
    $rowIndex: number
    column: ColumnInfo<D>
    columnIndex: number
    $columnIndex: number
    _columnIndex: number
    fixed: VxeColumnPropTypes.Fixed
    type: string

    /**
     * 已废弃
     * @deprecated
     * @private
     */
    data: any[][]

    // 兼容旧
    itemIndex: number
    items: any[]
  }

  interface TableEventParams<D = any> extends VxeComponentEventParams {
    $table: VxeTableConstructor<D>
  }

  interface TableBaseHeaderCellParams<D = any> {
    $rowIndex: number
    column: ColumnInfo<D>
    columnIndex: number
    $columnIndex: number
  }

  interface TableBaseCellParams<D = any> {
    cell: any
    row: D
    rowIndex: number
    $rowIndex: number
    column: ColumnInfo<D>
    columnIndex: number
    $columnIndex: number
  }

  interface TableBaseFooterCellParams<D = any> {
    $rowIndex: number
    column: ColumnInfo<D>
    columnIndex: number
    $columnIndex: number
  }

  export interface KeydownStartParams { }
  export interface KeydownStartEventParams<D = any> extends TableEventParams<D>, KeydownStartParams { }

  export interface KeydownParams { }
  export interface KeydownEventParams<D = any> extends TableEventParams<D>, KeydownParams { }

  export interface KeydownEndParams { }
  export interface KeydownEndEventParams<D = any> extends TableEventParams<D>, KeydownEndParams { }

  export interface PasteParams { }
  export interface PasteEventParams<D = any> extends TableEventParams<D>, PasteParams { }

  export interface CopyParams { }
  export interface CopyEventParams<D = any> extends TableEventParams<D>, CopyParams { }

  export interface CutParams { }
  export interface CutEventParams<D = any> extends TableEventParams<D>, CutParams { }

  export interface CurrentChangeParams<D = any> extends TableBaseCellParams<D> {
    newValue: any
    oldValue: any
  }
  export interface CurrentChangeEventParams<D = any> extends TableEventParams<D>, CurrentChangeParams<D> { }

  export interface RadioChangeParams<D = any> extends TableBaseCellParams<D> {
    newValue: any
    oldValue: any
  }
  export interface RadioChangeEventParams<D = any> extends TableEventParams<D>, RadioChangeParams<D> { }

  export interface CheckboxChangeParams<D = any> extends TableBaseCellParams<D> {
    checked: boolean
    /**
     * 已废弃，请调用方法 getCheckboxRecords() 获取
     * @deprecated
     */
    records: D[]
    /**
     * 已废弃，请调用方法 getCheckboxReserveRecords() 获取
     * @deprecated
     */
    reserves: D[]
    /**
     * 已废弃，请调用方法 getCheckboxIndeterminateRecords() 获取
     * @deprecated
     */
    indeterminates: D[]
  }
  export interface CheckboxChangeEventParams<D = any> extends TableEventParams<D>, CheckboxChangeParams<D> { }

  export interface CheckboxAllParams<D = any> extends CheckboxChangeParams<D> { }
  export interface CheckboxAllEventParams<D = any> extends TableEventParams<D>, CheckboxAllParams<D> { }

  export interface CheckboxRangeStartParams<D = any> {
    /**
     * 已废弃，请调用方法 getCheckboxRecords() 获取
     * @deprecated
     */
    records: D[]
    /**
     * 已废弃，请调用方法 getCheckboxReserveRecords() 获取
     * @deprecated
     */
    reserves: D[]
  }
  export interface CheckboxRangeStartEventParams<D = any> extends TableEventParams<D>, CheckboxRangeStartParams<D> { }

  export interface CheckboxRangeChangeParams<D = any> extends CheckboxRangeStartParams<D> { }
  export interface CheckboxRangeChangeEventParams<D = any> extends TableEventParams<D>, CheckboxRangeChangeParams<D> { }

  export interface CheckboxRangeEndParams<D = any> extends CheckboxRangeStartParams<D> { }

  export interface CheckboxRangeEndEventParams<D = any> extends TableEventParams<D>, CheckboxRangeEndParams<D> { }

  export interface CheckboxRangeSelectParams<D = any> {
    rangeRecords: D[]
  }
  export interface CheckboxRangeSelectEventParams<D = any> extends TableEventParams<D>, CheckboxRangeSelectParams<D> { }

  export interface CellClickParams<D = any> extends TableBaseCellParams<D> {
    triggerRadio: boolean
    triggerCheckbox: boolean
    triggerTreeNode: boolean
    triggerExpandNode: boolean
  }
  export interface CellClickEventParams<D = any> extends TableEventParams<D>, CellClickParams<D> { }

  export interface CellDblclickParams<D = any> extends TableEventParams<D>, CellClickParams<D> { }
  export interface CellDblclickEventParams<D = any> extends TableEventParams<D>, CellDblclickParams<D> { }

  export interface CellMenuParams<D = any> extends TableBaseCellParams<D> { }
  export interface CellMenuEventParams<D = any> extends TableEventParams<D>, CellMenuParams<D> { }

  export interface CellMouseenterParams<D = any> extends TableBaseCellParams<D> { }
  export interface CellMouseenterEventParams<D = any> extends TableEventParams<D>, CellMouseenterParams<D> { }

  export interface CellMouseleaveParams<D = any> extends TableBaseCellParams<D> { }
  export interface CellMouseleaveEventParams<D = any> extends TableEventParams<D>, CellMouseleaveParams<D> { }

  export interface CellDeleteValueParams<D = any> {
    row: D
    rowIndex: number
    column: VxeTableDefines.ColumnInfo<D>
    columnIndex: number
    activeArea: VxeTableProDefines.MouseActiveCellArea<D>
    cellAreas: VxeTableProDefines.MouseCellArea<D>[]
   }
  export interface CellDeleteValueEventParams<D = any> extends TableEventParams<D>, CellDeleteValueParams<D> { }

  export interface HeaderCellClickParams<D = any> extends TableBaseHeaderCellParams<D> {
    triggerResizable: boolean
    triggerSort: boolean
    triggerFilter: boolean
  }
  export interface HeaderCellClickEventParams<D = any> extends TableEventParams<D>, HeaderCellClickParams<D> { }

  export interface HeaderCellDblclickParams<D = any> extends TableBaseHeaderCellParams<D> { }
  export interface HeaderCellDblclickEventParams<D = any> extends TableEventParams<D>, HeaderCellDblclickParams<D> { }

  export interface HeaderCellMenuParams<D = any> extends TableBaseHeaderCellParams<D> { }
  export interface HeaderCellMenuEventParams<D = any> extends TableEventParams<D>, HeaderCellMenuParams<D> { }

  export interface FooterCellClickParams<D = any> extends TableBaseFooterCellParams<D> { }
  export interface FooterCellClickEventParams<D = any> extends TableEventParams<D>, FooterCellClickParams<D> { }

  export interface FooterCellDblclickParams<D = any> extends TableBaseFooterCellParams<D> { }
  export interface FooterCellDblclickEventParams<D = any> extends TableEventParams<D>, FooterCellDblclickParams<D> { }

  export interface FooterCellMenuParams<D = any> extends TableBaseFooterCellParams<D> { }
  export interface FooterCellMenuEventParams<D = any> extends TableEventParams<D>, FooterCellMenuParams<D> { }

  export interface SortCheckedParams<D = any> {
    column: VxeTableDefines.ColumnInfo<D>
    field: VxeColumnPropTypes.Field
    order: VxeTablePropTypes.SortOrder
    sortTime: number
    /**
     *已废弃， 请使用 field
     * @deprecated
     */
    property: VxeColumnPropTypes.Field
  }
  export interface SortChangeParams<D = any> extends SortCheckedParams<D> {
    sortList: SortCheckedParams[]
  }
  export interface SortChangeEventParams<D = any> extends TableEventParams<D>, SortChangeParams<D> { }

  export interface FilterCheckedParams<D = any> {
    column: VxeTableDefines.ColumnInfo<D>
    field: VxeColumnPropTypes.Field
    values: any[]
    datas: any[]
    /**
     *已废弃， 请使用 field
     * @deprecated
     */
    property: VxeColumnPropTypes.Field
  }
  export interface FilterChangeParams<D = any> extends FilterCheckedParams<D> {
    filterList: FilterCheckedParams<D>[]
  }
  export interface FilterChangeEventParams<D = any> extends TableEventParams<D>, FilterChangeParams<D> { }

  export interface FilterVisibleParams<D = any> {
    column: VxeTableDefines.ColumnInfo<D>
    field: VxeColumnPropTypes.Field
    filterList: FilterCheckedParams<D>[]
    visible: boolean
    /**
     *已废弃， 请使用 field
     * @deprecated
     */
    property: VxeColumnPropTypes.Field
  }
  export interface FilterVisibleEventParams<D = any> extends TableEventParams<D>, FilterVisibleParams<D> { }

  export interface ResizableChangeParams<D = any> extends TableBaseHeaderCellParams<D> { }
  export interface ResizableChangeEventParams<D = any> extends TableEventParams<D>, ResizableChangeParams<D> {
    resizeWidth: number
  }

  export interface ToggleRowExpandParams<D = any> extends TableBaseCellParams<D> {
    expanded: boolean
  }
  export interface ToggleRowExpandEventParams<D = any> extends TableEventParams<D>, ToggleRowExpandParams { }

  export interface ToggleTreeExpandParams<D = any> extends TableBaseCellParams<D> {
    expanded: boolean
  }
  export interface ToggleTreeExpandEventParams<D = any> extends TableEventParams<D>, ToggleTreeExpandParams<D> { }

  export interface MenuClickParams<D = any> extends TableBaseCellParams<D> {
    menu: VxeTableDefines.MenuFirstOption | VxeTableDefines.MenuChildOption
    type: string
  }
  export interface MenuClickEventParams<D = any> extends TableEventParams<D>, MenuClickParams<D> { }

  export interface EditClosedParams<D = any> extends TableBaseCellParams<D> { }
  export interface EditClosedEventParams<D = any> extends TableEventParams<D>, EditClosedParams<D> { }

  export interface EditActivatedParams<D = any> extends TableBaseCellParams<D> { }
  export interface EditActivatedEventParams<D = any> extends TableEventParams<D>, EditActivatedParams<D> { }

  export interface EditDisabledParams<D = any> extends TableBaseCellParams<D> { }
  export interface EditDisabledEventParams<D = any> extends TableEventParams<D>, EditDisabledParams<D> { }

  export interface ValidErrorParams<D = any> extends TableBaseCellParams<D> {
    rule: any
  }
  export interface ValidErrorEventParams<D = any> extends TableEventParams<D>, ValidErrorParams<D> { }

  export interface ScrollParams {
    type: string
    scrollTop: number
    scrollLeft: number
    scrollHeight: number
    scrollWidth: number
    bodyWidth: number
    bodyHeight: number
    isX: boolean
    isY: boolean
    isTop: boolean
    isBottom: boolean
    isLeft: boolean
    isRight: boolean
    direction: 'top' | 'bottom' | 'left' | 'right'
  }
  export interface ScrollEventParams<D = any> extends TableEventParams<D>, ScrollParams {
    target: HTMLDivElement
  }
  export interface ScrollBoundaryEventParams<D = any> extends ScrollEventParams<D> {}

  export type CustomType = '' | 'confirm' | 'reset' | 'cancel' | 'close' | 'open'

  export interface CustomParams {
    type: CustomType
  }
  export interface CustomEventParams<D = any> extends TableEventParams<D>, CustomParams { }

  export interface RowDragstartEventParams<D = any> {
    row: D
    column: VxeTableDefines.ColumnInfo<D>
  }

  export interface RowDragoverEventParams<D = any> {
    oldRow: D
    targetRow: D
    dragPos: 'top' | 'bottom'
    offsetIndex: 0 | 1
  }

  export interface RowDragendEventParams<D = any> {
    newRow: D
    oldRow: D
    dragPos: 'top' | 'bottom'
    dragToChild: boolean
    offsetIndex: 0 | 1
    _index: {
      newIndex: number
      oldIndex: number
    }
  }

  export interface RowDragToChildMethod<D = any> extends RowDragendEventParams<D> {}

  export interface ColumnDragstartEventParams<D = any> {
    column: VxeTableDefines.ColumnInfo<D>
  }

  export interface ColumnDragoverEventParams<D = any> {
    oldColumn: VxeTableDefines.ColumnInfo<D>
    targetColumn: VxeTableDefines.ColumnInfo<D>
    dragPos: 'left' | 'right'
    offsetIndex: 0 | 1
  }

  export interface ColumnDragendEventParams<D = any> {
    newColumn: VxeTableDefines.ColumnInfo<D>
    oldColumn: VxeTableDefines.ColumnInfo<D>
    dragPos: 'left' | 'right'
    dragToChild: boolean
    offsetIndex: 0 | 1
    _index: {
      newIndex: number
      oldIndex: number
    }
  }

  export interface ColumnDragToChildMethod<D = any> extends ColumnDragendEventParams<D> {}

  export interface EnterAppendRowEventParams<D = any> {
    row: D
    rowIndex: number
    $rowIndex: number
    _rowIndex: number
    column: VxeTableDefines.ColumnInfo<D>
    columnIndex: number
    $columnIndex: number
    _columnIndex: number
  }

  export interface VxeTableCustomStoreObj {
    btnEl: HTMLDivElement | null
    isAll: boolean
    isIndeterminate: boolean
    activeBtn: boolean
    activeWrapper: boolean
    visible: boolean
    maxHeight: number
    oldSortMaps: Record<string, number>
    oldFixedMaps: Record<string, VxeColumnPropTypes.Fixed>
    oldVisibleMaps: Record<string, boolean>
  }

  export interface CustomStoreData {
    resizableData?: Record<string, number>
    sortData?: Record<string, number>
    visibleData?: Record<string, boolean>
    fixedData?: Record<string, VxeColumnPropTypes.Fixed>
  }

  export interface VxeTableCustomStorageObj {
    visible?: boolean
    resizable?: boolean
    fixed?: boolean
    sort?: boolean
  }

  export interface ExtortSheetMethodParams {
    $table: VxeTableConstructor
    $grid: VxeGridConstructor | null | undefined
    options: VxeTablePropTypes.ExportHandleOptions
    datas: any[]
    columns: VxeTableDefines.ColumnInfo[]
    colgroups: VxeTableDefines.ColumnInfo[][]

    [key: string]: any
  }

  export interface ImportSlotParams {
    $table: VxeTableConstructor
    $grid: VxeGridConstructor | null | undefined
    options: VxeTablePropTypes.ImportConfig
    params: Record<string, any>
  }

  export interface ExtortSlotParams {
    $table: VxeTableConstructor
    $grid: VxeGridConstructor | null | undefined
    options: VxeTablePropTypes.ExportConfig
    columns: VxeTableDefines.ColumnInfo[]
    params: Record<string, any>
  }

  export interface PrintSlotParams {
    $table: VxeTableConstructor
    $grid: VxeGridConstructor | null | undefined
    options: VxeTablePropTypes.PrintConfig
    columns: VxeTableDefines.ColumnInfo[]
    params: Record<string, any>
  }

  export interface CustomSlotParams {
    $table: VxeTableConstructor
    $grid: VxeGridConstructor | null | undefined
    columns: VxeTableDefines.ColumnInfo[]
    isAllChecked: boolean
    isAllIndeterminate: boolean
    isCustomStatus: boolean
  }

  export interface RowDragSlotParams<D = any> {
    row: D
  }

  export interface ColumnDragSlotParams<D = any> {
    column: VxeTableDefines.ColumnInfo<D>
  }

  export interface MenuSlotParams {

  }

  export interface ValidatorRule<D = any> {
    /**
     * 是否必填
     */
    required?: boolean
    /**
     * 最小长度/值
     */
    min?: number | string
    /**
     * 最大长度/值
     */
    max?: number | string
    /**
     * 数据类型
     */
    type?: 'number' | 'string' | 'array' | '' | null
    /**
     * 使用正则表达式校验
     */
    pattern?: string | RegExp
    /**
     * 使用自定义校验函数，接收一个 Promise
     * @param params 参数
     */
    validator?: string | ((params: RuleValidatorParams<D>) => void | Error | Promise<void>)
    /**
     * 提示消息
     */
    content?: string
    trigger?: 'blur' | 'change' | 'manual' | '' | null
    maxWidth?: number
    /**
     * @deprecated 已废弃，请使用 content
     */
    message?: string
  }
  export interface RuleValidatorParams<D = any> {
    $table: VxeTableConstructor<D>
    $grid: VxeGridConstructor<D> | null | undefined
    cellValue: any
    rule: ValidatorRule<D>
    rules: ValidatorRule<D>[]
    column: VxeTableDefines.ColumnInfo<D>
    columnIndex: number
    row: D
    rowIndex: number
    field: string
  }
  export interface ValidatorErrorParams<D = any> {
    $table: VxeTableConstructor<D>
    cellValue: any
    rule: ValidatorRule<D>
    rules: ValidatorRule<D>[]
    column: VxeTableDefines.ColumnInfo<D>
    columnIndex: number
    row: D
    rowIndex: number
    field: string
  }
  export interface ValidatorErrorMapParams<D = any> {
    [key: string]: VxeTableDefines.ValidatorErrorParams<D>[]
  }

  export interface MenuOptions {
    disabled?: boolean
    options?: MenuFirstOption[][]
  }
  export interface MenuFirstOption {
    code?: string
    name?: string
    prefixConfig?: {
      icon?: string
      content?: string
      className?: string
    }
    /**
     * 请使用 prefixConfig
     * @deprecated
     */
    prefixIcon?: string
    suffixConfig?: {
      icon?: string
      content?: string
      className?: string
    }
    /**
     * 请使用 suffixConfig
     * @deprecated
     */
    suffixIcon?: string
    className?: string
    visible?: boolean
    disabled?: boolean
    children?: MenuChildOption[]
    params?: any
    slots?: {
      content?: string | ((params: VxeTableDefines.MenuSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
    }
    [key: string]: any
  }
  export interface MenuChildOption {
    code?: string
    name?: string
    prefixConfig?: {
      icon?: string
      content?: string
      className?: string
    }
    /**
     * 请使用 prefixConfig
     * @deprecated
     */
    prefixIcon?: string
    suffixConfig?: {
      icon?: string
      content?: string
      className?: string
    }
    /**
     * 请使用 suffixConfig
     * @deprecated
     */
    suffixIcon?: string
    className?: string
    visible?: boolean
    disabled?: boolean
    params?: any
    slots?: {
      content?: string | ((params: VxeTableDefines.MenuSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
    }
    [key: string]: any
  }

  export interface FilterOption {
    label: string | number
    value: any
    data: any
    resetValue: any
    checked: boolean
    _checked: boolean
  }

}

export interface VxeTableEventProps<D = any> {
  onKeydownStart?: VxeTableEvents.KeydownStart<D>
  onKeydown?: VxeTableEvents.Keydown<D>
  onKeydownEnd?: VxeTableEvents.KeydownEnd<D>
  onPaste?: VxeTableEvents.Paste<D>
  onCopy?: VxeTableEvents.Copy<D>
  onCut?: VxeTableEvents.Cut<D>
  onCurrentChange?: VxeTableEvents.CurrentChange<D>
  onRadioChange?: VxeTableEvents.RadioChange<D>
  onCheckboxChange?: VxeTableEvents.CheckboxChange<D>
  onCheckboxAll?: VxeTableEvents.CheckboxAll<D>
  onCheckboxRangeStart?: VxeTableEvents.CheckboxRangeStart<D>
  onCheckboxRangeChange?: VxeTableEvents.CheckboxRangeChange<D>
  onCheckboxRangeEnd?: VxeTableEvents.CheckboxRangeEnd<D>
  onCheckboxRangeSelect?: VxeTableEvents.CheckboxRangeSelect<D>
  onCellClick?: VxeTableEvents.CellClick<D>
  onCellDblclick?: VxeTableEvents.CellDblclick<D>
  onCellMenu?: VxeTableEvents.CellMenu<D>
  onCellMouseenter?: VxeTableEvents.CellMouseenter<D>
  onCellMouseleave?: VxeTableEvents.CellMouseleave<D>
  onCellDeleteValue?: VxeTableEvents.CellDeleteValue<D>
  onHeaderCellClick?: VxeTableEvents.HeaderCellClick<D>
  onHeaderCellDblclick?: VxeTableEvents.HeaderCellDblclick<D>
  onHeaderCellMenu?: VxeTableEvents.HeaderCellMenu<D>
  onFooterCellClick?: VxeTableEvents.FooterCellClick<D>
  onFooterCellDblclick?: VxeTableEvents.FooterCellDblclick<D>
  onFooterCellMenu?: VxeTableEvents.FooterCellMenu<D>
  onSortChange?: VxeTableEvents.SortChange<D>
  onFilterChange?: VxeTableEvents.FilterChange<D>
  onFilterVisible?: VxeTableEvents.FilterVisible<D>
  onResizableChange?: VxeTableEvents.ResizableChange<D>
  onToggleRowExpand?: VxeTableEvents.ToggleRowExpand<D>
  onToggleTreeExpand?: VxeTableEvents.ToggleTreeExpand<D>
  onMenuClick?: VxeTableEvents.MenuClick<D>
  onEditClosed?: VxeTableEvents.EditClosed<D>
  onEditActivated?: VxeTableEvents.EditActivated<D>
  onEditDisabled?: VxeTableEvents.EditDisabled<D>
  onValidError?: VxeTableEvents.ValidError<D>
  onScroll?: VxeTableEvents.Scroll<D>
  onScrollBoundary?: VxeTableEvents.ScrollBoundary<D>
  onCustom?: VxeTableEvents.Custom<D>
  onRowDragstart?: VxeTableEvents.RowDragstart<D>
  onRowDragover?: VxeTableEvents.RowDragover<D>
  onRowDragend?: VxeTableEvents.RowDragend<D>
  onColumnDragstart?: VxeTableEvents.ColumnDragstart<D>
  onColumnDragover?: VxeTableEvents.ColumnDragover<D>
  onColumnDragend?: VxeTableEvents.ColumnDragend<D>
  onEnterAppendRow?: VxeTableEvents.EnterAppendRow<D>

  /**
   * 已废弃，请使用 onEditActivated
   * @deprecated
   */
  onEditActived?: VxeTableEvents.EditActivated<D>
}

export interface VxeTableListeners<D = any> {
  /**
   * 当表格被激活且键盘被按下开始时会触发的事件
   */
  keydownStart?: VxeTableEvents.KeydownStart<D>
  /**
   * 当表格被激活且键盘被按下时会触发的事件
   */
  keydown?: VxeTableEvents.Keydown<D>
  /**
   * 当表格被激活且键盘被按下结束时会触发的事件
   */
  keydownEnd?: VxeTableEvents.KeydownEnd<D>
  paste?: VxeTableEvents.Paste<D>
  copy?: VxeTableEvents.Copy<D>
  cut?: VxeTableEvents.Cut<D>
  currentChange?: VxeTableEvents.CurrentChange<D>
  radioChange?: VxeTableEvents.RadioChange<D>
  checkboxChange?: VxeTableEvents.CheckboxChange<D>
  checkboxAll?: VxeTableEvents.CheckboxAll<D>
  checkboxRangeStart?: VxeTableEvents.CheckboxRangeStart<D>
  checkboxRangeChange?: VxeTableEvents.CheckboxRangeChange<D>
  checkboxRangeEnd?: VxeTableEvents.CheckboxRangeEnd<D>
  checkboxRangeSelect?: VxeTableEvents.CheckboxRangeSelect<D>
  cellClick?: VxeTableEvents.CellClick<D>
  cellDblclick?: VxeTableEvents.CellDblclick<D>
  cellMenu?: VxeTableEvents.CellMenu<D>
  cellMouseenter?: VxeTableEvents.CellMouseenter<D>
  cellMouseleave?: VxeTableEvents.CellMouseleave<D>
  cellDeleteValue?: VxeTableEvents.CellDeleteValue<D>
  headerCellClick?: VxeTableEvents.HeaderCellClick<D>
  headerCellDblclick?: VxeTableEvents.HeaderCellDblclick<D>
  headerCellMenu?: VxeTableEvents.HeaderCellMenu<D>
  footerCellClick?: VxeTableEvents.FooterCellClick<D>
  footerCellDblclick?: VxeTableEvents.FooterCellDblclick<D>
  footerCellMenu?: VxeTableEvents.FooterCellMenu<D>
  sortChange?: VxeTableEvents.SortChange<D>
  filterChange?: VxeTableEvents.FilterChange<D>
  resizableChange?: VxeTableEvents.ResizableChange<D>
  toggleRowExpand?: VxeTableEvents.ToggleRowExpand<D>
  toggleTreeExpand?: VxeTableEvents.ToggleTreeExpand<D>
  menuClick?: VxeTableEvents.MenuClick<D>
  editClosed?: VxeTableEvents.EditClosed<D>
  editActivated?: VxeTableEvents.EditActivated<D>
  editDisabled?: VxeTableEvents.EditDisabled<D>
  /**
   * 只对 edit-rules 配置时有效，当数据校验不通过时会触发该事件
   */
  validError?: VxeTableEvents.ValidError<D>
  /**
   * 表格滚动时会触发该事件
   */
  scroll?: VxeTableEvents.Scroll<D>
  scrollBoundary?: VxeTableEvents.ScrollBoundary<D>
  /**
   * 如果与工具栏关联，在自定义列按钮被手动点击后会触发该事件
   */
  custom?: VxeTableEvents.Custom<D>
  rowDragstart?: VxeTableEvents.RowDragstart<D>
  rowDragover?: VxeTableEvents.RowDragover<D>
  rowDragend?: VxeTableEvents.RowDragend<D>
  columnDragstart?: VxeTableEvents.ColumnDragstart<D>
  columnDragover?: VxeTableEvents.ColumnDragover<D>
  columnDragend?: VxeTableEvents.ColumnDragend<D>
  enterAppendRow?: VxeTableEvents.EnterAppendRow<D>

  /**
   * 已废弃，请使用 editActivated
   * @deprecated
   */
  editActived?: VxeTableEvents.EditActivated<D>
}

export namespace VxeTableEvents {
  export type KeydownStart<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.KeydownStartEventParams<D>) => void
  export type Keydown<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.KeydownEventParams<D>) => void
  export type KeydownEnd<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.KeydownEndEventParams<D>) => void
  export type Paste<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.PasteEventParams<D>) => void
  export type Copy<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.CopyEventParams<D>) => void
  export type Cut<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.CutEventParams<D>) => void
  export type CurrentChange<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.CurrentChangeEventParams<D>) => void
  export type RadioChange<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.RadioChangeEventParams<D>) => void
  export type CheckboxChange<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.CheckboxChangeEventParams<D>) => void
  export type CheckboxAll<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.CheckboxAllEventParams<D>) => void
  export type CheckboxRangeStart<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.CheckboxRangeStartEventParams<D>) => void
  export type CheckboxRangeChange<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.CheckboxRangeChangeEventParams<D>) => void
  export type CheckboxRangeEnd<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.CheckboxRangeEndEventParams<D>) => void
  export type CheckboxRangeSelect<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.CheckboxRangeSelectEventParams<D>) => void
  export type CellClick<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.CellClickEventParams<D>) => void
  export type CellDblclick<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.CellDblclickEventParams<D>) => void
  export type CellMenu<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.CellMenuEventParams<D>) => void
  export type CellMouseenter<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.CellMouseenterEventParams<D>) => void
  export type CellMouseleave<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.CellMouseleaveEventParams<D>) => void
  export type CellDeleteValue<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.CellDeleteValueEventParams<D>) => void
  export type HeaderCellClick<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.HeaderCellClickEventParams<D>) => void
  export type HeaderCellDblclick<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.HeaderCellDblclickEventParams<D>) => void
  export type HeaderCellMenu<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.HeaderCellMenuEventParams<D>) => void
  export type FooterCellClick<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.FooterCellClickEventParams<D>) => void
  export type FooterCellDblclick<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.FooterCellDblclickEventParams<D>) => void
  export type FooterCellMenu<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.FooterCellMenuEventParams<D>) => void
  export type SortChange<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.SortChangeEventParams<D>) => void
  export type FilterChange<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.FilterChangeEventParams<D>) => void
  export type FilterVisible<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.FilterVisibleEventParams<D>) => void
  export type ResizableChange<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.ResizableChangeEventParams<D>) => void
  export type ToggleRowExpand<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.ToggleRowExpandEventParams<D>) => void
  export type ToggleTreeExpand<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.ToggleTreeExpandEventParams<D>) => void
  export type MenuClick<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.MenuClickEventParams<D>) => void
  export type EditClosed<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.EditClosedEventParams<D>) => void
  export type EditActivated<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.EditActivatedEventParams<D>) => void
  export type EditDisabled<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.EditDisabledEventParams<D>) => void
  export type ValidError<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.ValidErrorEventParams<D>) => void
  export type Scroll<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.ScrollEventParams<D>) => void
  export type ScrollBoundary<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.ScrollBoundaryEventParams<D>) => void
  export type Custom<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.CustomEventParams<D>) => void
  export type RowDragstart<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.RowDragstartEventParams<D>) => void
  export type RowDragover<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.RowDragoverEventParams<D>) => void
  export type RowDragend<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.RowDragendEventParams<D>) => void
  export type ColumnDragstart<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.ColumnDragstartEventParams<D>) => void
  export type ColumnDragover<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.ColumnDragoverEventParams<D>) => void
  export type ColumnDragend<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.ColumnDragendEventParams<D>) => void
  export type EnterAppendRow<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.EnterAppendRowEventParams<D>) => void

  /**
   * 已废弃，请使用 EditActivated
   * @deprecated
   */
  export type EditActived<D = VxeTablePropTypes.Row> = (params: VxeTableDefines.EditActivatedEventParams<D>) => void
}

export namespace VxeTableSlotTypes {
  export interface DefaultSlotParams {}

  export interface BaseSlotParams<D = any> {
    $table: VxeTableConstructor<D>
    $grid: VxeGridConstructor<D> | null | undefined
  }
  export interface EmptySlotParams<D = any> extends BaseSlotParams<D> {}
  export interface LoadingSlotParams<D = any> extends BaseSlotParams<D> {}

  export interface RowDragIconSlotParams<D = any> extends BaseSlotParams<D>, VxeTableDefines.CellRenderBodyParams<D> {}
  export interface ColumnDragIconSlotParams<D = any> extends BaseSlotParams<D>, VxeTableDefines.CellRenderHeaderParams<D> {}
}

export interface VxeTableSlots<D = any> {
  /**
   * 自定义空数据时显示模板
   */
  empty?(params: VxeTableSlotTypes.EmptySlotParams<D>): any
  /**
   * 自定义加载中模板
   */
  loading?(params: VxeTableSlotTypes.LoadingSlotParams<D>): any

  /**
   * 只对 row-config.drag 开启后有效，自定义行拖拽按钮图标
   */
  rowDragIcon?: (params: VxeTableSlotTypes.RowDragIconSlotParams<D>) => any
  'row-drag-icon'?: (params: VxeTableSlotTypes.RowDragIconSlotParams<D>) => any

  /**
   * 只对 column-config.drag 开启后有效，自定义列拖拽按钮图标
   */
  columnDragIcon?: (params: VxeTableSlotTypes.ColumnDragIconSlotParams<D>) => any
  'column-drag-icon'?: (params: VxeTableSlotTypes.ColumnDragIconSlotParams<D>) => any
}

export * from './table-module'
export * from './table-plugins'

export const Table: typeof VxeTable
export default VxeTable
