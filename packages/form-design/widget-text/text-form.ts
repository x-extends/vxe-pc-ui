import { PropType, defineComponent, h, ref } from 'vue'
import XEUtils from 'xe-utils'
import { getI18n } from '@vxe-ui/core'
import { WidgetTextFormObjVO } from './text-data'
import { useKebabCaseName } from '../render/hooks'
import VxeFormComponent from '../../form/src/form'
import VxeInputComponent from '../../input/src/input'
import VxeFormItemComponent from '../../form/src/form-item'

import type { VxeGlobalRendererHandles } from '../../../types'

const getFontSizeOptions = () => {
  return XEUtils.range(12, 27).map((num) => {
    return { label: `${num}px`, value: `${num}px` }
  })
}

const getAlignOptions = () => {
  return [
    { label: getI18n('vxe.formDesign.widgetProp.textProp.alignLeft'), value: '' },
    { label: getI18n('vxe.formDesign.widgetProp.textProp.alignCenter'), value: 'center' },
    { label: getI18n('vxe.formDesign.widgetProp.textProp.alignRight'), value: 'right' }
  ]
}

const getBoldOptions = () => {
  return [
    { label: getI18n('vxe.formDesign.widgetProp.textProp.fontNormal'), value: false },
    { label: getI18n('vxe.formDesign.widgetProp.textProp.fontBold'), value: true }
  ]
}

export const WidgetTextFormComponent = defineComponent({
  props: {
    renderOpts: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewOptions>,
      default: () => ({})
    },
    renderParams: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewParams<WidgetTextFormObjVO>>,
      default: () => ({})
    }
  },
  emits: [],
  setup (props) {
    const computeKebabCaseName = useKebabCaseName(props)

    const alignOpts = ref(getAlignOptions())
    const boldOpts = ref(getBoldOptions())
    const fontSizeOpts = ref(getFontSizeOptions())

    return () => {
      const { renderParams } = props
      const { widget } = renderParams
      const kebabCaseName = computeKebabCaseName.value

      return h(VxeFormComponent, {
        class: ['vxe-form-design--widget-render-form-wrapper', `widget-${kebabCaseName}`],
        vertical: true,
        span: 24,
        titleBold: true,
        data: widget.options
      }, {
        default () {
          return [
            h(VxeFormItemComponent, {
              title: getI18n('vxe.formDesign.widgetProp.textProp.name')
            }, {
              default () {
                return h(VxeInputComponent, {
                  modelValue: widget.title,
                  'onUpdate:modelValue' (val) {
                    widget.title = val
                  }
                })
              }
            }),
            h(VxeFormItemComponent, {
              title: getI18n('vxe.formDesign.widgetProp.textProp.boldTitle'),
              field: 'bold',
              itemRender: { name: 'VxeRadioGroup', options: boldOpts.value }
            }),
            h(VxeFormItemComponent, {
              title: getI18n('vxe.formDesign.widgetProp.textProp.alignTitle'),
              field: 'align',
              itemRender: { name: 'VxeRadioGroup', options: alignOpts.value }
            }),
            h(VxeFormItemComponent, {
              title: getI18n('vxe.formDesign.widgetProp.textProp.sizeTitle'),
              field: 'fontSize',
              itemRender: { name: 'VxeSelect', options: fontSizeOpts.value }
            })
          ]
        }
      })
    }
  }
})
