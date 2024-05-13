import { VxeBreadcrumbPropTypes } from '../component/breadcrumb'

/**
 * 全局参数对象
 */
export interface VxeGlobalConfig {
  theme?: null | '' | 'default' | 'dark'

  // breadcrumb
  breadcrumb?: {
    separator: VxeBreadcrumbPropTypes.Separator
  }

  [key: string]: any
}
