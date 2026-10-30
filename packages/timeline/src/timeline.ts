import { ref, h, reactive, PropType, computed, watch, provide, onMounted, onBeforeUnmount } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI } from '@vxe-ui/core'
import { getText } from '../../ui/src/utils'

import type { TimelineReactData, TimelineInternalData, VxeTimelineEmits, VxeTimelinePropTypes, TimelineMethods, TimelinePrivateMethods, TimelinePrivateRef, TimelinePrivateComputed, VxeTimelineConstructor, VxeTimelinePrivateMethods, ValueOf } from '../../../types'

const { getConfig, useFns, createEvent } = VxeUI

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
  emits: [] as VxeTimelineEmits,
  setup(props, context) {
    const { slots, emit } = context

    const xID = XEUtils.uniqueId()

    const { computeSize } = useFns.useSize(props)

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive(createReactData())
    const internalData = createInternalData()

    const refMaps: TimelinePrivateRef = {
      refElem
    }

    const computeMaps: TimelinePrivateComputed = {}

    const $xeTimeline = {
      xID,
      props,
      context,
      reactData,
      internalData,
      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeTimelineConstructor & VxeTimelinePrivateMethods

    const computePropsOpts = computed(() => {
      return Object.assign({}, getConfig().timeline.optionProps, props.optionProps)
    })

    const computeTitleField = computed(() => {
      const propsOpts = computePropsOpts.value
      return propsOpts.title || 'title'
    })

    const computeContentField = computed(() => {
      const propsOpts = computePropsOpts.value
      return propsOpts.content || 'content'
    })

    const dispatchEvent = (type: ValueOf<VxeTimelineEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $timeline: $xeTimeline }, params))
    }

    const loadData = (opts: any[], isOptConf: boolean) => {
      reactData.isOptConf = isOptConf
      internalData.fullData = opts || []
      updateItems()
    }

    const updateItems = () => {
      const { reverse } = props
      const { fullData } = internalData
      reactData.itemList = reverse ? fullData.slice(0).reverse() : fullData.slice(0)
    }

    const timelineMethods: TimelineMethods = {
      dispatchEvent
    }

    const timelinePrivateMethods: TimelinePrivateMethods = {}

    Object.assign($xeTimeline, timelineMethods, timelinePrivateMethods)

    const renderItem = (item: any, index: number) => {
      const { itemList, isOptConf } = reactData
      const titleField = computeTitleField.value
      const contentField = computeContentField.value
      const titleVal = getText(isOptConf ? item[titleField] : item.title)
      const contentVal = getText(isOptConf ? item[contentField] : item.content)
      const titleSlot = slots.title
      const contentSlot = slots.content
      return h(
        'div',
        {
          key: index,
          class: [
            'vxe-timeline--item',
            {
              'is--last': index === itemList.length - 1
            }
          ]
        },
        [
          h('div', {
            class: 'vxe-timeline--item-line'
          }),
          h('div', {
            class: 'vxe-timeline--item-node'
          }),
          h(
            'div',
            {
              class: 'vxe-timeline--item-wrapper'
            },
            [
              h(
                'div',
                {
                  class: 'vxe-timeline--item-title'
                },
                titleSlot ? titleSlot({ item }) : titleVal
              ),
              h(
                'div',
                {
                  class: 'vxe-timeline--item-content'
                },
                contentSlot ? contentSlot({ item }) : contentVal
              )
            ]
          )
        ]
      )
    }

    const renderVN = () => {
      const { vertical } = props
      const { itemList } = reactData
      const vSize = computeSize.value
      const defaultSlot = slots.default
      return h(
        'div',
        {
          ref: refElem,
          class: [
            'vxe-timeline',
            {
              [`size--${vSize}`]: vSize,
              'is--vertical': vertical,
              'is--horizontal': !vertical
            }
          ]
        },
        [
          h(
            'div',
            {
              class: 'vxe-timeline--slots'
            },
            defaultSlot ? defaultSlot({}) : []
          ),
          h(
            'div',
            {
              class: 'vxe-timeline--body'
            },
            itemList.map((item, index) => renderItem(item, index))
          )
        ]
      )
    }

    watch(
      () => reactData.staticItems,
      (val) => {
        loadData(val, false)
      }
    )

    const refOptsFlag = ref(0)
    watch(
      () => props.options,
      () => {
        refOptsFlag.value++
      }
    )
    watch(
      () => (props.options ? props.options.length : -1),
      () => {
        refOptsFlag.value++
      }
    )
    watch(refOptsFlag, () => {
      loadData(props.options || [], true)
    })

    watch(
      () => props.reverse,
      () => {
        updateItems()
      }
    )

    onMounted(() => {
      const { staticItems } = reactData
      if (staticItems.length) {
        loadData(staticItems, false)
      } else {
        loadData(props.options || [], true)
      }
    })

    onBeforeUnmount(() => {
      XEUtils.assign(reactData, createReactData())
      XEUtils.assign(internalData, createInternalData())
    })

    provide('$xeTimeline', $xeTimeline)

    $xeTimeline.renderVN = renderVN

    return $xeTimeline
  },
  render() {
    return this.renderVN()
  }
}) /* define-vxe-component end */
