export namespace VxeGlobalInterceptorHandles {
  export type HookType = 'created' | 'mounted' | 'activated' | 'beforeUnmount' | 'unmounted'
  export type EventType = 'event.clearEdit' | 'event.clearActived' | 'event.clearFilter' | 'event.clearAreas' | 'event.showMenu' | 'event.keydown' | 'event.export' | 'event.import'
  export type Type = HookType | EventType

  export type InterceptorCallback = (params: any) => any

  interface InterceptorParams {
    $grid?:any
    $table: any
    $event: Event
  }

  export interface InterceptorKeydownParams extends InterceptorParams { }
  export interface InterceptorClearFilterParams extends InterceptorParams { }
  export interface InterceptorClearEditParams extends InterceptorParams { }
  export interface InterceptorClearAreasParams extends InterceptorParams { }

  export interface InterceptorExportParams extends InterceptorParams {
    options: any
    columns: any[]
    colgroups: any[][]
    datas: any[]
  }

  export interface InterceptorImportParams extends InterceptorParams {
    file: File
    options: any
    columns: any[]
    datas: any[]
  }

  export interface InterceptorShowMenuParams extends InterceptorParams {
    type: 'header' | 'body' | 'footer'
    options: any[][]
    columns: any[]
    row?: any
    rowIndex?: number
    column?: any
    columnIndex?: number
  }
}

/**
 * 全局事件拦截器
 */
export interface VxeGlobalInterceptor {
  mixin(options: {
    [type: string]: VxeGlobalInterceptorHandles.InterceptorCallback
  }): VxeGlobalInterceptor
  get(type: VxeGlobalInterceptorHandles.Type): VxeGlobalInterceptorHandles.InterceptorCallback[]
  add(type: VxeGlobalInterceptorHandles.Type, callback: VxeGlobalInterceptorHandles.InterceptorCallback): VxeGlobalInterceptor
  delete(type: VxeGlobalInterceptorHandles.Type, callback?: VxeGlobalInterceptorHandles.InterceptorCallback): void
}
