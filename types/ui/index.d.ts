import { App } from 'vue'
import { ModalController } from '../components/modal'
import { DrawerController } from '../components/drawer'
import { VxePrintDefines } from '../components/print'
import { VxeUploadDefines } from '../components/upload'

declare module '@vxe-ui/core' {
  export interface VxeUIExport {
    uiVersion: string
    tableVersion: string
    modal: ModalController
    drawer: DrawerController
    dynamicApp: App<Element>
    print: VxePrintDefines.PrintFunction
    saveFile: VxeUploadDefines.SaveFileFunction
    readFile: VxeUploadDefines.ReadFileFunction
  }
}

export * from './global-config'
export * from './global-icon'
export * from './renderer'
export * from './interceptor'
export * from './commands'
export * from './formats'
export * from './menus'
export * from './validators'
export * from './hooks'

export * from '@vxe-ui/core'
export default VxeUI
