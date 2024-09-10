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
    const $xeParentFormGather = inject<XEFormItemProvide | null>('$xeFormGather', null)
    const formItem = reactive(createItem($xeForm, props))
    formItem.children = []

    const formItemInfo = { itemConfig: formItem }
    provide('xeFormItemInfo', formItemInfo)

    watchItem(props, formItem)

    onMounted(() => {
      const elem = refElem.value
      assembleItem($xeForm, elem, formItem, $xeParentFormGather)
    })

    onUnmounted(() => {
      destroyItem($xeForm, formItem)
    })

    const renderVN = () => {
      const { className, field } = props
      const span = props.span || ($xeForm ? $xeForm.props.span : null)
      const defaultSlot = slots.default
      const params = { $form: $xeForm, data: $xeForm ? $xeForm.props.data : {}, item: formItem as any, field: field as string, property: field as string }
      return h('div', {
        ref: refElem,
        class: ['vxe-form--gather vxe-form--item-row', formItem.id, span ? `vxe-form--item-col_${span} is--span` : '', className ? (XEUtils.isFunction(className) ? className(params) : className) : '']
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
