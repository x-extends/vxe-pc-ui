import { CreateElement, VNode, PropType } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI } from '@vxe-ui/core'
import { createStepItem, watchStepItem, assembleStepItem, destroyStepItem } from './util'
import { StepItemInfo } from './step-info'

import type { VxeStepsInstance, VxeStepItemPropTypes, VxeComponentSizeType } from '../../../types'

const { globalMixins } = VxeUI

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeStepItem',
  mixins: [globalMixins.sizeMixin],
  props: {
    title: [String, Number] as PropType<VxeStepItemPropTypes.Title>,
    content: [String, Number] as PropType<VxeStepItemPropTypes.Content>,
    status: String as PropType<VxeStepItemPropTypes.Status>
  },
  inject: {
    $xeSteps: {
      default: null
    }
  },
  data() {
    const itemConfig = {} as StepItemInfo
    return {
      xID: XEUtils.uniqueId(),
      itemConfig
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
      $xeSteps(): VxeStepsInstance
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
    const $xeStepItem = this
    const props = $xeStepItem
    const $xeSteps = $xeStepItem.$xeSteps

    const itemConfig = createStepItem($xeSteps, props)
    $xeStepItem.itemConfig = itemConfig

    watchStepItem($xeStepItem, itemConfig)
  },
  mounted() {
    const $xeStepItem = this
    const slots = $xeStepItem.$scopedSlots
    const itemConfig = $xeStepItem.itemConfig
    const $xeSteps = $xeStepItem.$xeSteps

    itemConfig.slots = slots
    const el = $xeStepItem.$refs.refElem as HTMLDivElement
    assembleStepItem($xeSteps, el, itemConfig)
  },
  beforeDestroy() {
    const $xeStepItem = this
    const itemConfig = $xeStepItem.itemConfig
    const $xeSteps = $xeStepItem.$xeSteps

    destroyStepItem($xeSteps, itemConfig)
  },
  render(this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
