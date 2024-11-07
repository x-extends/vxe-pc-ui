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
  /**
   * 重置自定义列操作
   * 支持只重置指定的操作（列可视、列宽、冻结列、列顺序）
   */
  resetCustom(options?: boolean | {
    visible?: boolean
    resizable?: boolean
    fixed?: boolean
    order?: boolean
  }): Promise<void>
  /**
   * 保存自定义列操作
   */
  saveCustom(): Promise<void>
  /**
   * 取消自定义列操作
   */
  cancelCustom(): Promise<void>
  /**
   * 切换自定义列全选状态
   */
  toggleCustomAllCheckbox(): Promise<void>
  /**
   * 设置自定义列全选状态
   */
  setCustomAllCheckbox(checked: boolean): Promise<void>
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
