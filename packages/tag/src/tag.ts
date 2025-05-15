import { defineComponent, ref, h, reactive, PropType } from 'vue'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, useSize, renderEmptyElement } from '../../ui'
import { getSlotVNs } from '../../ui/src/vn'

import type { VxeTagPropTypes, TagReactData, TagPrivateRef, VxeTagEmits, VxeTagPrivateComputed, TagMethods, TagPrivateMethods, VxeTagConstructor, VxeTagPrivateMethods, ValueOf } from '../../../types'

export default defineComponent({
  name: 'VxeTag',
  props: {
    status: String as PropType<VxeTagPropTypes.Status>,
    title: [String, Number] as PropType<VxeTagPropTypes.Title>,
    icon: String as PropType<VxeTagPropTypes.Icon>,
    content: [String, Number] as PropType<VxeTagPropTypes.Content>,
    size: {
      type: String as PropType<VxeTagPropTypes.Size>,
      default: () => getConfig().tag.size || getConfig().size
    }
  },
  emits: [
    'click'
  ] as VxeTagEmits,
  setup (props, context) {
    const { slots, emit } = context

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<TagReactData>({
    })

    const refMaps: TagPrivateRef = {
      refElem
    }

    const computeMaps: VxeTagPrivateComputed = {
    }

    const $xeTag = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeTagConstructor & VxeTagPrivateMethods

    const dispatchEvent = (type: ValueOf<VxeTagEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $tag: $xeTag }, params))
    }

    const tagMethods: TagMethods = {
      dispatchEvent
    }

    const tagPrivateMethods: TagPrivateMethods = {
    }

    const clickEvent = (evnt: MouseEvent) => {
      dispatchEvent('click', {}, evnt)
    }

    Object.assign($xeTag, tagMethods, tagPrivateMethods)

    const renderContent = () => {
      const { icon, content } = props
      const defaultSlot = slots.default
      const iconSlot = slots.icon
      return [
        iconSlot || icon
          ? h('span', {
            class: 'vxe-tag--icon'
          }, iconSlot
            ? getSlotVNs(iconSlot({}))
            : [
                h('i', {
                  class: icon
                })
              ])
          : renderEmptyElement($xeTag),
        h('span', {
          class: 'vxe-tag--content'
        }, defaultSlot ? defaultSlot({}) : XEUtils.toValueString(content))
      ]
    }

    const renderVN = () => {
      const { status, title } = props
      const vSize = computeSize.value
      return h('span', {
        ref: refElem,
        class: ['vxe-tag', {
          [`size--${vSize}`]: vSize,
          [`theme--${status}`]: status
        }],
        title,
        onClick: clickEvent
      }, renderContent())
    }

    $xeTag.renderVN = renderVN

    return $xeTag
  },
  render () {
    return this.renderVN()
  }
})
