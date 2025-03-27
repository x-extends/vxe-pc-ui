import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeSplitComponent from './src/split'
import { dynamicApp } from '../dynamics'

export const VxeSplit = Object.assign({}, VxeSplitComponent, {
  install (app: App) {
    app.component(VxeSplitComponent.name as string, VxeSplitComponent)
  }
})

dynamicApp.use(VxeSplit)
VxeUI.component(VxeSplitComponent)

export const Split = VxeSplit
export default VxeSplit
