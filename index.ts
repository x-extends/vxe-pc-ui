import * as VxeUIExport from './packages/components'
import './styles/all.scss'

if (typeof window !== 'undefined') {
  if ((window as any).Vue) {
    // 兼容旧版本
    if (!(window as any).VxeUIAll) {
      (window as any).VxeUIAll = VxeUIExport
    }
    if (!(window as any).VxeUIBase) {
      (window as any).VxeUIBase = VxeUIExport
    }
  }
}

export * from './packages/components'
export default VxeUIExport
