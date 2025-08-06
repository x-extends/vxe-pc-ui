import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeGanttComponent from './src/gantt'
import { dynamicApp } from '../dynamics'

export const VxeGantt = Object.assign({}, VxeGanttComponent, {
  install (app: App) {
    app.component(VxeGanttComponent.name as string, VxeGanttComponent)
  }
})

dynamicApp.use(VxeGantt)
VxeUI.component(VxeGanttComponent)

export const Gantt = VxeGantt
export default VxeGantt
