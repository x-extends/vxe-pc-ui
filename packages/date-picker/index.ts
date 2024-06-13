import { App } from 'vue'
import VxeDatePickerComponent from './src/date-picker'
import { dynamicApp } from '../dynamics'

export const VxeDatePicker = Object.assign({}, VxeDatePickerComponent, {
  install (app: App) {
    app.component(VxeDatePickerComponent.name as string, VxeDatePickerComponent)
    app.component('VxeDateInput', VxeDatePickerComponent)
  }
})

dynamicApp.component(VxeDatePickerComponent.name as string, VxeDatePickerComponent)

export const DatePicker = VxeDatePicker
export default VxeDatePicker
