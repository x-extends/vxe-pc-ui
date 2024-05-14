import { VxeGlobalConfig } from '../../../types'

const globalConfigStore: Required<VxeGlobalConfig> = {
  size: '',
  theme: '',
  version: 1,
  zIndex: 999,
  emptyCell: '　',
  loadingText: '',

  i18n: (key: string) => key,

  button: {},
  breadcrumb: {
    separator: '/'
  },
  form: {},
  formDesign: {},
  tooltip: {},
  modal: {}
}

export default globalConfigStore
