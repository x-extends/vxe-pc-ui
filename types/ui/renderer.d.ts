import { VxeComponentSlot } from '../tool'

/* eslint-disable no-use-before-define */

type RendererOptions = DefineRendererOption<VxeGlobalRendererHandles.RenderResult>

export interface DefineRendererOption<T> {
  // 表单-项渲染
  itemClassName?: string | ((params: VxeGlobalRendererHandles.RenderItemTitleParams) => string | VNodeClassName)
  itemStyle?: VxeComponentSlot | ((params: VxeGlobalRendererHandles.RenderItemTitleParams) => VxeComponentSlot)
  itemContentClassName?: string | ((params: VxeGlobalRendererHandles.RenderItemTitleParams) => string | VNodeClassName)
  itemContentStyle?: VxeComponentSlot | ((params: VxeGlobalRendererHandles.RenderItemTitleParams) => VxeComponentSlot)
  itemTitleClassName?: string | ((params: VxeGlobalRendererHandles.RenderItemTitleParams) => string | VNodeClassName)
  itemTitleStyle?: VxeComponentSlot | ((params: VxeGlobalRendererHandles.RenderItemTitleParams) => VxeComponentSlot)
  renderItemTitle?(renderOpts: VxeGlobalRendererHandles.RenderItemTitleOptions, params: VxeGlobalRendererHandles.RenderItemTitleParams): T
  renderItemContent?(renderOpts: VxeGlobalRendererHandles.RenderItemContentOptions, params: VxeGlobalRendererHandles.RenderItemContentParams): T
  itemVisibleMethod?(params: VxeGlobalRendererHandles.ItemVisibleMethodParams): boolean
  itemResetMethod?(params: VxeGlobalRendererHandles.ItemResetMethodParams): void

  // 编辑渲染
  autofocus?: string | ((params: VxeGlobalRendererHandles.RenderEditParams<any> | VxeGlobalRendererHandles.RenderCellParams<any>) => HTMLElement | null)
  autoselect?: boolean

  // 设计表单
  formDesignWidgetName?: string
  formDesignWidgetIcon?: string
  formDesignWidgetSettingFormData?(renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetOptions, params: VxeGlobalRendererHandles.RenderFormDesignWidgetParams): any
  formDesignWidgetSettingFormItems?(renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetOptions, params: VxeGlobalRendererHandles.RenderFormDesignWidgetParams): any
  renderFormDesignWidgetItem?(renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetOptions, params: VxeGlobalRendererHandles.RenderFormDesignWidgetParams): T
  renderFormDesignWidgetView?(renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetOptions, params: VxeGlobalRendererHandles.RenderFormDesignWidgetParams): T
  renderFormDesignWidgetSetting?(renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetOptions, params: VxeGlobalRendererHandles.RenderFormDesignWidgetParams): T
}

export namespace VxeGlobalRendererHandles {
  export type RenderResult = VxeComponentSlot | VxeComponentSlot[]

  export interface RenderFormDesignWidgetOptions {}
  export interface RenderFormDesignWidgetParams {}

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
  delete(name: string): void
}
