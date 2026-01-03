import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import { dynamicApp } from '../dynamics'
import VxeTimelineComponent from './src/timeline'

export const VxeTimeline = Object.assign({}, VxeTimelineComponent, {
  install (app: VueConstructor) {
    app.component(VxeTimelineComponent.name as string, VxeTimelineComponent)
  }
})

dynamicApp.use(VxeTimeline)
VxeUI.component(VxeTimelineComponent)

export const Timeline = VxeTimeline
export default VxeTimeline
