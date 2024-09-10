import { createCommentVNode, h, VNode } from 'vue'
import { getIcon, renderer } from '../../ui'
import { getFuncText, isEnableConf } from '../../ui/src/utils'
import { getSlotVNs } from '../../ui/src/vn'
import VxeTooltipComponent from '../../tooltip/src/tooltip'
import VxeIconComponent from '../../icon/src/icon'

import type { VxeFormConstructor, VxeFormDefines, VxeFormItemPropTypes, VxeFormPrivateMethods } from '../../../types'

function renderPrefixIcon (titlePrefix: VxeFormItemPropTypes.TitlePrefix) {
  return h('span', {
    class: 'vxe-form--item-title-prefix'
  }, [
    h(VxeIconComponent, {
      class: titlePrefix.icon || getIcon().FORM_PREFIX,
      status: titlePrefix.iconStatus
    })
  ])
}

function renderSuffixIcon (titleSuffix: VxeFormItemPropTypes.TitleSuffix) {
  return h('span', {
    class: 'vxe-form--item-title-suffix'
  }, [
    h(VxeIconComponent, {
      class: titleSuffix.icon || getIcon().FORM_SUFFIX,
      status: titleSuffix.iconStatus
    })
  ])
}

export function renderTitle ($xeForm: VxeFormConstructor & VxeFormPrivateMethods, item: VxeFormDefines.ItemInfo) {
  const formProps = $xeForm.props
  const { data, readonly, disabled } = formProps
  const { computeTooltipOpts } = $xeForm.getComputeMaps()
  const { slots, field, itemRender, titlePrefix, titleSuffix } = item
  const tooltipOpts = computeTooltipOpts.value
  const compConf = isEnableConf(itemRender) ? renderer.get(itemRender.name) : null
  const params = { data, readonly, disabled, field, property: field, item, $form: $xeForm, $grid: $xeForm.xegrid }
  const titleSlot = slots ? slots.title : null
  const extraSlot = slots ? slots.extra : null
  const titVNs: VNode[] = []
  if (titlePrefix) {
    titVNs.push(
      (titlePrefix.content || titlePrefix.message)
        ? h(VxeTooltipComponent, {
          ...tooltipOpts,
          ...titlePrefix,
          content: getFuncText(titlePrefix.content || titlePrefix.message)
        }, {
          default: () => renderPrefixIcon(titlePrefix)
        })
        : renderPrefixIcon(titlePrefix)
    )
  }
  const rftTitle = compConf ? (compConf.renderFormItemTitle || compConf.renderItemTitle) : null
  titVNs.push(
    h('span', {
      class: 'vxe-form--item-title-label'
    }, titleSlot ? $xeForm.callSlot(titleSlot, params) : (rftTitle ? getSlotVNs(rftTitle(itemRender, params)) : getFuncText(item.title)))
  )
  const fixVNs = []
  if (titleSuffix) {
    fixVNs.push(
      (titleSuffix.content || titleSuffix.message)
        ? h(VxeTooltipComponent, {
          ...tooltipOpts,
          ...titleSuffix,
          content: getFuncText(titleSuffix.content || titleSuffix.message)
        }, {
          default: () => renderSuffixIcon(titleSuffix)
        })
        : renderSuffixIcon(titleSuffix)
    )
  }
  return [
    h('div', {
      class: 'vxe-form--item-title-content'
    }, titVNs),
    h('div', {
      class: 'vxe-form--item-title-postfix'
    }, fixVNs),
    extraSlot
      ? h('div', {
        class: 'vxe-form--item-title-extra'
      }, $xeForm.callSlot(extraSlot, params))
      : createCommentVNode()
  ]
}
