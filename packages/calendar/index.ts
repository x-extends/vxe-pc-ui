import { App } from 'vue'
import VxeCalendarComponent from './src/calendar'
import { dynamicApp } from '../dynamics'

export const VxeCalendar = Object.assign({}, VxeCalendarComponent, {
  install (app: App) {
    app.component(VxeCalendarComponent.name as string, VxeCalendarComponent)
  }
})

dynamicApp.component(VxeCalendarComponent.name as string, VxeCalendarComponent)

export const Calendar = VxeCalendar
export default VxeCalendar
