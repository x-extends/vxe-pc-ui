import globalConfigStore from './globalStore'

import { VxeGlobalConfig } from '../../../types'

export default function setTheme (options?: VxeGlobalConfig) {
  const theme = (options ? options.theme : null) || globalConfigStore.theme || 'default'
  if (typeof document !== 'undefined') {
    const documentElement = document.documentElement
    if (documentElement) {
      documentElement.setAttribute('data-vxe-ui-theme', theme)
    }
  }
}
