import { CreateElement, VNode, PropType } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getI18n, getIcon, createEvent } from '../../ui'

import type { EmptyReactData, VxeEmptyEmits, ValueOf, VxeEmptyPropTypes } from '../../../types'

export default defineVxeComponent({
  name: 'VxeEmpty',
  props: {
    imageUrl: String as PropType<VxeEmptyPropTypes.ImageUrl>,
    imageStyle: Object as PropType<VxeEmptyPropTypes.ImageStyle>,
    icon: String as PropType<VxeEmptyPropTypes.Icon>,
    content: [String, Number] as PropType<VxeEmptyPropTypes.Content>
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: EmptyReactData = {
    }
    return {
      xID,
      reactData
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeEmptyEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeEmpty = this
      $xeEmpty.$emit(type, createEvent(evnt, { $empty: $xeEmpty }, params))
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeEmpty = this
      const props = $xeEmpty

      const { imageUrl, imageStyle, icon, content } = props
      return h('div', {
        ref: 'refElem',
        class: 'vxe-empty'
      }, [
        h('div', {
          class: 'vxe-empty--inner'
        }, [
          imageUrl
            ? h('div', {
              class: 'vxe-empty--img-wrapper'
            }, [
              h('img', {
                attrs: {
                  src: imageUrl
                },
                style: imageStyle
              })
            ])
            : h('div', {
              class: 'vxe-empty--icon-wrapper'
            }, [
              h('i', {
                class: icon || getIcon().EMPTY_DEFAULT
              })
            ]),
          h('div', {
            class: 'vxe-empty--content-wrapper'
          }, `${content || getI18n('vxe.empty.defText')}`)
        ])
      ])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
