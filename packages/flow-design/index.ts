import { App } from 'vue'
import VxeFlowDesignComponent from './src/flow-design'
import { dynamicApp } from '../dynamics'

export const VxeFlowDesign = Object.assign({}, VxeFlowDesignComponent, {
  install (app: App) {
    app.component(VxeFlowDesignComponent.name as string, VxeFlowDesignComponent)
  }
})

dynamicApp.component(VxeFlowDesignComponent.name as string, VxeFlowDesignComponent)

export const FlowDesign = VxeFlowDesign
export default VxeFlowDesign
