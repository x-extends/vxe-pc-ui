import { ref, h, PropType, computed, reactive } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, useSize } from '../../ui'
import { getPropClass, toCssUnit } from '../../ui/src/dom'
import { eqEmptyValue } from '../../ui/src/utils'

import type { SpaceReactData, VxeSpaceEmits, SpaceMethods, VxeSpacePropTypes, SpacePrivateMethods, ValueOf, SpacePrivateRef, VxeSpacePrivateComputed, VxeSpaceConstructor, VxeSpacePrivateMethods, VxeComponentStyleType } from '../../../types'

export default defineVxeComponent({
  name: 'VxeSpace',
  props: {
    size: {
      type: String as PropType<VxeSpacePropTypes.Size>,
      default: () => getConfig().space.size || getConfig().size
    },
    wrap: {
      type: Boolean as PropType<VxeSpacePropTypes.Wrap>,
      default: () => getConfig().space.wrap
    },
    gap: {
      type: [Number, String, Array, Object] as PropType<VxeSpacePropTypes.Gap>,
      default: () => getConfig().space.gap
    },
    vertical: {
      type: Boolean as PropType<VxeSpacePropTypes.Vertical>,
      default: () => getConfig().space.vertical
    },
    className: {
      type: String as PropType<VxeSpacePropTypes.ClassName>,
      default: () => getConfig().space.className
    },
    itemClassName: {
      type: String as PropType<VxeSpacePropTypes.ItemClassName>,
      default: () => getConfig().space.itemClassName
    },
    separator: {
      type: String as PropType<VxeSpacePropTypes.Separator>,
      default: () => getConfig().space.separator
    }
  },
  emits: [] as VxeSpaceEmits,
  setup (props, context) {
    const { emit, slots } = context

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<SpaceReactData>({
      activeValue: null
    })

    const refMaps: SpacePrivateRef = {
      refElem
    }

    const computeWrapperStyle = computed(() => {
      const { gap } = props
      const stys: VxeComponentStyleType = {}
      let rowGap: string | number = ''
      let columGap: string | number = ''
      if (XEUtils.isNumber(gap) || XEUtils.isString(gap)) {
        rowGap = gap
        columGap = gap
      } else if (gap) {
        if (XEUtils.isArray(gap)) {
          rowGap = gap[0]
          columGap = gap[1]
        } else {
          rowGap = gap.rowGap || ''
          columGap = gap.columGap || ''
        }
      }
      if (!eqEmptyValue(rowGap)) {
        stys['--vxe-ui-space-current-row-gap'] = toCssUnit(rowGap)
      }
      if (!eqEmptyValue(columGap)) {
        stys['--vxe-ui-space-current-column-gap'] = toCssUnit(columGap)
      }
      return stys
    })

    const computeMaps: VxeSpacePrivateComputed = {
    }

    const $xeSpace = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeSpaceConstructor & VxeSpacePrivateMethods

    const dispatchEvent = (type: ValueOf<VxeSpaceEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $space: $xeSpace }, params))
    }

    const spaceMethods: SpaceMethods = {
      dispatchEvent
    }

    const spacePrivateMethods: SpacePrivateMethods = {
    }

    Object.assign($xeSpace, spaceMethods, spacePrivateMethods)

    const renderVN = () => {
      const { vertical, wrap, className, itemClassName } = props
      const wrapperStyle = computeWrapperStyle.value
      const vSize = computeSize.value
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: ['vxe-space', getPropClass(className, {}), {
          [`size--${vSize}`]: vSize,
          'is--wrap': wrap,
          'is--vertical': vertical
        }],
        style: wrapperStyle
      }, defaultSlot
        ? (defaultSlot({}) || []).map((itemVN, index) => {
            return h('div', {
              key: index,
              class: ['vxe-space--item', getPropClass(itemClassName, { index })]
            }, [itemVN])
          })
        : [])
    }

    $xeSpace.renderVN = renderVN

    return $xeSpace
  },
  render () {
    return this.renderVN()
  }
})
