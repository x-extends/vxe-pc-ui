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
}
