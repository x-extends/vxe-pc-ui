/* eslint-disable @typescript-eslint/no-empty-interface,@typescript-eslint/no-unused-vars,no-use-before-define */

export interface TableKeyboardMethods<D = any> {}

export interface TableKeyboardPrivateMethods<D = any> {
  moveTabSelected(args: any, isLeft: any, evnt: any): void
  moveCurrentRow(isUpArrow: any, isDwArrow: any, evnt: any): void
  moveSelected(args: any, isLeftArrow: any, isUpArrow: any, isRightArrow: any, isDwArrow: any, evnt: any): void
  triggerHeaderCellMousedownEvent(evnt: any, params: any): void
  triggerCellMousedownEvent(evnt: any, params: any): void
 }

declare module '../grid' {
  export type VxeGridMethods<D = any> = TableKeyboardMethods<D>
}

declare module '../table' {
  export type VxeTableMethods<D = any> = TableKeyboardMethods<D>
  export type VxeTablePrivateMethods<D = any> = TableKeyboardPrivateMethods<D>
}
