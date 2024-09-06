import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeFlowViewComponent from './src/flow-view'
import { dynamicApp } from '../dynamics'

export const VxeFlowView = Object.assign({}, VxeFlowViewComponent, {
  install (app: App) {
    app.component(VxeFlowViewComponent.name as string, VxeFlowViewComponent)
  }
})

dynamicApp.use(VxeFlowView)
VxeUI.component(VxeFlowViewComponent)

export const FlowView = VxeFlowView
export default VxeFlowView
