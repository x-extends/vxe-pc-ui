import { ref, h, reactive, PropType, onUnmounted } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { getConfig, createEvent } from '../../ui'
import XEUtils from 'xe-utils'

import type { GanttReactData, VxeGanttEmits, VxeGanttPropTypes, GanttPrivateRef, GanttInternalData, ValueOf, GanttMethods, GanttPrivateMethods, VxeGanttPrivateComputed, VxeGanttConstructor, VxeGanttPrivateMethods } from '../../../types'
import type { VxeTableInstance } from '../../../types/components/table'

function createInternalData (): GanttInternalData {
  return {
  }
}

export default defineVxeComponent({
  name: 'VxeGantt',
  props: {
    size: {
      type: String as PropType<VxeGanttPropTypes.Size>,
      default: () => getConfig().gantt.size || getConfig().size
    }
  },
  emits: [
  ] as VxeGanttEmits,
  setup (props, context) {
    const { emit } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()
    const refTable = ref<VxeTableInstance>()

    const reactData = reactive<GanttReactData>({
    })

    const internalData = createInternalData()

    const refMaps: GanttPrivateRef = {
      refElem,
      refTable
    }

    const computeMaps: VxeGanttPrivateComputed = {
    }

    const $xeGantt = {
      xID,
      props,
      context,
      reactData,
      internalData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeGanttConstructor & VxeGanttPrivateMethods

    const dispatchEvent = (type: ValueOf<VxeGanttEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $gantt: $xeGantt }, params))
    }

    const ganttMethods: GanttMethods = {
      dispatchEvent
    }

    const ganttPrivateMethods: GanttPrivateMethods = {
    }

    Object.assign($xeGantt, ganttMethods, ganttPrivateMethods)

    const renderVN = () => {
      return h('div', {
        ref: refElem,
        class: 'vxe-gantt'
      })
    }

    onUnmounted(() => {
      XEUtils.assign(internalData, createInternalData())
    })

    $xeGantt.renderVN = renderVN

    return $xeGantt
  },
  render () {
    return this.renderVN()
  }
})
