/**
 * 全局参数对象
 */
export interface VxeGlobalConfig {
  theme?: null | '' | 'default' | 'dark'

  [key: string]: any
}

/**
 * 全局图标对象
 */
export interface VxeIconConfig {
  [key: string]: any
}

export interface VxeUIExport {
  /**
   * 全局参数设置
   */
  config(options?: VxeGlobalConfig): Readonly<VxeGlobalConfig>
  /**
   * 获取全局参数
   */
  getConfig<T = any>(key: string | number | null | undefined, defaultValue?: any): T
}

export declare const VxeUI: VxeUIExport

export default VxeUI
