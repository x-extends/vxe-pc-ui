import { App } from 'vue'
import VxeIconComponent from './src/icon'

const VxeIcon = Object.assign({}, VxeIconComponent, {
  install (app: App) {
    app.component(VxeIconComponent.name as string, VxeIconComponent)
  }
})

export const Icon = VxeIcon
export default VxeIcon
