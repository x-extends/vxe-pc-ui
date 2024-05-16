import { VxeGlobalRendererHandles } from './renderer'

/* eslint-disable no-use-before-define */

export namespace VxeGlobalMenusHandles {
  export type MenusOption<D = any> = {
    menuMethod?: (params: MenuMethodParams<D>, event: Event) => any
  }
  export interface MenuMethodParams<D = any> extends VxeGlobalRendererHandles.RenderCellParams<D> {
    $grid: any
    $table: any
    $event: MouseEvent
    menu: any
  }
}

/**
 * 全局快捷菜单
 */
export interface VxeGlobalMenus {
  mixin(opts: {
    [code: string]: VxeGlobalMenusHandles.MenusOption<any> | ((params: VxeGlobalMenusHandles.MenuMethodParams<any>, event: Event) => any)
  }): VxeGlobalMenus
  has(code: string): boolean
  get(code: string): VxeGlobalMenusHandles.MenusOption<any>
  add(code: string, options: VxeGlobalMenusHandles.MenusOption<any> | ((params: VxeGlobalMenusHandles.MenuMethodParams<any>, event: Event) => any)): VxeGlobalMenus
  delete(code: string): void
  forEach(callback: (options: VxeGlobalMenusHandles.MenusOption<any>, code: string) => void): void
}
