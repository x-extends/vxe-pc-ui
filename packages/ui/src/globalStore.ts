import { VxeGlobalConfig } from '../../../types'

const globalConfigStore: VxeGlobalConfig = {
  button: {},
  breadcrumb: {
    separator: '/'
  },
  i18n: (key: string) => key
}

export default globalConfigStore
