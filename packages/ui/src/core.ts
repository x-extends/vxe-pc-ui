import XEUtils from 'xe-utils'
import DomZIndex from 'dom-zindex'
import globalConfigStore from './globalStore'
import iconConfigStore from './iconStore'
import setTheme from './theme'

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
  getIcon
}

setTheme()

export default VxeCore
