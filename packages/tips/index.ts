import { App } from 'vue'
import VxeTipsComponent from './src/tips'
import { dynamicApp } from '../dynamics'

export const VxeTips = Object.assign({}, VxeTipsComponent, {
  install (app: App) {
    app.component(VxeTipsComponent.name as string, VxeTipsComponent)
  }
})

dynamicApp.component(VxeTipsComponent.name as string, VxeTipsComponent)

export const Tips = VxeTips
export default VxeTips
