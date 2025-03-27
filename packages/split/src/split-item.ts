import { CreateElement, PropType, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { globalMixins, createEvent } from '../../ui'
import { assembleSplitItem, destroySplitItem } from './util'
import XEUtils from 'xe-utils'

import type { SplitItemReactData, VxeSplitItemPropTypes, VxeSplitItemEmits, VxeComponentSizeType, ValueOf, VxeSplitConstructor, VxeSplitPrivateMethods, VxeSplitDefines } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeSplitItem',
  mixins: [
    globalMixins.sizeMixin
  ],
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
  inject: {
    $xeSplit: {
      default: null
    }
  },
  provide () {
    const $xeSplitItem = this
    return {
      $xeSplitItem
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: SplitItemReactData = {
    }
    const chunkConfig: VxeSplitDefines.ChunkConfig = {
      id: xID,
      width: 0,
      height: 0,
      minWidth: 0,
      minHeight: 0,
      renderWidth: 0,
      renderHeight: 0,
      slots: {}
    }

    return {
      xID,
      reactData,
      chunkConfig
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
      $xeSplit(): (VxeSplitConstructor & VxeSplitPrivateMethods) | null
    })
  },
  watch: {
    width (val) {
      const $xeSplitItem = this
      const chunkConfig = $xeSplitItem.chunkConfig

      chunkConfig.width = val
    },
    height (val) {
      const $xeSplitItem = this
      const chunkConfig = $xeSplitItem.chunkConfig

      chunkConfig.height = val
    },
    minWidth (val) {
      const $xeSplitItem = this
      const chunkConfig = $xeSplitItem.chunkConfig

      chunkConfig.minWidth = val
    },
    minHeight (val) {
      const $xeSplitItem = this
      const chunkConfig = $xeSplitItem.chunkConfig

      chunkConfig.minHeight = val
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeSplitItemEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeSplitItem = this
      $xeSplitItem.$emit(type, createEvent(evnt, { $splitItem: $xeSplitItem }, params))
    },
    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      return h('div', {
        ref: 'refElem'
      })
    }
  },
  created () {
    const $xeSplitItem = this
    const props = $xeSplitItem
    const slots = $xeSplitItem.$scopedSlots
    const chunkConfig = $xeSplitItem.chunkConfig

    Object.assign(chunkConfig, {
      width: props.width,
      height: props.height,
      minWidth: props.minWidth,
      minHeight: props.minHeight,
      renderWidth: 0,
      renderHeight: 0,
      slots
    })
  },
  mounted () {
    const $xeSplitItem = this
    const slots = $xeSplitItem.$scopedSlots
    const chunkConfig = $xeSplitItem.chunkConfig
    const $xeSplit = $xeSplitItem.$xeSplit

    chunkConfig.slots = slots

    const elem = $xeSplitItem.$refs.refElem as HTMLElement
    if ($xeSplit && elem) {
      assembleSplitItem($xeSplit, elem, chunkConfig)
    }
  },
  beforeDestroy () {
    const $xeSplitItem = this
    const chunkConfig = $xeSplitItem.chunkConfig
    const $xeSplit = $xeSplitItem.$xeSplit

    if ($xeSplit) {
      destroySplitItem($xeSplit, chunkConfig)
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
