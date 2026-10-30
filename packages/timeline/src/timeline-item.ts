import { ref, h, inject, PropType, onMounted, onUnmounted } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { createTimelineItem, watchTimelineItem, assembleTimelineItem, destroyTimelineItem } from './util'

import type { VxeTimelineConstructor, VxeTimelineItemPropTypes } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeTimelineItem',
  props: {
    title: [String, Number] as PropType<VxeTimelineItemPropTypes.Title>,
    content: [String, Number] as PropType<VxeTimelineItemPropTypes.Content>
  },
  setup(props, context) {
    const { slots } = context

    const refElem = ref<HTMLDivElement>()
    const $xeTimeline = inject('$xeTimeline', {} as VxeTimelineConstructor)
    const itemConfig = createTimelineItem($xeTimeline, props)
    itemConfig.slots = slots

    watchTimelineItem(props, itemConfig)

    onMounted(() => {
      const el = refElem.value
      if (el) {
        assembleTimelineItem($xeTimeline, el, itemConfig)
      }
    })

    onUnmounted(() => {
      destroyTimelineItem($xeTimeline, itemConfig)
    })

    return () => {
      return h('div', {
        ref: refElem
      })
    }
  }
}) /* define-vxe-component end */
