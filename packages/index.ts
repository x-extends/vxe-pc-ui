import * as VxeUIExport from './components'

// 自动安装
if (typeof window !== 'undefined') {
  // 兼容旧版本
  if (window.VxeUI) {
    if (!(window as any).VxeUIAll) {
      ;(window as any).VxeUIAll = VxeUIExport
    }
    if (!(window as any).VxeUIBase) {
      ;(window as any).VxeUIBase = VxeUIExport
    }
  }
  if (window.Vue) {
    window.Vue.use(VxeUIExport)
  }
}

export * from './components'

/**
 * A vue based PC component library
 */
export default VxeUIExport
