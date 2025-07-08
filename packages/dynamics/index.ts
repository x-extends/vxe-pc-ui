import { h, createApp, reactive, createCommentVNode } from 'vue'
import { defineVxeComponent } from '../ui/src/comp'
import { VxeUI } from '@vxe-ui/core'

import type { VxeModalDefines, VxeDrawerDefines, VxeLoadingProps, VxeWatermarkProps } from '../../types'

let dynamicContainerElem: HTMLElement

export const dynamicStore = reactive<{
  modals: VxeModalDefines.ModalOptions[]
  drawers: VxeDrawerDefines.DrawerOptions[]
  globalLoading: null | VxeLoadingProps
  globalWatermark: null | VxeWatermarkProps
}>({
  modals: [],
  drawers: [],
  globalLoading: null,
  globalWatermark: null
})

/**
 * 动态组件
 */
const VxeDynamics = defineVxeComponent({
  setup () {
    const VxeUIModalComponent = VxeUI.getComponent('vxe-modal')
    const VxeUIDrawerComponent = VxeUI.getComponent('vxe-drawer')
    const VxeUILoadingComponent = VxeUI.getComponent('vxe-loading')
    const VxeUIWatermarkComponent = VxeUI.getComponent('vxe-watermark')

    return () => {
      const { modals, drawers, globalWatermark, globalLoading } = dynamicStore
      return [
        modals.length
          ? h('div', {
            key: 1,
            class: 'vxe-dynamics--modal'
          }, modals.map((item) => h(VxeUIModalComponent, item)))
          : createCommentVNode(),
        drawers.length
          ? h('div', {
            key: 2,
            class: 'vxe-dynamics--drawer'
          }, drawers.map((item) => h(VxeUIDrawerComponent, item)))
          : createCommentVNode(),
        globalWatermark ? h(VxeUIWatermarkComponent, globalWatermark) : createCommentVNode(),
        globalLoading ? h(VxeUILoadingComponent, globalLoading) : createCommentVNode()
      ]
    }
  }
})

export const dynamicApp = createApp(VxeDynamics)

export function checkDynamic () {
  if (!dynamicContainerElem) {
    dynamicContainerElem = document.createElement('div')
    dynamicContainerElem.className = 'vxe-dynamics'
    document.body.appendChild(dynamicContainerElem)
    dynamicApp.mount(dynamicContainerElem)
  }
}
