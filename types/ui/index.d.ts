import { VxeUI, getI18n, setConfig } from '@vxe-ui/core'
import { LoadingController } from '../components/loading'
import { ModalController } from '../components/modal'
import { DrawerController } from '../components/drawer'
import { VxePrintDefines } from '../components/print'
import { VxeUploadDefines } from '../components/upload'
import { VxeImageDefines } from '../components/image'

/**
 * 已废弃，请使用 setConfig
 * @deprecated
 */
export const config: typeof setConfig
/**
 * 已废弃，请使用 setConfig
 * @deprecated
 */
export const setup: typeof setConfig

/**
 * 已废弃
 * @deprecated
 */
export interface VxeGlobalStore {
  [key: string]: any
  clipboard?: {
    text: string
    html: string
  }
}

// 兼容老版本
export const loading: LoadingController
export const modal: ModalController
export const drawer: DrawerController
export const print: VxePrintDefines.PrintFunction
export const saveFile: VxeUploadDefines.SaveFileFunction
export const readFile: VxeUploadDefines.ReadFileFunction

declare module '@vxe-ui/core' {
  export interface VxeUIExport {
    uiVersion: string
    tableVersion: string
    loading: LoadingController
    modal: ModalController
    drawer: DrawerController
    dynamicApp: any

    print: VxePrintDefines.PrintFunction
    saveFile: VxeUploadDefines.SaveFileFunction
    readFile: VxeUploadDefines.ReadFileFunction
    previewImage: VxeImageDefines.PreviewImageFunction

    /**
     * 已废弃，请使用 setConfig
     * @deprecated
     */
    config: typeof setConfig
    /**
     * 已废弃，请使用 setConfig
     * @deprecated
     */
    setup: typeof setConfig
    /**
     * 请使用 getI18n
     * @deprecated
     */
    t: typeof getI18n
    /**
     * @deprecated
     */
    _t(key: string, args?: any): string
    /**
     * @deprecated
     */
    version: string
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
