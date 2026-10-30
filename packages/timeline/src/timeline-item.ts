import { CreateElement, VNode, PropType } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI } from '@vxe-ui/core'
import { createTimelineItem, watchTimelineItem, assembleTimelineItem, destroyTimelineItem } from './util'
import { TimelineItemInfo } from './timeline-info'

import type { VxeTimelineInstance, VxeTimelineItemPropTypes, VxeComponentSizeType } from '../../../types'

const { globalMixins } = VxeUI

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeTimelineItem',
  mixins: [globalMixins.sizeMixin],
  props: {
    title: [String, Number] as PropType<VxeTimelineItemPropTypes.Title>,
    content: [String, Number] as PropType<VxeTimelineItemPropTypes.Content>
  },
  inject: {
    $xeTimeline: {
      default: null
    }
  },
  data() {
    const itemConfig = {} as TimelineItemInfo
    return {
      xID: XEUtils.uniqueId(),
      itemConfig
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
      $xeTimeline(): VxeTimelineInstance
    })
  },
  methods: {
    //
    // Render
    //
    renderVN(h: CreateElement): VNode {
      return h('div', {
        ref: 'refElem'
      })
    }
  },
  created() {
    const $xeTimelineItem = this
    const props = $xeTimelineItem
    const $xeTimeline = $xeTimelineItem.$xeTimeline

    const itemConfig = createTimelineItem($xeTimeline, props)
    $xeTimelineItem.itemConfig = itemConfig

    watchTimelineItem($xeTimelineItem, itemConfig)
  },
  mounted() {
    const $xeTimelineItem = this
    const slots = $xeTimelineItem.$scopedSlots
    const itemConfig = $xeTimelineItem.itemConfig
    const $xeTimeline = $xeTimelineItem.$xeTimeline

    itemConfig.slots = slots
    const el = $xeTimelineItem.$refs.refElem as HTMLDivElement
    assembleTimelineItem($xeTimeline, el, itemConfig)
  },
  beforeDestroy() {
    const $xeTimelineItem = this
    const itemConfig = $xeTimelineItem.itemConfig
    const $xeTimeline = $xeTimelineItem.$xeTimeline

    destroyTimelineItem($xeTimeline, itemConfig)
  },
  render(this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
