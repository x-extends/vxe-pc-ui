/* eslint-disable @typescript-eslint/no-unused-vars,no-use-before-define */

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
  export type VxeGridMethods<D = any> = TableMenuMethods<D>
}

declare module '../table' {
  export type VxeTableMethods<D = any> = TableMenuMethods<D>
  export type VxeTablePrivateMethods<D = any> = TableMenuPrivateMethods<D>
}
