import { App } from 'vue'
import VxeLayoutContainerComponent from './src/layout-container'

const VxeLayoutContainer = Object.assign({}, VxeLayoutContainerComponent, {
  install (app: App) {
    app.component(VxeLayoutContainerComponent.name as string, VxeLayoutContainerComponent)
  }
})

export const LayoutContainer = VxeLayoutContainer
export default VxeLayoutContainer
