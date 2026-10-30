import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI } from '@vxe-ui/core'
import { getText } from '../../ui/src/utils'

import type { VxeTimelinePropTypes, TimelineReactData, TimelineInternalData, VxeTimelineEmits, VxeComponentSizeType, ValueOf } from '../../../types'

const { getConfig, globalMixins, createEvent } = VxeUI

function createInternalData(): TimelineInternalData {
  return {
    fullData: []
  }
}

function createReactData(): TimelineReactData {
  return {
    itemList: [],
    staticItems: [],
    isOptConf: false
  }
}

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeTimeline',
  mixins: [globalMixins.sizeMixin],
  props: {
    size: {
      type: String as PropType<VxeTimelinePropTypes.Size>,
      default: () => getConfig().timeline.size || getConfig().size
    },
    options: Array as PropType<VxeTimelinePropTypes.Options>,
    reverse: {
      type: Boolean as PropType<VxeTimelinePropTypes.Reverse>,
      default: () => getConfig().timeline.reverse
    },
    vertical: {
      type: Boolean as PropType<VxeTimelinePropTypes.Vertical>,
      default: () => getConfig().timeline.vertical
    },
    optionProps: Object as PropType<VxeTimelinePropTypes.OptionProps>
  },
  provide() {
    const $xeTimeline = this
    return {
      $xeTimeline
    }
  },
  data() {
    const xID = XEUtils.uniqueId()
    const reactData = createReactData()

    return {
      ...({} as {
        internalData: TimelineInternalData
      }),
      xID,
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
    }),
    computePropsOpts () {
      const $xeTimeline = this
      const props = $xeTimeline

      return Object.assign({}, getConfig().timeline.optionProps, props.optionProps)
    },
    computeTitleField () {
      const $xeTimeline = this

      const propsOpts = $xeTimeline.computePropsOpts as VxeTimelinePropTypes.OptionProps
      return propsOpts.title || 'title'
    },
    computeContentField () {
      const $xeTimeline = this

      const propsOpts = $xeTimeline.computePropsOpts as VxeTimelinePropTypes.OptionProps
      return propsOpts.content || 'content'
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent(type: ValueOf<VxeTimelineEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeTimeline = this
      $xeTimeline.$emit(type, createEvent(evnt, { $timeline: $xeTimeline }, params))
    },
    loadData (opts: any[], isOptConf: boolean) {
      const $xeTimeline = this
      const reactData = $xeTimeline.reactData
      const internalData = $xeTimeline.internalData

      reactData.isOptConf = isOptConf
      internalData.fullData = opts || []
      $xeTimeline.updateItems()
    },
    updateItems () {
      const $xeTimeline = this
      const props = $xeTimeline
      const reactData = $xeTimeline.reactData
      const internalData = $xeTimeline.internalData

      const { reverse } = props
      const { fullData } = internalData
      reactData.itemList = reverse ? fullData.slice(0).reverse() : fullData.slice(0)
    },

    //
    // Render
    //
    renderItem (h: CreateElement, item: any, index: number) {
      const $xeTimeline = this
      const reactData = $xeTimeline.reactData
      const slots = $xeTimeline.$scopedSlots

      const { itemList, isOptConf } = reactData
      const titleField = $xeTimeline.computeTitleField
      const contentField = $xeTimeline.computeContentField
      const titleVal = getText(isOptConf ? item[titleField] : item.title)
      const contentVal = getText(isOptConf ? item[contentField] : item.content)
      const titleSlot = slots.title
      const contentSlot = slots.content
      return h('div', {
        key: index,
        class: ['vxe-timeline--item', {
          'is--last': index === itemList.length - 1
        }]
      }, [
        h('div', {
          class: 'vxe-timeline--item-line'
        }),
        h('div', {
          class: 'vxe-timeline--item-node'
        }),
        h('div', {
          class: 'vxe-timeline--item-wrapper'
        }, [
          h('div', {
            class: 'vxe-timeline--item-title'
          }, titleSlot ? titleSlot({ item }) : titleVal),
          h('div', {
            class: 'vxe-timeline--item-content'
          }, contentSlot ? contentSlot({ item }) : contentVal)
        ])
      ]
      )
    },
    renderVN(h: CreateElement): VNode {
      const $xeTimeline = this
      const props = $xeTimeline
      const reactData = $xeTimeline.reactData
      const slots = $xeTimeline.$scopedSlots

      const { vertical } = props
      const { itemList } = reactData
      const vSize = $xeTimeline.computeSize
      const defaultSlot = slots.default
      return h('div', {
        ref: 'refElem',
        class: ['vxe-timeline', {
          [`size--${vSize}`]: vSize,
          'is--vertical': vertical,
          'is--horizontal': !vertical
        }]
      },
      [
        h('div', {
          class: 'vxe-timeline--slots'
        }, defaultSlot ? defaultSlot({}) : []),
        h('div', {
          class: 'vxe-timeline--body'
        }, itemList.map((item, index) => $xeTimeline.renderItem(h, item, index)))
      ])
    }
  },
  watch: {
    'reactData.staticItems' (val: any) {
      const $xeTimeline = this

      $xeTimeline.loadData(val, false)
    },
    options (val: any) {
      const $xeTimeline = this

      $xeTimeline.loadData(val || [], true)
    },
    reverse () {
      const $xeTimeline = this

      $xeTimeline.updateItems()
    }
  },
  created() {
    const $xeTimeline = this

    $xeTimeline.internalData = createInternalData()
  },
  mounted() {
    const $xeTimeline = this
    const props = $xeTimeline
    const reactData = $xeTimeline.reactData

    const { staticItems } = reactData
    if (staticItems.length) {
      $xeTimeline.loadData(staticItems, false)
    } else {
      $xeTimeline.loadData(props.options || [], true)
    }
  },
  destroyed() {
    const $xeTimeline = this
    const reactData = $xeTimeline.reactData
    const internalData = $xeTimeline.internalData

    XEUtils.assign(reactData, createReactData())
    XEUtils.assign(internalData, createInternalData())
  },
  render(this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
