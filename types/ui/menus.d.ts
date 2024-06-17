import { VxeTableConstructor, VxeTableDefines, VxeTablePrivateMethods } from '../components/table'
import { VxeGridConstructor } from '../components/grid'
import { VxeGlobalRendererHandles } from '@vxe-ui/core'

/* eslint-disable no-use-before-define */

declare module '@vxe-ui/core' {
  export namespace VxeGlobalMenusHandles {
    export interface MenusOption {
      /**
       * 表格 - 自定义菜单方法
       */
      tableMenuMethod?: (params: TableMenuMethodParams, event: Event) => any

      /**
       * 已废弃，请使用 tableMenuMethod
       * @deprecated
       */
      menuMethod?: (params: TableMenuMethodParams, event: Event) => any
    }

    export interface TableMenuMethodParams extends VxeGlobalRendererHandles.RenderCellParams {
      $grid: VxeGridConstructor | null
      $table: VxeTableConstructor & VxeTablePrivateMethods
      $event: MouseEvent
      menu: VxeTableDefines.MenuFirstOption | VxeTableDefines.MenuChildOption
    }
  }
}
