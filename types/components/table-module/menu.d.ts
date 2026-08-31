import { VxeTableDefines } from '../table'

/* eslint-disable @typescript-eslint/no-unused-vars,no-use-before-define */

export interface TableMenuMethods<D = any> {
  /**
   * 手动关闭快捷菜单
   */
  closeMenu(): Promise<any>
}

export interface TableMenuPrivateMethods<D = any> {
  /**
   * @private
   */
  moveCtxMenu(evnt: KeyboardEvent, ctxMenuStore: any, property: 'selectChild' | 'selected', hasOper: boolean, operRest: any, menuList: any[]): void
  /**
   * @private
   */
  handleOpenMenuEvent(evnt: Event, type: 'header' | 'body' | 'footer', params: any): void
  /**
   * @private
   */
  handleGlobalContextmenuEvent(evnt: Event): void
  /**
   * @private
   */
  ctxMenuMouseoverEvent(evnt: Event, item: VxeTableDefines.MenuFirstOption | VxeTableDefines.MenuChildOption, child?: any): void
  /**
   * @private
   */
  ctxMenuMouseoutEvent(evnt: Event, item: VxeTableDefines.MenuFirstOption | VxeTableDefines.MenuChildOption): void
  /**
   * @private
   */
  ctxMenuLinkEvent(evnt: Event, menu: VxeTableDefines.MenuFirstOption | VxeTableDefines.MenuChildOption): void
}

declare module '../grid' {
  export interface VxeGridMethods<D = any> extends TableMenuMethods<D> { }
}

declare module '../table' {
  export interface VxeTableMethods<D = any> extends TableMenuMethods<D> { }
  export interface VxeTablePrivateMethods<D = any> extends TableMenuPrivateMethods<D> { }
}
