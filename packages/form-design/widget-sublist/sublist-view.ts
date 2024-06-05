import { PropType, defineComponent, h } from 'vue'
import { WidgetSublistFormObjVO } from './sublist-data'
import VxeFormGatherComponent from '../../form/src/form-gather'

import type { VxeGlobalRendererHandles } from '../../../types'

export const WidgetSublistEditComponent = defineComponent({
  props: {
    renderOpts: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetEditOptions>,
      default: () => ({})
    },
    renderParams: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetEditParams<WidgetSublistFormObjVO>>,
      default: () => ({})
    }
  },
  emits: [],
  setup () {
    return () => {
      return h(VxeFormGatherComponent, {}, {
        default () {
          return h('div', 'xx')
        }
      })
    }
  }
})

export const WidgetSublistViewComponent = defineComponent({
  props: {
    renderOpts: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions>,
      default: () => ({})
    },
    renderParams: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams<WidgetSublistFormObjVO>>,
      default: () => ({})
    }
  },
  emits: [],
  setup () {
    return () => {
      return h('div', 'eeee')
    }
  }
})
