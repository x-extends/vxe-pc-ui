import { VxeGridConstructor } from '../components/grid'
import { VxeToolbarPropTypes } from '../components/toolbar'
import { VxeTableConstructor } from '../components/table'

declare module '@vxe-ui/core' {
  export namespace VxeGlobalCommandsHandles {
    export interface CommandMethodParams {
      $grid: VxeGridConstructor | null
      $table: VxeTableConstructor
      button?: VxeToolbarPropTypes.ButtonConfig | null
    }
  }
}
