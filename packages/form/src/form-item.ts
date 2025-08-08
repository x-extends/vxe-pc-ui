import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { renderer, renderEmptyElement, globalMixins } from '../../ui'
import { isEnableConf } from '../../ui/src/utils'
import { createItem, watchItem, destroyItem, assembleItem, XEFormItemProvide } from './util'
import { renderTitle, renderItemContent, getItemClass, getItemContentClass } from './render'

import type { VxeFormConstructor, FormItemReactData, VxeFormDefines, VxeFormItemPropTypes, VxeComponentSizeType, VxeFormPrivateMethods } from '../../../types'

export const formItemProps = {
  title: String as PropType<VxeFormItemPropTypes.Title>,
  field: String as PropType<VxeFormItemPropTypes.Field>,
  span: {
    type: [String, Number] as PropType<VxeFormItemPropTypes.Span>,
    default: null
  },
  align: {
    type: String as PropType<VxeFormItemPropTypes.Align>,
    default: null
  },
  verticalAlign: {
    type: String as PropType<VxeFormItemPropTypes.VerticalAlign>,
    default: null
  },
  titleBackground: {
    type: Boolean as PropType<VxeFormItemPropTypes.TitleBackground>,
    default: null
  },
  titleBold: {
    type: Boolean as PropType<VxeFormItemPropTypes.TitleBold>,
    default: null
  },
  titleAlign: {
    type: String as PropType<VxeFormItemPropTypes.TitleAlign>,
    default: null
  },
  titleWidth: {
    type: [String, Number] as PropType<VxeFormItemPropTypes.TitleWidth>,
    default: null
  },
  titleColon: {
    type: Boolean as PropType<VxeFormItemPropTypes.TitleColon>,
    default: null
  },
  titleAsterisk: {
    type: Boolean as PropType<VxeFormItemPropTypes.TitleAsterisk>,
    default: null
  },
  showTitle: {
    type: Boolean as PropType<VxeFormItemPropTypes.ShowTitle>,
    default: true
  },
  vertical: {
    type: Boolean as PropType<VxeFormItemPropTypes.Vertical>,
    default: null
  },
  padding: {
    type: Boolean as PropType<VxeFormItemPropTypes.Padding>,
    default: null
  },
  formatter: [String, Function] as PropType<VxeFormItemPropTypes.Formatter>,
  className: [String, Function] as PropType<VxeFormItemPropTypes.ClassName>,
  contentClassName: [String, Function] as PropType<VxeFormItemPropTypes.ContentClassName>,
  contentStyle: [Object, Function] as PropType<VxeFormItemPropTypes.ContentStyle>,
  titleClassName: [String, Function] as PropType<VxeFormItemPropTypes.TitleClassName>,
  titleStyle: [Object, Function] as PropType<VxeFormItemPropTypes.TitleStyle>,
  titleOverflow: {
    type: [Boolean, String] as PropType<VxeFormItemPropTypes.TitleOverflow>,
    default: null
  },
  titlePrefix: Object as PropType<VxeFormItemPropTypes.TitlePrefix>,
  titleSuffix: Object as PropType<VxeFormItemPropTypes.TitleSuffix>,
  resetValue: { default: null },
  visibleMethod: Function as PropType<VxeFormItemPropTypes.VisibleMethod>,
  visible: {
    type: Boolean as PropType<VxeFormItemPropTypes.Visible>,
    default: null
  },
  showContent: {
    type: Boolean as PropType<VxeFormItemPropTypes.ShowContent>,
    default: null
  },
  folding: Boolean as PropType<VxeFormItemPropTypes.Folding>,
  collapseNode: Boolean as PropType<VxeFormItemPropTypes.CollapseNode>,
  itemRender: Object as PropType<VxeFormItemPropTypes.ItemRender>,
  rules: Array as PropType<VxeFormItemPropTypes.Rules>,
  params: Object as PropType<VxeFormItemPropTypes.Params>
}

const formItemPropKeys = Object.keys(formItemProps)

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeFormItem',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: formItemProps,
  inject: {
    $xeForm: {
      default: null
    },
    $xeFormGroup: {
      default: null
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const formItem: any = {}
    const reactData: FormItemReactData = {}
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
      $xeFormGroup(): XEFormItemProvide
    })
  },
  methods: {
    renderItem (h: CreateElement, $xeForm: VxeFormConstructor & VxeFormPrivateMethods, item: VxeFormDefines.ItemInfo) {
      const $xeFormItem = this
      const formProps = $xeForm
      const $xeGrid = $xeForm.$xeGrid

      const { data, readonly, disabled } = formProps
      const { visible, field, itemRender, contentStyle, showContent } = item
      const compConf = isEnableConf(itemRender) ? renderer.get(itemRender.name) : null
      const itemStyle = compConf ? (compConf.formItemStyle || compConf.itemStyle) : null
      const itemContentStyle = compConf ? (compConf.formItemContentStyle || compConf.itemContentStyle) : null
      const params = { data, disabled, readonly, field, property: field, item, $form: $xeForm, $grid: $xeGrid }
      if (visible === false) {
        return renderEmptyElement($xeFormItem)
      }
      return h('div', {
        ref: 'refElem',
        key: item.id,
        class: getItemClass($xeForm, item),
        style: XEUtils.isFunction(itemStyle) ? itemStyle(params) : (itemStyle || {}),
        attrs: {
          itemid: item.id
        }
      }, [
        renderTitle(h, $xeForm, item),
        showContent === false
          ? renderEmptyElement($xeFormItem)
          : h('div', {
            class: getItemContentClass($xeForm, item),
            style: Object.assign({}, XEUtils.isFunction(itemContentStyle) ? itemContentStyle(params) : itemContentStyle, XEUtils.isFunction(contentStyle) ? contentStyle(params) : contentStyle)
          }, [
            renderItemContent(h, $xeForm, item)
          ])
      ])
    },
    renderVN (h: CreateElement): VNode {
      const $xeFormItem = this
      const $xeForm = $xeFormItem.$xeForm
      const formItem = $xeFormItem.formItem

      const customLayout = $xeForm ? $xeForm.customLayout : false
      const item = formItem
      return customLayout
        ? $xeFormItem.renderItem(h, $xeForm, item)
        : h('div', {
          ref: 'refElem'
        })
    }
  },
  provide (this: any) {
    const $xeFormItem = this
    const formItem = $xeFormItem.formItem
    return {
      $xeFormGroup: null,
      $xeFormItem,
      xeFormItemInfo: {
        itemConfig: formItem
      }
    }
  },
  created (this: any) {
    const $xeFormItem = this
    const props = $xeFormItem
    const $xeForm = $xeFormItem.$xeForm

    const formItem = createItem($xeForm, props)

    $xeFormItem.formItem = formItem

    watchItem($xeFormItem, formItemPropKeys, formItem)
  },
  mounted (this: any) {
    const $xeFormItem = this
    const slots = $xeFormItem.$scopedSlots
    const formItem = $xeFormItem.formItem
    const $xeForm = $xeFormItem.$xeForm
    const $xeFormGroup = $xeFormItem.$xeFormGroup

    formItem.slots = slots
    const elem = $xeFormItem.$refs.refElem as HTMLDivElement
    assembleItem($xeForm, elem, formItem, $xeFormGroup)
  },
  beforeDestroy (this: any) {
    const $xeFormItem = this
    const formItem = $xeFormItem.formItem
    const $xeForm = $xeFormItem.$xeForm

    destroyItem($xeForm, formItem)
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
