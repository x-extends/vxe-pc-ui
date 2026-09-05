import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeDividerComponent from './src/divider'
import { dynamicApp } from '../dynamics'

export const VxeDivider = Object.assign({}, VxeDividerComponent, {
  install (app: App) {
    app.component(VxeDividerComponent.name as string, VxeDividerComponent)
  }
})

dynamicApp.use(VxeDivider)
VxeUI.component(VxeDividerComponent)

export const Divider = VxeDivider
export default VxeDivider
