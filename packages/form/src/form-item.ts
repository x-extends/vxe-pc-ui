import { defineComponent, h, onUnmounted, inject, ref, provide, onMounted, PropType, reactive, createCommentVNode } from 'vue'
import { createItem, watchItem, destroyItem, assembleItem, XEFormItemProvide } from './util'
import { renderer } from '../../ui'
import { isEnableConf } from '../../ui/src/utils'
import { renderTitle, renderItemContent, getItemClass, getItemContentClass } from './render'
import XEUtils from 'xe-utils'

import type { VxeFormConstructor, VxeFormDefines, VxeFormItemPropTypes, VxeFormPrivateMethods } from '../../../types'

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
  rules: Array as PropType<VxeFormItemPropTypes.Rules>
}

export default defineComponent({
  name: 'VxeFormItem',
  props: formItemProps,
  setup (props, { slots }) {
    const refElem = ref<HTMLDivElement>()
    const $xeForm = inject('$xeForm', {} as VxeFormConstructor & VxeFormPrivateMethods)
    const $xeFormGroup = inject<XEFormItemProvide | null>('$xeFormGroup', null)
    const formItem = reactive(createItem($xeForm, props))
    formItem.slots = slots

    const formItemInfo = { itemConfig: formItem }
    provide('xeFormItemInfo', formItemInfo)

    watchItem(props, formItem)

    onMounted(() => {
      const elem = refElem.value
      if (elem) {
        assembleItem($xeForm, elem, formItem, $xeFormGroup)
      }
    })

    onUnmounted(() => {
      destroyItem($xeForm, formItem)
    })

    const renderItem = ($xeForm: VxeFormConstructor & VxeFormPrivateMethods, item: VxeFormDefines.ItemInfo) => {
      const formProps = $xeForm.props
      const { data, readonly, disabled } = formProps
      const { visible, field, itemRender, contentStyle, showContent } = item
      const compConf = isEnableConf(itemRender) ? renderer.get(itemRender.name) : null
      const itemStyle = compConf ? (compConf.formItemStyle || compConf.itemStyle) : null
      const itemContentStyle = compConf ? (compConf.formItemContentStyle || compConf.itemContentStyle) : null
      const params = { data, disabled, readonly, field, property: field, item, $form: $xeForm, $grid: $xeForm.xegrid }
      if (visible === false) {
        return createCommentVNode()
      }
      return h('div', {
        ref: refElem,
        key: item.id,
        class: getItemClass($xeForm, item),
        style: XEUtils.isFunction(itemStyle) ? itemStyle(params) : itemStyle
      }, [
        renderTitle($xeForm, item),
        showContent === false
          ? createCommentVNode()
          : h('div', {
            class: getItemContentClass($xeForm, item),
            style: Object.assign({}, XEUtils.isFunction(itemContentStyle) ? itemContentStyle(params) : itemContentStyle, XEUtils.isFunction(contentStyle) ? contentStyle(params) : contentStyle)
          }, [
            renderItemContent($xeForm, item)
          ])
      ])
    }
    const renderVN = () => {
      const customLayout = $xeForm ? $xeForm.props.customLayout : false
      const item = formItem as unknown as VxeFormDefines.ItemInfo
      return customLayout
        ? renderItem($xeForm, item)
        : h('div', {
          ref: refElem
        })
    }

    const $xeFormitem = {
      formItem,

      renderVN
    }

    provide('$xeFormItem', $xeFormitem)
    provide('$xeFormGroup', null)

    return $xeFormitem
  },
  render () {
    return this.renderVN()
  }
})
