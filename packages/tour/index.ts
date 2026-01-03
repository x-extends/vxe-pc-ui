import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import { dynamicApp } from '../dynamics'
import VxeTourComponent from './src/tour'

export const VxeTour = Object.assign({}, VxeTourComponent, {
  install (app: VueConstructor) {
    app.component(VxeTourComponent.name as string, VxeTourComponent)
  }
})

dynamicApp.use(VxeTour)
VxeUI.component(VxeTourComponent)

export const Tour = VxeTour
export default VxeTour
