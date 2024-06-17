import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeFlowDesignComponent from './src/flow-design'
import { dynamicApp } from '../dynamics'

export const VxeFlowDesign = Object.assign({}, VxeFlowDesignComponent, {
  install (app: App) {
    app.component(VxeFlowDesignComponent.name as string, VxeFlowDesignComponent)
    VxeUI.component(VxeFlowDesignComponent)
  }
})

dynamicApp.component(VxeFlowDesignComponent.name as string, VxeFlowDesignComponent)

export const FlowDesign = VxeFlowDesign
export default VxeFlowDesign
