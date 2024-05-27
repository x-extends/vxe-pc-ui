import { VxeComponentStyleType, VxeComponentClassNameType, VxeComponentSlotType } from '@vxe-ui/core'
import { VxeTableConstructor, VxeTablePropTypes, VxeTableDefines, VxeTablePrivateMethods } from '../components/table'
import { VxeFormItemPropTypes, FormItemTitleRenderParams, FormItemContentRenderParams, FormItemVisibleParams, FormItemResetParams } from '../components/form-item'
import { VxeGridConstructor } from '../components/grid'
import { VxeColumnPropTypes } from '../components/column'
import { VxeToolbarPropTypes } from '../components/toolbar'
import { VxeFormDefines, VxeFormProps } from '../components/form'
import { VxeFormDesignDefines, VxeFormDesignConstructor } from '../components/form-design'
import { VxeFormViewDefines } from '../components/form-view'

/* eslint-disable no-use-before-define */

// 表格
declare module '@vxe-ui/core' {
  export interface VxeGlobalRendererOptions {
    // 筛选渲染
    filterClassName?: string | ((params: VxeGlobalRendererHandles.RenderFilterParams<any>) => string | VxeComponentClassNameType)
    showFilterFooter?: boolean
    renderFilter?(renderOpts: VxeGlobalRendererHandles.RenderFilterOptions, params: VxeGlobalRendererHandles.RenderFilterParams<any>): VxeComponentSlotType | VxeComponentSlotType[]
    filterMethod?(params: VxeGlobalRendererHandles.FilterMethodParams<any>): boolean
    filterRemoteMethod?(params: VxeGlobalRendererHandles.FilterRemoteMethod<any>): boolean
    filterResetMethod?(params: VxeGlobalRendererHandles.FilterResetMethodParams<any>): void
    filterRecoverMethod?(params: VxeGlobalRendererHandles.FilterRecoverMethodParams<any>): void
    // 默认行为
    defaultFilterMethod?(params: VxeGlobalRendererHandles.FilterMethodParams<any>): boolean

    // 单元格渲染
    cellClassName?: string | ((params: VxeGlobalRendererHandles.RenderDefaultParams<any>) => string | VxeComponentClassNameType)
    cellStyle?: VxeComponentStyleType | ((params: VxeGlobalRendererHandles.RenderDefaultParams<any>) => VxeComponentStyleType)
    renderHeader?(renderOpts: VxeGlobalRendererHandles.RenderHeaderOptions, params: VxeGlobalRendererHandles.RenderHeaderParams<any>): VxeComponentSlotType | VxeComponentSlotType[]
    renderDefault?(renderOpts: VxeGlobalRendererHandles.RenderDefaultOptions, params: VxeGlobalRendererHandles.RenderDefaultParams<any>): VxeComponentSlotType | VxeComponentSlotType[]
    renderFooter?(renderOpts: VxeGlobalRendererHandles.RenderFooterOptions, params: VxeGlobalRendererHandles.RenderFooterParams<any>): VxeComponentSlotType | VxeComponentSlotType[]
    exportMethod?(params: VxeGlobalRendererHandles.ExportMethodParams<any>): string
    footerExportMethod?(params: VxeGlobalRendererHandles.FooterExportMethodParams<any>): string

    // 编辑渲染
    autofocus?: string | ((params: VxeGlobalRendererHandles.RenderEditParams<any> | VxeGlobalRendererHandles.RenderCellParams<any>) => HTMLElement | null)
    autoselect?: boolean
    renderEdit?(renderOpts: VxeGlobalRendererHandles.RenderEditOptions<any>, params: VxeGlobalRendererHandles.RenderEditParams<any>): VxeComponentSlotType | VxeComponentSlotType[]
    renderCell?(renderOpts: VxeGlobalRendererHandles.RenderCellOptions<any>, params: VxeGlobalRendererHandles.RenderCellParams<any>): VxeComponentSlotType | VxeComponentSlotType[]

    // 内容渲染
    renderExpand?(renderOpts: VxeGlobalRendererHandles.RenderExpandOptions, params: VxeGlobalRendererHandles.RenderExpandParams<any>): VxeComponentSlotType | VxeComponentSlotType[]

    // 空内容渲染
    renderTableEmptyView?(renderOpts: VxeGlobalRendererHandles.RenderTableEmptyViewOptions, params: VxeGlobalRendererHandles.RenderEmptyParams): VxeComponentSlotType | VxeComponentSlotType[]

    /**
     * @deprecated 已废弃
     */
    className?: string
    /**
     * 已废弃，请使用 renderTableEmptyView
     * @deprecated
     */
    renderEmpty?(renderOpts: VxeGlobalRendererHandles.RenderTableEmptyViewOptions, params: VxeGlobalRendererHandles.RenderEmptyParams): VxeComponentSlotType | VxeComponentSlotType[]
  }

  export namespace VxeGlobalRendererHandles {
    export interface RenderFilterOptions extends VxeColumnPropTypes.FilterRender {}

    export interface RenderParams {}

    export type RenderFilterParams<D = any> = {
      $table: VxeTableConstructor<D> & VxeTablePrivateMethods<D>
      $panel: any
      column: {
        filters: VxeTableDefines.FilterOption[]
      } & VxeTableDefines.ColumnInfo<D>
      columnIndex: number
      $columnIndex: number
      $rowIndex: number
    }

    export type FilterMethodParams<D = any> = {
      $table: VxeTableConstructor<D> & VxeTablePrivateMethods<D>
      value: any
      option: VxeTableDefines.FilterOption
      cellValue: any
      row: any
      column: VxeTableDefines.ColumnInfo<D>
    }

    export interface FilterRemoteMethod<D = any> extends VxeTableDefines.FilterChangeParams<D> {
      $table: VxeTableConstructor<D> & VxeTablePrivateMethods<D>
    }

    export interface FilterResetMethodParams<D = any> {
      $table: VxeTableConstructor<D> & VxeTablePrivateMethods<D>
      options: VxeTableDefines.FilterOption[]
      column: VxeTableDefines.ColumnInfo<D>
    }

    export interface FilterRecoverMethodParams<D = any> {
      $table: VxeTableConstructor<D> & VxeTablePrivateMethods<D>
      option: VxeTableDefines.FilterOption
      column: VxeTableDefines.ColumnInfo<D>
    }

    export interface RenderHeaderOptions extends VxeGlobalRendererHandles.RenderOptions { }

    export interface RenderHeaderParams<D = any> {
      $table: VxeTableConstructor<D> & VxeTablePrivateMethods<D>
      column: VxeTableDefines.ColumnInfo<D>
      columnIndex: number
      $columnIndex: number
      $rowIndex: number
    }

    export type RenderDefaultOptions<D = any> = VxeColumnPropTypes.EditRender<D>
    export type RenderDefaultParams<D = any> = RenderEditParams<D>

    export interface RenderFooterOptions extends VxeGlobalRendererHandles.RenderOptions { }

    export interface RenderFooterParams<D = any> {
      $table: VxeTableConstructor<D> & VxeTablePrivateMethods<D>
      column: VxeTableDefines.ColumnInfo<D>
      columnIndex: number
      _columnIndex: number
      $columnIndex: number
      $rowIndex: number
      items: any[]
      data: D[][]
    }

    export interface ExportMethodParams<D = any> {
      row: D
      column: VxeTableDefines.ColumnInfo<D>
      options: VxeTablePropTypes.ExportHandleOptions
    }

    export interface FooterExportMethodParams<D = any> {
      items: any[]
      _columnIndex: number
      column: VxeTableDefines.ColumnInfo<D>
      options: VxeTablePropTypes.ExportHandleOptions
    }

    export type RenderEditOptions<D = any> = VxeColumnPropTypes.EditRender<D>

    export interface RenderEditParams<D = any> {
      $table: VxeTableConstructor<D> & VxeTablePrivateMethods<D>
      $grid: VxeGridConstructor<D> | null
      column: VxeTableDefines.ColumnInfo<D>
      columnIndex: number
      $columnIndex: number
      rowid: string
      row: D
      rowIndex: number
      $rowIndex: number
      isHidden: boolean
      fixed: VxeColumnPropTypes.Fixed
      type: string
    }

    export type RenderCellOptions<D = any> = VxeColumnPropTypes.EditRender<D>
    export type RenderCellParams<D = any> = {
      $table: VxeTableConstructor<D> & VxeTablePrivateMethods<D>
      $grid: VxeGridConstructor<D> | null
      column: VxeTableDefines.ColumnInfo<D>
      columnIndex: number
      $columnIndex: number
      rowid: string
      row: D
      rowIndex: number
      $rowIndex: number
      isHidden: boolean
      fixed: VxeColumnPropTypes.Fixed
      type: string
    }

    export interface RenderExpandOptions extends VxeColumnPropTypes.ContentRender { }
    export type RenderExpandParams<D = any> = RenderEditParams<D>

    export type RenderTableEmptyViewOptions = VxeTablePropTypes.EmptyRender

    export interface RenderEmptyParams<D = any> {
      $table: VxeTableConstructor<D> & VxeTablePrivateMethods<D>
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
  }
}

// 工具栏
declare module '@vxe-ui/core' {
  export interface VxeGlobalRendererOptions {
    // 工具栏-按钮渲染
    toolbarButtonClassName?: string | ((params: VxeGlobalRendererHandles.RenderButtonParams<any>) => string | VxeComponentClassNameType)
    renderToolbarButton?(renderOpts: VxeGlobalRendererHandles.RenderButtonOptions, params: VxeGlobalRendererHandles.RenderButtonParams<any>): VxeComponentSlotType | VxeComponentSlotType[]
    toolbarToolClassName?: string | ((params: VxeGlobalRendererHandles.RenderToolParams<any>) => string | VxeComponentClassNameType)
    renderToolbarTool?(renderOpts: VxeGlobalRendererHandles.RenderToolOptions, params: VxeGlobalRendererHandles.RenderToolParams<any>): VxeComponentSlotType | VxeComponentSlotType[]
  }

  export namespace VxeGlobalRendererHandles {

    export interface RenderButtonOptions extends VxeToolbarPropTypes.ButtonRender { }
    export interface RenderButtonParams<D = any> {
      $grid: VxeGridConstructor | null
      $table: VxeTableConstructor<D> & VxeTablePrivateMethods<D>
      button: VxeToolbarPropTypes.ButtonConfig
    }

    export interface RenderToolOptions extends VxeToolbarPropTypes.ToolRender { }
    export interface RenderToolParams<D = any> {
      $grid: VxeGridConstructor | null
      $table: VxeTableConstructor<D> & VxeTablePrivateMethods<D>
      tool: VxeToolbarPropTypes.ToolConfig
    }
  }
}

// 表单
declare module '@vxe-ui/core' {
  export interface VxeGlobalRendererOptions {
    /**
     * 表单项 - 设置自动聚焦元素
     */
    formItemAutoFocus?: string
    itemClassName?: string | ((params: VxeGlobalRendererHandles.RenderItemTitleParams) => string | VxeComponentClassNameType)
    itemStyle?: VxeComponentStyleType | ((params: VxeGlobalRendererHandles.RenderItemTitleParams) => VxeComponentStyleType)
    itemContentClassName?: string | ((params: VxeGlobalRendererHandles.RenderItemTitleParams) => string | VxeComponentClassNameType)
    itemContentStyle?: VxeComponentStyleType | ((params: VxeGlobalRendererHandles.RenderItemTitleParams) => VxeComponentStyleType)
    itemTitleClassName?: string | ((params: VxeGlobalRendererHandles.RenderItemTitleParams) => string | VxeComponentClassNameType)
    itemTitleStyle?: VxeComponentStyleType | ((params: VxeGlobalRendererHandles.RenderItemTitleParams) => VxeComponentStyleType)
    renderItemTitle?(renderOpts: VxeGlobalRendererHandles.RenderItemTitleOptions, params: VxeGlobalRendererHandles.RenderItemTitleParams): VxeComponentSlotType | VxeComponentSlotType[]
    renderItemContent?(renderOpts: VxeGlobalRendererHandles.RenderItemContentOptions, params: VxeGlobalRendererHandles.RenderItemContentParams): VxeComponentSlotType | VxeComponentSlotType[]
    itemVisibleMethod?(params: VxeGlobalRendererHandles.ItemVisibleMethodParams): boolean
    itemResetMethod?(params: VxeGlobalRendererHandles.ItemResetMethodParams): void
  }

  export namespace VxeGlobalRendererHandles {
    export type RenderItemTitleOptions = VxeFormItemPropTypes.ItemRender
    export type RenderItemTitleParams = FormItemTitleRenderParams
    export type RenderItemContentOptions = VxeFormItemPropTypes.ItemRender
    export type RenderItemContentParams = FormItemContentRenderParams
    export type ItemVisibleMethodParams = FormItemVisibleParams
    export type ItemResetMethodParams = FormItemResetParams
  }
}

// 表单设计器
declare module '@vxe-ui/core' {
  export interface VxeGlobalRendererOptions {
    /**
     * 表单设计器 - 渲染左侧控件项
     */
    renderFormDesignWidgetItem?(renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetItemOptions, params: VxeGlobalRendererHandles.RenderFormDesignWidgetItemParams): VxeComponentSlotType | VxeComponentSlotType[]
    /**
     * 表单设计器 - 创建设计器-表单属性数据
     */
    createFormDesignSettingFormConfig?(params: VxeGlobalRendererHandles.CreateFormDesignSettingFormConfigParams): Record<string, any>
    /**
     * 表单设计器 - 渲染设计器-属性表单
     */
    renderFormDesignSettingFormView?(renderOpts: VxeGlobalRendererHandles.RenderFormDesignSettingFormViewOptions, params: VxeGlobalRendererHandles.RenderFormDesignSettingFormViewParams): VxeComponentSlotType | VxeComponentSlotType[]
    /**
     * 表单设计器 - 渲染设计器-电脑端表单
     */
    renderFormDesignStyleFormView?(renderOpts: VxeGlobalRendererHandles.RenderFormDesignStyleFormViewOptions, params: VxeGlobalRendererHandles.RenderFormDesignStyleFormViewParams): VxeComponentSlotType | VxeComponentSlotType[]
    /**
     * 表单设计器 - 渲染设计器-手机端表单
     */
    renderFormDesignMobileStyleFormView?(renderOpts: VxeGlobalRendererHandles.RenderFormDesignMobileStyleFormViewOptions, params: VxeGlobalRendererHandles.RenderFormDesignMobileStyleFormViewParams): VxeComponentSlotType | VxeComponentSlotType[]
    /**
     * 表单设计器 - 创建控件-定义控件信息和控件表单数据
     */
    createFormDesignWidgetConfig?(params: VxeGlobalRendererHandles.CreateFormDesignWidgetConfigParams): VxeGlobalRendererHandles.CreateFormDesignWidgetConfigObj
    /**
     * 表单设计器 - 渲染右侧-控件表单
     */
    renderFormDesignWidgetFormView?(renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewOptions, params: VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewParams): VxeComponentSlotType | VxeComponentSlotType[]
    /**
     * 表单设计器 - 控件渲染器（设计时）
     * 如果不设置，则使用 renderFormDesignWidgetView 渲染
     */
    renderFormDesignWidgetEdit?(renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetEditOptions, params: VxeGlobalRendererHandles.RenderFormDesignWidgetEditParams): VxeComponentSlotType | VxeComponentSlotType[]
    /**
     * 表单设计器 - 控件渲染器（预览时 - 电脑端）
     * 如果不设置，则使用 renderFormDesignWidgetView 渲染
     */
    renderFormDesignWidgetPreview?(renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetPreviewOptions, params: VxeGlobalRendererHandles.RenderFormDesignWidgetPreviewParams): VxeComponentSlotType | VxeComponentSlotType[]
    /**
     * 表单设计器 - 控件渲染器（预览时 - 手机端）
     * 如果不设置，则使用 renderFormDesignWidgetView 渲染
     */
    renderFormDesignWidgetMobilePreview?(renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetMobilePreviewOptions, params: VxeGlobalRendererHandles.RenderFormDesignWidgetMobilePreviewParams): VxeComponentSlotType | VxeComponentSlotType[]
    /**
     * 表单设计器 - 控件渲染器（运行时）
     */
    renderFormDesignWidgetView?(renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions, params: VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams): VxeComponentSlotType | VxeComponentSlotType[]
    /**
     * 表单设计器 - 创建控件校验规则
     */
    createFormDesignWidgetRules?(params: VxeGlobalRendererHandles.CreateFormDesignWidgetRulesParams): VxeFormDefines.FormRule[]

    /**
     * 表单视图 - 创建渲染电脑端表单
     */
    createFormViewFormConfig?(params: VxeGlobalRendererHandles.CreateFormViewFormConfigParams): VxeFormProps
    /**
     * 表单视图 - 创建渲染手机端端表单
     */
    createFormViewMobileFormConfig?(params: VxeGlobalRendererHandles.CreateFormViewMobileFormConfigParams): VxeFormProps
  }

  export namespace VxeGlobalRendererHandles {
    export interface FormDesignWidgetNameParams {
      name: string
    }
    export interface FormDesignWidgetCustomGroupParams {}
    export interface CreateFormDesignSettingFormConfigParams {}
    export interface CreateFormDesignWidgetConfigParams {
      name: string
      $formDesign: null | VxeFormDesignConstructor
    }
    export interface CreateFormDesignWidgetConfigObj<D = any> {
      title?: string | number | ((params: {
        name: string
        $formDesign: null | VxeFormDesignConstructor
      }) => string)
      group?: VxeFormDesignDefines.WidgetGroup
      customGroup?: string | number | ((params: {
        name: string
        $formDesign: null | VxeFormDesignConstructor
      }) => string)
      icon?: string
      options?: D
      children?: VxeFormDesignDefines.WidgetObjItem[]
    }

    export interface RenderFormDesignWidgetItemOptions {}
    export interface RenderFormDesignWidgetItemParams {}

    export interface RenderFormDesignWidgetPreviewOptions extends RenderFormDesignWidgetViewOptions {}
    export interface RenderFormDesignWidgetPreviewParams<D = any> extends RenderFormDesignWidgetViewParams<D> {}

    export interface RenderFormDesignWidgetMobilePreviewOptions extends RenderFormDesignWidgetPreviewOptions {}
    export interface RenderFormDesignWidgetMobilePreviewParams<D = any> extends RenderFormDesignWidgetPreviewParams<D> {}

    export interface RenderFormDesignWidgetViewOptions {
      name: string
    }
    export interface RenderFormDesignWidgetViewParams<D = any> {
      widget: VxeFormDesignDefines.WidgetObjItem<D>
      isEditMode: boolean
      isViewMode: boolean
    }
    export interface CreateFormDesignWidgetRulesParams<D = any> {
      widget: VxeFormDesignDefines.WidgetObjItem<D>
    }
    export interface RenderFormDesignWidgetEditOptions extends RenderFormDesignWidgetFormViewOptions {}
    export interface RenderFormDesignWidgetFormViewOptions {
      name: string
    }
    export interface RenderFormDesignWidgetFormViewParams<D = any> {
      widget: VxeFormDesignDefines.WidgetObjItem<D>
    }
    export interface RenderFormDesignWidgetEditParams<D = any> extends RenderFormDesignWidgetViewParams<D> {}
    export interface RenderFormDesignSettingFormViewOptions {}
    export interface RenderFormDesignSettingFormViewParams {}

    export interface RenderFormDesignStyleFormViewOptions {}
    export interface RenderFormDesignStyleFormViewParams<D = any> extends VxeFormDesignDefines.FormDesignDefaultParams {
      formConfig: D
    }

    export interface RenderFormDesignMobileStyleFormViewOptions {}
    export interface RenderFormDesignMobileStyleFormViewParams<D = any> extends RenderFormDesignStyleFormViewParams<D> {}

    export interface CreateFormViewFormConfigParams<D = any> extends VxeFormViewDefines.CreateFormConfigParams<D> {}
    export interface CreateFormViewMobileFormConfigParams<D = any> extends CreateFormViewFormConfigParams {}
  }
}
