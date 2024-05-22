import { VxeTableDefines } from '../components/table'

declare module '@vxe-ui/core' {
  export namespace VxeGlobalFormatsHandles {
    export interface FormatMethodParams {
      cellValue: any
      row: any
      column: VxeTableDefines.ColumnInfo
    }
  }
}
