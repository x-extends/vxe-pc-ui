import { PropType, defineComponent, h } from 'vue'
import VxeFormComponent from '../../form/src/form'
import VxeFormItemComponent from '../../form/src/form-item'
import { getFormDesignWidgetName } from './util'

import { VxeGlobalRendererHandles, VxeFormDesignDefines, VxeFormProps } from '../../../types'

interface WidgetTextareaFormObjVO {
  itemTitle: string
}

export const getWidgetTextareaFormData = (params: VxeGlobalRendererHandles.CreateFormDesignWidgetFormConfigParams): VxeFormProps<WidgetTextareaFormObjVO> => {
  return {
    data: {
      itemTitle: getFormDesignWidgetName(params.name)
    }
  }
}

export const WidgetTextareaFormComponent = defineComponent({
  props: {
    widget: {
      type: Object as PropType<VxeFormDesignDefines.WidgetObjItem<WidgetTextareaFormObjVO>>,
      default: () => ({})
    }
  },
  emits: [],
  setup (props) {
    return () => {
      const { widget } = props
      const { widgetFormData } = widget
      return h(VxeFormComponent, {
        class: 'vxe-design-form--widget-input-form',
        vertical: true,
        span: 24,
        data: widgetFormData
      }, {
        default () {
          return [
            h(VxeFormItemComponent, {
              title: '控件名称',
              field: 'itemTitle',
              itemRender: { name: 'VxeInput' }
            })
          ]
        }
      })
    }
  }
})
