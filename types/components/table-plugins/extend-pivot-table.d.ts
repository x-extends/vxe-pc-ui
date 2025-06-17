import { DefineVxeComponentOptions } from '@vxe-ui/core'
import { VxeTableConstructor, VxeTablePrivateMethods, VxeTableDefines } from '../table'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/no-unused-vars */

export interface VxeTableExtendPivotTableMethods<D = any> {
}

export interface VxeTableExtendPivotTablePrivateMethods<D = any> {
  /**
   * @private
   */
  handlePivotTableAggregateData(aggList: VxeTableDefines.AggregateRowInfo[]): void
  /**
   * @private
   */
  getPivotTableAggregateCellAggValue(params: VxeTableDefines.CellRenderBodyParams<D> & { $table: VxeTableConstructor<D> & VxeTablePrivateMethods<D> }): string
  /**
   * @private
   */
  getPivotTableAggregateSimplePanel(): DefineVxeComponentOptions<{
    customStore: VxeTableDefines.VxeTableCustomStoreObj
  }>
}

declare module '../table' {
  export interface VxeTableMethods<D = any> extends VxeTableExtendPivotTableMethods<D> { }
  export interface VxeTablePrivateMethods<D = any> extends VxeTableExtendPivotTablePrivateMethods<D> { }
}

declare module '../grid' {
  export interface VxeGridMethods<D = any> extends VxeTableExtendPivotTableMethods<D> { }
  export interface VxeGridPrivateMethods<D = any> extends VxeTableExtendPivotTablePrivateMethods<D> { }
}
