import { PropType, ref, h, reactive, watch, provide, inject, onMounted, onUnmounted } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { createEvent } from '../../ui'
import { assembleSplitItem, destroySplitItem } from './util'
import XEUtils from 'xe-utils'

import type { SplitItemReactData, VxeSplitPanePropTypes, SplitItemPrivateRef, SplitItemInternalData, SplitItemMethods, VxeSplitPanePrivateComputed, SplitItemPrivateMethods, VxeSplitPaneEmits, VxeSplitPaneConstructor, ValueOf, VxeSplitDefines, VxeSplitPanePrivateMethods, VxeSplitConstructor, VxeSplitPrivateMethods } from '../../../types'

export default defineVxeComponent({
  name: 'VxeSplitPane',
  props: {
    name: [Number, String] as PropType<VxeSplitPanePropTypes.Name>,
    width: [Number, String] as PropType<VxeSplitPanePropTypes.Width>,
    height: [Number, String] as PropType<VxeSplitPanePropTypes.Height>,
    showAction: Boolean as PropType<VxeSplitPanePropTypes.ShowAction>,
    minWidth: {
      type: [Number, String] as PropType<VxeSplitPanePropTypes.MinWidth>,
      default: () => null
    },
    minHeight: {
      type: [Number, String] as PropType<VxeSplitPanePropTypes.MinHeight>,
      default: () => null
    }
  },
  emits: [
  ] as VxeSplitPaneEmits,
  setup (props, context) {
    const { emit, slots } = context

    const xID = XEUtils.uniqueId()

    const $xeSplit = inject<(VxeSplitConstructor & VxeSplitPrivateMethods) | null>('$xeSplit', null)

    const refElem = ref<HTMLDivElement>()

    const paneConfig = reactive<VxeSplitDefines.PaneConfig>({
      id: xID,
      name: props.name,
      width: props.width,
      height: props.height,
      minWidth: props.minWidth,
      minHeight: props.minHeight,
      showAction: props.showAction,
      isVisible: true,
      isExpand: true,
      renderWidth: 0,
      resizeWidth: 0,
      foldWidth: 0,
      renderHeight: 0,
      resizeHeight: 0,
      foldHeight: 0,
      slots: slots
    })

    const reactData = reactive<SplitItemReactData>({
    })

    const internalData: SplitItemInternalData = {
    }

    const computeMaps: VxeSplitPanePrivateComputed = {
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
    } as unknown as VxeSplitPaneConstructor & VxeSplitPanePrivateMethods

    const dispatchEvent = (type: ValueOf<VxeSplitPaneEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $splitPane: $xeSplitItem }, params))
    }

    const splitPaneMethods: SplitItemMethods = {
      dispatchEvent
    }

    const splitPanePrivateMethods: SplitItemPrivateMethods = {
    }

    Object.assign($xeSplitItem, splitPaneMethods, splitPanePrivateMethods)

    const renderVN = () => {
      return h('div', {
        ref: refElem
      })
    }

    watch(() => props.name, (val) => {
      paneConfig.name = val
    })

    watch(() => props.width, (val) => {
      paneConfig.width = val
    })

    watch(() => props.height, (val) => {
      paneConfig.height = val
    })

    watch(() => props.minWidth, (val) => {
      paneConfig.minWidth = val
    })

    watch(() => props.minHeight, (val) => {
      paneConfig.minHeight = val
    })

    watch(() => props.showAction, (val) => {
      paneConfig.showAction = val
    })

    onMounted(() => {
      const elem = refElem.value
      if ($xeSplit && elem) {
        assembleSplitItem($xeSplit, elem, paneConfig)
      }
    })

    onUnmounted(() => {
      if ($xeSplit) {
        destroySplitItem($xeSplit, paneConfig)
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
