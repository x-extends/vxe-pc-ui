import { App } from 'vue'
import VxeCollapsePaneComponent from './src/collapse-pane'
import { dynamicApp } from '../dynamics'

const VxeCollapsePane = Object.assign({}, VxeCollapsePaneComponent, {
  install (app: App) {
    app.component(VxeCollapsePaneComponent.name as string, VxeCollapsePaneComponent)
  }
})

dynamicApp.component(VxeCollapsePaneComponent.name as string, VxeCollapsePaneComponent)

export const CollapsePane = VxeCollapsePane
export default VxeCollapsePane
