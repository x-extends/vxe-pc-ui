import { App } from 'vue'
import VxeButtonComponent from './src/button'

const VxeButton = Object.assign({}, VxeButtonComponent, {
  install (app: App) {
    app.component(VxeButtonComponent.name as string, VxeButtonComponent)
  }
})

export const Button = VxeButton
export default VxeButton
