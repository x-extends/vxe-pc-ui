import { RenderFunction, SetupContext, Ref } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentBaseOptions, VxeComponentEventParams, VxeComponentSlotType, ValueOf } from '@vxe-ui/core'
import { VxeTableDefines, VxeTablePropTypes, VxeTableConstructor } from './table'
import { VxeTooltipDefines } from './tooltip'
import { VxeGlobalRendererHandles } from '../ui'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeColumn: DefineVxeComponentApp<VxeColumnProps, VxeColumnEventProps, VxeColumnSlots>
export type VxeColumnComponent = DefineVxeComponentOptions<VxeColumnProps, VxeColumnEventProps>

export type VxeColumnInstance = DefineVxeComponentInstance<VxeColumnProps, VxeColumnConstructor>

export interface VxeColumnConstructor extends VxeComponentBaseOptions, VxeColumnMethods {
  props: VxeColumnProps
  context: SetupContext<VxeColumnEmits>
  reactData: ColumnReactData
  getRefMaps(): ColumnPrivateRef
  getComputeMaps(): ColumnPrivateComputed
  renderVN: RenderFunction
}

export interface ColumnPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeColumnPrivateRef extends ColumnPrivateRef { }

export namespace VxeColumnPropTypes {
  export type ColId = string | number
  export type Type = 'seq' | 'radio' | 'checkbox' | 'expand' | 'html' | null
  export type Field = string
  export type Title = string
  export type Width = number | string
  export type MinWidth = number | string
  export type MaxWidth = number | string
  export type Resizable = boolean
  export type Fixed = 'left' | 'right' | '' | null
  export type Align = 'left' | 'center' | 'right' | '' | null
  export type HeaderAlign = Align
  export type FooterAlign = Align
  export type ShowOverflow = VxeTablePropTypes.ShowOverflow
  export type ShowHeaderOverflow = ShowOverflow
  export type ShowFooterOverflow = ShowOverflow
  export type ClassName<D = any> = string | ((params: VxeGlobalRendererHandles.RenderCellParams<D>) => string | any[] | { [key: string]: boolean })
  export type HeaderClassName<D = any> = string | ((params: VxeGlobalRendererHandles.RenderHeaderParams<D>) => string | any[] | { [key: string]: boolean })
  export type FooterClassName<D = any> = string | ((params: VxeGlobalRendererHandles.RenderFooterParams<D>) => string | any[] | { [key: string]: boolean })

  export type Formatter<D = any> = ((params: {
    cellValue: any
    column: VxeTableDefines.ColumnInfo<D>
    row: D
  }) => string | number) | any[] | string

  export type FooterFormatter<D = any> = ((params: {
    itemValue: any
    column: VxeTableDefines.ColumnInfo<D>
    row: any
    items: any[]
    _columnIndex: number
  }) => string | number) | any[] | string

  export type Sortable = boolean
  export type SortBy<D = any> = string | ((params: {
    row: D
    column: VxeTableDefines.ColumnInfo<D>
  }) => string | number)
  export type SortType = 'auto' | 'string' | 'number' | null

  export interface FilterItem {
    label?: string | number
    value?: any
    data?: any
    resetValue?: any
    checked?: boolean
  }
  /**
   * 请使用 FilterItem
   * @deprecated
   */
  export interface Filter extends FilterItem {}
  export type Filters = FilterItem[]

  export type FilterMultiple = boolean

  interface FilterMethodParams<D = any> {
    $table: VxeTableConstructor<D>
    value: any
    option: VxeTableDefines.FilterOption
    cellValue: any
    row: D
    column: VxeTableDefines.ColumnInfo<D>
  }
  export type FilterMethod<D = any> = (params: FilterMethodParams<D>) => boolean

  interface FilterResetMethodParams<D = any> {
    options: VxeTableDefines.FilterOption[]
    column: VxeTableDefines.ColumnInfo<D>
  }
  export type FilterResetMethod = (params: FilterResetMethodParams) => void

  interface FilterRecoverMethodParams<D = any> {
    option: VxeTableDefines.FilterOption
    column: VxeTableDefines.ColumnInfo<D>
  }
  export type FilterRecoverMethod<D = any> = (params: FilterRecoverMethodParams<D>) => void

  /**
   * 筛选渲染配置项
   */
  export interface FilterRender {
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
    /**
     * 多目标渲染
     */
    children?: any[]

    enabled?: boolean
    options?: any[]
    optionProps?: VxeGlobalRendererHandles.RenderOptionProps
    optionGroups?: any[]
    optionGroupProps?: VxeGlobalRendererHandles.RenderOptionGroupProps
    content?: string
    cellType?: VxeColumnPropTypes.CellType
  }

  /**
   * 设置为树节点
   */
  export type TreeNode = boolean
  /**
   * 设置为拖拽排序
   */
  export type DragSort = boolean
  export type Visible = boolean

  interface ExportMethodParams<D = any> {
    $table: VxeTableConstructor<D>
    row: D
    column: VxeTableDefines.ColumnInfo<D>
    options: VxeTablePropTypes.ExportHandleOptions
  }
  export type ExportMethod<D = any> = (params: ExportMethodParams<D>) => string | number

  interface HeaderExportParams<D = any> {
    $table: VxeTableConstructor<D>
    column: VxeTableDefines.ColumnInfo<D>
    options: VxeTablePropTypes.ExportHandleOptions
  }
  export type HeaderExportMethod<D = any> = (params: HeaderExportParams<D>) => string | number

  interface FooterExportParams<D = any> {
    $table: VxeTableConstructor<D>,
    items: any[]
    row: any
    column: VxeTableDefines.ColumnInfo<D>
    _columnIndex: number
    options: VxeTablePropTypes.ExportHandleOptions
  }
  export type FooterExportMethod<D = any> = (params: FooterExportParams<D>) => string | number

  /**
   * 已废弃，被 TitlePrefix 替换
   * @deprecated
   */
  export type TitleHelp = VxeTooltipDefines.TooltipHelperOption

  export type TitlePrefix = VxeTooltipDefines.TooltipHelperOption
  export type TitleSuffix = VxeTooltipDefines.TooltipHelperOption

  export type CellType = 'auto' | 'number' | 'string' | '' | null

  export interface CellRender<D = any, P = Record<string, any>> {
    /**
     * 渲染器名称
     */
    name?: string
    /**
     * 目标组件渲染的参数
     */
    props?: P
    /**
     * 目标组件渲染的属性
     */
    attrs?: Record<string, any>
    /**
     * 多目标渲染
     */
    children?: any[]

    events?: Record<string, (cellParams: VxeColumnSlotTypes.DefaultSlotParams<D>, ...args: any[]) => any>
    options?: any[]
    optionProps?: VxeGlobalRendererHandles.RenderOptionProps
    optionGroups?: any[]
    optionGroupProps?: VxeGlobalRendererHandles.RenderOptionGroupProps
    content?: string
  }

  /**
   * 编辑渲染配置项
   */
  export interface EditRender<D = any, P = Record<string, any>> {
    /**
     * 渲染器名称
     */
    name?: string
    /**
     * 目标组件渲染的参数
     */
    props?: P
    /**
     * 目标组件渲染的属性
     */
    attrs?: Record<string, any>
    /**
     * 多目标渲染
     */
    children?: any[]

    events?: Record<string, (cellParams: VxeColumnSlotTypes.EditSlotParams<D>, ...args: any[]) => any>
    enabled?: boolean
    options?: any[]
    optionProps?: VxeGlobalRendererHandles.RenderOptionProps
    optionGroups?: any[]
    optionGroupProps?: VxeGlobalRendererHandles.RenderOptionGroupProps
    autoFocus?: boolean | string
    autoSelect?: boolean
    defaultValue?: ((params: { column: VxeTableDefines.ColumnInfo<D> }) => any) | null | undefined | string | number | RegExp | object | any[] | Date
    immediate?: boolean
    content?: string
    placeholder?: string

    /**
     * 已废弃，请使用 autoFocus
     * @deprecated
     */
    autofocus?: string
    /**
     * 已废弃，请使用 autoSelect
     * @deprecated
     */
    autoselect?: boolean
  }

  /**
   * 内容渲染配置项
   */
  export interface ContentRender<D = any, P = Record<string, any>> {
    /**
     * 渲染器名称
     */
    name?: string
    /**
     * 目标组件渲染的参数
     */
    props?: P
    /**
     * 目标组件渲染的属性
     */
    attrs?: Record<string, any>
    /**
     * 目标组件渲染的事件
     */
    events?: Record<string, (cellParams: VxeColumnSlotTypes.ContentSlotParams<D>, ...args: any[]) => any>
    /**
     * 多目标渲染
     */
    children?: any[]

    options?: any[]
    optionProps?: VxeGlobalRendererHandles.RenderOptionProps
    optionGroups?: any[]
    optionGroupProps?: VxeGlobalRendererHandles.RenderOptionGroupProps
  }

  export interface WidgetRender<D = any, P = Record<string, any>> {
    /**
     * 渲染器名称
     */
    name?: string
    /**
     * 目标组件渲染的参数
     */
    props?: P
  }

  export type Params = any

  export type Slots<D = any> = {
    /**
     * 只对 type=checkbox,radio 有效，自定义标题模板
     */
    title?: string | ((params: VxeColumnSlotTypes.HeaderSlotParams<D>) => VxeComponentSlotType[] | VxeComponentSlotType) | null
    /**
     * 只对 type=radio 有效，自定义单选框模板
     */
    radio?: string | ((params: VxeColumnSlotTypes.RadioSlotParams<D>) => VxeComponentSlotType[] | VxeComponentSlotType) | null
    /**
     * 只对 type=checkbox 有效，自定义复选框模板
     */
    checkbox?: string | ((params: VxeColumnSlotTypes.CheckboxSlotParams<D>) => VxeComponentSlotType[] | VxeComponentSlotType) | null
    /**
     * 自定义显示内容模板
     */
    default?: string | ((params: VxeColumnSlotTypes.DefaultSlotParams<D>) => VxeComponentSlotType[] | VxeComponentSlotType) | null
    /**
     * 自定义表头内容的模板
     */
    header?: string | ((params: VxeColumnSlotTypes.HeaderSlotParams<D>) => VxeComponentSlotType[] | VxeComponentSlotType) | null
    /**
     * 自定义表尾内容的模板
     */
    footer?: string | ((params: VxeColumnSlotTypes.FooterSlotParams<D>) => VxeComponentSlotType[] | VxeComponentSlotType) | null
    /**
     * 只对 type=expand 有效，自定义展开后的内容模板
     */
    content?: string | ((params: VxeColumnSlotTypes.ContentSlotParams<D>) => VxeComponentSlotType[] | VxeComponentSlotType) | null
    /**
     * 只对 filter-render 启用时有效，自定义筛选模板
     */
    filter?: string | ((params: VxeColumnSlotTypes.FilterSlotParams<D>) => VxeComponentSlotType[] | VxeComponentSlotType) | null
    /**
     * 只对 edit-render 启用时有效，自定义可编辑组件模板
     */
    edit?: string | ((params: VxeColumnSlotTypes.EditSlotParams<D>) => VxeComponentSlotType[] | VxeComponentSlotType) | null
    /**
     * 只对 edit-render 启用时有效，自定义可编辑组件模板
     */
    valid?: string | ((params: VxeColumnSlotTypes.ValidSlotParams<D>) => VxeComponentSlotType[] | VxeComponentSlotType) | null

    /**
     * 已废弃
     * @deprecated
     */
    icon?: string | ((params: VxeColumnSlotTypes.IconSlotParams<D>) => VxeComponentSlotType[] | VxeComponentSlotType) | null
  }
}

export interface VxeColumnProps<D = any> {
  colId?: VxeColumnPropTypes.ColId
  /**
   * 渲染类型
   */
  type?: VxeColumnPropTypes.Type
  /**
   * 列字段名
   */
  field?: VxeColumnPropTypes.Field
  /**
   * 列标题
   */
  title?: VxeColumnPropTypes.Title
  /**
   * 列宽度
   */
  width?: VxeColumnPropTypes.Width
  /**
   * 列最小宽度，把剩余宽度按比例分配
   */
  minWidth?: VxeColumnPropTypes.MinWidth
  /**
   * 列最大宽度
   */
  maxWidth?: VxeColumnPropTypes.MaxWidth
  /**
   * 是否允许拖动列宽调整大小
   */
  resizable?: VxeColumnPropTypes.Resizable
  /**
   * 将列固定在左侧或者右侧
   */
  fixed?: VxeColumnPropTypes.Fixed
  /**
   * 列对其方式
   */
  align?: VxeColumnPropTypes.Align
  /**
   * 表头对齐方式
   */
  headerAlign?: VxeColumnPropTypes.HeaderAlign
  /**
   * 表尾列的对齐方式
   */
  footerAlign?: VxeColumnPropTypes.FooterAlign
  /**
   * 当内容过长时显示为省略号
   */
  showOverflow?: VxeColumnPropTypes.ShowOverflow
  /**
   * 当表头内容过长时显示为省略号
   */
  showHeaderOverflow?: VxeColumnPropTypes.ShowHeaderOverflow
  /**
   * 当表尾内容过长时显示为省略号
   */
  showFooterOverflow?: VxeColumnPropTypes.ShowFooterOverflow
  /**
   * 给单元格附加 className
   */
  className?: VxeColumnPropTypes.ClassName<D>
  /**
   * 给表头单元格附加 className
   */
  headerClassName?: VxeColumnPropTypes.HeaderClassName<D>
  /**
   * 给表尾单元格附加 className
   */
  footerClassName?: VxeColumnPropTypes.FooterClassName<D>
  /**
   * 格式化显示内容
   */
  formatter?: VxeColumnPropTypes.Formatter<D>
  /**
   * 格式化表尾显示内容
   */
  footerFormatter?: VxeColumnPropTypes.FooterFormatter<D>
  /**
   * 是否允许排序
   */
  sortable?: VxeColumnPropTypes.Sortable
  /**
   * 自定义排序的属性
   */
  sortBy?: VxeColumnPropTypes.SortBy<D>
  /**
   * 排序的字段类型，比如字符串转数值等
   */
  sortType?: VxeColumnPropTypes.SortType
  /**
   * 配置筛选条件数组
   */
  filters?: VxeColumnPropTypes.Filters
  /**
   * 筛选是否允许多选
   */
  filterMultiple?: VxeColumnPropTypes.FilterMultiple
  /**
   * 自定义筛选方法
   */
  filterMethod?: VxeColumnPropTypes.FilterMethod<D>
  /**
   * 筛选模板配置项
   */
  filterRender?: VxeColumnPropTypes.FilterRender
  /**
   * 设置为树节点
   */
  treeNode?: VxeColumnPropTypes.TreeNode
  /**
   * 设置为拖拽排序
   */
  dragSort?: VxeColumnPropTypes.DragSort
  /**
   * 是否可视
   */
  visible?: VxeColumnPropTypes.Visible
  /**
   * 自定义表尾单元格数据导出方法
   */
  headerExportMethod?: VxeColumnPropTypes.HeaderExportMethod<D>
  /**
   * 自定义单元格数据导出方法
   */
  exportMethod?: VxeColumnPropTypes.ExportMethod<D>
  /**
   * 自定义表尾单元格数据导出方法
   */
  footerExportMethod?: VxeColumnPropTypes.FooterExportMethod<D>
  /**
   * 已废弃，被 titlePrefix 替换
   * @deprecated
   */
  titleHelp?: VxeColumnPropTypes.TitleHelp
  /**
   * 标题前缀图标配置项
   */
  titlePrefix?: VxeColumnPropTypes.TitlePrefix
  /**
   * 标题后缀图标配置项
   */
  titleSuffix?: VxeColumnPropTypes.TitleSuffix
  /**
   * 单元格值类型
   */
  cellType?: VxeColumnPropTypes.CellType
  /**
   * 单元格渲染配置项
   */
  cellRender?: VxeColumnPropTypes.CellRender<D>
  /**
   * 单元格编辑渲染配置项
   */
  editRender?: VxeColumnPropTypes.EditRender<D>
  /**
   * 内容渲染配置项
   */
  contentRender?: VxeColumnPropTypes.ContentRender
  /**
   * 额外的参数
   */
  params?: VxeColumnPropTypes.Params
}

export interface ColumnPrivateComputed {
}
export interface VxeColumnPrivateComputed extends ColumnPrivateComputed { }

export interface ColumnReactData {
}

export interface ColumnMethods {
  dispatchEvent(type: ValueOf<VxeColumnEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeColumnMethods extends ColumnMethods { }

export interface ColumnPrivateMethods { }
export interface VxeColumnPrivateMethods extends ColumnPrivateMethods { }

export type VxeColumnEmits = []

export namespace VxeColumnDefines {
  export interface ColumnEventParams extends VxeComponentEventParams {
    $column: VxeColumnConstructor
  }
}

export type VxeColumnEventProps = {}

export interface VxeColumnListeners { }

export namespace VxeColumnEvents { }

export namespace VxeColumnSlotTypes {
  export interface FilterSlotParams<D = any> {
    $panel: any
    column: {
      filters: VxeTableDefines.FilterOption[]
    } & VxeTableDefines.ColumnInfo<D>
    columnIndex: number
    $columnIndex: number
    $rowIndex: number
  }

  export interface EditSlotParams<D = any> extends VxeTableDefines.CellRenderBodyParams<D> { }

  export interface FooterSlotParams<D = any> {
    row: D
    rowIndex: number
    column: VxeTableDefines.ColumnInfo<D>
    columnIndex: number
    _columnIndex: number
    $columnIndex: number
    $rowIndex: number
    items: any[]
    data: D[][]
  }

  export interface HeaderSlotParams<D = any> extends VxeTableDefines.CellRenderHeaderParams<D> { }

  export interface ContentSlotParams<D = any> extends VxeTableDefines.CellRenderBodyParams<D> { }

  export interface DefaultSlotParams<D = any> extends VxeTableDefines.CellRenderBodyParams<D> { }

  export interface CheckboxSlotParams<D = any> extends DefaultSlotParams<D> {
    checked: boolean
    indeterminate: boolean
  }
  export interface RadioSlotParams<D = any> extends DefaultSlotParams<D> {
    checked: boolean
  }
  export interface IconSlotParams<D = any> extends DefaultSlotParams<D> { }

  export interface ValidSlotParams<D = any> extends DefaultSlotParams<D> {
    rule: VxeTableDefines.ValidatorRule<D>
    content: string
  }
}

export interface VxeColumnSlots<D = any> {
  /**
   * 自定义显示内容模板
   */
  default?: (params: VxeColumnSlotTypes.DefaultSlotParams<D>) => any
  /**
   * 自定义表头内容的模板
   */
  header?: (params: VxeColumnSlotTypes.HeaderSlotParams<D>) => any
  /**
   * 自定义表尾内容的模板
   */
  footer?: (params: VxeColumnSlotTypes.FooterSlotParams<D>) => any
  /**
   * 只对 type=checkbox,radio 有效，自定义标题模板
   */
  title?: (params: VxeColumnSlotTypes.HeaderSlotParams<D>) => any
  /**
   * 只对 type=checkbox 有效，自定义复选框模板
   */
  checkbox?: (params: VxeColumnSlotTypes.CheckboxSlotParams<D>) => any
  /**
   * 只对 type=radio 有效，自定义单选框模板
   */
  radio?: (params: VxeColumnSlotTypes.RadioSlotParams<D>) => any
  /**
   * 只对 type=expand 有效，自定义展开后的内容模板
   */
  content?: (params: VxeColumnSlotTypes.ContentSlotParams<D>) => any
  /**
   * 只对 filter-render 启用时有效，自定义筛选模板
   */
  filter?: (params: VxeColumnSlotTypes.FilterSlotParams<D>) => any
  /**
   * 只对 edit-render 启用时有效，自定义可编辑组件模板
   */
  edit?: (params: VxeColumnSlotTypes.EditSlotParams<D>) => any
   /**
   * 只对 edit-render 启用时有效，自定义展示错误校验模板
   */
  valid?: (params: VxeColumnSlotTypes.ValidSlotParams<D>) => any

  /**
   * 已废弃
   * @deprecated
   */
  icon?: (params: VxeColumnSlotTypes.IconSlotParams<D>) => any
}

export const Column: typeof VxeColumn
export default VxeColumn
