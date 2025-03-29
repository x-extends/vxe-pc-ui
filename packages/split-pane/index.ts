import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeSplitPaneComponent from '../split/src/split-pane'
import { dynamicApp } from '../dynamics'

export const VxeSplitPane = Object.assign({}, VxeSplitPaneComponent, {
  install (app: VueConstructor) {
    app.component(VxeSplitPaneComponent.name as string, VxeSplitPaneComponent)
    app.component('VxeSplitItem', VxeSplitPaneComponent)
  }
})

dynamicApp.use(VxeSplitPane)
VxeUI.component(VxeSplitPaneComponent)

export const SplitPane = VxeSplitPane
export default VxeSplitPane
