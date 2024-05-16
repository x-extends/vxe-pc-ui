import XEUtils from 'xe-utils'
import DomZIndex from 'dom-zindex'
import globalConfigStore from './globalStore'
import iconConfigStore from './iconStore'
import setTheme from './theme'
import { getI18n } from './i18n'
import { renderer } from './renderer'
import { validators } from './validators'
import { menus } from './menus'
import { formats } from './formats'
import { commands } from './commands'
import { interceptor } from './interceptor'
import { hooks } from './hooks'

import { VxeUIExport, VxeGlobalConfig } from '../../../types'

/**
* 全局参数设置
*/
export function setConfig (options?: VxeGlobalConfig) {
  if (options) {
    if (options.theme) {
      setTheme(options)
    }
    if (options.zIndex) {
      DomZIndex.setCurrent(options.zIndex)
    }
  }
  return options ? XEUtils.merge(globalConfigStore, options) : globalConfigStore
}

/**
* 获取全局参数
*/
export function getConfig (key: string | number | null | undefined, defaultValue?: any) {
  return arguments.length ? XEUtils.get(globalConfigStore, key, defaultValue) : globalConfigStore
}

export function setIcon (options?: any) {
  return options ? Object.assign(iconConfigStore, options) : iconConfigStore
}

export function getIcon (key: string) {
  return arguments.length ? XEUtils.get(iconConfigStore, key) : iconConfigStore
}

export const version = process.env.VUE_APP_VXE_TABLE_VERSION

const VxeCore: VxeUIExport = {
  version,
  setConfig,
  getConfig,
  setIcon,
  getIcon,
  getI18n,
  renderer,
  validators,
  menus,
  formats,
  commands,
  interceptor,

  hooks,

  modal: null as any
}

setTheme()

export * from './i18n'
export * from './renderer'
export * from './validators'
export * from './menus'
export * from './formats'
export * from './commands'
export * from './interceptor'
export * from './hooks'

export default VxeCore
