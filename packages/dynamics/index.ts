import Vue, { CreateElement } from 'vue'
import { renderEmptyElement } from '@vxe-ui/core'

import type { VxeModalDefines, VxeDrawerDefines, VxeLoadingProps, VxeWatermarkProps } from '../../types'

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
      globalWatermark: null as null | VxeWatermarkProps
    }
  },
  methods: {
    renderVN (h: CreateElement) {
      const { modals, drawers, globalLoading, globalWatermark } = this
      return h('div', {}, [
        modals.length
          ? h('div', {
            key: 1,
            class: 'vxe-dynamics--modal'
          }, modals.map((item) => h('vxe-modal', {
            key: item.key,
            props: item.props,
            on: item.on
          })))
          : renderEmptyElement(this),
        drawers.length
          ? h('div', {
            key: 2,
            class: 'vxe-dynamics--drawer'
          }, drawers.map((item) => h('vxe-drawer', {
            key: item.key,
            props: item.props,
            on: item.on
          })))
          : renderEmptyElement(this),
        globalWatermark
          ? h('vxe-watermark', {
            key: 'gw',
            props: globalWatermark
          })
          : renderEmptyElement(this),
        globalLoading
          ? h('vxe-loading', {
            key: 'gl',
            props: globalLoading
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
