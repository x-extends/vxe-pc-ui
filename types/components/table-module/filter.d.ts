import { VxeTableDefines } from '../table'
import { VxeColumnPropTypes } from '../column'

/* eslint-disable no-use-before-define */

export interface VxeFilterPanel {
  /**
   * 筛选所有发生改变
   * @param evnt 事件
   * @param checked 是否选中
   */
  changeAllOption(evnt: Event | null, checked: boolean): void
  /**
   * 筛选选项发生改变
   * @param evnt 事件
   * @param checked 是否选中
   * @param option 选项对象
   */
  changeOption(evnt: Event | null, checked: boolean, option: VxeTableDefines.FilterOption): void
  /**
   * 确认筛选
   */
  confirmFilter(evnt?: Event): void
  /**
   * 重置筛选
   */
  resetFilter(evnt?: Event): void
}

export interface TableFilterMethods<D = any> {
  /**
   * 手动弹出筛选
   * @param fieldOrColumn
   */
  openFilter(fieldOrColumn: VxeColumnPropTypes.Field | VxeTableDefines.ColumnInfo<any>):Promise<void>
  /**
   * 用于 filters，修改筛选列表
   * @param columnOrField 列对象或字段名
   * @param options 选项列表
   * @param update 是否同时更新数据，如果不传，则可以手动调用 updateData() 更新数据
   */
  setFilter(fieldOrColumn: VxeColumnPropTypes.Field | VxeTableDefines.ColumnInfo<any>, options: VxeColumnPropTypes.FilterItem[], update?: boolean): Promise<void>
  /**
   * 手动清空筛选条件
   * 如果不传 column 则清空所有筛选条件，数据会恢复成未筛选的状态
   * @param column 字段名
   */
  clearFilter(fieldOrColumn?: VxeColumnPropTypes.Field | VxeTableDefines.ColumnInfo<any> | null): Promise<void>
  /**
   * 用于在自定义面板中使用，手动确认筛选
   */
  saveFilterPanel(): Promise<any>
  /**
   * 用于在自定义面板中使用，手动重置筛选
   */
  resetFilterPanel(): Promise<any>
  /**
   * 获取当前筛选的所有列信息
   */
  getCheckedFilters(): VxeTableDefines.FilterCheckedParams<D>[]
  /**
   * 更新筛选选项的状态
   */
  updateFilterOptionStatus(item: any, checked: boolean): Promise<void>
}

export interface TableFilterPrivateMethods<D = any> {
  checkFilterOptions(): void
  handleClearFilter(column: any): void
  triggerFilterEvent(evnt: any, column: any, params: any): void
  handleColumnConfirmFilter(column: VxeTableDefines.ColumnInfo, evnt: Event | null): Promise<any>
  confirmFilterEvent(evnt: Event | null): void
  handleFilterChangeRadioOption (evnt: Event, checked: boolean, item: any): void
  handleFilterChangeMultipleOption (evnt: Event, checked: boolean, item: any): void
  handleFilterChangeOption (evnt: Event, checked: boolean, item: any): void
  handleFilterConfirmFilter (evnt: Event): void
  handleFilterResetFilter (evnt: Event | null): void
}

declare module '../grid' {
  export interface VxeGridMethods<D = any> extends TableFilterMethods<D> { }
}

declare module '../table' {
  export interface VxeTableMethods<D = any> extends TableFilterMethods<D> { }
  export interface VxeTablePrivateMethods<D = any> extends TableFilterPrivateMethods<D> { }
}
