import { ref, h, reactive, PropType } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { getConfig, useSize, createEvent } from '../../ui'
import VxeLoadingComponent from '../../loading/src/loading'
import XEUtils from 'xe-utils'

import type { VxeLayoutBodyPropTypes, LayoutBodyReactData, LayoutBodyPrivateRef, VxeLayoutBodyEmits, LayoutBodyMethods, LayoutBodyPrivateMethods, VxeLayoutBodyPrivateComputed, VxeLayoutBodyConstructor, VxeLayoutBodyPrivateMethods, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxeLayoutBody',
  props: {
    loading: Boolean as PropType<VxeLayoutBodyPropTypes.Loading>,
    padding: Boolean as PropType<VxeLayoutBodyPropTypes.Padding>,
    size: {
      type: String as PropType<VxeLayoutBodyPropTypes.Size>,
      default: () => getConfig().layoutBody.size || getConfig().size
    }
  },
  emits: [],
  setup (props, context) {
    const { slots, emit } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const { computeSize } = useSize(props)

    const reactData = reactive<LayoutBodyReactData>({
    })

    const refMaps: LayoutBodyPrivateRef = {
      refElem
    }

    const computeMaps: VxeLayoutBodyPrivateComputed = {
      computeSize
    }

    const $xeLayoutBody = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeLayoutBodyConstructor & VxeLayoutBodyPrivateMethods

    const dispatchEvent = (type: ValueOf<VxeLayoutBodyEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $layoutBody: $xeLayoutBody }, params))
    }

    const layoutBodyMethods: LayoutBodyMethods = {
      dispatchEvent
    }

    const layoutBodyPrivateMethods: LayoutBodyPrivateMethods = {
    }

    Object.assign($xeLayoutBody, layoutBodyMethods, layoutBodyPrivateMethods)

    const renderVN = () => {
      const { loading, padding } = props
      const vSize = computeSize.value
      const defaultSlot = slots.default

      return h('div', {
        ref: refElem,
        class: ['vxe-layout-body', {
          [`size--${vSize}`]: vSize,
          'is--loading': loading,
          'is--padding': padding
        }]
      }, [
        h('div', {
          class: 'vxe-layout-body--inner'
        }, defaultSlot ? defaultSlot({}) : []),
        /**
         * 加载中
         */
        h(VxeLoadingComponent, {
          class: 'vxe-list-view--loading',
          modelValue: loading
        })
      ])
    }

    $xeLayoutBody.renderVN = renderVN

    return $xeLayoutBody
  },
  render () {
    return this.renderVN()
  }
})
