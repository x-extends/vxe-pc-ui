import { CreateElement, VNode } from 'vue'
import { getIcon, renderer, renderEmptyElement } from '../../ui'
import { getFuncText, isEnableConf } from '../../ui/src/utils'
import { getSlotVNs } from '../../ui/src/vn'
import VxeTooltipComponent from '../../tooltip/src/tooltip'
import VxeIconComponent from '../../icon/src/icon'

import type { VxeFormConstructor, VxeFormDefines, VxeFormItemPropTypes, VxeFormItemConstructor, VxeFormGatherConstructor, VxeFormPrivateMethods } from '../../../types'

function renderPrefixIcon (h: CreateElement, titlePrefix: VxeFormItemPropTypes.TitlePrefix) {
  return h('span', {
    class: 'vxe-form--item-title-prefix'
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
    class: 'vxe-form--item-title-suffix'
  }, [
    h(VxeIconComponent, {
      class: titleSuffix.icon || getIcon().FORM_SUFFIX,
      props: {
        status: titleSuffix.iconStatus
      }
    })
  ])
}

export function renderTitle (h: CreateElement, _vm: VxeFormItemConstructor | VxeFormGatherConstructor, $xeForm: VxeFormConstructor & VxeFormPrivateMethods, item: VxeFormDefines.ItemInfo) {
  const formProps = $xeForm
  const { data, readonly, disabled } = formProps
  const { slots, field, itemRender, titlePrefix, titleSuffix } = item
  const tooltipOpts = $xeForm.computeTooltipOpts
  const compConf = isEnableConf(itemRender) ? renderer.get(itemRender.name) : null
  const params = { data, readonly, disabled, field, property: field, item, $form: $xeForm, $grid: $xeForm.xegrid }
  const titleSlot = slots ? slots.title : null
  const extraSlot = slots ? slots.extra : null
  const titVNs: VNode[] = []
  if (titlePrefix) {
    titVNs.push(
      (titlePrefix.content || titlePrefix.message)
        ? h(VxeTooltipComponent, {
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
      class: 'vxe-form--item-title-label'
    }, titleSlot ? $xeForm.callSlot(titleSlot, params, h) : (rftTitle ? getSlotVNs(rftTitle.call($xeForm, h, itemRender, params)) : getFuncText(item.title)))
  )
  const fixVNs = []
  if (titleSuffix) {
    fixVNs.push(
      (titleSuffix.content || titleSuffix.message)
        ? h(VxeTooltipComponent, {
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
      }, $xeForm.callSlot(extraSlot, params, h))
      : renderEmptyElement(_vm)
  ]
}
