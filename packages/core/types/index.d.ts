/**
 * 全局参数对象
 */
export interface VxeGlobalConfig {
  [key: string]: any
}

export interface VxeUIExport {
  /**
   * 全局参数设置
   */
  config(options?: VxeGlobalConfig): Required<VxeGlobalConfig>
  /**
   * 获取全局参数
   */
  getConfig<T = any>(key: string | number | null | undefined, defaultValue?: any): T
}

export declare const VxeUI: VxeUIExport

export * from './util'
export * from './component'
export default VxeUI
