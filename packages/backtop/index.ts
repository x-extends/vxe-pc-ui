import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import { dynamicApp } from '../dynamics'
import VxeBacktopComponent from './src/backtop'

export const VxeBacktop = Object.assign({}, VxeBacktopComponent, {
  install (app: VueConstructor) {
    app.component(VxeBacktopComponent.name as string, VxeBacktopComponent)
  }
})

dynamicApp.use(VxeBacktop)
VxeUI.component(VxeBacktopComponent)

export const Backtop = VxeBacktop
export default VxeBacktop
