import { CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { renderer, globalMixins, renderEmptyElement } from '../../ui'
import { isEnableConf } from '../../ui/src/utils'
import { createItem, watchItem, destroyItem, assembleItem, XEFormItemProvide } from './util'
import { formItemProps } from './form-item'
import { renderTitle, getItemClass, getItemContentClass } from './render'

import type { VxeFormConstructor, FormGroupReactData, VxeFormPrivateMethods, VxeComponentSizeType } from '../../../types'

const formItemPropKeys = Object.keys(formItemProps)

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeFormGroup',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: formItemProps,
  inject: {
    $xeForm: {
      default: null
    },
    $xeParentFormGroup: {
      from: '$xeFormGroup',
      default: null
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const formItem: any = {}
    const reactData: FormGroupReactData = {}
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
      $xeParentFormGroup(): XEFormItemProvide
    })
  },
  methods: {
    renderVN (h: CreateElement): VNode {
      const $xeFormGroup = this
      const slots = $xeFormGroup.$scopedSlots
      const formItem = $xeFormGroup.formItem
      const $xeForm = $xeFormGroup.$xeForm
      const formProps = $xeForm
      const $xeGrid = $xeForm.$xeGrid

      const item = formItem
      const { data, readonly, disabled } = formProps
      const { visible, field, itemRender, contentStyle } = item
      const compConf = isEnableConf(itemRender) ? renderer.get(itemRender.name) : null
      const itemStyle = compConf ? (compConf.formItemStyle || compConf.itemStyle) : null
      const itemContentStyle = compConf ? (compConf.formItemContentStyle || compConf.itemContentStyle) : null
      const defaultSlot = slots ? slots.default : null
      const params = { data, disabled, readonly, field, property: field, item, $form: $xeForm, $grid: $xeGrid }
      if (visible === false) {
        return renderEmptyElement($xeFormGroup)
      }
      return h('div', {
        ref: 'refElem',
        key: item.id,
        class: getItemClass($xeForm, item, true),
        style: XEUtils.isFunction(itemStyle) ? itemStyle(params) : (itemStyle || {})
      }, [
        renderTitle(h, $xeForm, item, true),
        h('div', {
          class: getItemContentClass($xeForm, item, true),
          style: Object.assign({}, XEUtils.isFunction(itemContentStyle) ? itemContentStyle(params) : itemContentStyle, XEUtils.isFunction(contentStyle) ? contentStyle(params) : contentStyle)
        }, defaultSlot ? defaultSlot({}) : [])
      ])
    }
  },
  provide (this: any) {
    const $xeFormGroup = this
    const formItem = $xeFormGroup.formItem
    return {
      $xeFormGroup,
      $xeFormItem: null,
      xeFormItemInfo: {
        itemConfig: formItem
      }
    }
  },
  created (this: any) {
    const $xeFormGroup = this
    const props = $xeFormGroup
    const $xeForm = $xeFormGroup.$xeForm

    const formItem = createItem($xeForm, props)
    formItem.children = []

    $xeFormGroup.formItem = formItem

    watchItem($xeFormGroup, formItemPropKeys, formItem)
  },
  mounted (this: any) {
    const $xeFormGroup = this
    const formItem = $xeFormGroup.formItem
    const $xeForm = $xeFormGroup.$xeForm
    const $xeParentFormGroup = $xeFormGroup.$xeParentFormGroup

    const elem = $xeFormGroup.$refs.refElem as HTMLDivElement
    assembleItem($xeForm, elem, formItem, $xeParentFormGroup)
  },
  beforeDestroy () {
    const $xeFormGroup = this
    const formItem = $xeFormGroup.formItem
    const $xeForm = $xeFormGroup.$xeForm

    destroyItem($xeForm, formItem)
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
