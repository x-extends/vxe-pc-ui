import { VxeComponentStyleType, VxeComponentClassNameType } from '@vxe-ui/core'
import { VxeFormItemPropTypes, FormItemTitleRenderParams, FormItemContentRenderParams, FormItemVisibleParams, FormItemResetParams } from '../components/form-item'
import { VxeFormDefines, VxeFormProps } from '../components/form'
import { VxeFormDesignDefines } from '../components/form-design'

/* eslint-disable no-use-before-define */

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
    export type RenderItemContentOptions = any
    export type RenderItemContentParams = FormItemContentRenderParams
    export type ItemVisibleMethodParams = FormItemVisibleParams
    export type ItemResetMethodParams = FormItemResetParams
  }
}

// 表单设计器
declare module '@vxe-ui/core' {
  export interface VxeGlobalRendererOptions {
    /**
     * 表单设计器 - 左侧控件名称
     */
    formDesignWidgetName?: string | ((params: VxeGlobalRendererHandles.FormDesignWidgetNameParams) => string)
    /**
     * 表单设计器 - 左侧控件图标
     */
    formDesignWidgetIcon?: string
    /**
     * 表单设计器 - 左侧控件分组
     */
    formDesignWidgetGroup?: null | '' | 'base' | 'layout' | 'advanced'
    /**
     * 表单设计器 - 左侧自定义控件分组
     */
    formDesignWidgetCustomGroup?: string | ((params: VxeGlobalRendererHandles.FormDesignWidgetCustomGroupParams) => string)
    /**
     * 表单设计器 - 渲染左侧控件项
     */
    renderFormDesignWidgetItem?(renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetItemOptions, params: VxeGlobalRendererHandles.RenderFormDesignWidgetItemParams): VxeComponentSlotType | VxeComponentSlotType[]
    /**
     * 表单设计器 - 创建设计器表单数据
     */
    createFormDesignSettingFormConfig?(params: VxeGlobalRendererHandles.CreateFormDesignSettingFormConfigParams): Record<string, any>
    /**
     * 表单设计器 - 渲染设计器表单视图
     */
    renderFormDesignSettingView?(renderOpts: VxeGlobalRendererHandles.RenderFormDesignSettingViewOptions, params: VxeGlobalRendererHandles.RenderFormDesignSettingViewParams): VxeComponentSlotType | VxeComponentSlotType[]
    /**
     * 表单设计器 - 创建右侧控件字段表单数据
     */
    createFormDesignWidgetFormConfig?(params: VxeGlobalRendererHandles.CreateFormDesignWidgetFormConfigParams): VxeFormProps
    /**
     * 表单设计器 - 渲染右侧控件表单视图
     */
    renderFormDesignWidgetFormView?(renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewOptions, params: VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewParams): VxeComponentSlotType | VxeComponentSlotType[]
    /**
     * 表单设计器 - 控件渲染器（设计时）
     * 如果不设置，则使用 renderFormDesignWidgetView 渲染
     */
    renderFormDesignWidgetEdit?(renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetEditOptions, params: VxeGlobalRendererHandles.RenderFormDesignWidgetEditParams): VxeComponentSlotType | VxeComponentSlotType[]
    /**
     * 表单设计器 - 控件渲染器（运行时）
     */
    renderFormDesignWidgetView?(renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions, params: VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams): VxeComponentSlotType | VxeComponentSlotType[]
    /**
     * 表单设计器 - 创建控件校验规则
     */
    createFormDesignWidgetViewRules?(params: VxeGlobalRendererHandles.CreateFormDesignWidgetViewRulesParams): VxeFormDefines.FormRule[]
  }

  export namespace VxeGlobalRendererHandles {
    export interface FormDesignWidgetNameParams {
      name: string
    }
    export interface FormDesignWidgetCustomGroupParams {}
    export interface CreateFormDesignSettingFormConfigParams {}
    export interface CreateFormDesignWidgetFormConfigParams {
      name: string
    }
    export interface RenderFormDesignWidgetItemOptions {}
    export interface RenderFormDesignWidgetItemParams {}
    export interface RenderFormDesignWidgetViewOptions {
      name: string
    }
    export interface RenderFormDesignWidgetViewParams<D = any> {
      widget: VxeFormDesignDefines.WidgetObjItem<D>
      isEditMode: boolean
      isViewMode: boolean
    }
    export interface CreateFormDesignWidgetViewRulesParams<D = any> {
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
    export interface RenderFormDesignSettingViewOptions {}
    export interface RenderFormDesignSettingViewParams {}
  }
}
