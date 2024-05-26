import { App } from 'vue'
import VxeFlowViewComponent from './src/flow-view'
import { dynamicApp } from '../dynamics'

const VxeFlowView = Object.assign({}, VxeFlowViewComponent, {
  install (app: App) {
    app.component(VxeFlowViewComponent.name as string, VxeFlowViewComponent)
  }
})

dynamicApp.component(VxeFlowViewComponent.name as string, VxeFlowViewComponent)

export const FlowView = VxeFlowView
export default VxeFlowView
