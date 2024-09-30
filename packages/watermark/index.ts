import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeWatermarkComponent from './src/watermark'
import { dynamicApp } from '../dynamics'

export const VxeWatermark = Object.assign({}, VxeWatermarkComponent, {
  install (app: App) {
    app.component(VxeWatermarkComponent.name as string, VxeWatermarkComponent)
  }
})

dynamicApp.use(VxeWatermark)
VxeUI.component(VxeWatermarkComponent)

export const Watermark = VxeWatermark
export default VxeWatermark
