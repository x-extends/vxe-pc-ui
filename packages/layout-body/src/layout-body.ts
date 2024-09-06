import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { getConfig, createEvent, globalMixins } from '../../ui'
import VxeLoadingComponent from '../../loading/src/loading'
import XEUtils from 'xe-utils'

import type { VxeLayoutBodyPropTypes, LayoutBodyReactData, VxeLayoutBodyEmits, VxeComponentSizeType, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxeLayoutBody',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    loading: Boolean as PropType<VxeLayoutBodyPropTypes.Loading>,
    padding: Boolean as PropType<VxeLayoutBodyPropTypes.Padding>,
    size: {
      type: String as PropType<VxeLayoutBodyPropTypes.Size>,
      default: () => getConfig().layoutBody.size || getConfig().size
    }
  },
  data () {
    const reactData: LayoutBodyReactData = {
    }
    return {
      xID: XEUtils.uniqueId(),
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
    })
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeLayoutBodyEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeLayoutBody = this
      $xeLayoutBody.$emit(type, createEvent(evnt, { $layoutBody: $xeLayoutBody }, params))
    },
    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeLayoutBody = this
      const slots = $xeLayoutBody.$scopedSlots
      const { loading, padding } = $xeLayoutBody
      const vSize = $xeLayoutBody.computeSize
      const defaultSlot = slots.default

      return h('div', {
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
          props: {
            value: loading
          }
        })
      ])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
