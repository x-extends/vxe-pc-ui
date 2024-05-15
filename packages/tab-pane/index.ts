import { App } from 'vue'
import VxeTabPaneComponent from '../tabs/src/tab-pane'

const VxeTabPane = Object.assign({}, VxeTabPaneComponent, {
  install (app: App) {
    app.component(VxeTabPaneComponent.name as string, VxeTabPaneComponent)
  }
})

export const TabPane = VxeTabPane
export default VxeTabPane
