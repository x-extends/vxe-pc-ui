import { App } from 'vue'
import { setConfig, VxeGlobalConfig } from '@vxe-ui/core'

import VxeAnchor from './anchor'
import VxeAnchorLink from './anchor-link'
import VxeBreadcrumb from './breadcrumb'
import VxeBreadcrumbItem from './breadcrumb-item'
import VxeButton from './button'
import VxeButtonGroup from './button-group'
import VxeCalendar from './calendar'
import VxeCard from './card'
import VxeCheckbox from './checkbox'
import VxeCheckboxGroup from './checkbox-group'
import VxeCol from './col'
import VxeCollapse from './collapse'
import VxeCollapsePane from './collapse-pane'
import VxeDateInput from './date-input'
import VxeDrawer from './drawer'
import VxeForm from './form'
import VxeFormDesign from './form-design'
import VxeFormGather from './form-gather'
import VxeFormItem from './form-item'
import VxeFormView from './form-view'
import VxeIcon from './icon'
import VxeInput from './input'
import VxeLayoutAside from './layout-aside'
import VxeLayoutBody from './layout-body'
import VxeLayoutContainer from './layout-container'
import VxeLayoutFooter from './layout-footer'
import VxeLayoutHeader from './layout-header'
import VxeListDesign from './list-design'
import VxeListView from './list-view'
import VxeList from './list'
import VxeLoading from './loading'
import VxeMenu from './menu'
import VxeModal from './modal'
import VxeNumberInput from './number-input'
import VxeOptgroup from './optgroup'
import VxeOption from './option'
import VxePager from './pager'
import VxePasswordInput from './password-input'
import VxePrint from './print'
import VxePulldown from './pulldown'
import VxeRadio from './radio'
import VxeRadioButton from './radio-button'
import VxeRadioGroup from './radio-group'
import VxeRow from './row'
import VxeSelect from './select'
import VxeSwitch from './switch'
import VxeTabPane from './tab-pane'
import VxeTabs from './tabs'
import VxeTextarea from './textarea'
import VxeTooltip from './tooltip'
import VxeTree from './tree'
import VxeTreeSelect from './tree-select'
import VxeUpload from './upload'

const components = [
  VxeAnchor,
  VxeAnchorLink,
  VxeBreadcrumb,
  VxeBreadcrumbItem,
  VxeButton,
  VxeButtonGroup,
  VxeCalendar,
  VxeCard,
  VxeCheckbox,
  VxeCheckboxGroup,
  VxeCol,
  VxeCollapse,
  VxeCollapsePane,
  VxeDateInput,
  VxeDrawer,
  VxeForm,
  VxeFormDesign,
  VxeFormGather,
  VxeFormItem,
  VxeFormView,
  VxeIcon,
  VxeInput,
  VxeLayoutAside,
  VxeLayoutBody,
  VxeLayoutContainer,
  VxeLayoutFooter,
  VxeLayoutHeader,
  VxeListDesign,
  VxeListView,
  VxeList,
  VxeLoading,
  VxeMenu,
  VxeModal,
  VxeNumberInput,
  VxeOptgroup,
  VxeOption,
  VxePager,
  VxePasswordInput,
  VxePrint,
  VxePulldown,
  VxeRadio,
  VxeRadioButton,
  VxeRadioGroup,
  VxeRow,
  VxeSelect,
  VxeSwitch,
  VxeTabPane,
  VxeTabs,
  VxeTextarea,
  VxeTooltip,
  VxeTree,
  VxeTreeSelect,
  VxeUpload
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
export * from './calendar'
export * from './card'
export * from './checkbox'
export * from './checkbox-group'
export * from './col'
export * from './collapse'
export * from './collapse-pane'
export * from './date-input'
export * from './drawer'
export * from './form'
export * from './form-design'
export * from './form-gather'
export * from './form-item'
export * from './form-view'
export * from './icon'
export * from './input'
export * from './layout-aside'
export * from './layout-body'
export * from './layout-container'
export * from './layout-footer'
export * from './layout-header'
export * from './list-design'
export * from './list-view'
export * from './list'
export * from './loading'
export * from './menu'
export * from './modal'
export * from './number-input'
export * from './optgroup'
export * from './option'
export * from './pager'
export * from './password-input'
export * from './print'
export * from './pulldown'
export * from './radio'
export * from './radio-button'
export * from './radio-group'
export * from './row'
export * from './select'
export * from './switch'
export * from './tab-pane'
export * from './tabs'
export * from './textarea'
export * from './tooltip'
export * from './tree'
export * from './tree-select'
export * from './upload'
