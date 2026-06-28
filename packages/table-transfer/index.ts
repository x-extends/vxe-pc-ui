import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeTableTransferComponent from './src/table-transfer'
import { dynamicApp } from '../dynamics'

export const VxeTableTransfer = Object.assign({}, VxeTableTransferComponent, {
  install (app: VueConstructor) {
    app.component(VxeTableTransferComponent.name as string, VxeTableTransferComponent)
  }
})

dynamicApp.use(VxeTableTransfer)
VxeUI.component(VxeTableTransferComponent)

export const TableTransfer = VxeTableTransfer
export default VxeTableTransfer
