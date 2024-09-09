import { CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { globalMixins } from '../../ui'
import { createItem, watchItem, destroyItem, assembleItem, XEFormItemProvide } from './util'
import { formItemProps } from './form-item'

import type { VxeFormConstructor, FormGatherReactData, VxeFormPrivateMethods, VxeComponentSizeType } from '../../../types'

const formItemPropKeys = Object.keys(formItemProps)

export default defineVxeComponent({
  name: 'VxeFormGather',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: formItemProps,
  inject: {
    $xeForm: {
      default: null
    },
    $xeParentFormGather: {
      from: '$xeFormGather',
      default: null
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const formItem: any = {}
    const reactData: FormGatherReactData = {}
    return {
      xID,
      formItem,
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
      $xeForm(): VxeFormConstructor & VxeFormPrivateMethods
      $xeParentFormGather(): XEFormItemProvide
    })
  },
  methods: {
    renderVN (h: CreateElement): VNode {
      const $xeFormGather = this
      const props = $xeFormGather
      const slots = $xeFormGather.$scopedSlots
      const formItem = $xeFormGather.formItem
      const $xeForm = $xeFormGather.$xeForm

      const { className, field } = props
      const span = props.span || ($xeForm ? $xeForm.span : null)
      const defaultSlot = slots.default
      const params = { $form: $xeForm, data: $xeForm ? $xeForm.data : {}, item: formItem, field: field as string, property: field as string }
      return h('div', {
        ref: 'refElem',
        class: ['vxe-form--gather vxe-form--item-row', formItem.id, span ? `vxe-form--item-col_${span} is--span` : '', className ? (XEUtils.isFunction(className) ? className(params) : className) : '']
      }, defaultSlot ? defaultSlot({}) : [])
    }
  },
  provide (this: any) {
    const $xeFormGather = this
    const formItem = $xeFormGather.formItem
    return {
      $xeFormGather,
      $xeFormItem: null,
      xeFormItemInfo: {
        itemConfig: formItem
      }
    }
  },
  created (this: any) {
    const $xeFormGather = this
    const props = $xeFormGather
    const $xeForm = $xeFormGather.$xeForm

    const formItem = createItem($xeForm, props)
    formItem.children = []

    $xeFormGather.formItem = formItem

    watchItem($xeFormGather, formItemPropKeys, formItem)
  },
  mounted (this: any) {
    const $xeFormGather = this
    const formItem = $xeFormGather.formItem
    const $xeForm = $xeFormGather.$xeForm
    const $xeParentFormGather = $xeFormGather.$xeParentFormGather

    const elem = $xeFormGather.$refs.refElem as HTMLDivElement
    assembleItem($xeForm, elem, formItem, $xeParentFormGather)
  },
  beforeDestroy () {
    const $xeFormGather = this
    const formItem = $xeFormGather.formItem
    const $xeForm = $xeFormGather.$xeForm

    destroyItem($xeForm, formItem)
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
