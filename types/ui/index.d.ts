import { VxeGlobalConfig } from './global-config'
import { VxeGlobalIcon } from './global-icon'
import { VxeGlobalRenderer } from './renderer'
import { VxeGlobalValidators } from './validators'
import { ModalController } from '../component/modal'

export function setConfig(options?: VxeGlobalConfig): Readonly<VxeGlobalConfig>

export function getConfig(key: string | number | null | undefined, defaultValue?: any): any

export function setIcon(options?: VxeGlobalIcon): Readonly<VxeGlobalIcon>

export function getIcon(key: string): any

export function getI18n(key: string, args?: any): string

export const version: string

export const renderer: VxeGlobalRenderer

export const validators: VxeGlobalValidators

export const modal: ModalController

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
   * 翻译组件语言
   */
  getI18n: typeof getI18n
  /**
   * 获取全局图标
   */
  getIcon: typeof getIcon,

  renderer: VxeGlobalRenderer
  validators: VxeGlobalValidators

  // 全局弹窗对象
  modal: ModalController
}

export declare const VxeUI: VxeUIExport

export * from './global-config'
export * from './global-icon'
export * from './renderer'
export * from './validators'

export default VxeUI
