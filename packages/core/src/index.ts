import XEUtils from 'xe-utils'
import DomZIndex from 'dom-zindex'

import { VxeUIExport, VxeGlobalConfig } from '../types'

const globalConfigStore: VxeGlobalConfig = {}

const VxeUI: VxeUIExport = {
  /**
   * 全局参数设置
   */
  config (options) {
    if (options && options.zIndex) {
      DomZIndex.setCurrent(options.zIndex)
    }
    return options ? XEUtils.merge(globalConfigStore, options) : globalConfigStore
  },
  /**
   * 获取全局参数
   */
  getConfig (key, defaultValue) {
    return key ? XEUtils.get(globalConfigStore, key, defaultValue) : globalConfigStore
  }
}

export default VxeUI
