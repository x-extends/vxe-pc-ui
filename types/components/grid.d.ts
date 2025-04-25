import { VNode, CreateElement } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, VxeComponentSizeType, VxeComponentSlotType, ValueOf } from '@vxe-ui/core'
import { VxeToolbarProps, VxeToolbarPropTypes, VxeToolbarSlotTypes } from './toolbar'
import { VxeTableDefines, VxeTableEmits, VxeTableConstructor, VxeTableProps, TableMethods, VxeTableSlotTypes } from './table'
import { VxeColumnPropTypes } from './column'
import { VxePagerProps, VxePagerDefines, VxePagerSlotTypes } from './pager'
import { VxeFormProps, VxeFormDefines } from './form'
import { VxeFormItemProps } from './form-item'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types,@typescript-eslint/no-unused-vars */

export declare const VxeGrid: DefineVxeComponentApp<VxeGridProps, VxeGridEventProps, VxeGridSlots, VxeGridMethods>
export type VxeGridComponent = DefineVxeComponentOptions<VxeGridProps>

export type VxeGridInstance<D = any> = DefineVxeComponentInstance<{
  reactData: GridReactData<D>
}, VxeGridProps<D>, VxeGridPrivateComputed<D>, VxeGridMethods<D>>

export type VxeGridConstructor<D = any> = VxeGridInstance<D>

export interface GridPrivateRef<D = any> {
}
export interface VxeGridPrivateRef<D = any> extends GridPrivateRef<D> { }

export namespace VxeGridPropTypes {
  export type Size = VxeComponentSizeType

  export type LayoutKey = 'Form' | 'Toolbar' | 'Top' | 'Table' | 'Bottom' | 'Pager'
  export type Layouts = LayoutKey[] |LayoutKey[][]

  export type Column<D = any> = VxeTableDefines.ColumnOptions<D>
  export type Columns<D = any> = Column<D>[]

  export interface PagerConfig extends VxePagerProps {
    enabled?: boolean
    slots?: {
      left?: string | ((params: VxePagerSlotTypes.LeftSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      right?: string | ((params: VxePagerSlotTypes.RightSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      home?: string | ((params: VxePagerSlotTypes.HomeSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      prevPage?: string | ((params: VxePagerSlotTypes.PrevPageSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      prevJump?: string | ((params: VxePagerSlotTypes.PrevJumpSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      nextJump?: string | ((params: VxePagerSlotTypes.NextJumpSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      nextPage?: string | ((params: VxePagerSlotTypes.NextPageSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      end?: string | ((params: VxePagerSlotTypes.EndSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      number?: string | ((params: VxePagerSlotTypes.NumberJumpSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      numberJump?: string | ((params: VxePagerSlotTypes.NumberJumpSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      sizes?: string | ((params: VxePagerSlotTypes.SizesSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      fullJump?: string | ((params: VxePagerSlotTypes.FullJumpSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      jump?:string | ((params: VxePagerSlotTypes.FullJumpSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      pageCount?: string | ((params: VxePagerSlotTypes.PageCountSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      total?: string | ((params: VxePagerSlotTypes.TotalSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
    }
  }
  export interface PagerOpts extends PagerConfig { }

  interface ProxyAjaxQueryPageParams {
    total: number
    pageSize: number
    currentPage: number
  }

  interface ProxyAjaxQuerySortCheckedParams<D = any> {
    column: VxeTableDefines.ColumnInfo<D>
    order: string
    sortBy: string
    field: string
    property: string
  }

  interface ProxyAjaxQueryParams<D = any> {
    $grid: VxeGridConstructor<D>
    page: ProxyAjaxQueryPageParams
    sort: ProxyAjaxQuerySortCheckedParams<D>
    sorts: ProxyAjaxQuerySortCheckedParams<D>[]
    filters: VxeTableDefines.FilterCheckedParams[]
    form: {
      [key: string]: any
    }
  }

  interface ProxyAjaxQueryAllParams<D = any> {
    $table: VxeTableConstructor<D>
    $grid: VxeGridConstructor<D>
    sort: ProxyAjaxQuerySortCheckedParams<D>
    sorts: ProxyAjaxQuerySortCheckedParams<D>[]
    filters: VxeTableDefines.FilterCheckedParams[]
    form: {
      [key: string]: any
    }
    options: any
  }

  interface ProxyAjaxDeleteParams<D = any> {
    $grid: VxeGridConstructor<D>
    body: {
      removeRecords: D[]
    }
  }

  interface ProxyAjaxSaveParams<D = any> {
    $grid: VxeGridConstructor<D>
    body: {
      insertRecords: D[]
      updateRecords: D[]
      removeRecords: D[]
      pendingRecords: D[]
    }
  }

  interface ProxyAjaxResponseParams<T = any> {
    response: T
  }

  export interface ProxyConfig<D = any> {
    enabled?: boolean
    autoLoad?: boolean
    /**
     * 已废弃，请使用 showResponseMsg
     * @deprecated
     */
    message?: boolean
    showResponseMsg?: boolean
    showActiveMsg?: boolean
    seq?: boolean
    sort?: boolean
    filter?: boolean
    form?: boolean
    response?: {
      list?: string | null | ((params: {
        data: any
        $grid: VxeGridConstructor<D>
      }) => any[])
      result?: string | ((params: {
        data: any
        $grid: VxeGridConstructor<D>
      }) => any[])
      total?: string | ((params: {
        data: any
        $grid: VxeGridConstructor<D>
      }) => number)
      message?: string | ((params: {
        data: any
        $grid: VxeGridConstructor<D>
      }) => string)
    }
    ajax?: {
      query?(params: ProxyAjaxQueryParams<D>, ...args: any[]): Promise<any>
      querySuccess?(params: ProxyAjaxQueryParams<D> & ProxyAjaxResponseParams): void
      queryError?(params: ProxyAjaxQueryParams<D> & ProxyAjaxResponseParams): void
      queryAll?(params: ProxyAjaxQueryAllParams<D>): Promise<any>
      queryAllSuccess?(params: ProxyAjaxQueryAllParams<D> & ProxyAjaxResponseParams): void
      queryAllError?(params: ProxyAjaxQueryAllParams<D> & ProxyAjaxResponseParams): void
      delete?(params: ProxyAjaxDeleteParams<D>, ...args: any[]): Promise<any>
      deleteSuccess?(params: ProxyAjaxDeleteParams<D> & ProxyAjaxResponseParams): void
      deleteError?(params: ProxyAjaxDeleteParams<D> & ProxyAjaxResponseParams): void
      save?(params: ProxyAjaxSaveParams<D>, ...args: any[]): Promise<any>
      saveSuccess?(params: ProxyAjaxSaveParams<D> & ProxyAjaxResponseParams): void
      saveError?(params: ProxyAjaxSaveParams<D> & ProxyAjaxResponseParams): void
    }
    [key: string]: any

    /**
     * 已废弃，请使用 proxy-config.response
     * @deprecated
     */
    props?: {
      /**
       * 已废弃，请使用 proxy-config.response.list
       * @deprecated
       */
      list?: string | null
      /**
       * 已废弃，请使用 proxy-config.response.result
       * @deprecated
       */
      result?: string
      /**
       * 已废弃，请使用 proxy-config.response.total
       * @deprecated
       */
      total?: string
      /**
       * 已废弃，请使用 proxy-config.response.message
       * @deprecated
       */
      message?: string
    }
  }
  export interface ProxyOpts<D = any> extends ProxyConfig<D> { }

  export interface ToolbarOpts extends ToolbarConfig { }
  export interface ToolbarConfig extends VxeToolbarProps {
    enabled?: boolean
    zoom?: boolean | {
      escRestore?: boolean
      iconIn?: string
      iconOut?: string
    }
    /**
     * 自定义插槽模板
     */
    slots?: {
      /**
       * 自定义左侧按钮列表
       */
      buttons?: string | ((params: VxeToolbarSlotTypes.DefaultSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      /**
       * 自定义左侧按钮列表前缀插槽模板
       */
      buttonPrefix?: string | ((params: VxeToolbarSlotTypes.DefaultSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      /**
       * 自定义左侧按钮列表后缀插槽模板
       */
      buttonSuffix?: string | ((params: VxeToolbarSlotTypes.DefaultSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      /**
       * 自定义右侧工具列表
       */
      tools?: string | ((params: VxeToolbarSlotTypes.DefaultSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      /**
       * 自定义右侧工具列表前缀插槽模板
       */
      toolPrefix?: string | ((params: VxeToolbarSlotTypes.DefaultSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
      /**
       * 自定义右侧工具列表后缀插槽模板
       */
      toolSuffix?: string | ((params: VxeToolbarSlotTypes.DefaultSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
    }
  }

  export interface FormConfig extends VxeFormProps {
    enabled?: boolean
    items?: VxeFormItemProps[]
  }
  export interface FormOpts extends FormConfig {
    inited?: boolean
  }

  export interface ZoomConfig {
    escRestore?: boolean
  }
  export interface ZoomOpts extends ZoomConfig { }
}

export interface VxeGridProps<D = any> extends VxeTableProps<D> {
  layouts?: VxeGridPropTypes.Layouts
  columns?: VxeGridPropTypes.Columns<D>
  pagerConfig?: VxeGridPropTypes.PagerConfig
  proxyConfig?: VxeGridPropTypes.ProxyConfig<D>
  toolbarConfig?: VxeGridPropTypes.ToolbarConfig
  formConfig?: VxeGridPropTypes.FormConfig
  zoomConfig?: VxeGridPropTypes.ZoomConfig
}

export interface GridPrivateComputed<D = any> {
  proxyOpts: VxeGridPropTypes.ProxyOpts
  pagerOpts: VxeGridPropTypes.PagerOpts
  formOpts: VxeGridPropTypes.FormOpts
  toolbarOpts: VxeGridPropTypes.ToolbarOpts
  zoomOpts:VxeGridPropTypes.ZoomOpts

  computeProxyOpts: VxeGridPropTypes.ProxyOpts
  computePagerOpts: VxeGridPropTypes.PagerOpts
  computeFormOpts: VxeGridPropTypes.FormOpts
  computeToolbarOpts: VxeGridPropTypes.ToolbarOpts
  computeZoomOpts:VxeGridPropTypes.ZoomOpts
}
export interface VxeGridPrivateComputed<D = any> extends GridPrivateComputed<D> { }

export interface GridReactData<D = any> {
  tableLoading: boolean
  proxyInited: boolean
  isZMax: boolean
  tableData: D[]
  filterData: VxeTableDefines.FilterCheckedParams<D>[]
  formData: any
  sortData: VxeTableDefines.SortCheckedParams<D>[]
  tZindex: number
  tablePage: {
    total: number
    pageSize: number
    currentPage: number
  }
}

export interface GridMethods<D = any> {
  dispatchEvent(type: ValueOf<VxeGridEmits>, params: Record<string, any>, evnt: Event | null): void
  /**
   * 获取根元素
   */
  getEl(): HTMLDivElement
  /**
   * 给数据代理提交指令
   * @param code 指令编码
   */
  commitProxy(code: string | VxeToolbarPropTypes.ButtonConfig, ...args: any[]): Promise<any>
  /**
   * 获取表单数据
   */
  getFormData(): any
  /**
   * 获取表单项列表
   */
  getFormItems(): VxeFormItemProps[]
  getFormItems(itemIndex?: number): VxeFormItemProps
  /**
   * 切换表格最大化/还原
   */
  zoom(): Promise<boolean>
  /**
   * 判断是否最大化显示
   */
  isMaximized(): boolean
  /**
   * 如果表格处于常规状态，则最大化表格
   */
  maximize(): Promise<any>
  /**
   * 如果表格处于最大化状态，则还原表格
   */
  revert(): Promise<any>
  /**
   * 获取数据代理信息
   */
  getProxyInfo(): {
    data: D[]
    filter: any
    form: any
    sort: VxeTableDefines.SortCheckedParams<D> | { [key: string]: any }
    sorts: VxeTableDefines.SortCheckedParams<D>[]
    pager: {
      total: number
      pageSize: number
      currentPage: number
    }
    pendingRecords: D[]
  } | null
  /**
   * 设置数据代理信息
   */
  // setProxyInfo(options: {
  //   /**
  //    * 修改表格数据
  //    */
  //   data?: any[]
  //   /**
  //    * 修改表单数据
  //    */
  //   form?: {
  //     [key: string]: any
  //   },
  //   /**
  //    * 修改分页数据
  //    */
  //   pager?: {
  //     pageSize?: number
  //     currentPage?: number
  //   }
  // }): Promise<any>
}
export interface VxeGridMethods<D = any> extends GridMethods<D>, Omit<TableMethods<D>, 'dispatchEvent'> { }

export interface GridPrivateMethods {
  callSlot<T = any>(slotFunc: ((params: T) => VxeComponentSlotType | VxeComponentSlotType[]) | string | null, params: T, h: CreateElement, vNodes?: VNode[]): VxeComponentSlotType[]
  extendTableMethods<T>(methodKeys: T[]): any
  triggerToolbarCommitEvent(params: VxeToolbarPropTypes.ButtonConfig | VxeToolbarPropTypes.ToolConfig, evnt: Event): Promise<any>
  triggerToolbarBtnEvent(button: VxeToolbarPropTypes.ButtonConfig, evnt: Event): void
  triggerToolbarTolEvent(button: VxeToolbarPropTypes.ToolConfig, evnt: Event): void
  triggerZoomEvent(evnt: Event): void
  getParentHeight(): number
  getExcludeHeight(): number
}
export interface VxeGridPrivateMethods extends GridPrivateMethods { }

export type VxeGridEmits = [
  ...VxeTableEmits,

  'page-change',
  'form-submit',
  'form-submit-invalid',
  'form-reset',
  'form-collapse',
  'form-toggle-collapse',
  'proxy-query',
  'proxy-delete',
  'proxy-save',
  'toolbar-button-click',
  'toolbar-tool-click',
  'zoom'
]

export namespace VxeGridDefines {
  export interface GridEventParams<D = any> extends VxeComponentEventParams {
    $grid: VxeGridConstructor<D>
  }

  export interface KeydownStartEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.KeydownStartEventParams<D> { }
  export interface KeydownEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.KeydownEventParams<D> { }
  export interface KeydownEndEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.KeydownEndEventParams<D> { }
  export interface PasteEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.PasteEventParams<D> { }
  export interface CopyEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.CopyEventParams<D> { }
  export interface CutEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.CutEventParams<D> { }
  export interface CurrentRowChangeParams<D = any> extends GridEventParams<D>, VxeTableDefines.CurrentRowChangeEventParams<D> { }
  export interface CurrentRowDisabledParams<D = any> extends GridEventParams<D>, VxeTableDefines.CurrentRowDisabledEventParams<D> { }
  export interface CurrentColumnChangeParams<D = any> extends GridEventParams<D>, VxeTableDefines.CurrentColumnChangeEventParams<D> { }
  export interface CurrentColumnDisabledParams<D = any> extends GridEventParams<D>, VxeTableDefines.CurrentColumnDisabledEventParams<D> { }
  export interface RadioChangeEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.RadioChangeEventParams<D> { }
  export interface CheckboxChangeEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.CheckboxChangeEventParams<D> { }
  export interface CheckboxAllEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.CheckboxAllEventParams<D> { }
  export interface CheckboxRangeStartEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.CheckboxRangeStartEventParams<D> { }
  export interface CheckboxRangeChangeEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.CheckboxRangeChangeEventParams<D> { }
  export interface CheckboxRangeEndEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.CheckboxRangeEndEventParams<D> { }
  export interface CellClickEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.CellClickEventParams<D> { }
  export interface CellDblclickEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.CellDblclickEventParams<D> { }
  export interface CellMenuEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.CellMenuEventParams<D> { }
  export interface CellMouseenterEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.CellMouseenterEventParams<D> { }
  export interface CellMouseleaveEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.CellMouseleaveEventParams<D> { }
  export interface HeaderCellClickEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.HeaderCellClickEventParams<D> { }
  export interface HeaderCellDblclickEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.HeaderCellDblclickEventParams<D> { }
  export interface HeaderCellMenuEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.HeaderCellMenuEventParams<D> { }
  export interface FooterCellClickEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.FooterCellClickEventParams<D> { }
  export interface FooterCellDblclickEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.FooterCellDblclickEventParams<D> { }
  export interface FooterCellMenuEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.FooterCellMenuEventParams<D> { }
  export interface SortChangeEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.SortChangeEventParams<D> { }
  export interface FilterChangeEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.FilterChangeEventParams<D> { }
  export interface FilterVisibleEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.FilterVisibleEventParams<D> { }
  export interface ResizableChangeEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.ResizableChangeEventParams<D> { }
  export interface ToggleRowGroupExpandEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.ToggleRowGroupExpandEventParams<D> { }
  export interface ToggleRowExpandEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.ToggleRowExpandEventParams<D> { }
  export interface ToggleTreeExpandEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.ToggleTreeExpandEventParams<D> { }
  export interface MenuClickEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.MenuClickEventParams<D> { }
  export interface EditClosedEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.EditClosedEventParams<D> { }
  export interface EditActivatedEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.EditActivatedEventParams<D> { }
  export interface EditDisabledEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.EditDisabledEventParams<D> { }
  export interface ValidErrorEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.ValidErrorEventParams<D> { }
  export interface ScrollEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.ScrollEventParams<D> { }
  export interface ScrollBoundaryEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.ScrollBoundaryEventParams<D> { }
  export interface CustomEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.CustomEventParams<D> { }
  export interface RowDragstartEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.RowDragstartEventParams<D> { }
  export interface RowDragoverEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.RowDragoverEventParams<D> { }
  export interface RowDragendEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.RowDragendEventParams<D> { }
  export interface ColumnDragstartEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.ColumnDragstartEventParams<D> { }
  export interface ColumnDragoverEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.ColumnDragoverEventParams<D> { }
  export interface ColumnDragendEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.ColumnDragendEventParams<D> { }
  export interface EnterAppendRowEventParams<D = any> extends GridEventParams<D>, VxeTableDefines.EnterAppendRowEventParams<D> { }

  export interface ProxyQueryEventParams<D = any> extends GridEventParams<D> {
    status: boolean
    isReload: boolean
    isInited: boolean
  }
  export interface ProxyDeleteEventParams<D = any> extends GridEventParams<D> {
    status: boolean
  }
  export interface ProxySaveEventParams<D = any> extends GridEventParams<D> {
    status: boolean
  }
  export interface PageChangeEventParams<D = any> extends GridEventParams<D>, VxePagerDefines.PageChangeEventParams { }
  export interface FormSubmitEventParams<D = any> extends GridEventParams<D>, VxeFormDefines.SubmitEventParams { }
  export interface FormSubmitInvalidEventParams<D = any> extends GridEventParams<D>, VxeFormDefines.SubmitInvalidParams { }
  export interface FormResetEventParams<D = any> extends GridEventParams<D>, VxeFormDefines.ResetEventParams { }
  export interface FormCollapseEventParams<D = any> extends GridEventParams<D>, VxeFormDefines.CollapseEventParams { }

  export interface ToolbarButtonClickParams {
    code: string
    button: VxeToolbarPropTypes.ButtonConfig
  }
  export interface ToolbarButtonClickEventParams<D = any> extends GridEventParams<D>, ToolbarButtonClickParams { }

  export interface ToolbarToolClickParams {
    code: string
    tool: VxeToolbarPropTypes.ToolConfig
  }
  export interface ToolbarToolClickEventParams<D = any> extends GridEventParams<D>, ToolbarToolClickParams { }

  export interface ZoomParams {
    type: 'max' | 'revert'
  }
  export interface ZoomEventParams<D = any> extends GridEventParams<D>, ZoomParams { }
}

export interface VxeGridEventProps<D = any> {
  onKeydownStart?: VxeGridEvents.KeydownStart<D>
  onKeydown?: VxeGridEvents.Keydown<D>
  onKeydownEnd?: VxeGridEvents.KeydownEnd<D>
  onPaste?: VxeGridEvents.Paste<D>
  onCopy?: VxeGridEvents.Copy<D>
  onCut?: VxeGridEvents.Cut<D>
  onCurrentRowChange?: VxeGridEvents.CurrentRowChange<D>
  onCurrentRowDisabled?: VxeGridEvents.CurrentRowDisabled<D>
  onCurrentColumnChange?: VxeGridEvents.CurrentColumnChange<D>
  onCurrentColumnDisabled?: VxeGridEvents.CurrentColumnDisabled<D>
  onRadioChange?: VxeGridEvents.RadioChange<D>
  onCheckboxChange?: VxeGridEvents.CheckboxChange<D>
  onCheckboxAll?: VxeGridEvents.CheckboxAll<D>
  onCheckboxRangeStart?: VxeGridEvents.CheckboxRangeStart<D>
  onCheckboxRangeChange?: VxeGridEvents.CheckboxRangeChange<D>
  onCheckboxRangeEnd?: VxeGridEvents.CheckboxRangeEnd<D>
  onCellClick?: VxeGridEvents.CellClick<D>
  onCellDblclick?: VxeGridEvents.CellDblclick<D>
  onCellMenu?: VxeGridEvents.CellMenu<D>
  onCellMouseenter?: VxeGridEvents.CellMouseenter<D>
  onCellMouseleave?: VxeGridEvents.CellMouseleave<D>
  onHeaderCellClick?: VxeGridEvents.HeaderCellClick<D>
  onHeaderCellDblclick?: VxeGridEvents.HeaderCellDblclick<D>
  onHeaderCellMenu?: VxeGridEvents.HeaderCellMenu<D>
  onFooterCellClick?: VxeGridEvents.FooterCellClick<D>
  onFooterCellDblclick?: VxeGridEvents.FooterCellDblclick<D>
  onFooterCellMenu?: VxeGridEvents.FooterCellMenu<D>
  onSortChange?: VxeGridEvents.SortChange<D>
  onFilterChange?: VxeGridEvents.FilterChange<D>
  onFilterVisible?: VxeGridEvents.FilterVisible<D>
  onResizableChange?: VxeGridEvents.ResizableChange<D>
  onToggleRowGroupExpand?: VxeGridEvents.ToggleRowGroupExpand<D>
  onToggleRowExpand?: VxeGridEvents.ToggleRowExpand<D>
  onToggleTreeExpand?: VxeGridEvents.ToggleTreeExpand<D>
  onMenuClick?: VxeGridEvents.MenuClick<D>
  onEditClosed?: VxeGridEvents.EditClosed<D>
  onEditActivated?: VxeGridEvents.EditActivated<D>
  onEditDisabled?: VxeGridEvents.EditDisabled<D>
  onValidError?: VxeGridEvents.ValidError<D>
  onScroll?: VxeGridEvents.Scroll<D>
  onScrollBoundary?: VxeGridEvents.ScrollBoundary<D>
  onCustom?: VxeGridEvents.Custom<D>
  onRowDragstart?: VxeGridEvents.RowDragstart<D>
  onRowDragover?: VxeGridEvents.RowDragover<D>
  onRowDragend?: VxeGridEvents.RowDragend<D>
  onColumnDragstart?: VxeGridEvents.ColumnDragstart<D>
  onColumnDragover?: VxeGridEvents.ColumnDragover<D>
  onColumnDragend?: VxeGridEvents.ColumnDragend<D>
  onEnterAppendRow?: VxeGridEvents.EnterAppendRow<D>

  // grid
  onProxyQuery?: VxeGridEvents.ProxyQuery<D>
  onProxyDelete?: VxeGridEvents.ProxyDelete<D>
  onProxySave?: VxeGridEvents.ProxySave<D>
  onPageChange?: VxeGridEvents.PageChange<D>
  onFormSubmit?: VxeGridEvents.FormSubmit<D>
  onFormSubmitInvalid?: VxeGridEvents.FormSubmitInvalid<D>
  onFormReset?: VxeGridEvents.FormReset<D>
  onFormCollapse?: VxeGridEvents.FormCollapse<D>
  onToolbarButtonClick?: VxeGridEvents.ToolbarButtonClick<D>
  onToolbarToolClick?: VxeGridEvents.ToolbarToolClick<D>
  onZoom?: VxeGridEvents.Zoom<D>

  /**
   * 已废弃，请使用 onEditActivated
   * @deprecated
   */
  onEditActived?: VxeGridEvents.EditActivated<D>
}

export interface VxeGridListeners<D = any> {
  keydownStart?: VxeGridEvents.KeydownStart<D>
  keydown?: VxeGridEvents.Keydown<D>
  keydownEnd?: VxeGridEvents.KeydownEnd<D>
  paste?: VxeGridEvents.Paste<D>
  copy?: VxeGridEvents.Copy<D>
  cut?: VxeGridEvents.Cut<D>
  currentRowChange?: VxeGridEvents.CurrentRowChange<D>
  currentRowDisabled?: VxeGridEvents.CurrentRowDisabled<D>
  currentColumnChange?: VxeGridEvents.CurrentColumnChange<D>
  currentColumnDisabled?: VxeGridEvents.CurrentColumnDisabled<D>
  radioChange?: VxeGridEvents.RadioChange<D>
  checkboxChange?: VxeGridEvents.CheckboxChange<D>
  checkboxAll?: VxeGridEvents.CheckboxAll<D>
  checkboxRangeStart?: VxeGridEvents.CheckboxRangeStart<D>
  checkboxRangeChange?: VxeGridEvents.CheckboxRangeChange<D>
  checkboxRangeEnd?: VxeGridEvents.CheckboxRangeEnd<D>
  cellClick?: VxeGridEvents.CellClick<D>
  cellDblclick?: VxeGridEvents.CellDblclick<D>
  cellMenu?: VxeGridEvents.CellMenu<D>
  cellMouseenter?: VxeGridEvents.CellMouseenter<D>
  cellMouseleave?: VxeGridEvents.CellMouseleave<D>
  headerCellClick?: VxeGridEvents.HeaderCellClick<D>
  headerCellDblclick?: VxeGridEvents.HeaderCellDblclick<D>
  headerCellMenu?: VxeGridEvents.HeaderCellMenu<D>
  footerCellClick?: VxeGridEvents.FooterCellClick<D>
  footerCellDblclick?: VxeGridEvents.FooterCellDblclick<D>
  footerCellMenu?: VxeGridEvents.FooterCellMenu<D>
  sortChange?: VxeGridEvents.SortChange<D>
  filterChange?: VxeGridEvents.FilterChange<D>
  filterVisible?: VxeGridEvents.FilterVisible<D>
  resizableChange?: VxeGridEvents.ResizableChange<D>
  toggleRowGroupExpand?: VxeGridEvents.ToggleRowGroupExpand<D>
  toggleRowExpand?: VxeGridEvents.ToggleRowExpand<D>
  toggleTreeExpand?: VxeGridEvents.ToggleTreeExpand<D>
  menuClick?: VxeGridEvents.MenuClick<D>
  editClosed?: VxeGridEvents.EditClosed<D>
  editActivated?: VxeGridEvents.EditActivated<D>
  editDisabled?: VxeGridEvents.EditDisabled<D>
  validError?: VxeGridEvents.ValidError<D>
  scroll?: VxeGridEvents.Scroll<D>
  scrollBoundary?: VxeGridEvents.ScrollBoundary<D>
  custom?: VxeGridEvents.Custom<D>
  rowDragstart?: VxeGridEvents.RowDragstart<D>
  rowDragover?: VxeGridEvents.RowDragover<D>
  rowDragend?: VxeGridEvents.RowDragend<D>
  columnDragstart?: VxeGridEvents.ColumnDragstart<D>
  columnDragover?: VxeGridEvents.ColumnDragover<D>
  columnDragend?: VxeGridEvents.ColumnDragend<D>
  enterAppendRow?: VxeGridEvents.EnterAppendRow<D>

  // grid
  proxyQuery?: VxeGridEvents.ProxyQuery<D>
  proxyDelete?: VxeGridEvents.ProxyDelete<D>
  proxySave?: VxeGridEvents.ProxySave<D>
  pageChange?: VxeGridEvents.PageChange<D>
  formSubmit?: VxeGridEvents.FormSubmit<D>
  formSubmitInvalid?: VxeGridEvents.FormSubmitInvalid<D>
  formReset?: VxeGridEvents.FormReset<D>
  formCollapse?: VxeGridEvents.FormCollapse<D>
  toolbarButtonClick?: VxeGridEvents.ToolbarButtonClick<D>
  toolbarToolClick?: VxeGridEvents.ToolbarToolClick<D>
  zoom?: VxeGridEvents.Zoom<D>

  /**
   * 已废弃，请使用 editActivated
   * @deprecated
   */
  editActived?: VxeGridEvents.EditActivated<D>
}

export namespace VxeGridEvents {
  export type KeydownStart<D = any> = (params: VxeGridDefines.KeydownStartEventParams<D>) => void
  export type Keydown<D = any> = (params: VxeGridDefines.KeydownEventParams<D>) => void
  export type KeydownEnd<D = any> = (params: VxeGridDefines.KeydownEndEventParams<D>) => void
  export type Paste<D = any> = (params: VxeGridDefines.PasteEventParams<D>) => void
  export type Copy<D = any> = (params: VxeGridDefines.CopyEventParams<D>) => void
  export type Cut<D = any> = (params: VxeGridDefines.CutEventParams<D>) => void
  export type CurrentRowChange<D = any> = (params: VxeGridDefines.CurrentRowChangeParams<D>) => void
  export type CurrentRowDisabled<D = any> = (params: VxeGridDefines.CurrentRowDisabledParams<D>) => void
  export type CurrentColumnChange<D = any> = (params: VxeGridDefines.CurrentColumnChangeParams<D>) => void
  export type CurrentColumnDisabled<D = any> = (params: VxeGridDefines.CurrentColumnDisabledParams<D>) => void
  export type RadioChange<D = any> = (params: VxeGridDefines.RadioChangeEventParams<D>) => void
  export type CheckboxChange<D = any> = (params: VxeGridDefines.CheckboxChangeEventParams<D>) => void
  export type CheckboxAll<D = any> = (params: VxeGridDefines.CheckboxAllEventParams<D>) => void
  export type CheckboxRangeStart<D = any> = (params: VxeGridDefines.CheckboxRangeStartEventParams<D>) => void
  export type CheckboxRangeChange<D = any> = (params: VxeGridDefines.CheckboxRangeChangeEventParams<D>) => void
  export type CheckboxRangeEnd<D = any> = (params: VxeGridDefines.CheckboxRangeEndEventParams<D>) => void
  export type CellClick<D = any> = (params: VxeGridDefines.CellClickEventParams<D>) => void
  export type CellDblclick<D = any> = (params: VxeGridDefines.CellDblclickEventParams<D>) => void
  export type CellMenu<D = any> = (params: VxeGridDefines.CellMenuEventParams<D>) => void
  export type CellMouseenter<D = any> = (params: VxeGridDefines.CellMouseenterEventParams<D>) => void
  export type CellMouseleave<D = any> = (params: VxeGridDefines.CellMouseleaveEventParams<D>) => void
  export type HeaderCellClick<D = any> = (params: VxeGridDefines.HeaderCellClickEventParams<D>) => void
  export type HeaderCellDblclick<D = any> = (params: VxeGridDefines.HeaderCellDblclickEventParams<D>) => void
  export type HeaderCellMenu<D = any> = (params: VxeGridDefines.HeaderCellMenuEventParams<D>) => void
  export type FooterCellClick<D = any> = (params: VxeGridDefines.FooterCellClickEventParams<D>) => void
  export type FooterCellDblclick<D = any> = (params: VxeGridDefines.FooterCellDblclickEventParams<D>) => void
  export type FooterCellMenu<D = any> = (params: VxeGridDefines.FooterCellMenuEventParams<D>) => void
  export type SortChange<D = any> = (params: VxeGridDefines.SortChangeEventParams<D>) => void
  export type FilterChange<D = any> = (params: VxeGridDefines.FilterChangeEventParams<D>) => void
  export type FilterVisible<D = any> = (params: VxeGridDefines.FilterVisibleEventParams<D>) => void
  export type ResizableChange<D = any> = (params: VxeGridDefines.ResizableChangeEventParams<D>) => void
  export type ToggleRowGroupExpand<D = any> = (params: VxeGridDefines.ToggleRowGroupExpandEventParams<D>) => void
  export type ToggleRowExpand<D = any> = (params: VxeGridDefines.ToggleRowExpandEventParams<D>) => void
  export type ToggleTreeExpand<D = any> = (params: VxeGridDefines.ToggleTreeExpandEventParams<D>) => void
  export type MenuClick<D = any> = (params: VxeGridDefines.MenuClickEventParams<D>) => void
  export type EditClosed<D = any> = (params: VxeGridDefines.EditClosedEventParams<D>) => void
  export type EditActivated<D = any> = (params: VxeGridDefines.EditActivatedEventParams<D>) => void
  export type EditDisabled<D = any> = (params: VxeGridDefines.EditDisabledEventParams<D>) => void
  export type ValidError<D = any> = (params: VxeGridDefines.ValidErrorEventParams<D>) => void
  export type Scroll<D = any> = (params: VxeGridDefines.ScrollEventParams<D>) => void
  export type ScrollBoundary<D = any> = (params: VxeGridDefines.ScrollBoundaryEventParams<D>) => void
  export type Custom<D = any> = (params: VxeGridDefines.CustomEventParams<D>) => void
  export type RowDragstart<D = any> = (params: VxeGridDefines.RowDragstartEventParams<D>) => void
  export type RowDragover<D = any> = (params: VxeGridDefines.RowDragoverEventParams<D>) => void
  export type RowDragend<D = any> = (params: VxeGridDefines.RowDragendEventParams<D>) => void
  export type ColumnDragstart<D = any> = (params: VxeGridDefines.ColumnDragstartEventParams<D>) => void
  export type ColumnDragover<D = any> = (params: VxeGridDefines.ColumnDragoverEventParams<D>) => void
  export type ColumnDragend<D = any> = (params: VxeGridDefines.ColumnDragendEventParams<D>) => void
  export type EnterAppendRow<D = any> = (params: VxeGridDefines.EnterAppendRowEventParams<D>) => void

  export type ProxyQuery<D = any> = (params: VxeGridDefines.ProxyQueryEventParams<D>) => void
  export type ProxyDelete<D = any> = (params: VxeGridDefines.ProxyDeleteEventParams<D>) => void
  export type ProxySave<D = any> = (params: VxeGridDefines.ProxySaveEventParams<D>) => void
  export type PageChange<D = any> = (params: VxeGridDefines.PageChangeEventParams<D>) => void
  export type FormSubmit<D = any> = (params: VxeGridDefines.FormSubmitEventParams<D>) => void
  export type FormSubmitInvalid<D = any> = (params: VxeGridDefines.FormSubmitInvalidEventParams<D>) => void
  export type FormReset<D = any> = (params: VxeGridDefines.FormResetEventParams<D>) => void
  export type FormCollapse<D = any> = (params: VxeGridDefines.FormCollapseEventParams<D>) => void
  export type ToolbarButtonClick<D = any> = (params: VxeGridDefines.ToolbarButtonClickEventParams<D>) => void
  export type ToolbarToolClick<D = any> = (params: VxeGridDefines.ToolbarToolClickEventParams<D>) => void
  export type Zoom<D = any> = (params: VxeGridDefines.ZoomEventParams<D>) => void

  /**
   * 已废弃，请使用 EditActivated
   * @deprecated
   */
  export type EditActived<D = any> = (params: VxeGridDefines.EditActivatedEventParams<D>) => void
}

export namespace VxeGridSlotTypes {
  export interface DefaultSlotParams<D = any> {
    $table: VxeTableConstructor<D>
    $grid: VxeGridConstructor<D> | null | undefined
    rowid: string
    /**
     * 当前行对象，支持数据双向绑定
     */
    row: D
    /**
     * 相对于 data 中的索引，等同于 getRowIndex(row)
     */
    rowIndex: number
    /**
     * 相对于可视区渲染中的行索引，等同于 getVMRowIndex(row)
     */
    $rowIndex: number
    /**
     * 相对于当前表格数据的索引，等同于 getVTRowIndex(row)
     */
    _rowIndex: number
    /**
     * 当前列对象
     */
    column: VxeTableDefines.ColumnInfo<D>
    /**
     * 相对于 columns 中的索引，等同于 getTColumnIndex(column)
     */
    columnIndex: number
    /**
     * 相对于可视区渲染中的列索引，等同于 getVMColumnIndex(column)
     */
    $columnIndex: number
    /**
     * 相对于当前表格列的索引，等同于 getVTColumnIndex(column)
     */
    _columnIndex: number

    type: string
    fixed: VxeColumnPropTypes.Fixed
    checked?: boolean
    indeterminate?: boolean
    seq: string | number
    level: number
    isEdit: boolean
    isHidden: boolean

    // 混用多组件不具名插槽
    field: string
    item: any
    data: any

    /**
     * @deprecated
     * @private
     */
    visibleData: D[]
    /**
      * 已废弃
      * @deprecated
      */
    items: any[]

    [key: string]: any
  }

  export interface BaseSlotParams<D = any> {
    $table: VxeTableConstructor<D>
    $grid: VxeGridConstructor<D> | null | undefined
  }
  export interface EmptySlotParams<D = any> extends BaseSlotParams<D> {}
  export interface LoadingSlotParams<D = any> extends BaseSlotParams<D> {}
  export interface FormSlotParams<D = any> extends BaseSlotParams<D> {}
  export interface ToolbarSlotParams<D = any> extends BaseSlotParams<D> {}
  export interface TopSlotParams<D = any> extends BaseSlotParams<D> {}
  export interface BottomSlotParams<D = any> extends BaseSlotParams<D> {}
  export interface LeftSlotParams<D = any> extends BaseSlotParams<D> {}
  export interface RightSlotParams<D = any> extends BaseSlotParams<D> {}
  export interface AsideLeftSlotParams<D = any> extends BaseSlotParams<D> {}
  export interface AsideRightSlotParams<D = any> extends BaseSlotParams<D> {}
  export interface PagerSlotParams<D = any> extends BaseSlotParams<D> {}
  export interface RowDragIconSlotParams<D = any> extends VxeTableSlotTypes.RowDragIconSlotParams<D> {}
  export interface ColumnDragIconSlotParams<D = any> extends VxeTableSlotTypes.ColumnDragIconSlotParams<D> {}
}

export interface VxeGridSlots<D = any> {
  [key: string]: ((params: VxeGridSlotTypes.DefaultSlotParams<D>) => any) | undefined

  /**
   * 自定义空数据时显示模板
   */
  empty?(params: VxeGridSlotTypes.EmptySlotParams<D>): any
  /**
   * 自定义加载中模板
   */
  loading?(params: VxeGridSlotTypes.LoadingSlotParams<D>): any
  /**
   * 自定义表单模板
   */
  form?(params: VxeGridSlotTypes.FormSlotParams<D>): any
  /**
   * 自定义工具栏模板
   */
  toolbar?(params: VxeGridSlotTypes.ToolbarSlotParams<D>): any
  /**
   * 自定义表格顶部模板
   */
  top?(params: VxeGridSlotTypes.TopSlotParams<D>): any
  /**
   * 自定义表格底部模板
   */
  bottom?(params: VxeGridSlotTypes.BottomSlotParams<D>): any
  /**
   * 自定义表格左边模板
   */
  left?(params: VxeGridSlotTypes.LeftSlotParams<D>): any
  /**
   * 自定义表格边侧模板
   */
  right?(params: VxeGridSlotTypes.RightSlotParams<D>): any
  /**
   * 自定义左侧模板
   */
  asideLeft?(params: VxeGridSlotTypes.AsideLeftSlotParams<D>): any
  'aside-left'?(params: VxeGridSlotTypes.AsideLeftSlotParams<D>): any
  /**
   * 自定义右侧模板
   */
  asideRight?(params: VxeGridSlotTypes.AsideRightSlotParams<D>): any
  'aside-right'?(params: VxeGridSlotTypes.AsideRightSlotParams<D>): any
  /**
   * 自定义分页模板
   */
  pager?(params: VxeGridSlotTypes.PagerSlotParams<D>): any

  /**
   * 只对 row-config.drag 开启后有效，自定义行拖拽按钮图标
   */
  rowDragIcon?(params: VxeGridSlotTypes.RowDragIconSlotParams<D>): any
  'row-drag-icon'?(params: VxeGridSlotTypes.RowDragIconSlotParams<D>): any

  /**
   * 只对 column-config.drag 开启后有效，自定义列拖拽按钮图标
   */
  columnDragIcon?(params: VxeGridSlotTypes.RowDragIconSlotParams<D> | VxeGridSlotTypes.ColumnDragIconSlotParams<D>): any
  'column-drag-icon'?(params: VxeGridSlotTypes.RowDragIconSlotParams<D> | VxeGridSlotTypes.ColumnDragIconSlotParams<D>): any
}

export const Grid: typeof VxeGrid
export default VxeGrid
