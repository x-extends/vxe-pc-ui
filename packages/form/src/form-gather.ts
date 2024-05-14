import { defineComponent, h, onUnmounted, inject, ref, Ref, reactive, onMounted, provide, nextTick } from 'vue'
import { errLog } from '../../ui/src/log'
import { createItem, watchItem, destroyItem, assemItem, XEFormItemProvide } from './util'
import { formItemProps } from './form-item'

import { VxeFormConstructor, VxeFormPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeFormGather',
  props: formItemProps,
  setup (props, { slots }) {
    const refElem = ref() as Ref<HTMLDivElement>
    const $xeForm = inject('$xeForm', {} as VxeFormConstructor & VxeFormPrivateMethods)
    const parentFormGather = inject('$xeFormGather', null as XEFormItemProvide | null)
    const defaultSlot = slots.default
    const formItem = reactive(createItem($xeForm, props))
    formItem.children = []

    const formItemInfo = { itemConfig: formItem }
    provide('$xeFormItemInfo', formItemInfo)

    watchItem(props, formItem)

    onMounted(() => {
      assemItem($xeForm, refElem.value, formItem, parentFormGather)
    })

    onUnmounted(() => {
      destroyItem($xeForm, formItem)
    })

    if (process.env.VUE_APP_VXE_TABLE_ENV === 'development') {
      nextTick(() => {
        if ($xeForm && $xeForm.props.customLayout) {
          errLog('vxe.error.errConflicts', ['custom-layout', '<form-gather ...>'])
        }
      })
    }

    const renderVN = () => {
      return h('div', {
        ref: refElem
      }, defaultSlot ? defaultSlot() : [])
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
