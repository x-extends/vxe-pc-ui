import { VxeTableDefines } from '../components/table'

/* eslint-disable no-use-before-define */

declare module '@vxe-ui/core' {
  export namespace VxeGlobalFormatsHandles {
    export interface FormatsOptions {
      /**
       * 表格 - 自定义单元格格式化方法
       */
      tableCellFormatMethod?: (params: TableCellFormatMethodParams, ...args: any[]) => string | number

      /**
       * 已废弃，请使用 tableCellFormatMethod
       * @deprecated
       */
      cellFormatMethod?: (params: TableCellFormatMethodParams, ...args: any[]) => string | number
    }
    export interface TableCellFormatMethodParams {
      cellValue: any
      row: any
      column: VxeTableDefines.ColumnInfo
    }
  }
}
