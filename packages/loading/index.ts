import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeLoadingComponent from './src/loading'
import { dynamicApp, checkDynamic } from '../dynamics'

import type { VxeLoadingProps } from '../../types'

export const VxeLoading = Object.assign({}, VxeLoadingComponent, {
  install (app: VueConstructor) {
    app.component(VxeLoadingComponent.name as string, VxeLoadingComponent)
  }
})

export const LoadingController = {
  open (options?: VxeLoadingProps) {
    const opts = Object.assign({}, options)
    dynamicApp.globalLoading = {
      value: true,
      text: opts.text,
      icon: opts.icon
    }
    checkDynamic()
  },
  close () {
    dynamicApp.globalLoading = null
  }
}

VxeUI.component(VxeLoadingComponent)
VxeUI.loading = LoadingController

export const Loading = VxeLoading
export default VxeLoading
