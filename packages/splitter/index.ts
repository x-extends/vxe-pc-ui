import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeSplitterComponent from './src/splitter'
import { dynamicApp } from '../dynamics'

export const VxeSplitter = Object.assign({}, VxeSplitterComponent, {
  install (app: VueConstructor) {
    app.component(VxeSplitterComponent.name as string, VxeSplitterComponent)
  }
})

dynamicApp.use(VxeSplitter)
VxeUI.component(VxeSplitterComponent)

export const Splitter = VxeSplitter
export default VxeSplitter
