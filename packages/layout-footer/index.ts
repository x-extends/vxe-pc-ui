import { App } from 'vue'
import VxeLayoutFooterComponent from './src/layout-footer'

const VxeLayoutFooter = Object.assign({}, VxeLayoutFooterComponent, {
  install (app: App) {
    app.component(VxeLayoutFooterComponent.name as string, VxeLayoutFooterComponent)
  }
})

export const LayoutFooter = VxeLayoutFooter
export default VxeLayoutFooter
