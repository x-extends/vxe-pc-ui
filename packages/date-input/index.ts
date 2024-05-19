import { App } from 'vue'
import VxeDateInputComponent from './src/date-input'
import { dynamicApp } from '../dynamics'

const VxeDateInput = Object.assign({}, VxeDateInputComponent, {
  install (app: App) {
    app.component(VxeDateInputComponent.name as string, VxeDateInputComponent)
  }
})

dynamicApp.component(VxeDateInputComponent.name as string, VxeDateInputComponent)

export const DateInput = VxeDateInput
export default VxeDateInput
