import { App } from 'vue'
import VxeIconComponent from './src/icon'
import { dynamicApp } from '../dynamics'

const VxeIcon = Object.assign({}, VxeIconComponent, {
  install (app: App) {
    app.component(VxeIconComponent.name as string, VxeIconComponent)
  }
})

dynamicApp.component(VxeIconComponent.name as string, VxeIconComponent)

export const Icon = VxeIcon
export default VxeIcon
