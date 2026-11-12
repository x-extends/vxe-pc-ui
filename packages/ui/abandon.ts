import { VxeUI, setConfig } from '@vxe-ui/core'
import { warnLog } from './src/log'

import { VxeGlobalConfig } from '../../types'

/**
 * 已废弃，兼容老版本
 * @deprecated
 */
export function config(options?: VxeGlobalConfig) {
  warnLog('vxe.error.delFunc', ['config', 'setConfig'])
  return setConfig(options)
}
/**
 * 已废弃，兼容老版本
 * @deprecated
 */
export function setup(options?: VxeGlobalConfig) {
  warnLog('vxe.error.delFunc', ['setup', 'setConfig'])
  return setConfig(options)
}

/**
 * 已废弃，兼容老版本
 * @deprecated
 */
VxeUI.config = config
/**
 * 已废弃，兼容老版本
 * @deprecated
 */
VxeUI.setup = setup
