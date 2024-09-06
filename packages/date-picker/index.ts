import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeDatePickerComponent from './src/date-picker'
import { dynamicApp } from '../dynamics'

export const VxeDatePicker = Object.assign({}, VxeDatePickerComponent, {
  install (app: VueConstructor) {
    app.component(VxeDatePickerComponent.name as string, VxeDatePickerComponent)
    app.component('VxeDateInput', VxeDatePickerComponent)
  }
})

dynamicApp.use(VxeDatePicker)
VxeUI.component(VxeDatePickerComponent)

export const DatePicker = VxeDatePicker
export default VxeDatePicker
