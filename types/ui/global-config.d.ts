import { VxeComponentSize } from '../tool'
import { VxeTooltipProps } from '../components/tooltip'
import { VxePagerProps } from '../components/pager'
import { VxeFormProps } from '../components/form'
import { VxeInputProps } from '../components/input'
import { VxeTextareaProps } from '../components/textarea'
import { VxeSelectProps } from '../components/select'
import { VxeButtonProps } from '../components/button'
import { VxeButtonGroupProps } from '../components/button-group'
import { VxeRadioProps } from '../components/radio'
import { VxeRadioButtonProps } from '../components/radio-button'
import { VxeRadioGroupProps } from '../components/radio-group'
import { VxeCheckboxProps } from '../components/checkbox'
import { VxeCheckboxGroupProps } from '../components/checkbox-group'
import { VxeSwitchProps } from '../components/switch'
import { VxeModalProps } from '../components/modal'
import { VxeListProps } from '../components/list'
import { VxeBreadcrumbProps } from '../components/breadcrumb'
import { VxeFormDesignProps } from '../components/form-design'

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

  tooltip?: VxeTooltipProps
  pager?: VxePagerProps
  form?: VxeFormProps
  input?: VxeInputProps
  textarea?: VxeTextareaProps
  select?: VxeSelectProps
  button?: VxeButtonProps
  buttonGroup?: VxeButtonGroupProps
  radio?: VxeRadioProps
  radioButton?: VxeRadioButtonProps
  radioGroup?: VxeRadioGroupProps
  checkbox?: VxeCheckboxProps
  checkboxGroup?: VxeCheckboxGroupProps
  switch?: VxeSwitchProps
  modal?: VxeModalProps
  list?: VxeListProps
  breadcrumb?: VxeBreadcrumbProps,
  formDesign?: VxeFormDesignProps
}
