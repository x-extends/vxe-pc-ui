import { App } from 'vue'
import VxeUploadComponent from './src/upload'
import { dynamicApp } from '../dynamics'

const VxeUpload = Object.assign({}, VxeUploadComponent, {
  install (app: App) {
    app.component(VxeUploadComponent.name as string, VxeUploadComponent)
  }
})

dynamicApp.component(VxeUploadComponent.name as string, VxeUploadComponent)

export const Upload = VxeUpload
export default VxeUpload
