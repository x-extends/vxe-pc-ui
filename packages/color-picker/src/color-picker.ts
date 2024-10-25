import { defineComponent, ref, h, reactive } from 'vue'
import XEUtils from 'xe-utils'
import { createEvent } from '../../ui'

import type { ColorPickerReactData, VxeColorPickerEmits, ColorPickerMethods, ColorPickerPrivateMethods, ValueOf, ColorPickerPrivateRef, VxeColorPickerPrivateComputed, VxeColorPickerConstructor, VxeColorPickerPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeColorPicker',
  props: {
  },
  emits: [
  ] as VxeColorPickerEmits,
  setup (props, context) {
    const { emit } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<ColorPickerReactData>({
    })

    const refMaps: ColorPickerPrivateRef = {
      refElem
    }

    const computeMaps: VxeColorPickerPrivateComputed = {
    }

    const $xeColorPicker = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeColorPickerConstructor & VxeColorPickerPrivateMethods

    const dispatchEvent = (type: ValueOf<VxeColorPickerEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $colorPicker: $xeColorPicker }, params))
    }

    const colorPickerMethods: ColorPickerMethods = {
      dispatchEvent
    }

    const colorPickerPrivateMethods: ColorPickerPrivateMethods = {
    }

    Object.assign($xeColorPicker, colorPickerMethods, colorPickerPrivateMethods)

    const renderVN = () => {
      return h('div', {
        ref: refElem,
        class: 'vxe-color-picker'
      }, [])
    }

    $xeColorPicker.renderVN = renderVN

    return $xeColorPicker
  },
  render () {
    return this.renderVN()
  }
})
