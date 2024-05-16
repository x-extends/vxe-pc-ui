import { App } from 'vue'
import VxeTabPaneComponent from '../tabs/src/tab-pane'
import { dynamicApp } from '../dynamics'

const VxeTabPane = Object.assign({}, VxeTabPaneComponent, {
  install (app: App) {
    app.component(VxeTabPaneComponent.name as string, VxeTabPaneComponent)
  }
})

dynamicApp.component(VxeTabPaneComponent.name as string, VxeTabPaneComponent)

export const TabPane = VxeTabPane
export default VxeTabPane
