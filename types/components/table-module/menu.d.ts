/* eslint-disable no-use-before-define */

export interface TableMenuMethods<D = any> {
  /**
   * 手动关闭快捷菜单
   */
  closeMenu(): Promise<any>
}

export interface TableMenuPrivateMethods<D = any> {
  moveCtxMenu(evnt: any, ctxMenuStore: any, property: any, hasOper: boolean, operRest: any, menuList: any): void
  handleOpenMenuEvent(evnt: Event, type: 'header' | 'body' | 'footer', params: any): void
  handleGlobalContextmenuEvent(evnt: any): void
  ctxMenuMouseoverEvent(evnt: any, item: any, child?: any): void
  ctxMenuMouseoutEvent(evnt: any, item: any): void
  ctxMenuLinkEvent(evnt: any, menu: any): void
}

declare module '../grid' {
  export interface VxeGridMethods<D = any> extends TableMenuMethods<D> { }
}

declare module '../table' {
  export interface VxeTableMethods<D = any> extends TableMenuMethods<D> { }
  export interface VxeTablePrivateMethods<D = any> extends TableMenuPrivateMethods<D> { }
  export namespace VxeTableDefines {
    export interface MenuOptions {
      disabled?: boolean
      options?: MenuFirstOption[][]
    }
    export interface MenuFirstOption {
      code?: string
      name?: string
      prefixIcon?: string
      suffixIcon?: string
      className?: string
      visible?: boolean
      disabled?: boolean
      children?: MenuChildOption[]
      params?: any
      [key: string]: any
    }
    export interface MenuChildOption {
      code?: string
      name?: string
      prefixIcon?: string
      className?: string
      visible?: boolean
      disabled?: boolean
      params?: any
      [key: string]: any
    }
  }
}
