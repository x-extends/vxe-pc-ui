import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import { dynamicApp } from '../dynamics'
import VxeSegmentedComponent from './src/segmented'

export const VxeSegmented = Object.assign({}, VxeSegmentedComponent, {
  install (app: VueConstructor) {
    app.component(VxeSegmentedComponent.name as string, VxeSegmentedComponent)
  }
})

dynamicApp.use(VxeSegmented)
VxeUI.component(VxeSegmentedComponent)

export const Segmented = VxeSegmented
export default VxeSegmented
