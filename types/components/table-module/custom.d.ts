/* eslint-disable @typescript-eslint/no-empty-interface,@typescript-eslint/no-unused-vars,no-use-before-define */

export interface VxeCustomPanel {
}

export interface TableCustomMethods<D = any> {
  /**
   * 打开自定义面板
   */
  openCustom(): Promise<void>
  /**
   * 处理自定义面板
   */
  closeCustom(): Promise<void>
}

export interface TableCustomPrivateMethods<D = any> {
  checkCustomStatus(): void
  emitCustomEvent(type: string, evnt: Event): void
  triggerCustomEvent(evnt: MouseEvent): void
  customOpenEvent (evnt: Event): void
  customCloseEvent (evnt: Event): void
}

declare module '../grid' {
  export interface VxeGridMethods<D = any> extends TableCustomMethods<D> { }
}

declare module '../table' {
  export interface VxeTableMethods<D = any> extends TableCustomMethods<D> { }
  export interface VxeTablePrivateMethods<D = any> extends TableCustomPrivateMethods<D> { }
}
