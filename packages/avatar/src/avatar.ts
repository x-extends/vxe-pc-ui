import { defineComponent, ref, h, reactive } from 'vue'
import XEUtils from 'xe-utils'
import { createEvent } from '../../ui'

import type { AvatarReactData, VxeAvatarEmits, AvatarMethods, AvatarPrivateMethods, ValueOf, AvatarPrivateRef, VxeAvatarPrivateComputed, VxeAvatarConstructor, VxeAvatarPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeAvatar',
  props: {
  },
  emits: [
  ] as VxeAvatarEmits,
  setup (props, context) {
    const { emit } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<AvatarReactData>({
    })

    const refMaps: AvatarPrivateRef = {
      refElem
    }

    const computeMaps: VxeAvatarPrivateComputed = {
    }

    const $xeAvatar = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeAvatarConstructor & VxeAvatarPrivateMethods

    const dispatchEvent = (type: ValueOf<VxeAvatarEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $avatar: $xeAvatar }, params))
    }

    const collapsePaneMethods: AvatarMethods = {
      dispatchEvent
    }

    const collapsePanePrivateMethods: AvatarPrivateMethods = {
    }

    Object.assign($xeAvatar, collapsePaneMethods, collapsePanePrivateMethods)

    const renderVN = () => {
      return h('div', {
        ref: refElem,
        class: 'vxe-avatar'
      }, [])
    }

    $xeAvatar.renderVN = renderVN

    return $xeAvatar
  },
  render () {
    return this.renderVN()
  }
})
