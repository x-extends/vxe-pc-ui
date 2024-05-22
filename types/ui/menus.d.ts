import { VxeTableConstructor, VxeTableDefines, VxeTablePrivateMethods } from '../components/table'
import { VxeGridConstructor } from '../components/grid'
import { VxeGlobalRendererHandles } from './renderer'

declare module '@vxe-ui/core' {
  export namespace VxeGlobalMenusHandles {
    export interface MenuMethodParams extends VxeGlobalRendererHandles.RenderCellParams {
      $grid: VxeGridConstructor | null
      $table: VxeTableConstructor & VxeTablePrivateMethods
      $event: MouseEvent
      menu: VxeTableDefines.MenuFirstOption | VxeTableDefines.MenuChildOption
    }
  }
}
