import { VxeComponentSize } from '../tool'

import { VxeAnchorProps } from '../components/anchor'
import { VxeAnchorLinkProps } from '../components/anchor-link'
import { VxeBreadcrumbProps } from '../components/breadcrumb'
import { VxeBreadcrumbItemProps } from '../components/breadcrumb-item'
import { VxeButtonProps } from '../components/button'
import { VxeButtonGroupProps } from '../components/button-group'
import { VxeCheckboxProps } from '../components/checkbox'
import { VxeCheckboxGroupProps } from '../components/checkbox-group'
import { VxeColProps } from '../components/col'
import { VxeFormProps } from '../components/form'
import { VxeFormDesignProps } from '../components/form-design'
import { VxeFormGatherProps } from '../components/form-gather'
import { VxeFormItemProps } from '../components/form-item'
import { VxeIconProps } from '../components/icon'
import { VxeInputProps } from '../components/input'
import { VxeLayoutAsideProps } from '../components/layout-aside'
import { VxeLayoutBodyProps } from '../components/layout-body'
import { VxeLayoutContainerProps } from '../components/layout-container'
import { VxeLayoutFooterProps } from '../components/layout-footer'
import { VxeLayoutHeaderProps } from '../components/layout-header'
import { VxeListDesignProps } from '../components/list-design'
import { VxeListProps } from '../components/list'
import { VxeLoadingProps } from '../components/loading'
import { VxeModalProps } from '../components/modal'
import { VxeOptgroupProps } from '../components/optgroup'
import { VxeOptionProps } from '../components/option'
import { VxePagerProps } from '../components/pager'
import { VxePulldownProps } from '../components/pulldown'
import { VxeRadioProps } from '../components/radio'
import { VxeRadioButtonProps } from '../components/radio-button'
import { VxeRadioGroupProps } from '../components/radio-group'
import { VxeRowProps } from '../components/row'
import { VxeSelectProps } from '../components/select'
import { VxeSwitchProps } from '../components/switch'
import { VxeTabPaneProps } from '../components/tab-pane'
import { VxeTabsProps } from '../components/tabs'
import { VxeTextareaProps } from '../components/textarea'
import { VxeTooltipProps } from '../components/tooltip'

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
  resizeInterval?: number

  i18n?(key: string, args?: any): string

  anchor?: VxeAnchorProps
  anchorLink?: VxeAnchorLinkProps
  breadcrumb?: VxeBreadcrumbProps
  breadcrumbItem?: VxeBreadcrumbItemProps
  button?: VxeButtonProps
  buttonGroup?: VxeButtonGroupProps
  checkbox?: VxeCheckboxProps
  checkboxGroup?: VxeCheckboxGroupProps
  col?: VxeColProps
  form?: VxeFormProps
  formDesign?: VxeFormDesignProps
  formGather?: VxeFormGatherProps
  formItem?: VxeFormItemProps
  icon?: VxeIconProps
  input?: VxeInputProps
  layoutAside?: VxeLayoutAsideProps
  layoutBody?: VxeLayoutBodyProps
  layoutContainer?: VxeLayoutContainerProps
  layoutFooter?: VxeLayoutFooterProps
  layoutHeader?: VxeLayoutHeaderProps
  listDesign?: VxeListDesignProps
  list?: VxeListProps
  loading?: VxeLoadingProps
  modal?: VxeModalProps
  optgroup?: VxeOptgroupProps
  option?: VxeOptionProps
  pager?: VxePagerProps
  pulldown?: VxePulldownProps
  radio?: VxeRadioProps
  radioButton?: VxeRadioButtonProps
  radioGroup?: VxeRadioGroupProps
  row?: VxeRowProps
  select?: VxeSelectProps
  'switch'?: VxeSwitchProps
  tabPane?: VxeTabPaneProps
  tabs?: VxeTabsProps
  textarea?: VxeTextareaProps
  tooltip?: VxeTooltipProps
}
