import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeDateRangePickerComponent from './src/date-range-picker'
import { dynamicApp } from '../dynamics'

export const VxeDateRangePicker = Object.assign({}, VxeDateRangePickerComponent, {
  install (app: VueConstructor) {
    app.component(VxeDateRangePickerComponent.name as string, VxeDateRangePickerComponent)
  }
})

dynamicApp.use(VxeDateRangePicker)
VxeUI.component(VxeDateRangePickerComponent)

export const DateRangePicker = VxeDateRangePicker
export default VxeDateRangePicker
