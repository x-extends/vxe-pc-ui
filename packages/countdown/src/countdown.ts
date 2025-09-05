import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getI18n, createEvent, globalMixins, renderEmptyElement } from '../../ui'
import { getSlotVNs } from '../../ui/src/vn'
import VxeTextComponent from '../../text/src/text'

import type { VxeCountdownPropTypes, CountdownReactData, CountdownInternalData, VxeCountdownEmits, VxeComponentSizeType, ValueOf } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeCountdown',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    value: [Number, String] as PropType<VxeCountdownPropTypes.ModelValue>,
    format: String as PropType<VxeCountdownPropTypes.Format>,
    prefixConfig: Object as PropType<VxeCountdownPropTypes.PrefixConfig>,
    suffixConfig: Object as PropType<VxeCountdownPropTypes.SuffixConfig>,
    size: {
      type: String as PropType<VxeCountdownPropTypes.Size>,
      default: () => getConfig().countdown.size || getConfig().size
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: CountdownReactData = {
      currNum: 0,
      secondNum: 0
    }
    const internalData: CountdownInternalData = {
      dnTimeout: undefined
    }
    return {
      xID,
      reactData,
      internalData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
    }),
    computeTimeFormats (): Array<'yyyy' | 'MM' | 'dd' | 'HH' | 'mm' | 'ss'> {
      const $xeCountdown = this
      const reactData = $xeCountdown.reactData

      const { secondNum } = reactData
      if (secondNum >= 31622400000) {
        return ['yyyy', 'MM', 'dd', 'HH', 'mm', 'ss']
      }
      if (secondNum >= 2678400000) {
        return ['MM', 'dd', 'HH', 'mm', 'ss']
      }
      if (secondNum >= 86400000) {
        return ['dd', 'HH', 'mm', 'ss']
      }
      if (secondNum >= 3600000) {
        return ['HH', 'mm', 'ss']
      }
      if (secondNum >= 60000) {
        return ['mm', 'ss']
      }
      return ['ss']
    },
    computeDiffConf (this: any) {
      const $xeCountdown = this
      const reactData = $xeCountdown.reactData

      const { currNum } = reactData
      const diffRest = XEUtils.getDateDiff(Date.now(), Date.now() + currNum)
      return Object.assign(diffRest, { done: !(XEUtils.isBoolean(diffRest.status) ? diffRest.status : diffRest.done) })
    },
    computeFormatLabel () {
      const $xeCountdown = this
      const props = $xeCountdown

      const { format } = props
      const diffConf = $xeCountdown.computeDiffConf
      let rest = ''
      if (format) {
        rest = `${format}`
        XEUtils.each(diffConf, (val, key) => {
          rest = rest.replace(new RegExp(key, 'g'), XEUtils.padStart(val, key.length, '0'))
        })
        return rest
      }
      return rest
    },
    computePrefixOpts () {
      const $xeCountdown = this
      const props = $xeCountdown

      return Object.assign({}, props.prefixConfig, getConfig().countdown.prefixConfig)
    },
    computeSuffixOpts () {
      const $xeCountdown = this
      const props = $xeCountdown

      return Object.assign({}, props.suffixConfig, getConfig().countdown.suffixConfig)
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeCountdownEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeCountdown = this
      $xeCountdown.$emit(type, createEvent(evnt, { $carousel: $xeCountdown }, params))
    },
    updateCount () {
      const $xeCountdown = this
      const props = $xeCountdown
      const reactData = $xeCountdown.reactData

      const secondNum = XEUtils.toNumber(props.value || 0)
      reactData.secondNum = secondNum
      reactData.currNum = secondNum
    },
    handleTime () {
      const $xeCountdown = this
      const reactData = $xeCountdown.reactData
      const internalData = $xeCountdown.internalData

      const { currNum } = reactData
      if (currNum > 1000) {
        reactData.currNum -= 1000
        internalData.dnTimeout = setTimeout(() => {
          $xeCountdown.handleTime()
        }, 1000)
      } else {
        reactData.currNum = 0
        $xeCountdown.handleStop()
      }
    },
    handleStart () {
      const $xeCountdown = this

      $xeCountdown.dispatchEvent('start', {}, null)
      $xeCountdown.handleTime()
    },
    handleStop  () {
      const $xeCountdown = this
      const internalData = $xeCountdown.internalData

      const { dnTimeout } = internalData
      if (dnTimeout) {
        clearTimeout(dnTimeout)
        internalData.dnTimeout = undefined
        $xeCountdown.dispatchEvent('end', {}, null)
      }
    },

    //
    // Render
    //
    renderDefaultContentVNs  (h: CreateElement) {
      const $xeCountdown = this
      const props = $xeCountdown

      const { format } = props
      const timeFormats = $xeCountdown.computeTimeFormats
      const diffConf = $xeCountdown.computeDiffConf
      const formatLabel = $xeCountdown.computeFormatLabel

      if (format) {
        return [
          h('div', {
            key: 'format',
            class: 'vxe-countdown--content-format'
          }, formatLabel)
        ]
      }
      return timeFormats.map((key, index) => {
        return h('div', {
          key: index,
          class: 'vxe-countdown--content-item'
        }, [
          h('div', {
            class: 'vxe-countdown--content-num'
          }, `${diffConf[key] || 0}`),
          h('div', {
            class: 'vxe-countdown--content-unit'
          }, getI18n(`vxe.countdown.formats.${key}`))
        ])
      })
    },
    renderVN (h: CreateElement): VNode {
      const $xeCountdown = this
      const props = $xeCountdown
      const slots = $xeCountdown.$scopedSlots
      const reactData = $xeCountdown.reactData

      const { prefixConfig, suffixConfig } = props
      const { currNum } = reactData
      const vSize = $xeCountdown.computeSize
      const diffConf = $xeCountdown.computeDiffConf
      const prefixOpts = $xeCountdown.computePrefixOpts
      const suffixOpts = $xeCountdown.computeSuffixOpts
      const prefixSlot = slots.prefix
      const suffixSlot = slots.suffix
      const defaultSlot = slots.default

      return h('div', {
        ref: 'refElem',
        class: ['vxe-countdown', diffConf.done ? 'is--progress' : 'is-end', {
          [`size--${vSize}`]: vSize
        }]
      }, [
        prefixSlot || prefixConfig
          ? h('div', {
            class: 'vxe-countdown--prefix'
          }, prefixSlot
            ? getSlotVNs(prefixSlot({ currentValue: currNum, diffConf }))
            : [
                h(VxeTextComponent, {
                  props: {
                    content: prefixOpts.content,
                    icon: prefixOpts.icon,
                    status: prefixOpts.status
                  }
                })
              ])
          : renderEmptyElement($xeCountdown),
        h('div', {
          class: 'vxe-countdown--content'
        }, defaultSlot
          ? getSlotVNs(defaultSlot({ currentValue: currNum, diffConf }))
          : $xeCountdown.renderDefaultContentVNs(h)
        ),
        suffixSlot || suffixConfig
          ? h('div', {
            class: 'vxe-countdown--suffix'
          }, suffixSlot
            ? getSlotVNs(suffixSlot({ currentValue: currNum, diffConf }))
            : [
                h(VxeTextComponent, {
                  props: {
                    content: suffixOpts.content,
                    icon: suffixOpts.icon,
                    status: suffixOpts.status
                  }
                })
              ])
          : renderEmptyElement($xeCountdown)
      ])
    }
  },
  watch: {
    value () {
      const $xeCountdown = this

      $xeCountdown.updateCount()
      $xeCountdown.handleStop()
      $xeCountdown.handleStart()
    }
  },
  created () {
    const $xeCountdown = this

    $xeCountdown.updateCount()
  },
  mounted () {
    const $xeCountdown = this

    $xeCountdown.handleStart()
  },
  beforeDestroy () {
    const $xeCountdown = this

    $xeCountdown.handleStop()
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
