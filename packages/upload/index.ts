import { App } from 'vue'
import VxeUploadComponent from './src/upload'
import { VxeUI } from '@vxe-ui/core'
import { dynamicApp } from '../dynamics'
import { saveLocalFile, readLocalFile } from './src/util'

const VxeUpload = Object.assign({}, VxeUploadComponent, {
  install (app: App) {
    app.component(VxeUploadComponent.name as string, VxeUploadComponent)
    VxeUI.saveFile = saveLocalFile
    VxeUI.readFile = readLocalFile
  }
})

dynamicApp.component(VxeUploadComponent.name as string, VxeUploadComponent)

export const Upload = VxeUpload
export default VxeUpload
