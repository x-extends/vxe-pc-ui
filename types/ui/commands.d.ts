import { VxeGridConstructor } from '../components/grid'
import { VxeToolbarPropTypes } from '../components/toolbar'
import { VxeTableConstructor } from '../components/table'

/* eslint-disable no-use-before-define */

declare module '@vxe-ui/core' {
  export namespace VxeGlobalCommandsHandles {
    export interface CommandsOptions {
      /**
       * 表格 - 自定义工具栏或数据代理的指令方法
       */
      tableCommandMethod?: (params: TableCommandMethodParams, ...args: any[]) => void

      /**
       * 已废弃，请使用 tableCommandMethod
       * @deprecated
       */
      commandMethod?: (params: TableCommandMethodParams, ...args: any[]) => void
    }

    export interface TableCommandMethodParams {
      $grid: VxeGridConstructor | null | undefined
      $table: VxeTableConstructor
      button?: VxeToolbarPropTypes.ButtonConfig | null
      code?: string
    }
  }
}
