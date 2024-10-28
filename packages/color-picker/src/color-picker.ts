import { CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { createEvent } from '../../ui'

import type { ColorPickerReactData, VxeColorPickerEmits, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxeColorPicker',
  props: {
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: ColorPickerReactData = {
    }
    return {
      xID,
      reactData
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeColorPickerEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeColorPicker = this
      $xeColorPicker.$emit(type, createEvent(evnt, { $colorPicker: $xeColorPicker }, params))
    },
    emitModel  (value: any) {
      const $xeColorPicker = this

      const { _events } = $xeColorPicker as any
      if (_events && _events.modelValue) {
        $xeColorPicker.$emit('modelValue', value)
      } else {
        $xeColorPicker.$emit('model-value', value)
      }
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeColorPicker = this
      const slots = $xeColorPicker.$scopedSlots

      const defaultSlot = slots.default
      return h('div', {
        ref: 'refElem',
        class: 'vxe-color-picker'
      }, defaultSlot ? defaultSlot({}) : [])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
