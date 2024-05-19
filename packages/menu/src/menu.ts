import { defineComponent, ref, h, reactive } from 'vue'
import XEUtils from 'xe-utils'

import { MenuReactData, VxeMenuEmits, MenuPrivateRef, VxeMenuPrivateComputed, VxeMenuConstructor, VxeMenuPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeMenu',
  props: {
  },
  emits: [
  ] as VxeMenuEmits,
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<MenuReactData>({
    })

    const refMaps: MenuPrivateRef = {
      refElem
    }

    const computeMaps: VxeMenuPrivateComputed = {
    }

    const $xeMenu = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeMenuConstructor & VxeMenuPrivateMethods

    const renderVN = () => {
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: ['vxe-menu']
      }, defaultSlot ? defaultSlot({}) : [])
    }

    $xeMenu.renderVN = renderVN

    return $xeMenu
  },
  render () {
    return this.renderVN()
  }
})
