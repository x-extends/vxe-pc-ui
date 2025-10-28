import { CreateElement, PropType, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { globalMixins, createEvent } from '../../ui'
import { assembleSplitterItem, destroySplitterItem } from './util'
import XEUtils from 'xe-utils'

import type { SplitterItemReactData, VxeSplitterPanelPropTypes, VxeSplitterPanelEmits, VxeComponentSizeType, ValueOf, VxeSplitterConstructor, VxeSplitterPrivateMethods, VxeSplitterDefines } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeSplitterPanel',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    name: [Number, String] as PropType<VxeSplitterPanelPropTypes.Name>,
    width: [Number, String] as PropType<VxeSplitterPanelPropTypes.Width>,
    height: [Number, String] as PropType<VxeSplitterPanelPropTypes.Height>,
    minWidth: {
      type: [Number, String] as PropType<VxeSplitterPanelPropTypes.MinWidth>,
      default: () => null
    },
    minHeight: {
      type: [Number, String] as PropType<VxeSplitterPanelPropTypes.MinHeight>,
      default: () => null
    },

    // 已废弃
    showAction: Boolean as PropType<VxeSplitterPanelPropTypes.ShowAction>
  },
  inject: {
    $xeSplitter: {
      default: null
    }
  },
  provide () {
    const $xeSplitterItem = this
    return {
      $xeSplitterItem
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: SplitterItemReactData = {
    }
    const paneConfig: VxeSplitterDefines.PaneConfig = {
      id: xID,
      name: '',
      width: 0,
      height: 0,
      minWidth: 0,
      minHeight: 0,
      showAction: false,
      isExpand: true,
      renderWidth: 0,
      resizeWidth: 0,
      foldWidth: 0,
      renderHeight: 0,
      resizeHeight: 0,
      foldHeight: 0,
      slots: {}
    }

    return {
      xID,
      reactData,
      paneConfig
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
      $xeSplitter(): (VxeSplitterConstructor & VxeSplitterPrivateMethods) | null
    })
  },
  watch: {
    name (val) {
      const $xeSplitterItem = this
      const paneConfig = $xeSplitterItem.paneConfig

      paneConfig.name = val
    },
    width (val) {
      const $xeSplitterItem = this
      const paneConfig = $xeSplitterItem.paneConfig

      paneConfig.width = val
    },
    height (val) {
      const $xeSplitterItem = this
      const paneConfig = $xeSplitterItem.paneConfig

      paneConfig.height = val
    },
    minWidth (val) {
      const $xeSplitterItem = this
      const paneConfig = $xeSplitterItem.paneConfig

      paneConfig.minWidth = val
    },
    minHeight (val) {
      const $xeSplitterItem = this
      const paneConfig = $xeSplitterItem.paneConfig

      paneConfig.minHeight = val
    },
    showAction (val) {
      const $xeSplitterItem = this
      const paneConfig = $xeSplitterItem.paneConfig

      paneConfig.showAction = val
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeSplitterPanelEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeSplitterItem = this
      $xeSplitterItem.$emit(type, createEvent(evnt, { $splitterPanel: $xeSplitterItem }, params))
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
    const $xeSplitterItem = this
    const props = $xeSplitterItem
    const slots = $xeSplitterItem.$scopedSlots
    const paneConfig = $xeSplitterItem.paneConfig

    Object.assign(paneConfig, {
      name: props.name,
      width: props.width,
      height: props.height,
      minWidth: props.minWidth,
      minHeight: props.minHeight,
      showAction: props.showAction,
      slots
    })
  },
  mounted () {
    const $xeSplitterItem = this
    const slots = $xeSplitterItem.$scopedSlots
    const paneConfig = $xeSplitterItem.paneConfig
    const $xeSplitter = $xeSplitterItem.$xeSplitter

    paneConfig.slots = slots

    const elem = $xeSplitterItem.$refs.refElem as HTMLElement
    if ($xeSplitter && elem) {
      assembleSplitterItem($xeSplitter, elem, paneConfig)
    }
  },
  beforeDestroy () {
    const $xeSplitterItem = this
    const paneConfig = $xeSplitterItem.paneConfig
    const $xeSplitter = $xeSplitterItem.$xeSplitter

    if ($xeSplitter) {
      destroySplitterItem($xeSplitter, paneConfig)
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
