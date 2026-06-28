import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeTransferComponent from './src/transfer'
import { dynamicApp } from '../dynamics'

export const VxeTransfer = Object.assign({}, VxeTransferComponent, {
  install (app: VueConstructor) {
    app.component(VxeTransferComponent.name as string, VxeTransferComponent)
  }
})

dynamicApp.use(VxeTransfer)
VxeUI.component(VxeTransferComponent)

export const Transfer = VxeTransfer
export default VxeTransfer
