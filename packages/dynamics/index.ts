import { defineComponent, h, createApp, resolveComponent, reactive, createCommentVNode } from 'vue'

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
    return () => {
      const { modals, drawers, globalLoading } = dynamicStore
      return [
        modals.length
          ? h('div', {
            class: 'vxe-dynamics--modal'
          }, modals.map((item) => h(resolveComponent('vxe-modal') as VxeModalComponent, item)))
          : createCommentVNode(),
        drawers.length
          ? h('div', {
            class: 'vxe-dynamics--drawer'
          }, drawers.map((item) => h(resolveComponent('vxe-drawer') as VxeDrawerComponent, item)))
          : createCommentVNode(),
        globalLoading ? h(resolveComponent('vxe-loading') as VxeLoadingComponent, globalLoading) : createCommentVNode()
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
