import { defineComponent, PropType, ref, h, reactive, watch, provide, inject, onMounted, onUnmounted } from 'vue'
import { createEvent } from '../../ui'
import { assembleSplitItem, destroySplitItem } from './util'
import XEUtils from 'xe-utils'

import type { SplitItemReactData, VxeSplitItemPropTypes, SplitItemPrivateRef, SplitItemInternalData, SplitItemMethods, VxeSplitItemPrivateComputed, SplitItemPrivateMethods, VxeSplitItemEmits, VxeSplitItemConstructor, ValueOf, VxeSplitDefines, VxeSplitItemPrivateMethods, VxeSplitConstructor, VxeSplitPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeSplitItem',
  props: {
    width: [Number, String] as PropType<VxeSplitItemPropTypes.Width>,
    height: [Number, String] as PropType<VxeSplitItemPropTypes.Height>,
    minWidth: {
      type: [Number, String] as PropType<VxeSplitItemPropTypes.MinWidth>,
      default: () => null
    },
    minHeight: {
      type: [Number, String] as PropType<VxeSplitItemPropTypes.MinHeight>,
      default: () => null
    }
  },
  emits: [
  ] as VxeSplitItemEmits,
  setup (props, context) {
    const { emit, slots } = context

    const xID = XEUtils.uniqueId()

    const $xeSplit = inject<(VxeSplitConstructor & VxeSplitPrivateMethods) | null>('$xeSplit', null)

    const refElem = ref<HTMLDivElement>()

    const chunkConfig = reactive<VxeSplitDefines.ChunkConfig>({
      id: xID,
      width: props.width,
      height: props.height,
      minWidth: props.minWidth,
      minHeight: props.minHeight,
      renderWidth: 0,
      renderHeight: 0,
      slots: slots
    })

    const reactData = reactive<SplitItemReactData>({
    })

    const internalData: SplitItemInternalData = {
    }

    const computeMaps: VxeSplitItemPrivateComputed = {
    }

    const refMaps: SplitItemPrivateRef = {
      refElem
    }

    const $xeSplitItem = {
      xID,
      props,
      context,
      reactData,
      internalData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeSplitItemConstructor & VxeSplitItemPrivateMethods

    const dispatchEvent = (type: ValueOf<VxeSplitItemEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $splitItem: $xeSplitItem }, params))
    }

    const splitItemMethods: SplitItemMethods = {
      dispatchEvent
    }

    const splitItemPrivateMethods: SplitItemPrivateMethods = {
    }

    Object.assign($xeSplitItem, splitItemMethods, splitItemPrivateMethods)

    const renderVN = () => {
      return h('div', {
        ref: refElem
      })
    }

    watch(() => props.width, (val) => {
      chunkConfig.width = val
    })

    watch(() => props.height, (val) => {
      chunkConfig.height = val
    })

    watch(() => props.minWidth, (val) => {
      chunkConfig.minWidth = val
    })

    watch(() => props.minHeight, (val) => {
      chunkConfig.minHeight = val
    })

    onMounted(() => {
      const elem = refElem.value
      if ($xeSplit && elem) {
        assembleSplitItem($xeSplit, elem, chunkConfig)
      }
    })

    onUnmounted(() => {
      if ($xeSplit) {
        destroySplitItem($xeSplit, chunkConfig)
      }
    })

    provide('$xeSplitItem', $xeSplitItem)

    $xeSplitItem.renderVN = renderVN

    return $xeSplitItem
  },
  render () {
    return this.renderVN()
  }
})
