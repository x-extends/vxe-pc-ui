import { App } from 'vue'
import VxeInputConstructor from './src/input'
import { dynamicApp } from '../dynamics'

export const VxeInput = Object.assign(VxeInputConstructor, {
  install (app: App) {
    app.component(VxeInputConstructor.name as string, VxeInputConstructor)
  }
})

dynamicApp.component(VxeInputConstructor.name as string, VxeInputConstructor)

export const Input = VxeInput
export default VxeInput
