import { App } from 'vue'
import VxeTextComponent from './src/text'
import { dynamicApp } from '../dynamics'

export const VxeText = Object.assign({}, VxeTextComponent, {
  install (app: App) {
    app.component(VxeTextComponent.name as string, VxeTextComponent)
  }
})

dynamicApp.component(VxeTextComponent.name as string, VxeTextComponent)

export const Text = VxeText
export default VxeText
