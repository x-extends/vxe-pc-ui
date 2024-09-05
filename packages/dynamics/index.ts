import XEUtils from 'xe-utils'
import Vue, { PropType, CreateElement } from 'vue'
import { renderEmptyElement } from '@vxe-ui/core'

import type { VxeModalDefines, VxeDrawerListeners, VxeModalListeners, VxeDrawerDefines, VxeLoadingProps } from '../../types'

let dynamicContainerElem: HTMLElement

function parseCompConf (item: any) {
  const props: Record<string, any> = {}
  const events: Record<string, any> = {}
  XEUtils.each(item, (val, key) => {
    if (/^on/.test(key)) {
      events[XEUtils.kebabCase(key).replace('on-', '')] = val
    } else {
      props[key] = val
    }
  })
  return {
    key: item.key,
    props,
    events
  }
}

export const dynamicApp = new Vue({
  props: {
    modals: Array as PropType<{
      props: VxeModalDefines.ModalOptions
      events: VxeModalListeners
    }[]>,
    drawers: Array as PropType<{
      props: VxeDrawerDefines.DrawerOptions
      events: VxeDrawerListeners
    }[]>,
    globalLoading: Object as PropType<null | VxeLoadingProps>
  },
  computed: {
    computeModelList () {
      const { modals } = this
      if (modals) {
        return modals.map(parseCompConf)
      }
      return []
    },
    computeDrawerList () {
      const { drawers } = this
      if (drawers) {
        return drawers.map(parseCompConf)
      }
      return []
    }
  },
  methods: {
    renderVN (h: CreateElement) {
      const { computeModelList, computeDrawerList, globalLoading } = this
      return h('div', {}, [
        computeModelList.length
          ? h('div', {
            class: 'vxe-dynamics--modal'
          }, computeModelList.map((item) => h('vxe-modal', item)))
          : renderEmptyElement(this),
        computeDrawerList.length
          ? h('div', {
            class: 'vxe-dynamics--drawer'
          }, computeDrawerList.map((item) => h('vxe-drawer', item)))
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

export function checkDynamic () {
  if (!dynamicContainerElem) {
    dynamicContainerElem = document.createElement('div')
    dynamicContainerElem.className = 'vxe-dynamics'
    document.body.appendChild(dynamicContainerElem)
    dynamicApp.$mount(dynamicContainerElem)
  }
}
