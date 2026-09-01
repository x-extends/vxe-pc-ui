import { h, createApp, reactive, createCommentVNode, ref } from 'vue'
import { defineVxeComponent } from '../ui/src/comp'
import { VxeUI } from '@vxe-ui/core'

import type { VxeModalDefines, VxeDrawerDefines, VxeLoadingProps, VxeWatermarkProps, VxeContextMenuProps, VxeContextMenuDefines, VxeContextMenuEventProps, VxeTooltipInstance, TooltipPrivateMethods, VxeTooltipProps } from '../../types'

let dynamicContainerElem: HTMLElement

export const refTooltip = ref<VxeTooltipInstance & TooltipPrivateMethods>()

interface DynamicStoreData {
  modals: VxeModalDefines.ModalOptions[]
  drawers: VxeDrawerDefines.DrawerOptions[]
  globalLoading: VxeLoadingProps | null
  globalWatermark: VxeWatermarkProps | null
  globalContextMenu:|(VxeContextMenuProps & VxeContextMenuDefines.ContextMenuOpenOptions) | null
  globalTooltip: VxeTooltipProps | null
  isTipInit: boolean
}

export const dynamicStore = reactive<DynamicStoreData>({
  modals: [],
  drawers: [],
  globalLoading: null,
  globalWatermark: null,
  globalContextMenu: null,
  globalTooltip: null,
  isTipInit: false
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
    const VxeUIContextMenuComponent = VxeUI.getComponent('vxe-context-menu')
    const VxeUITooltipComponent = VxeUI.getComponent('vxe-tooltip')

    return () => {
      const { modals, drawers, globalWatermark, globalLoading, globalContextMenu, globalTooltip } = dynamicStore

      let cmOpts: (VxeContextMenuProps & VxeContextMenuEventProps) | null = globalContextMenu
      if (globalContextMenu) {
        const events = globalContextMenu.events || {}
        const { optionClick, show, hide } = events
        cmOpts = Object.assign({}, globalContextMenu, {
          key: 'cm',
          onShow (params: VxeContextMenuDefines.ShowEventParams) {
            if (show) {
              show(params)
            }
          },
          onHide (params: VxeContextMenuDefines.HideEventParams) {
            if (hide) {
              hide(params)
            }
            dynamicStore.globalContextMenu = null
          },
          onOptionClick (params: VxeContextMenuDefines.OptionClickEventParams) {
            if (optionClick) {
              optionClick(params)
            }
          }
        }, { events: undefined })
      }

      let tpOpts = globalTooltip || {}
      if (globalTooltip) {
        tpOpts = Object.assign({}, globalTooltip, {
          'onUpdate:modelValue' (value: boolean) {
            globalTooltip.modelValue = value
          }
        })
      }

      return [
        modals.length
          ? h('div', {
            key: 'ml',
            class: 'vxe-dynamics--modal'
          }, modals.map((item) => h(VxeUIModalComponent, item)))
          : createCommentVNode(),
        drawers.length
          ? h('div', {
            key: 'dr',
            class: 'vxe-dynamics--drawer'
          }, drawers.map((item) => h(VxeUIDrawerComponent, item)))
          : createCommentVNode(),
        globalWatermark
          ? h(VxeUIWatermarkComponent, globalWatermark)
          : createCommentVNode(),
        globalLoading
          ? h(VxeUILoadingComponent, globalLoading)
          : createCommentVNode(),
        globalContextMenu ? h(VxeUIContextMenuComponent, cmOpts) : createCommentVNode(),
        dynamicStore.isTipInit
          ? h(VxeUITooltipComponent, { ref: refTooltip, ...tpOpts })
          : createCommentVNode()
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
