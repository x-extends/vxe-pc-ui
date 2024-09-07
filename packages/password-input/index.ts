import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxePasswordInputComponent from './src/password-input'
import { dynamicApp } from '../dynamics'

export const VxePasswordInput = Object.assign({}, VxePasswordInputComponent, {
  install (app: VueConstructor) {
    app.component(VxePasswordInputComponent.name as string, VxePasswordInputComponent)
  }
})

dynamicApp.use(VxePasswordInput)
VxeUI.component(VxePasswordInputComponent)

export const PasswordInput = VxePasswordInput
export default VxePasswordInput
