import { defineComponent, h, onUnmounted, inject, ref, Ref, reactive, onMounted, provide } from 'vue'
import { createItem, watchItem, destroyItem, assembleItem, XEFormItemProvide } from './util'
import { formItemProps } from './form-item'
import XEUtils from 'xe-utils'

import type { VxeFormConstructor, VxeFormPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeFormGather',
  props: formItemProps,
  setup (props, { slots }) {
    const refElem = ref() as Ref<HTMLDivElement>
    const $xeForm = inject('$xeForm', {} as VxeFormConstructor & VxeFormPrivateMethods)
    const parentFormGather = inject('$xeFormGather', null as XEFormItemProvide | null)
    const formItem = reactive(createItem($xeForm, props))
    formItem.children = []

    const formItemInfo = { itemConfig: formItem }
    provide('xeFormItemInfo', formItemInfo)

    watchItem(props, formItem)

    onMounted(() => {
      assembleItem($xeForm, refElem.value, formItem, parentFormGather)
    })

    onUnmounted(() => {
      destroyItem($xeForm, formItem)
    })

    const renderVN = () => {
      const { className, field } = props
      const span = props.span || ($xeForm ? $xeForm.props.span : null)
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: ['vxe-form--gather vxe-form--item-row', formItem.id, span ? `vxe-form--item-col_${span} is--span` : '', className ? (XEUtils.isFunction(className) ? className({ $form: $xeForm, data: $xeForm ? $xeForm.props.data : {}, item: formItem as any, field: field as string, property: field as string }) : className) : '']
      }, defaultSlot ? defaultSlot({}) : [])
    }

    const $xeFormGather = {
      formItem,

      renderVN
    }

    provide('$xeFormGather', $xeFormGather)
    provide('$xeFormItem', null)

    return $xeFormGather
  },
  render () {
    return this.renderVN()
  }
})
