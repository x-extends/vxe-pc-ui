import * as VxeUIExport from './packages/components'
import './styles/all.scss'

// 自动安装
if (typeof window !== 'undefined') {
  // 兼容旧版本
  if (!(window as any).VxeUIAll) {
    (window as any).VxeUIAll = VxeUIExport
  }
  if (!(window as any).VxeUIBase) {
    (window as any).VxeUIBase = VxeUIExport
  }
  if (!(window as any).VxeUI) {
    (window as any).VxeUI = VxeUIExport
  }
  if (window.Vue) {
    window.Vue.use(VxeUIExport)
  }
}

export * from './packages/components'
export default VxeUIExport
