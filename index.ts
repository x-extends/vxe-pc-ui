import * as VxeUIExport from './packages/components'
import './styles/all.scss'

if (typeof window !== 'undefined') {
  if ((window as any).VxeUI && !(window as any).VxeUIAll) {
    (window as any).VxeUIAll = VxeUIExport
  }
}

export * from './packages/components'
export default VxeUIExport
