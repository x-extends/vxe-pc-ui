import { VxeComponentSize } from '../tool'
import { VxeBreadcrumbProps } from '../component/breadcrumb'
import { VxeButtonProps } from '../component/button'
import { VxeFormProps } from '../component/form'
import { VxeFormDesignProps } from '../component/form-design'
import { VxeTooltipProps } from '../component/tooltip'
import { VxeModalProps } from '../component/modal'

/**
 * 全局参数对象
 */
export interface VxeGlobalConfig {
  zIndex?: number
  size?: VxeComponentSize
  version?: string | number
  theme?: null | '' | 'default' | 'dark'
  emptyCell?: string
  loadingText?: string

  i18n?(key: string, args?: any): string

  // breadcrumb
  breadcrumb?: VxeBreadcrumbProps

  // button
  button?: VxeButtonProps

  // form
  form?: VxeFormProps

  // design-form
  formDesign?: VxeFormDesignProps,

  // tooltip
  tooltip?: VxeTooltipProps

  // modal
  modal?: VxeModalProps
}
