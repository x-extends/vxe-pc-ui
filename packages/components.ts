import { App } from 'vue'
import XEUtils from 'xe-utils'
import { setConfig } from './ui'

import VxeAnchor from './anchor'
import VxeAnchorLink from './anchor-link'
import VxeBreadcrumb from './breadcrumb'
import VxeBreadcrumbItem from './breadcrumb-item'
import VxeButton from './button'
import VxeButtonGroup from './button-group'
import VxeCheckbox from './checkbox'
import VxeCheckboxGroup from './checkbox-group'
import VxeCol from './col'
import VxeForm from './form'
import VxeFormDesign from './form-design'
import VxeFormGather from './form-gather'
import VxeFormItem from './form-item'
import VxeIcon from './icon'
import VxeInput from './input'
import VxeLayoutAside from './layout-aside'
import VxeLayoutBody from './layout-body'
import VxeLayoutContainer from './layout-container'
import VxeLayoutFooter from './layout-footer'
import VxeLayoutHeader from './layout-header'
import VxeListDesign from './list-design'
import VxeLoading from './loading'
import VxeModal from './modal'
import VxeOptgroup from './optgroup'
import VxeOption from './option'
import VxePager from './pager'
import VxePulldown from './pulldown'
import VxeRadio from './radio'
import VxeRadioButton from './radio-button'
import VxeRadioGroup from './radio-group'
import VxeRow from './row'
import VxeSelect from './select'
import VxeSwitch from './switch'
import VxeTextarea from './textarea'
import VxeTooltip from './tooltip'

import zhCN from './locale/lang/zh-CN'

import { VxeGlobalConfig } from '../types'

// 默认中文
setConfig({
  i18n: (key: string, args: any) => XEUtils.toFormatString(XEUtils.get(zhCN, key), args)
})

const components = [
  VxeAnchor,
  VxeAnchorLink,
  VxeBreadcrumb,
  VxeBreadcrumbItem,
  VxeButton,
  VxeButtonGroup,
  VxeCheckbox,
  VxeCheckboxGroup,
  VxeCol,
  VxeForm,
  VxeFormDesign,
  VxeFormGather,
  VxeFormItem,
  VxeIcon,
  VxeInput,
  VxeLayoutAside,
  VxeLayoutBody,
  VxeLayoutContainer,
  VxeLayoutFooter,
  VxeLayoutHeader,
  VxeListDesign,
  VxeLoading,
  VxeModal,
  VxeOptgroup,
  VxeOption,
  VxePager,
  VxePulldown,
  VxeRadio,
  VxeRadioButton,
  VxeRadioGroup,
  VxeRow,
  VxeSelect,
  VxeSwitch,
  VxeTextarea,
  VxeTooltip
]

export function install (app: App, options?: VxeGlobalConfig) {
  setConfig(options)

  components.forEach(component => app.use(component))
}

export * from './ui'

// Components
export * from './anchor'
export * from './anchor-link'
export * from './breadcrumb'
export * from './breadcrumb-item'
export * from './button'
export * from './button-group'
export * from './checkbox'
export * from './checkbox-group'
export * from './col'
export * from './form'
export * from './form-design'
export * from './form-gather'
export * from './form-item'
export * from './icon'
export * from './input'
export * from './layout-aside'
export * from './layout-body'
export * from './layout-container'
export * from './layout-footer'
export * from './layout-header'
export * from './list-design'
export * from './loading'
export * from './modal'
export * from './optgroup'
export * from './option'
export * from './pager'
export * from './pulldown'
export * from './radio'
export * from './radio-button'
export * from './radio-group'
export * from './row'
export * from './select'
export * from './switch'
export * from './textarea'
export * from './tooltip'
