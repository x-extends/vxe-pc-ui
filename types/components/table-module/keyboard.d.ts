/* eslint-disable no-use-before-define */

export interface TableKeyboardMethods<D = any> {}

export interface TableKeyboardPrivateMethods<D = any> {
  moveTabSelected(args: any, isLeft: any, evnt: any): void
  moveCurrentRow(isUpArrow: any, isDwArrow: any, evnt: any): void
  moveSelected(args: any, isLeftArrow: any, isUpArrow: any, isRightArrow: any, isDwArrow: any, evnt: any): void
  handleCellMousedownEvent(evnt: any, params: any): void
 }

declare module '../grid' {
  export interface VxeGridMethods<D = any> extends TableKeyboardMethods<D> { }
}

declare module '../table' {
  export interface VxeTableMethods<D = any> extends TableKeyboardMethods<D> { }
  export interface VxeTablePrivateMethods<D = any> extends TableKeyboardPrivateMethods<D> { }
}
