import { CreateElement, VNode } from 'vue'
import { getIcon, getI18n, formats, renderer, renderEmptyElement } from '../../ui'
import { eqEmptyValue, getFuncText, isEnableConf } from '../../ui/src/utils'
import { toCssUnit } from '../../ui/src/dom'
import { getSlotVNs } from '../../ui/src/vn'
import { isActiveItem } from './util'
import VxeTooltipComponent from '../../tooltip/src/tooltip'
import VxeIconComponent from '../../icon/src/icon'
import XEUtils from 'xe-utils'

import type { VxeFormConstructor, VxeFormDefines, VxeFormItemPropTypes, VxeFormPrivateMethods, VxeComponentSlotType, VxeComponentStyleType } from '../../../types'

function renderPrefixIcon (h: CreateElement, titlePrefix: VxeFormItemPropTypes.TitlePrefix) {
  return h('span', {
    class: 'vxe-form--item-title-tip-prefix'
  }, [
    h(VxeIconComponent, {
      class: titlePrefix.icon || getIcon().FORM_PREFIX,
      props: {
        status: titlePrefix.iconStatus
      }
    })
  ])
}

function renderSuffixIcon (h: CreateElement, titleSuffix: VxeFormItemPropTypes.TitleSuffix) {
  return h('span', {
    class: 'vxe-form--item-title-tip-suffix'
  }, [
    h(VxeIconComponent, {
      class: titleSuffix.icon || getIcon().FORM_SUFFIX,
      props: {
        status: titleSuffix.iconStatus
      }
    })
  ])
}

export const getItemClass = ($xeForm: VxeFormConstructor & VxeFormPrivateMethods, item: VxeFormDefines.ItemInfo, isGroup?: boolean) => {
  const formProps = $xeForm
  const formReactData = $xeForm.reactData
  const $xeGrid = $xeForm.$xeGrid

  const { data, rules, readonly, disabled, span: allSpan, titleBackground: allTitleBackground, titleBold: allTitleBold, titleColon: allTitleColon, titleAsterisk: allTitleAsterisk, vertical: allVertical, padding: allPadding } = formProps
  const { collapseAll } = formReactData
  const { folding, field, itemRender, showError, className, vertical, padding, children, showContent } = item
  const compConf = isEnableConf(itemRender) ? renderer.get(itemRender.name) : null
  const itemClassName = compConf ? (compConf.formItemClassName || compConf.itemClassName) : ''
  const span = item.span || allSpan
  const itemPadding = XEUtils.eqNull(padding) ? allPadding : padding
  const itemVertical = XEUtils.eqNull(vertical) ? allVertical : vertical
  const titleBackground = XEUtils.eqNull(item.titleBackground) ? allTitleBackground : item.titleBackground
  const titleBold = XEUtils.eqNull(item.titleBold) ? allTitleBold : item.titleBold
  const titleColon = XEUtils.eqNull(item.titleColon) ? allTitleColon : item.titleColon
  const titleAsterisk = XEUtils.eqNull(item.titleAsterisk) ? allTitleAsterisk : item.titleAsterisk
  const params = { data, disabled, readonly, field, property: field, item, $form: $xeForm, $grid: $xeGrid }
  const hasGroup = children && children.length > 0
  let isRequired = false
  let isValid = false
  if (!readonly && rules) {
    const itemRules = rules[field]
    if (itemRules && itemRules.length) {
      isValid = true
      isRequired = itemRules.some((rule) => rule.required)
    }
  }
  return [
    isGroup || hasGroup ? 'vxe-form--group' : '',
    'vxe-form--item',
    item.id,
    span ? `vxe-form--item-col_${span} is--span` : '',
    className ? (XEUtils.isFunction(className) ? className(params) : className) : '',
    itemClassName ? (XEUtils.isFunction(itemClassName) ? itemClassName(params) : itemClassName) : '',
    {
      'is--colon': titleColon,
      'is--tbg': titleBackground,
      'is--bold': titleBold,
      'is--padding': itemPadding,
      'is--vertical': itemVertical,
      'is--asterisk': titleAsterisk,
      'hide--content': showContent === false,
      'is--valid': isValid,
      'is--required': isRequired,
      'is--hidden': folding && collapseAll,
      'is--active': isActiveItem($xeForm, item),
      'is--error': showError
    }
  ]
}

export const getItemContentClass = ($xeForm: VxeFormConstructor & VxeFormPrivateMethods, item: VxeFormDefines.ItemInfo, isGroup?: boolean) => {
  const formProps = $xeForm
  const $xeGrid = $xeForm.$xeGrid

  const { data, readonly, disabled, align: allAlign, verticalAlign: allVerticalAlign } = formProps
  const { field, itemRender, contentClassName, children } = item
  const compConf = isEnableConf(itemRender) ? renderer.get(itemRender.name) : null
  const itemContentClassName = compConf ? (compConf.formItemContentClassName || compConf.itemContentClassName) : ''
  const align = XEUtils.eqNull(item.align) ? allAlign : item.align
  const verticalAlign = XEUtils.eqNull(item.verticalAlign) ? allVerticalAlign : item.verticalAlign
  const params = { data, disabled, readonly, field, property: field, item, $form: $xeForm, $grid: $xeGrid }
  const hasGroup = children && children.length > 0

  return [
    isGroup || hasGroup ? 'vxe-form--group-content vxe-form--item-row' : '',
    'vxe-form--item-content',
    align ? `align--${align}` : '',
    verticalAlign ? `vertical-align--${verticalAlign}` : '',
    itemContentClassName ? (XEUtils.isFunction(itemContentClassName) ? itemContentClassName(params) : itemContentClassName) : '',
    contentClassName ? (XEUtils.isFunction(contentClassName) ? contentClassName(params) : contentClassName) : ''
  ]
}

export function renderTitle (h: CreateElement, $xeForm: VxeFormConstructor & VxeFormPrivateMethods, item: VxeFormDefines.ItemInfo, isGroup?: boolean) {
  const formProps = $xeForm
  const $xeGrid = $xeForm.$xeGrid

  const { data, readonly, disabled, titleAlign: allTitleAlign, titleWidth: allTitleWidth, titleOverflow: allTitleOverflow, vertical: allVertical } = formProps
  const { slots, title, field, itemRender, titleOverflow, vertical, showTitle, titleClassName, titleStyle, titlePrefix, titleSuffix, children, showContent } = item
  const tooltipOpts = $xeForm.computeTooltipOpts
  const compConf = isEnableConf(itemRender) ? renderer.get(itemRender.name) : null
  const itemTitleClassName = compConf ? (compConf.formItemTitleClassName || compConf.itemTitleClassName) : ''
  const itemTitleStyle = compConf ? (compConf.formItemTitleStyle || compConf.itemTitleStyle) : null
  const itemVertical = XEUtils.eqNull(vertical) ? allVertical : vertical
  const titleAlign = XEUtils.eqNull(item.titleAlign) ? allTitleAlign : item.titleAlign
  const titleWidth = itemVertical ? null : (XEUtils.eqNull(item.titleWidth) ? allTitleWidth : item.titleWidth)
  const itemOverflow = XEUtils.eqNull(titleOverflow) ? allTitleOverflow : titleOverflow
  const ovEllipsis = itemOverflow === 'ellipsis'
  const ovTitle = itemOverflow === 'title'
  const ovTooltip = itemOverflow === true || itemOverflow === 'tooltip'
  const hasEllipsis = ovTitle || ovTooltip || ovEllipsis
  const params = { data, disabled, readonly, field, property: field, item, $form: $xeForm, $grid: $xeGrid }
  const titleSlot = slots ? slots.title : null
  const prefixSlot = slots ? slots.prefix : null
  const suffixSlot = slots ? slots.suffix || slots.extra : null
  const isTitle = (showTitle !== false) && (title || titleSlot)
  const hasGroup = children && children.length > 0
  const titVNs: VNode[] = []
  if (prefixSlot) {
    titVNs.push(
      h('span', {
        key: 'pt',
        class: 'vxe-form--item-title-prefix'
      }, $xeForm.callSlot(prefixSlot, params, h))
    )
  }
  if (titlePrefix) {
    titVNs.push(
      (titlePrefix.content || titlePrefix.message)
        ? h(VxeTooltipComponent, {
          key: 'pm',
          props: {
            ...tooltipOpts,
            ...titlePrefix,
            content: getFuncText(titlePrefix.content || titlePrefix.message)
          },
          scopedSlots: {
            default: () => renderPrefixIcon(h, titlePrefix)
          }
        })
        : renderPrefixIcon(h, titlePrefix)
    )
  }
  const rftTitle = compConf ? (compConf.renderFormItemTitle || compConf.renderItemTitle) : null
  titVNs.push(
    h('span', {
      key: 'pl',
      class: 'vxe-form--item-title-label'
    }, titleSlot ? $xeForm.callSlot(titleSlot, params, h) : (rftTitle ? getSlotVNs(rftTitle.call($xeForm, h, itemRender, params)) : getFuncText(item.title)))
  )
  const fixVNs = []
  if (titleSuffix) {
    fixVNs.push(
      (titleSuffix.content || titleSuffix.message)
        ? h(VxeTooltipComponent, {
          key: 'sm',
          props: {
            ...tooltipOpts,
            ...titleSuffix,
            content: getFuncText(titleSuffix.content || titleSuffix.message)
          },
          scopedSlots: {
            default: () => renderSuffixIcon(h, titleSuffix)
          }
        })
        : renderSuffixIcon(h, titleSuffix)
    )
  }
  if (suffixSlot) {
    fixVNs.push(
      h('span', {
        key: 'st',
        class: 'vxe-form--item-title-suffix'
      }, $xeForm.callSlot(suffixSlot, params, h))
    )
  }
  const ons: any = ovTooltip
    ? {
        onMouseenter (evnt: MouseEvent) {
          $xeForm.triggerTitleTipEvent(evnt, params)
        },
        onMouseleave: $xeForm.handleTitleTipLeaveEvent
      }
    : {}
  const itStyle: VxeComponentStyleType = Object.assign(
    {},
    XEUtils.isFunction(itemTitleStyle) ? itemTitleStyle(params) : itemTitleStyle,
    XEUtils.isFunction(titleStyle) ? titleStyle(params) : titleStyle
  )
  if (titleWidth && titleWidth !== 'auto' && showContent !== false) {
    itStyle.width = toCssUnit(titleWidth)
  }

  return isTitle
    ? h('div', {
      class: [
        isGroup || hasGroup ? 'vxe-form--group-title' : '',
        'vxe-form--item-title',
        titleAlign ? `align--${titleAlign}` : '',
        hasEllipsis ? 'is--ellipsis' : '',
        itemTitleClassName ? (XEUtils.isFunction(itemTitleClassName) ? itemTitleClassName(params) : itemTitleClassName) : '',
        titleClassName ? (XEUtils.isFunction(titleClassName) ? titleClassName(params) : titleClassName) : ''
      ],
      style: itStyle,
      attrs: {
        itemid: item.id,
        title: ovTitle ? getFuncText(title) : null
      },
      on: ons
    }, [
      h('div', {
        class: 'vxe-form--item-title-content'
      }, titVNs),
      h('div', {
        class: 'vxe-form--item-title-postfix'
      }, fixVNs)
    ])
    : renderEmptyElement($xeForm)
}

export const renderItemContent = (h: CreateElement, $xeForm: VxeFormConstructor & VxeFormPrivateMethods, item: VxeFormDefines.ItemInfo) => {
  const formProps = $xeForm
  const formReactData = $xeForm.reactData
  const formInternalData = $xeForm.internalData
  const $xeGrid = $xeForm.$xeGrid

  const { data, readonly, disabled } = formProps
  const { itemFormatCache } = formInternalData
  const { collapseAll } = formReactData
  const { slots, field, itemRender, collapseNode, errRule, formatter } = item
  const defaultSlot = slots ? slots.default : null
  const validSlot = slots ? slots.valid : null
  const validOpts = $xeForm.computeValidOpts
  const collapseOpts = $xeForm.computeCollapseOpts
  const compConf = isEnableConf(itemRender) ? renderer.get(itemRender.name) : null

  const itemValue = XEUtils.get(data, field)
  const params = { data, disabled, readonly, field, property: field, item, itemValue, $form: $xeForm, $grid: $xeGrid }

  let contentVNs: VxeComponentSlotType[] = []
  const rftContent = compConf ? (compConf.renderFormItemContent || compConf.renderItemContent) : null
  if (defaultSlot) {
    contentVNs = $xeForm.callSlot(defaultSlot, params, h)
  } else if (rftContent) {
    contentVNs = getSlotVNs(rftContent.call($xeForm, h, itemRender, params))
  } else if (field) {
    let itemLabel = itemValue
    if (formatter) {
      let formatData: {
        value?: any
        label?: any
      } | undefined
      if (field) {
        const itemRest = itemFormatCache[field]
        if (itemRest) {
          formatData = itemRest.formatData
          if (formatData) {
            if (formatData.value === itemValue) {
              return formatData.label
            }
          } else {
            formatData = itemRest.formatData = {}
          }
        } else {
          itemFormatCache[field] = { field }
        }
      }
      if (XEUtils.isString(formatter)) {
        const gFormatOpts = formats.get(formatter)
        const fiFormatMethod = gFormatOpts ? gFormatOpts.formItemFormatMethod : null
        itemLabel = fiFormatMethod ? fiFormatMethod(params) : ''
      } else if (XEUtils.isArray(formatter)) {
        const gFormatOpts = formats.get(formatter[0])
        const fiFormatMethod = gFormatOpts ? gFormatOpts.formItemFormatMethod : null
        itemLabel = fiFormatMethod ? fiFormatMethod(params, ...formatter.slice(1)) : ''
      } else {
        itemLabel = formatter(params)
      }
      if (formatData) {
        formatData.value = itemValue
        formatData.label = itemLabel
      }
    }
    contentVNs = [eqEmptyValue(itemLabel) ? '' : `${itemLabel}`]
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
        }, collapseAll ? (collapseOpts.unfoldButtonText || getI18n('vxe.form.unfolding')) : (collapseOpts.foldButtonText || getI18n('vxe.form.folding'))),
        h('i', {
          class: ['vxe-form--item-trigger-icon', collapseAll ? (collapseOpts.foldIcon || getIcon().FORM_FOLDING) : (collapseOpts.unfoldIcon || getIcon().FORM_UNFOLDING)]
        })
      ])
    )
  }
  if (errRule && validOpts.showMessage) {
    const validParams = { ...params, rule: errRule }
    contentVNs.push(
      h('div', {
        class: 'vxe-form-item--valid-error-tip',
        style: errRule.maxWidth
          ? {
              width: toCssUnit(errRule.maxWidth)
            }
          : {}
      }, [
        h('div', {
          class: `vxe-form-item--valid-error-wrapper vxe-form-item--valid-error-theme-${validOpts.theme || 'normal'}`
        }, [
          validSlot
            ? $xeForm.callSlot(validSlot, validParams, h)
            : [
                h('span', {
                  class: 'vxe-form--item--valid-error-msg'
                }, errRule.content || errRule.message)
              ]
        ])
      ])
    )
  }
  return h('div', {
    class: 'vxe-form--item-inner'
  }, contentVNs)
}
