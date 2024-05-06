import XEUtils from 'xe-utils'
import DomZIndex from 'dom-zindex'
import globalConfigStore from './globalStore'

import { VxeUIExport } from '../../../types'

const VxeCore: VxeUIExport = {
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

export default VxeCore
