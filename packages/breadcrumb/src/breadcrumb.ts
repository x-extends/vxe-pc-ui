import { defineComponent, ref, h, reactive, provide, PropType } from 'vue'
import { getConfig } from '@vxe-ui/core'
import XEUtils from 'xe-utils'

import { VxeBreadcrumbPropTypes, BreadcrumbReactData, BreadcrumbPrivateRef, VxeBreadcrumbPrivateComputed, VxeBreadcrumbConstructor, VxeBreadcrumbPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeBreadcrumb',
  props: {
    separator: {
      type: String as PropType<VxeBreadcrumbPropTypes.Separator>,
      default: () => getConfig().breadcrumb.separator
    }
  },
  emits: [],
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<BreadcrumbReactData>({
    })

    const refMaps: BreadcrumbPrivateRef = {
      refElem
    }

    const computeMaps: VxeBreadcrumbPrivateComputed = {
    }

    const $xeBreadcrumb = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeBreadcrumbConstructor & VxeBreadcrumbPrivateMethods

    const renderVN = () => {
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: 'vxe-breadcrumb'
      }, defaultSlot ? defaultSlot({}) : [])
    }

    $xeBreadcrumb.renderVN = renderVN

    provide('$xeBreadcrumb', $xeBreadcrumb)

    return $xeBreadcrumb
  },
  render () {
    return this.renderVN()
  }
})
