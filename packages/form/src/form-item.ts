import { defineComponent, h, onUnmounted, inject, ref, Ref, provide, onMounted, PropType, createCommentVNode, reactive } from 'vue'
import XEUtils from 'xe-utils'
import { getIcon, getI18n, renderer, VxeComponentSlotType } from '../../ui'
import { getFuncText, isEnableConf } from '../../ui/src/utils'
import { getSlotVNs } from '../../ui/src/vn'
import { createItem, watchItem, destroyItem, assembleItem, XEFormItemProvide, isActiveItem } from './util'
import { renderTitle } from './render'

import type { VxeFormConstructor, VxeFormDefines, VxeFormItemPropTypes, VxeFormPrivateMethods } from '../../../types'

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
  visible: { type: Boolean as PropType<VxeFormItemPropTypes.Visible>, default: null },
  folding: Boolean as PropType<VxeFormItemPropTypes.Folding>,
  collapseNode: Boolean as PropType<VxeFormItemPropTypes.CollapseNode>,
  itemRender: Object as PropType<VxeFormItemPropTypes.ItemRender>,
  rules: Array as PropType<VxeFormItemPropTypes.Rules>
}

export default defineComponent({
  name: 'VxeFormItem',
  props: formItemProps,
  setup (props, { slots }) {
    const refElem = ref() as Ref<HTMLDivElement>
    const $xeForm = inject('$xeForm', {} as VxeFormConstructor & VxeFormPrivateMethods)
    const formGather = inject('$xeFormGather', null as XEFormItemProvide | null)
    const formItem = reactive(createItem($xeForm, props))
    formItem.slots = slots

    const formItemInfo = { itemConfig: formItem }
    provide('xeFormItemInfo', formItemInfo)

    watchItem(props, formItem)

    onMounted(() => {
      assembleItem($xeForm, refElem.value, formItem, formGather)
    })

    onUnmounted(() => {
      destroyItem($xeForm, formItem)
    })

    const renderItem = ($xeForm: VxeFormConstructor & VxeFormPrivateMethods, item: VxeFormDefines.ItemInfo) => {
      const { props, reactData } = $xeForm
      const { data, rules, titleBold: allTitleBold, titleAlign: allTitleAlign, titleWidth: allTitleWidth, titleColon: allTitleColon, titleAsterisk: allTitleAsterisk, titleOverflow: allTitleOverflow, vertical: allVertical } = props
      const { collapseAll } = reactData
      const { computeValidOpts } = $xeForm.getComputeMaps()
      const validOpts = computeValidOpts.value
      const { slots, title, visible, folding, field, collapseNode, itemRender, showError, errRule, className, titleOverflow, vertical, showTitle, contentClassName, contentStyle, titleClassName, titleStyle } = item
      const compConf = isEnableConf(itemRender) ? renderer.get(itemRender.name) : null
      const itemClassName = compConf ? compConf.itemClassName : ''
      const itemStyle = compConf ? compConf.itemStyle : null
      const itemContentClassName = compConf ? compConf.itemContentClassName : ''
      const itemContentStyle = compConf ? compConf.itemContentStyle : null
      const itemTitleClassName = compConf ? compConf.itemTitleClassName : ''
      const itemTitleStyle = compConf ? compConf.itemTitleStyle : null
      const defaultSlot = slots ? slots.default : null
      const titleSlot = slots ? slots.title : null
      const span = item.span || props.span
      const align = item.align || props.align
      const titleBold = XEUtils.eqNull(item.titleBold) ? allTitleBold : item.titleBold
      const titleAlign = XEUtils.eqNull(item.titleAlign) ? allTitleAlign : item.titleAlign
      const titleWidth = XEUtils.eqNull(item.titleWidth) ? allTitleWidth : item.titleWidth
      const titleColon = XEUtils.eqNull(item.titleColon) ? allTitleColon : item.titleColon
      const titleAsterisk = XEUtils.eqNull(item.titleAsterisk) ? allTitleAsterisk : item.titleAsterisk
      const itemOverflow = (XEUtils.isUndefined(titleOverflow) || XEUtils.isNull(titleOverflow)) ? allTitleOverflow : titleOverflow
      const itemVertical = (XEUtils.isUndefined(vertical) || XEUtils.isNull(vertical)) ? allVertical : vertical
      const ovEllipsis = itemOverflow === 'ellipsis'
      const ovTitle = itemOverflow === 'title'
      const ovTooltip = itemOverflow === true || itemOverflow === 'tooltip'
      const hasEllipsis = ovTitle || ovTooltip || ovEllipsis
      const params = { data, field, property: field, item, $form: $xeForm, $grid: $xeForm.xegrid }
      let isRequired = false
      if (visible === false) {
        return createCommentVNode()
      }
      if (rules) {
        const itemRules = rules[field]
        if (itemRules) {
          isRequired = itemRules.some((rule) => rule.required)
        }
      }
      let contentVNs: VxeComponentSlotType[] = []
      if (defaultSlot) {
        contentVNs = $xeForm.callSlot(defaultSlot, params)
      } else if (compConf && compConf.renderItemContent) {
        contentVNs = getSlotVNs(compConf.renderItemContent(itemRender, params))
      } else if (field) {
        contentVNs = [`${XEUtils.get(data, field)}`]
      }
      if (collapseNode) {
        contentVNs.push(
          h('div', {
            class: 'vxe-form--item-trigger-node',
            onClick: $xeForm.toggleCollapseEvent
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
              : null
          }, errRule.message)
        )
      }
      const ons = ovTooltip
        ? {
            onMouseenter (evnt: MouseEvent) {
              $xeForm.triggerTitleTipEvent(evnt, params)
            },
            onMouseleave: $xeForm.handleTitleTipLeaveEvent
          }
        : {}
      return h('div', {
        ref: refElem,
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
            'is--vertical': itemVertical,
            'is--asterisk': titleAsterisk,
            'is--required': isRequired,
            'is--hidden': folding && collapseAll,
            'is--active': isActiveItem($xeForm, item),
            'is--error': showError
          }
        ],
        style: XEUtils.isFunction(itemStyle) ? itemStyle(params) : itemStyle
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
              title: ovTitle ? getFuncText(title) : null,
              ...ons
            }, renderTitle($xeForm, item))
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
    }

    const renderVN = () => {
      const formProps = $xeForm ? $xeForm.props : null
      return formProps && formProps.customLayout
        ? renderItem($xeForm, formItem as unknown as VxeFormDefines.ItemInfo)
        : h('div', {
          ref: refElem
        })
    }

    const $xeFormitem = {
      formItem,

      renderVN
    }

    provide('$xeFormItem', $xeFormitem)
    provide('$xeFormGather', null)

    return $xeFormitem
  },
  render () {
    return this.renderVN()
  }
})
