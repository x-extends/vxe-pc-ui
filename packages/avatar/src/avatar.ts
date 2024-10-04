import { CreateElement, VNode, PropType } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, renderEmptyElement, globalMixins } from '../../ui'
import { toCssUnit } from '../../ui/src/dom'

import type { AvatarReactData, VxeAvatarEmits, VxeAvatarPropTypes, ValueOf, VxeComponentStyleType, VxeComponentSizeType } from '../../../types'

export default defineVxeComponent({
  name: 'VxeAvatar',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    count: [String, Number] as PropType<VxeAvatarPropTypes.Count>,
    dot: Boolean as PropType<VxeAvatarPropTypes.Dot>,
    content: [String, Number] as PropType<VxeAvatarPropTypes.Content>,
    icon: String as PropType<VxeAvatarPropTypes.Icon>,
    src: String as PropType<VxeAvatarPropTypes.Src>,
    width: [String, Number] as PropType<VxeAvatarPropTypes.Width>,
    height: [String, Number] as PropType<VxeAvatarPropTypes.Height>,
    circle: {
      type: Boolean as PropType<VxeAvatarPropTypes.Circle>,
      default: () => getConfig().avatar.circle
    },
    status: {
      type: String as PropType<VxeAvatarPropTypes.Status>,
      default: () => getConfig().avatar.status
    },
    size: {
      type: String as PropType<VxeAvatarPropTypes.Size>,
      default: () => getConfig().avatar.size || getConfig().size
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: AvatarReactData = {
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
    computeAvatarStyle () {
      const $xeAvatar = this
      const props = $xeAvatar

      const { width, height } = props
      const stys: VxeComponentStyleType = {}
      if (width) {
        stys.width = toCssUnit(width)
      }
      if (height) {
        stys.height = toCssUnit(height)
      }
      return stys
    },
    computeCountNum () {
      const $xeAvatar = this
      const props = $xeAvatar

      const { count } = props
      return count ? XEUtils.toNumber(count) : 0
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeAvatarEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeAvatar = this
      $xeAvatar.$emit(type, createEvent(evnt, { $avatar: $xeAvatar }, params))
    },

    //
    // Render
    //
    renderContent (h: CreateElement) {
      const $xeAvatar = this
      const props = $xeAvatar

      const { icon, content, src } = props
      if (icon) {
        return h('span', {
          class: 'vxe-avatar--icon'
        }, [
          h('i', {
            class: icon
          })
        ])
      }
      if (content) {
        return h('span', {
          class: 'vxe-avatar--content'
        }, `${content}`)
      }
      if (src) {
        return h('img', {
          class: 'vxe-avatar--img',
          attrs: {
            src
          }
        })
      }
      return renderEmptyElement($xeAvatar)
    },
    renderVN (h: CreateElement): VNode {
      const $xeAvatar = this
      const props = $xeAvatar

      const { circle, dot, status } = props
      const vSize = $xeAvatar.computeSize
      const countNum = $xeAvatar.computeCountNum
      const avatarStyle = $xeAvatar.computeAvatarStyle
      return h('div', {
        ref: 'refElem',
        class: ['vxe-avatar', {
          [`size--${vSize}`]: vSize,
          [`theme--${status}`]: status,
          'is--circle': circle,
          'is--dot': dot
        }],
        style: avatarStyle
      }, [
        $xeAvatar.renderContent(h),
        countNum
          ? h('span', {
            class: 'vxe-avatar--count'
          }, countNum > 99 ? '99+' : `${countNum}`)
          : renderEmptyElement($xeAvatar)
      ])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
