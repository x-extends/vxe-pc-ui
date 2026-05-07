import { VNode } from 'vue'
import { DefineVxeComponentOptions } from '@vxe-ui/core'
import { VxeTableConstructor, VxeTablePrivateMethods, VxeTableDefines } from '../table'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/no-unused-vars */

export interface VxeTableExtendPivotTableMethods<D = any> {
}

export interface VxeTableExtendPivotTablePrivateMethods<D = any> {
  /**
   * 内部方法
   * @private
   */
  getPivotTableAggregateRenderColTitles(column: VxeTableDefines.ColumnInfo, titleVN: VNode): VNode[]
  /**
   * 内部方法
   * @private
   */
  handlePivotTableAggregateData(aggList: VxeTableDefines.AggregateRowInfo[]): void
  /**
   * 内部方法
   * @private
   */
  getPivotTableAggregateCellAggValue(params: {
    $table: VxeTableConstructor<D> & VxeTablePrivateMethods<D>
    row: any
    column: VxeTableDefines.ColumnInfo
  }): string
  /**
   * @private
   */
  getPivotTableAggregateSimplePanel(): DefineVxeComponentOptions<{
    customStore: VxeTableDefines.VxeTableCustomStoreObj
  }, object>
  /**
   * 内部方法
   * @private
   */
  getPivotTableAggregatePopupPanel(): DefineVxeComponentOptions<{
    customStore: VxeTableDefines.VxeTableCustomStoreObj
  }, object>
  /**
   * 内部方法
   * @private
   */
  handlePivotTableAggregatePanelDragendEvent(evnt: DragEvent): void
}

declare module '../table' {
  export interface VxeTableMethods<D = any> extends VxeTableExtendPivotTableMethods<D> { }
  export interface VxeTablePrivateMethods<D = any> extends VxeTableExtendPivotTablePrivateMethods<D> { }
}

declare module '../grid' {
  export interface VxeGridMethods<D = any> extends VxeTableExtendPivotTableMethods<D> { }
  export interface VxeGridPrivateMethods<D = any> extends VxeTableExtendPivotTablePrivateMethods<D> { }
}
