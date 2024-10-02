import * as VxeUIExport from './packages/components'
import './styles/all.scss'

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VxeUIExport)
}

export * from './packages/components'
export default VxeUIExport
