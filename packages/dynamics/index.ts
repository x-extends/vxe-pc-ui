import { defineComponent, h, createApp, reactive, createCommentVNode } from 'vue'
import { VxeUI } from '@vxe-ui/core'

import type { VxeModalDefines, VxeModalComponent, VxeLoadingComponent, VxeDrawerDefines, VxeLoadingProps, VxeDrawerComponent } from '../../types'

let dynamicContainerElem: HTMLElement

export const dynamicStore = reactive<{
  modals: VxeModalDefines.ModalOptions[]
  drawers: VxeDrawerDefines.DrawerOptions[]
  globalLoading: null | VxeLoadingProps
}>({
  modals: [],
  drawers: [],
  globalLoading: null
})

/**
 * 动态组件
 */
const VxeDynamics = defineComponent({
  setup () {
    const VxeUIModalComponent = VxeUI.getComponent<VxeModalComponent>('VxeModal')
    const VxeUIDrawerComponent = VxeUI.getComponent<VxeDrawerComponent>('VxeDrawer')
    const VxeUILoadingComponent = VxeUI.getComponent<VxeLoadingComponent>('VxeTooltip')

    return () => {
      const { modals, drawers, globalLoading } = dynamicStore
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
