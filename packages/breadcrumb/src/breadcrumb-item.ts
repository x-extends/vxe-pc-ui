import { CreateElement, PropType, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { globalMixins, createEvent, renderEmptyElement } from '../../ui'

import type { VxeBreadcrumbItemPropTypes, BreadcrumbItemReactData, VxeComponentSizeType, VxeBreadcrumbEmits, VxeBreadcrumbConstructor, VxeBreadcrumbPrivateMethods, ValueOf } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeBreadcrumbItem',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    title: String as PropType<VxeBreadcrumbItemPropTypes.Title>,
    routerLink: Object as PropType<VxeBreadcrumbItemPropTypes.RouterLink>
  },
  inject: {
    $xeBreadcrumb: {
      default: null
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: BreadcrumbItemReactData = {
    }
    return {
      xID,
      reactData
    }
  },
  computed: {
    ...({} as {
        computeSize(): VxeComponentSizeType
        $xeBreadcrumb(): (VxeBreadcrumbConstructor & VxeBreadcrumbPrivateMethods) | null
      }),
    computeSeparator () {
      const $xeBreadcrumbItem = this
      const $xeBreadcrumb = $xeBreadcrumbItem.$xeBreadcrumb

      if ($xeBreadcrumb) {
        return $xeBreadcrumb.separator
      }
      return ''
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeBreadcrumbEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeBreadcrumbItem = this
      $xeBreadcrumbItem.$emit(type, createEvent(evnt, { $breadcrumbItem: $xeBreadcrumbItem }, params))
    },
    clickEvent  (evnt: MouseEvent) {
      const $xeBreadcrumbItem = this
      const props = $xeBreadcrumbItem
      const $xeBreadcrumb = $xeBreadcrumbItem.$xeBreadcrumb

      if ($xeBreadcrumb) {
        const item = {
          title: props.title,
          routerLink: props.routerLink
        }
        $xeBreadcrumb.handleClickLink(evnt, item)
      }
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeBreadcrumbItem = this
      const props = $xeBreadcrumbItem
      const slots = $xeBreadcrumbItem.$scopedSlots

      const { title, routerLink } = props
      const separator = $xeBreadcrumbItem.computeSeparator
      const defaultSlot = slots.default

      return h('span', {
        ref: 'refElem',
        class: 'vxe-breadcrumb-item',
        on: {
          click: $xeBreadcrumbItem.clickEvent
        }
      }, [
        h('span', {
          class: 'vxe-breadcrumb-item--content'
        }, [
          routerLink
            ? h('router-link', {
              class: 'vxe-breadcrumb-item--content-link',
              props: {
                title,
                custom: true,
                to: routerLink
              }
            }, [
              h('span', {
                class: 'vxe-breadcrumb-item--content-text'
              }, defaultSlot ? defaultSlot({}) : `${title || ''}`)
            ])
            : h('span', {
              class: 'vxe-breadcrumb-item--content-text'
            }, defaultSlot ? defaultSlot({}) : `${title || ''}`)
        ]),
        separator
          ? h('span', {
            class: 'vxe-breadcrumb-item--separator'
          }, `${separator}`)
          : renderEmptyElement($xeBreadcrumbItem)
      ])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
