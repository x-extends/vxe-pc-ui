import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeCollapseComponent from './src/collapse'
import { dynamicApp } from '../dynamics'

export const VxeCollapse = Object.assign({}, VxeCollapseComponent, {
  install (app: App) {
    app.component(VxeCollapseComponent.name as string, VxeCollapseComponent)
  }
})

dynamicApp.component(VxeCollapseComponent.name as string, VxeCollapseComponent)
VxeUI.component(VxeCollapseComponent)

export const Collapse = VxeCollapse
export default VxeCollapse
