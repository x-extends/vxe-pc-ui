import { CreateElement, PropType, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { globalMixins, createEvent } from '../../ui'
import { assembleSplitItem, destroySplitItem } from './util'
import XEUtils from 'xe-utils'

import type { SplitItemReactData, VxeSplitPanePropTypes, VxeSplitPaneEmits, VxeComponentSizeType, ValueOf, VxeSplitConstructor, VxeSplitPrivateMethods, VxeSplitDefines } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeSplitPane',
  mixins: [
    globalMixins.sizeMixin
  ],
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
    const paneConfig: VxeSplitDefines.PaneConfig = {
      id: xID,
      name: '',
      width: 0,
      height: 0,
      minWidth: 0,
      minHeight: 0,
      showAction: false,
      isVisible: true,
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
      $xeSplit(): (VxeSplitConstructor & VxeSplitPrivateMethods) | null
    })
  },
  watch: {
    name (val) {
      const $xeSplitItem = this
      const paneConfig = $xeSplitItem.paneConfig

      paneConfig.name = val
    },
    width (val) {
      const $xeSplitItem = this
      const paneConfig = $xeSplitItem.paneConfig

      paneConfig.width = val
    },
    height (val) {
      const $xeSplitItem = this
      const paneConfig = $xeSplitItem.paneConfig

      paneConfig.height = val
    },
    minWidth (val) {
      const $xeSplitItem = this
      const paneConfig = $xeSplitItem.paneConfig

      paneConfig.minWidth = val
    },
    minHeight (val) {
      const $xeSplitItem = this
      const paneConfig = $xeSplitItem.paneConfig

      paneConfig.minHeight = val
    },
    showAction (val) {
      const $xeSplitItem = this
      const paneConfig = $xeSplitItem.paneConfig

      paneConfig.showAction = val
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeSplitPaneEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeSplitItem = this
      $xeSplitItem.$emit(type, createEvent(evnt, { $splitPane: $xeSplitItem }, params))
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
    const paneConfig = $xeSplitItem.paneConfig

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
    const $xeSplitItem = this
    const slots = $xeSplitItem.$scopedSlots
    const paneConfig = $xeSplitItem.paneConfig
    const $xeSplit = $xeSplitItem.$xeSplit

    paneConfig.slots = slots

    const elem = $xeSplitItem.$refs.refElem as HTMLElement
    if ($xeSplit && elem) {
      assembleSplitItem($xeSplit, elem, paneConfig)
    }
  },
  beforeDestroy () {
    const $xeSplitItem = this
    const paneConfig = $xeSplitItem.paneConfig
    const $xeSplit = $xeSplitItem.$xeSplit

    if ($xeSplit) {
      destroySplitItem($xeSplit, paneConfig)
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
