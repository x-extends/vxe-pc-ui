import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { renderer, globalMixins, renderEmptyElement } from '../../ui'
import { isEnableConf } from '../../ui/src/utils'
import { renderTitle, getItemClass, getItemContentClass, renderItemContent } from './render'

import type { VxeFormConstructor, VxeFormDefines, VxeFormPrivateMethods, VxeComponentSizeType } from '../../../types'

const VxeFormConfigItem = defineVxeComponent({
  name: 'VxeFormConfigItem',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    itemConfig: Object as PropType<VxeFormDefines.ItemInfo>
  },
  inject: {
    $xeForm: {
      default: null
    }
  },
  provide () {
    const xeFormItemInfo = this
    return {
      xeFormItemInfo,
      $xeFormGroup: null
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
      $xeForm(): VxeFormConstructor & VxeFormPrivateMethods
    })
  },
  methods: {
    renderItem (h: CreateElement, $xeForm: VxeFormConstructor & VxeFormPrivateMethods, item: VxeFormDefines.ItemInfo): VNode {
      const $xeFormConfigItem = this

      const formProps = $xeForm
      const { data, readonly, disabled } = formProps
      const { visible, field, itemRender, contentStyle, children, showContent } = item
      const compConf = isEnableConf(itemRender) ? renderer.get(itemRender.name) : null
      const itemStyle = compConf ? (compConf.formItemStyle || compConf.itemStyle) : null
      const itemContentStyle = compConf ? (compConf.formItemContentStyle || compConf.itemContentStyle) : null
      const params = { data, disabled, readonly, field, property: field, item, $form: $xeForm, $grid: $xeForm.$xeGrid }
      const hasGroup = children && children.length > 0
      if (visible === false) {
        return renderEmptyElement($xeFormConfigItem)
      }
      return h('div', {
        key: item.id,
        class: getItemClass($xeForm, item),
        style: XEUtils.isFunction(itemStyle) ? itemStyle(params) : (itemStyle || {})
      }, [
        renderTitle(h, $xeForm, item),
        showContent === false
          ? renderEmptyElement($xeFormConfigItem)
          : h('div', {
            class: getItemContentClass($xeForm, item),
            style: Object.assign({}, XEUtils.isFunction(itemContentStyle) ? itemContentStyle(params) : itemContentStyle, XEUtils.isFunction(contentStyle) ? contentStyle(params) : contentStyle)
          }, hasGroup
            ? children.map((childItem) => $xeFormConfigItem.renderItem(h, $xeForm, childItem))
            : [
                renderItemContent(h, $xeForm, item)
              ])
      ])
    },
    renderVN (h: CreateElement): VNode {
      const $xeFormConfigItem = this
      const props = $xeFormConfigItem
      const $xeForm = $xeFormConfigItem.$xeForm

      return $xeFormConfigItem.renderItem(h, $xeForm, props.itemConfig)
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})

export default VxeFormConfigItem
