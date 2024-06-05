import { h } from 'vue'
import { getIcon, renderer } from '../../ui'
import { getFuncText, isEnableConf } from '../../ui/src/utils'
import { getSlotVNs } from '../../ui/src/vn'
import VxeTooltipComponent from '../../tooltip'

import type { VxeFormConstructor, VxeFormDefines, VxeFormItemPropTypes, VxeFormPrivateMethods } from '../../../types'

function renderPrefixIcon (titlePrefix: VxeFormItemPropTypes.TitlePrefix) {
  return h('span', {
    class: 'vxe-form--item-title-prefix'
  }, [
    h('i', {
      class: titlePrefix.icon || getIcon().FORM_PREFIX
    })
  ])
}

function renderSuffixIcon (titleSuffix: VxeFormItemPropTypes.TitleSuffix) {
  return h('span', {
    class: 'vxe-form--item-title-suffix'
  }, [
    h('i', {
      class: titleSuffix.icon || getIcon().FORM_SUFFIX
    })
  ])
}

export function renderTitle ($xeForm: VxeFormConstructor & VxeFormPrivateMethods, item: VxeFormDefines.ItemInfo) {
  const { data } = $xeForm.props
  const { computeTooltipOpts } = $xeForm.getComputeMaps()
  const { slots, field, itemRender, titlePrefix, titleSuffix } = item
  const tooltipOpts = computeTooltipOpts.value
  const compConf = isEnableConf(itemRender) ? renderer.get(itemRender.name) : null
  const params = { data, field, property: field, item, $form: $xeForm, $grid: $xeForm.xegrid }
  const titleSlot = slots ? slots.title : null
  const contVNs = []
  const titVNs = []
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
  titVNs.push(
    h('span', {
      class: 'vxe-form--item-title-label'
    }, compConf && compConf.renderItemTitle ? getSlotVNs(compConf.renderItemTitle(itemRender, params)) : (titleSlot ? $xeForm.callSlot(titleSlot, params) : getFuncText(item.title)))
  )
  contVNs.push(
    h('div', {
      class: 'vxe-form--item-title-content'
    }, titVNs)
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
  contVNs.push(
    h('div', {
      class: 'vxe-form--item-title-postfix'
    }, fixVNs)
  )
  return contVNs
}
