import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeFlowViewComponent from './src/flow-view'
import { dynamicApp } from '../dynamics'

export const VxeFlowView = Object.assign({}, VxeFlowViewComponent, {
  install (app: App) {
    app.component(VxeFlowViewComponent.name as string, VxeFlowViewComponent)
    VxeUI.component(VxeFlowViewComponent)
  }
})

dynamicApp.component(VxeFlowViewComponent.name as string, VxeFlowViewComponent)

export const FlowView = VxeFlowView
export default VxeFlowView
