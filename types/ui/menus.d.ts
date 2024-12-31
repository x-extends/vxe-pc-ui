import { VxeTableConstructor, VxeTableDefines } from '../components/table'
import { VxeGridConstructor } from '../components/grid'

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
      $grid: VxeGridConstructor | null | undefined
      $table: VxeTableConstructor
      $event: MouseEvent
      menu: VxeTableDefines.MenuFirstOption | VxeTableDefines.MenuChildOption
    }
  }
}
