import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxePagerComponent from './src/pager'
import { dynamicApp } from '../dynamics'

export const VxePager = Object.assign(VxePagerComponent, {
  install: function (app: App) {
    app.component(VxePagerComponent.name as string, VxePagerComponent)
    VxeUI.component(VxePagerComponent)
  }
})

dynamicApp.component(VxePagerComponent.name as string, VxePagerComponent)

export const Pager = VxePager
export default VxePager
