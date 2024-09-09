import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getIcon, getI18n, renderer, renderEmptyElement, globalMixins } from '../../ui'
import { getFuncText, isEnableConf } from '../../ui/src/utils'
import { getSlotVNs } from '../../ui/src/vn'
import { createItem, watchItem, destroyItem, assembleItem, XEFormItemProvide, isActiveItem } from './util'
import { renderTitle } from './render'

import type { VxeFormConstructor, FormItemReactData, VxeFormDefines, VxeFormItemPropTypes, VxeComponentSlotType, VxeComponentSizeType, VxeFormPrivateMethods } from '../../../types'

export const formItemProps = {
  title: String as PropType<VxeFormItemPropTypes.Title>,
  field: String as PropType<VxeFormItemPropTypes.Field>,
  span: [String, Number] as PropType<VxeFormItemPropTypes.Span>,
  align: String as PropType<VxeFormItemPropTypes.Align>,
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
  folding: Boolean as PropType<VxeFormItemPropTypes.Folding>,
  collapseNode: Boolean as PropType<VxeFormItemPropTypes.CollapseNode>,
  itemRender: Object as PropType<VxeFormItemPropTypes.ItemRender>,
  rules: Array as PropType<VxeFormItemPropTypes.Rules>
}

const formItemPropKeys = Object.keys(formItemProps)

export default defineVxeComponent({
  name: 'VxeFormItem',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: formItemProps,
  inject: {
    $xeForm: {
      default: null
    },
    $xeFormGather: {
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
      $xeFormGather(): XEFormItemProvide
    })
  },
  methods: {
    renderItem  (h: CreateElement, $xeForm: VxeFormConstructor & VxeFormPrivateMethods, item: VxeFormDefines.ItemInfo) {
      const $xeFormItem = this

      const formProps = $xeForm
      const formReactData = $xeForm.reactData
      const { data, rules, readonly, disabled, titleBold: allTitleBold, titleAlign: allTitleAlign, titleWidth: allTitleWidth, titleColon: allTitleColon, titleAsterisk: allTitleAsterisk, titleOverflow: allTitleOverflow, vertical: allVertical, padding: allPadding } = formProps
      const { collapseAll } = formReactData
      const validOpts = $xeForm.computeValidOpts
      const { slots, title, visible, folding, field, collapseNode, itemRender, showError, errRule, className, titleOverflow, vertical, padding, showTitle, contentClassName, contentStyle, titleClassName, titleStyle } = item
      const compConf = isEnableConf(itemRender) ? renderer.get(itemRender.name) : null
      const itemClassName = compConf ? (compConf.formItemClassName || compConf.itemClassName) : ''
      const itemStyle = compConf ? (compConf.formItemStyle || compConf.itemStyle) : null
      const itemContentClassName = compConf ? (compConf.formItemContentClassName || compConf.itemContentClassName) : ''
      const itemContentStyle = compConf ? (compConf.formItemContentStyle || compConf.itemContentStyle) : null
      const itemTitleClassName = compConf ? (compConf.formItemTitleClassName || compConf.itemTitleClassName) : ''
      const itemTitleStyle = compConf ? (compConf.formItemTitleStyle || compConf.itemTitleStyle) : null
      const defaultSlot = slots ? slots.default : null
      const titleSlot = slots ? slots.title : null
      const span = item.span || formProps.span
      const align = item.align || formProps.align
      const itemPadding = XEUtils.eqNull(padding) ? allPadding : padding
      const itemVertical = XEUtils.eqNull(vertical) ? allVertical : vertical
      const titleBold = XEUtils.eqNull(item.titleBold) ? allTitleBold : item.titleBold
      const titleAlign = XEUtils.eqNull(item.titleAlign) ? allTitleAlign : item.titleAlign
      const titleWidth = itemVertical ? null : (XEUtils.eqNull(item.titleWidth) ? allTitleWidth : item.titleWidth)
      const titleColon = XEUtils.eqNull(item.titleColon) ? allTitleColon : item.titleColon
      const titleAsterisk = XEUtils.eqNull(item.titleAsterisk) ? allTitleAsterisk : item.titleAsterisk
      const itemOverflow = XEUtils.eqNull(titleOverflow) ? allTitleOverflow : titleOverflow
      const ovEllipsis = itemOverflow === 'ellipsis'
      const ovTitle = itemOverflow === 'title'
      const ovTooltip = itemOverflow === true || itemOverflow === 'tooltip'
      const hasEllipsis = ovTitle || ovTooltip || ovEllipsis
      const params = { data, disabled, readonly, field, property: field, item, $form: $xeForm, $grid: $xeForm.xegrid }
      let isRequired = false
      let isValid = false
      if (visible === false) {
        return renderEmptyElement($xeFormItem)
      }
      if (!readonly && rules) {
        const itemRules = rules[field]
        if (itemRules && itemRules.length) {
          isValid = true
          isRequired = itemRules.some((rule) => rule.required)
        }
      }
      let contentVNs: VxeComponentSlotType[] = []
      const rftContent = compConf ? (compConf.renderFormItemContent || compConf.renderItemContent) : null
      if (defaultSlot) {
        contentVNs = $xeForm.callSlot(defaultSlot, params)
      } else if (rftContent) {
        contentVNs = getSlotVNs(rftContent(h, itemRender, params))
      } else if (field) {
        contentVNs = [`${XEUtils.get(data, field)}`]
      }
      if (collapseNode) {
        contentVNs.push(
          h('div', {
            class: 'vxe-form--item-trigger-node',
            on: {
              click: $xeForm.toggleCollapseEvent
            }
          }, [
            h('span', {
              class: 'vxe-form--item-trigger-text'
            }, collapseAll ? getI18n('vxe.form.unfolding') : getI18n('vxe.form.folding')),
            h('i', {
              class: ['vxe-form--item-trigger-icon', collapseAll ? getIcon().FORM_FOLDING : getIcon().FORM_UNFOLDING]
            })
          ])
        )
      }
      if (errRule && validOpts.showMessage) {
        contentVNs.push(
          h('div', {
            class: 'vxe-form--item-valid',
            style: errRule.maxWidth
              ? {
                  width: `${errRule.maxWidth}px`
                }
              : {}
          }, errRule.message)
        )
      }
      const ons: any = ovTooltip
        ? {
            mouseenter (evnt: MouseEvent) {
              $xeForm.triggerTitleTipEvent(evnt, params)
            },
            mouseleave: $xeForm.handleTitleTipLeaveEvent
          }
        : {}
      return h('div', {
        ref: 'refElem',
        class: [
          'vxe-form--item',
          item.id,
          span ? `vxe-form--item-col_${span} is--span` : '',
          className ? (XEUtils.isFunction(className) ? className(params) : className) : '',
          itemClassName ? (XEUtils.isFunction(itemClassName) ? itemClassName(params) : itemClassName) : '',
          {
            'is--title': title,
            'is--colon': titleColon,
            'is--bold': titleBold,
            'is--padding': itemPadding,
            'is--vertical': itemVertical,
            'is--asterisk': titleAsterisk,
            'is--valid': isValid,
            'is--required': isRequired,
            'is--hidden': folding && collapseAll,
            'is--active': isActiveItem($xeForm, item),
            'is--error': showError
          }
        ],
        style: XEUtils.isFunction(itemStyle) ? itemStyle(params) : (itemStyle || {})
      }, [
        h('div', {
          class: 'vxe-form--item-inner'
        }, [
          (showTitle !== false) && (title || titleSlot)
            ? h('div', {
              class: [
                'vxe-form--item-title',
                titleAlign ? `align--${titleAlign}` : '',
                hasEllipsis ? 'is--ellipsis' : '',
                itemTitleClassName ? (XEUtils.isFunction(itemTitleClassName) ? itemTitleClassName(params) : itemTitleClassName) : '',
                titleClassName ? (XEUtils.isFunction(titleClassName) ? titleClassName(params) : titleClassName) : ''
              ],
              style: Object.assign(
                {},
                XEUtils.isFunction(itemTitleStyle) ? itemTitleStyle(params) : itemTitleStyle,
                XEUtils.isFunction(titleStyle) ? titleStyle(params) : titleStyle,
                titleWidth
                  ? {
                      width: isNaN(titleWidth as number) ? titleWidth : `${titleWidth}px`
                    }
                  : null
              ),
              attrs: {

                title: ovTitle ? getFuncText(title) : null
              },
              on: ons
            }, renderTitle(h, $xeFormItem, $xeForm, item))
            : null,
          h('div', {
            class: [
              'vxe-form--item-content',
              align ? `align--${align}` : '',
              itemContentClassName ? (XEUtils.isFunction(itemContentClassName) ? itemContentClassName(params) : itemContentClassName) : '',
              contentClassName ? (XEUtils.isFunction(contentClassName) ? contentClassName(params) : contentClassName) : ''
            ],
            style: Object.assign(
              {},
              XEUtils.isFunction(itemContentStyle) ? itemContentStyle(params) : itemContentStyle,
              XEUtils.isFunction(contentStyle) ? contentStyle(params) : contentStyle
            )
          }, contentVNs)
        ])
      ])
    },
    renderVN (h: CreateElement): VNode {
      const $xeFormItem = this
      const formItem = $xeFormItem.formItem
      const $xeForm = $xeFormItem.$xeForm

      const customLayout = $xeForm ? $xeForm.customLayout : false
      return customLayout
        ? $xeFormItem.renderItem(h, $xeForm, formItem as unknown as VxeFormDefines.ItemInfo)
        : h('div', {
          ref: 'refElem'
        })
    }
  },
  provide (this: any) {
    const $xeFormItem = this
    const formItem = $xeFormItem.formItem
    return {
      $xeFormGather: null,
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
    const $xeFormGather = $xeFormItem.$xeFormGather

    formItem.slots = slots
    const elem = $xeFormItem.$refs.refElem as HTMLDivElement
    assembleItem($xeForm, elem, formItem, $xeFormGather)
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
})
