import { App } from 'vue'
import VxeLayoutBodyComponent from './src/layout-body'

const VxeLayoutBody = Object.assign({}, VxeLayoutBodyComponent, {
  install (app: App) {
    app.component(VxeLayoutBodyComponent.name as string, VxeLayoutBodyComponent)
  }
})

export const LayoutBody = VxeLayoutBody
export default VxeLayoutBody
