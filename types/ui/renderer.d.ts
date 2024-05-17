import { VxeComponentSlot, VxeComponentStyle, VxeComponentClassName } from '../tool'
import { FormItemRenderOptions, FormItemTitleRenderParams, FormItemContentRenderParams, FormItemVisibleParams, FormItemResetParams } from '../components/form-item'
import { VxeFormProps } from '../components/form'
import { VxeFormDesignDefines } from '../components/form-design'

/* eslint-disable no-use-before-define */

type RendererOptions = DefineRendererOption<VxeGlobalRendererHandles.RenderResult>

export interface DefineRendererOption<T> {
  /**
   * @deprecated 已废弃
   */
  className?: string

  // 筛选渲染
  filterClassName?: string | ((params: VxeGlobalRendererHandles.RenderFilterParams<any>) => string | VxeComponentClassName)
  showFilterFooter?: boolean
  renderFilter?(renderOpts: VxeGlobalRendererHandles.RenderFilterOptions, params: VxeGlobalRendererHandles.RenderFilterParams<any>): T
  filterMethod?(params: VxeGlobalRendererHandles.FilterMethodParams<any>): boolean
  filterRemoteMethod?(params: VxeGlobalRendererHandles.FilterRemoteMethod<any>): boolean
  filterResetMethod?(params: VxeGlobalRendererHandles.FilterResetMethodParams<any>): void
  filterRecoverMethod?(params: VxeGlobalRendererHandles.FilterRecoverMethodParams<any>): void
  // 默认行为
  defaultFilterMethod?(params: VxeGlobalRendererHandles.FilterMethodParams<any>): boolean

  // 单元格渲染
  cellClassName?: string | ((params: VxeGlobalRendererHandles.RenderDefaultParams<any>) => string | VxeComponentClassName)
  cellStyle?: VxeComponentStyle | ((params: VxeGlobalRendererHandles.RenderDefaultParams<any>) => VxeComponentStyle)
  renderHeader?(renderOpts: VxeGlobalRendererHandles.RenderHeaderOptions, params: VxeGlobalRendererHandles.RenderHeaderParams<any>): T
  renderDefault?(renderOpts: VxeGlobalRendererHandles.RenderDefaultOptions, params: VxeGlobalRendererHandles.RenderDefaultParams<any>): T
  renderFooter?(renderOpts: VxeGlobalRendererHandles.RenderFooterOptions, params: VxeGlobalRendererHandles.RenderFooterParams<any>): T
  exportMethod?(params: VxeGlobalRendererHandles.ExportMethodParams<any>): string
  footerExportMethod?(params: VxeGlobalRendererHandles.FooterExportMethodParams<any>): string

  // 编辑渲染
  autofocus?: string | ((params: VxeGlobalRendererHandles.RenderEditParams<any> | VxeGlobalRendererHandles.RenderCellParams<any>) => HTMLElement | null)
  autoselect?: boolean
  renderEdit?(renderOpts: VxeGlobalRendererHandles.RenderEditOptions<any>, params: VxeGlobalRendererHandles.RenderEditParams<any>): T
  renderCell?(renderOpts: VxeGlobalRendererHandles.RenderCellOptions<any>, params: VxeGlobalRendererHandles.RenderCellParams<any>): T

  // 内容渲染
  renderExpand?(renderOpts: VxeGlobalRendererHandles.RenderExpandOptions, params: VxeGlobalRendererHandles.RenderExpandParams<any>): T

  // 工具栏-按钮渲染
  toolbarButtonClassName?: string | ((params: VxeGlobalRendererHandles.RenderButtonParams<any>) => string | VxeComponentClassName)
  renderToolbarButton?(renderOpts: VxeGlobalRendererHandles.RenderButtonOptions, params: VxeGlobalRendererHandles.RenderButtonParams<any>): T
  toolbarToolClassName?: string | ((params: VxeGlobalRendererHandles.RenderToolParams<any>) => string | VxeComponentClassName)
  renderToolbarTool?(renderOpts: VxeGlobalRendererHandles.RenderToolOptions, params: VxeGlobalRendererHandles.RenderToolParams<any>): T

  // 表单-项渲染
  itemClassName?: string | ((params: VxeGlobalRendererHandles.RenderItemTitleParams) => string | VxeComponentClassName)
  itemStyle?: VxeComponentStyle | ((params: VxeGlobalRendererHandles.RenderItemTitleParams) => VxeComponentStyle)
  itemContentClassName?: string | ((params: VxeGlobalRendererHandles.RenderItemTitleParams) => string | VxeComponentClassName)
  itemContentStyle?: VxeComponentStyle | ((params: VxeGlobalRendererHandles.RenderItemTitleParams) => VxeComponentStyle)
  itemTitleClassName?: string | ((params: VxeGlobalRendererHandles.RenderItemTitleParams) => string | VxeComponentClassName)
  itemTitleStyle?: VxeComponentStyle | ((params: VxeGlobalRendererHandles.RenderItemTitleParams) => VxeComponentStyle)
  renderItemTitle?(renderOpts: VxeGlobalRendererHandles.RenderItemTitleOptions, params: VxeGlobalRendererHandles.RenderItemTitleParams): T
  renderItemContent?(renderOpts: VxeGlobalRendererHandles.RenderItemContentOptions, params: VxeGlobalRendererHandles.RenderItemContentParams): T
  itemVisibleMethod?(params: VxeGlobalRendererHandles.ItemVisibleMethodParams): boolean
  itemResetMethod?(params: VxeGlobalRendererHandles.ItemResetMethodParams): void

  // 设计表单
  formDesignWidgetName?: string | ((params: VxeGlobalRendererHandles.FormDesignWidgetNameParams) => string)
  formDesignWidgetIcon?: string
  formDesignWidgetGroup?: null | '' | 'base' | 'layout' | 'advanced'
  formDesignWidgetCustomGroup?: string | ((params: VxeGlobalRendererHandles.FormDesignWidgetCustomGroupParams) => string)
  createFormDesignSettingFormConfig?(params: VxeGlobalRendererHandles.CreateFormDesignSettingFormConfigParams): VxeFormProps
  renderFormDesignSettingView?(renderOpts: VxeGlobalRendererHandles.RenderFormDesignSettingViewOptions, params: VxeGlobalRendererHandles.RenderFormDesignSettingViewParams): T
  createFormDesignWidgetFormConfig?(params: VxeGlobalRendererHandles.CreateFormDesignWidgetFormConfigParams): VxeFormProps
  renderFormDesignWidgetFormView?(renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewOptions, params: VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewParams): T
  renderFormDesignWidgetItem?(renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetItemOptions, params: VxeGlobalRendererHandles.RenderFormDesignWidgetItemParams): T
  renderFormDesignWidgetView?(renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions, params: VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams): T

  // 空内容渲染
  renderEmpty?(renderOpts: VxeGlobalRendererHandles.RenderEmptyOptions, params: VxeGlobalRendererHandles.RenderEmptyParams): T
}

export namespace VxeGlobalRendererHandles {
  export type RenderResult = VxeComponentSlot | VxeComponentSlot[]

  export interface RenderFilterOptions {}

  export interface RenderParams {}

  export type RenderFilterParams<D = any> = {
    $table: any
    $panel: any
    column: any
    columnIndex: number
    $columnIndex: number
    $rowIndex: number
  }

  export type FilterMethodParams<D = any> = {
    $table: any
    value: any
    option: any
    cellValue: any
    row: any
    column: any
  }

  export interface FilterRemoteMethod<D = any> {
    $table: any
  }

  export interface FilterResetMethodParams<D = any> {
    $table: any
    options: any[]
    column: any
  }

  export interface FilterRecoverMethodParams<D = any> {
    $table: any
    option: any
    column: any
  }

  export interface RenderHeaderOptions extends VxeGlobalRendererHandles.RenderOptions { }

  export interface RenderHeaderParams<D = any> {
    $table: any
    column:any
    columnIndex: number
    $columnIndex: number
    $rowIndex: number
  }

  export type RenderDefaultOptions<D = any> = {
    [ket: string]: any
  }
  export type RenderDefaultParams<D = any> = RenderEditParams<D>

  export interface RenderFooterOptions extends VxeGlobalRendererHandles.RenderOptions { }

  export interface RenderFooterParams<D = any> {
    $table: any
    column: any
    columnIndex: number
    _columnIndex: number
    $columnIndex: number
    $rowIndex: number
    items: any[]
    data: D[][]
  }

  export interface ExportMethodParams<D = any> {
    row: D
    column: any
    options: any[]
  }

  export interface FooterExportMethodParams<D = any> {
    items: any[]
    _columnIndex: number
    column: any
    options: any[]
  }

  export type RenderEditOptions<D = any> = {
    [ket: string]: any
  }

  export interface RenderEditParams<D = any> {
    $table: any
    $grid: any
    column: any
    columnIndex: number
    $columnIndex: number
    rowid: string
    row: D
    rowIndex: number
    $rowIndex: number
    isHidden: boolean
    fixed: any
    type: string
  }

  export type RenderCellOptions<D = any> = {
    [ket: string]: any
  }
  export type RenderCellParams<D = any> = {
    $table: any
    $grid: any
    column: any
    columnIndex: number
    $columnIndex: number
    rowid: string
    row: D
    rowIndex: number
    $rowIndex: number
    isHidden: boolean
    fixed: any
    type: string
  }

  export interface RenderExpandOptions { }
  export type RenderExpandParams<D = any> = RenderEditParams<D>

  export interface RenderButtonOptions extends VxeGlobalRendererHandles.RenderOptions { }
  export interface RenderButtonParams<D = any> {
    $grid: any
    $table: any
    button: any
  }

  export interface RenderToolOptions extends VxeGlobalRendererHandles.RenderOptions { }
  export interface RenderToolParams<D = any> {
    $grid: any
    $table: any
    tool: any
  }

  export type RenderItemTitleOptions = FormItemRenderOptions
  export type RenderItemTitleParams = FormItemTitleRenderParams
  export type RenderItemContentOptions = FormItemRenderOptions
  export type RenderItemContentParams = FormItemContentRenderParams
  export type ItemVisibleMethodParams = FormItemVisibleParams
  export type ItemResetMethodParams = FormItemResetParams

  export type RenderEmptyOptions = {
    [key: string]: any
  }

  export interface RenderEmptyParams<D = any> {
    $table: any
  }

  /**
   * 渲染选项
   */
  export interface RenderOptions {
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
    /**
     * 渲染类型
     */
    cellType?: 'string' | 'number'
  }

  /**
   * 选项参数
   */
  export interface RenderOptionProps {
    value?: string
    label?: string
    disabled?: string
    key?: string
  }

  /**
   * 分组选项参数
   */
  export interface RenderOptionGroupProps {
    options?: string
    label?: string
    key?: string
  }

  export interface FormDesignWidgetNameParams {
    name: string
  }

  export interface FormDesignWidgetCustomGroupParams {
  }

  export interface CreateFormDesignSettingFormConfigParams {
  }

  export interface CreateFormDesignWidgetFormConfigParams {
    name: string
  }

  export interface RenderFormDesignWidgetItemOptions {}

  export interface RenderFormDesignWidgetItemParams {}

  export interface RenderFormDesignWidgetViewOptions extends VxeFormDesignDefines.WidgetObjItem {}
  export interface RenderFormDesignWidgetViewParams {
    item: VxeFormDesignDefines.WidgetObjItem
  }

  export interface RenderFormDesignWidgetFormViewOptions extends VxeFormDesignDefines.WidgetObjItem {}
  export interface RenderFormDesignWidgetFormViewParams {
    widget: VxeFormDesignDefines.WidgetObjItem
  }

  export interface RenderFormDesignSettingViewOptions {}
  export interface RenderFormDesignSettingViewParams {}
}

/**
 * 渲染器
 */
export interface VxeGlobalRenderer {
  mixin(options: {
    [name: string]: RendererOptions
  }): VxeGlobalRenderer
  get(name: string | null | undefined): DefineRendererOption<VxeGlobalRendererHandles.RenderResult>
  add(name: string, options: RendererOptions): VxeGlobalRenderer
  forEach(callback: (item: DefineRendererOption<VxeGlobalRendererHandles.RenderResult>, name: string, renderMap: {
    [name: string]: RendererOptions
  }) => void): VxeGlobalRenderer
  delete(name: string): void
}
