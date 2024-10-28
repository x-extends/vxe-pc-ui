import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { getConfig, getIcon, getI18n, globalMixins, createEvent, renderEmptyElement } from '../../ui'
import { getSlotVNs } from '../../ui/src/vn'
import XEUtils from 'xe-utils'

import type { VxeLoadingPropTypes, LoadingReactData, VxeLoadingEmits, VxeComponentSizeType, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxeLoading',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    value: Boolean as PropType<VxeLoadingPropTypes.ModelValue>,
    icon: {
      type: String as PropType<VxeLoadingPropTypes.Icon>,
      default: () => getConfig().loading.icon
    },
    showIcon: {
      type: Boolean as PropType<VxeLoadingPropTypes.ShowIcon>,
      default: () => getConfig().loading.showIcon
    },
    text: {
      type: String as PropType<VxeLoadingPropTypes.Text>,
      default: () => getConfig().loading.text
    },
    showText: {
      type: Boolean as PropType<VxeLoadingPropTypes.ShowText>,
      default: () => getConfig().loading.showText
    },
    status: String as PropType<VxeLoadingPropTypes.Status>,
    size: {
      type: String as PropType<VxeLoadingPropTypes.Size>,
      default: () => getConfig().loading.size || getConfig().size
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: LoadingReactData = {
      initialized: false
    }
    return {
      xID,
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
    }),
    computeLoadingIcon () {
      const $xeLoading = this
      const props = $xeLoading

      return props.icon || getIcon().LOADING
    },
    computeLoadingText () {
      const $xeLoading = this
      const props = $xeLoading

      const { text } = props
      return XEUtils.isString(text) ? text : getI18n('vxe.loading.text')
    }
  },
  watch: {
    value () {
      this.handleInit()
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeLoadingEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeLoading = this
      $xeLoading.$emit(type, createEvent(evnt, { $loading: $xeLoading }, params))
    },
    emitModel  (value: any) {
      const $xeLoading = this

      const { _events } = $xeLoading as any
      $xeLoading.$emit('input', value)
      if (_events && _events.modelValue) {
        $xeLoading.$emit('modelValue', value)
      } else {
        $xeLoading.$emit('model-value', value)
      }
    },
    handleInit () {
      const $xeLoading = this
      const reactData = $xeLoading.reactData

      if (!reactData.initialized) {
        reactData.initialized = !!reactData.initialized
      }
    },
    //
    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeLoading = this
      const props = $xeLoading
      const slots = $xeLoading.$scopedSlots
      const reactData = $xeLoading.reactData

      const { value, showIcon, status } = props
      const { initialized } = reactData
      const vSize = $xeLoading.computeSize
      const defaultSlot = slots.default
      const textSlot = slots.text
      const iconSlot = slots.icon
      const loadingIcon = $xeLoading.computeLoadingIcon
      const loadingText = $xeLoading.computeLoadingText

      if (!initialized && !value) {
        return renderEmptyElement($xeLoading)
      }

      return h('div', {
        class: ['vxe-loading', {
          [`size--${vSize}`]: vSize,
          [`theme--${status}`]: status,
          'is--visible': value
        }]
      }, defaultSlot
        ? [
            h('div', {
              class: 'vxe-loading--wrapper'
            }, getSlotVNs(defaultSlot({})))
          ]
        : [
            h('div', {
              class: 'vxe-loading--chunk'
            }, [
              showIcon && (iconSlot || loadingIcon)
                ? h('div', {
                  class: 'vxe-loading--icon'
                }, iconSlot
                  ? getSlotVNs(iconSlot({}))
                  : [
                      h('i', {
                        class: loadingIcon
                      })
                    ])
                : h('div', {
                  class: 'vxe-loading--spinner'
                }),
              textSlot || loadingText
                ? h('div', {
                  class: 'vxe-loading--text'
                }, textSlot ? getSlotVNs(textSlot({})) : `${loadingText}`)
                : null
            ])
          ])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
