import Vue, { CreateElement } from 'vue'
import { VxeUI, renderEmptyElement } from '@vxe-ui/core'

import type { VxeModalDefines, VxeDrawerDefines, VxeLoadingProps, VxeWatermarkProps, VxeContextMenuProps, VxeContextMenuDefines } from '../../types'

let dynamicContainerElem: HTMLElement

export const DynamicApp = Vue.extend({
  data () {
    const modals: {
      key: number | string
      props: VxeModalDefines.ModalOptions
      on: Record<string, any>
    }[] = []
    const drawers: {
      key: number | string
      props: VxeDrawerDefines.DrawerOptions
      on: Record<string, any>
    }[] = []
    return {
      modals,
      drawers,
      globalLoading: null as null | VxeLoadingProps,
      globalWatermark: null as null | VxeWatermarkProps,
      globalContextMenu: null as null |(VxeContextMenuProps & VxeContextMenuDefines.ContextMenuOpenOptions)
    }
  },
  methods: {
    renderVN (h: CreateElement) {
      const VxeUIModalComponent = VxeUI.getComponent('vxe-modal')
      const VxeUIDrawerComponent = VxeUI.getComponent('vxe-drawer')
      const VxeUILoadingComponent = VxeUI.getComponent('vxe-loading')
      const VxeUIWatermarkComponent = VxeUI.getComponent('vxe-watermark')
      const VxeUIContextMenuComponent = VxeUI.getComponent('vxe-context-menu')

      const { modals, drawers, globalLoading, globalWatermark, globalContextMenu } = this
      let cmOns: {
        show: any
        hide: any
        'option-click': any
      } | undefined
      if (globalContextMenu) {
        const events = globalContextMenu.events || {}
        const { optionClick, show, hide } = events
        cmOns = {
          show (params: VxeContextMenuDefines.ShowEventParams) {
            const { $contextMenu } = params
            if (show) {
              show.call($contextMenu, params)
            }
          },
          hide (params: VxeContextMenuDefines.HideEventParams) {
            const { $contextMenu } = params
            if (hide) {
              hide.call($contextMenu, params)
            }
            dynamicStore.globalContextMenu = null
          },
          'option-click' (params: VxeContextMenuDefines.OptionClickEventParams) {
            const { $contextMenu } = params
            if (optionClick) {
              optionClick.call($contextMenu, params)
            }
          }
        }
      }
      return h('div', {}, [
        modals.length
          ? h('div', {
            key: 1,
            class: 'vxe-dynamics--modal'
          }, modals.map((item) => h(VxeUIModalComponent, {
            key: item.key,
            props: item.props,
            on: item.on
          })))
          : renderEmptyElement(this),
        drawers.length
          ? h('div', {
            key: 2,
            class: 'vxe-dynamics--drawer'
          }, drawers.map((item) => h(VxeUIDrawerComponent, {
            key: item.key,
            props: item.props,
            on: item.on
          })))
          : renderEmptyElement(this),
        globalWatermark
          ? h(VxeUIWatermarkComponent, {
            key: 'gw',
            props: globalWatermark
          })
          : renderEmptyElement(this),
        globalLoading
          ? h(VxeUILoadingComponent, {
            key: 'gl',
            props: globalLoading
          })
          : renderEmptyElement(this),
        globalContextMenu
          ? h(VxeUIContextMenuComponent, {
            key: 'cm',
            props: globalContextMenu,
            on: cmOns
          })
          : renderEmptyElement(this)
      ])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})

export const dynamicApp = DynamicApp
export const dynamicStore = new DynamicApp()

export function checkDynamic () {
  if (!dynamicContainerElem) {
    dynamicContainerElem = document.createElement('div')
    dynamicContainerElem.className = 'vxe-dynamics'
    document.body.appendChild(dynamicContainerElem)
    dynamicStore.$mount(dynamicContainerElem)
  }
}
