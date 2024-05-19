import { App } from 'vue'
import VxePasswordInputComponent from './src/password-input'
import { dynamicApp } from '../dynamics'

const VxePasswordInput = Object.assign({}, VxePasswordInputComponent, {
  install (app: App) {
    app.component(VxePasswordInputComponent.name as string, VxePasswordInputComponent)
  }
})

dynamicApp.component(VxePasswordInputComponent.name as string, VxePasswordInputComponent)

export const PasswordInput = VxePasswordInput
export default VxePasswordInput
