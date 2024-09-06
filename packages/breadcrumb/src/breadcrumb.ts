import { CreateElement, PropType, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, globalMixins, createEvent } from '../../ui'
import VxeBreadcrumbItemComponent from './breadcrumb-item'

import type { VxeBreadcrumbPropTypes, BreadcrumbReactData, VxeBreadcrumbItemProps, VxeComponentSizeType, VxeBreadcrumbEmits, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxeBreadcrumb',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    separator: {
      type: String as PropType<VxeBreadcrumbPropTypes.Separator>,
      default: () => getConfig().breadcrumb.separator
    },
    options: Array as PropType<VxeBreadcrumbPropTypes.Options>
  },
  provide () {
    const $xeBreadcrumb = this
    return {
      $xeBreadcrumb
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: BreadcrumbReactData = {
    }
    return {
      xID,
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
    })
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeBreadcrumbEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeBreadcrumb = this
      $xeBreadcrumb.$emit(type, createEvent(evnt, { $breadcrumb: $xeBreadcrumb }, params))
    },
    handleClickLink (evnt: MouseEvent, option?: VxeBreadcrumbItemProps) {
      const $xeBreadcrumb = this
      $xeBreadcrumb.dispatchEvent('click', { option }, evnt)
    },

    //
    // Render
    //
    renderItems  (h: CreateElement): VNode[] {
      const $xeBreadcrumb = this
      const props = $xeBreadcrumb

      const { options } = props
      if (options && options.length) {
        return options.map(item => {
          return h(VxeBreadcrumbItemComponent, {
            props: {
              title: item.title,
              routerLink: item.routerLink
            }
          })
        })
      }
      return []
    },
    renderVN (h: CreateElement): VNode {
      const $xeBreadcrumb = this
      const slots = $xeBreadcrumb.$scopedSlots

      const defaultSlot = slots.default

      return h('div', {
        ref: 'refElem',
        class: 'vxe-breadcrumb'
      }, defaultSlot ? defaultSlot({}) : $xeBreadcrumb.renderItems(h))
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
