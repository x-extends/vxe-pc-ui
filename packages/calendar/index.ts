import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeCalendarComponent from './src/calendar'
import { dynamicApp } from '../dynamics'

export const VxeCalendar = Object.assign({}, VxeCalendarComponent, {
  install (app: VueConstructor) {
    app.component(VxeCalendarComponent.name as string, VxeCalendarComponent)
  }
})

dynamicApp.use(VxeCalendar)
VxeUI.component(VxeCalendarComponent)

export const Calendar = VxeCalendar
export default VxeCalendar
