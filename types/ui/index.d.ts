import { App } from 'vue'
import { ModalController } from '../components/modal'
import { DrawerController } from '../components/drawer'
import { VxePrintDefines } from '../components/print'
import { VxeUploadDefines } from '../components/upload'

export const uiVersion: string
export const modal: ModalController
export const drawer: DrawerController
export const dynamicApp: App<Element>
export const print: VxePrintDefines.PrintFunction
export const saveFile: VxeUploadDefines.SaveFileFunction
export const readFile: VxeUploadDefines.ReadFileFunction

declare module '@vxe-ui/core' {
  export interface VxeUIExport {
    uiVersion: string
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
export * from './validators'

export * from '@vxe-ui/core'
export default VxeUI
