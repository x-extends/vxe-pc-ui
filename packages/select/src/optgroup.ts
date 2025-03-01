import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { createEvent, globalMixins } from '../../ui'
import XEUtils from 'xe-utils'
import { createOption, watchOption, destroyOption, assembleOption } from './util'
import { OptionInfo } from './option-info'

import type { VxeSelectConstructor, VxeOptgroupPropTypes, VxeComponentSizeType, VxeOptgroupEmits, ValueOf, OptgroupReactData } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeOptgroup',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    label: {
      type: [String, Number, Boolean] as PropType<VxeOptgroupPropTypes.Label>,
      default: ''
    },
    visible: {
      type: Boolean as PropType<VxeOptgroupPropTypes.Visible>,
      default: null
    },
    className: [String, Function] as PropType<VxeOptgroupPropTypes.ClassName>,
    disabled: Boolean as PropType<VxeOptgroupPropTypes.Disabled>
  },
  inject: {
    $xeSelect: {
      default: null
    }
  },
  provide () {
    const $xeOptgroup = this
    return {
      $xeOptgroup
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: OptgroupReactData = {
    }
    const optionConfig = {} as OptionInfo
    return {
      xID,
      reactData,
      optionConfig
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
      $xeSelect(): VxeSelectConstructor
    })
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeOptgroupEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeOptgroup = this
      $xeOptgroup.$emit(type, createEvent(evnt, { $optgroup: $xeOptgroup }, params))
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeOptgroup = this
      const slots = $xeOptgroup.$scopedSlots
      const defaultSlot = slots.default

      return h('div', {
        ref: 'elem'
      }, defaultSlot ? defaultSlot({}) : [])
    }
  },
  created () {
    const $xeOptgroup = this
    const props = $xeOptgroup
    const slots = $xeOptgroup.$scopedSlots
    const $xeSelect = $xeOptgroup.$xeSelect

    const optionConfig = createOption($xeSelect, props)
    optionConfig.slots = slots
    $xeOptgroup.optionConfig = optionConfig

    watchOption($xeOptgroup, optionConfig)
  },
  mounted () {
    const $xeOptgroup = this
    const optionConfig = $xeOptgroup.optionConfig
    const $xeSelect = $xeOptgroup.$xeSelect

    const el = $xeOptgroup.$refs.elem as HTMLDivElement
    assembleOption($xeSelect, el, optionConfig)
  },
  beforeDestroy () {
    const $xeOptgroup = this
    const optionConfig = $xeOptgroup.optionConfig
    const $xeSelect = $xeOptgroup.$xeSelect

    destroyOption($xeSelect, optionConfig)
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
