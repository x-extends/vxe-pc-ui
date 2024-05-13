import { VxeGlobalConfig } from './global-config'
import { VxeGlobalIcon } from './global-icon'

export function setConfig(options?: VxeGlobalConfig): Readonly<VxeGlobalConfig>

export function getConfig(key: string | number | null | undefined, defaultValue?: any): any

export function setIcon(options?: VxeGlobalIcon): Readonly<VxeGlobalIcon>

export function getIcon(key: string): string

export const version: string

export interface VxeUIExport {
  /**
   * 版本号
   */
  version: string
  /**
   * 设置全局参数
   */
  setConfig: typeof setConfig
  /**
   * 获取全局参数
   */
  getConfig: typeof getConfig
  /**
   * 设置全局图标
   */
  setIcon: typeof setIcon
  /**
   * 获取全局图标
   */
  getIcon: typeof getIcon
}

export declare const VxeUI: VxeUIExport

export * from './global-config'
export * from './global-icon'

export default VxeUI
