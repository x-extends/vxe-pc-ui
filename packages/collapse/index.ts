import { App } from 'vue'
import VxeCollapseComponent from './src/collapse'
import { dynamicApp } from '../dynamics'

const VxeCollapse = Object.assign({}, VxeCollapseComponent, {
  install (app: App) {
    app.component(VxeCollapseComponent.name as string, VxeCollapseComponent)
  }
})

dynamicApp.component(VxeCollapseComponent.name as string, VxeCollapseComponent)

export const Collapse = VxeCollapse
export default VxeCollapse
