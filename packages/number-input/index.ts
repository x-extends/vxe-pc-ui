import { App } from 'vue'
import VxeNumberInputComponent from './src/number-input'
import { dynamicApp } from '../dynamics'

export const VxeNumberInput = Object.assign({}, VxeNumberInputComponent, {
  install (app: App) {
    app.component(VxeNumberInputComponent.name as string, VxeNumberInputComponent)
  }
})

dynamicApp.component(VxeNumberInputComponent.name as string, VxeNumberInputComponent)

export const NumberInput = VxeNumberInput
export default VxeNumberInput
