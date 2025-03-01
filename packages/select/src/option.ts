import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { createEvent, globalMixins } from '../../ui'
import { XEOptionProvide, createOption, watchOption, destroyOption, assembleOption } from './util'
import { OptionInfo } from './option-info'

import type { VxeSelectConstructor, VxeOptionEmits, VxeOptionPropTypes, OptionReactData, VxeComponentSizeType, ValueOf } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeOption',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    value: [String, Number, Boolean] as PropType<VxeOptionPropTypes.Value>,
    label: {
      type: [String, Number, Boolean] as PropType<VxeOptionPropTypes.Label>,
      default: ''
    },
    visible: {
      type: Boolean as PropType<VxeOptionPropTypes.Visible>,
      default: null
    },
    className: [String, Function] as PropType<VxeOptionPropTypes.ClassName>,
    disabled: Boolean as PropType<VxeOptionPropTypes.Disabled>
  },
  inject: {
    $xeSelect: {
      default: null
    },
    $xeOptgroup: {
      default: null
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: OptionReactData = {
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
      $xeOptgroup(): XEOptionProvide | null
    })
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeOptionEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeOption = this
      $xeOption.$emit(type, createEvent(evnt, { $option: $xeOption }, params))
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      return h('div', {
        ref: 'elem'
      })
    }
  },
  created () {
    const $xeOption = this
    const props = $xeOption
    const slots = $xeOption.$scopedSlots
    const $xeSelect = $xeOption.$xeSelect

    const optionConfig = createOption($xeSelect, props)
    optionConfig.slots = slots
    $xeOption.optionConfig = optionConfig

    watchOption($xeOption, optionConfig)
  },
  mounted () {
    const $xeOption = this
    const optionConfig = $xeOption.optionConfig
    const $xeSelect = $xeOption.$xeSelect
    const $xeOptgroup = $xeOption.$xeOptgroup

    const el = $xeOption.$refs.elem as HTMLDivElement
    assembleOption($xeSelect, el, optionConfig, $xeOptgroup)
  },
  beforeDestroy () {
    const $xeOption = this
    const optionConfig = $xeOption.optionConfig
    const $xeSelect = $xeOption.$xeSelect

    destroyOption($xeSelect, optionConfig)
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
