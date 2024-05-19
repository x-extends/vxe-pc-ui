import { defineComponent, ref, h, reactive, nextTick, PropType, watch } from 'vue'
import XEUtils from 'xe-utils'
import { renderer } from '../../ui/src/renderer'
import { getSlotVNs } from '../../ui/src/vn'
import VxeFormComponent from '../../form/src/form'

import { VxeGlobalRendererHandles, VxeFormViewPropTypes, FormViewReactData, FormViewPrivateRef, FormViewMethods, FormViewPrivateMethods, VxeFormViewEmits, VxeFormViewPrivateComputed, VxeFormProps, VxeFormDesignDefines, VxeFormViewConstructor, VxeFormViewPrivateMethods, VxeFormPropTypes } from '../../../types'

export default defineComponent({
  name: 'VxeFormView',
  props: {
    modelValue: Object as PropType<VxeFormViewPropTypes.ModelValue>,
    config: {
      type: Object as PropType<VxeFormViewPropTypes.Config>,
      default: () => ({})
    }
  },
  emits: [
  ] as VxeFormViewEmits,
  setup (props, context) {
    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<FormViewReactData>({
      formConfig: {},
      formRules: {},
      widgetObjList: []
    })

    const refMaps: FormViewPrivateRef = {
      refElem
    }

    const computeMaps: VxeFormViewPrivateComputed = {
    }

    const $xeFormView = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeFormViewConstructor & VxeFormViewPrivateMethods

    const loadConfig = (config: VxeFormDesignDefines.FormDesignConfig) => {
      if (config) {
        const { formData, widgetData } = config
        loadFormConfig(formData || {})
        loadWidgetData(widgetData || [])
      }
      return nextTick()
    }

    const loadFormConfig = (formData: VxeFormProps) => {
      reactData.formConfig = Object.assign({}, formData)
      return nextTick()
    }

    const loadWidgetData = (widgetData: VxeFormDesignDefines.WidgetObjItem[]) => {
      reactData.widgetObjList = widgetData ? widgetData.slice(0) : []
      updateWidgetRules()
      return nextTick()
    }

    const updateWidgetRules = () => {
      const formRules: VxeFormPropTypes.Rules = {}
      XEUtils.eachTree(reactData.widgetObjList, widget => {
        const { name, field, required } = widget
        const compConf = renderer.get(name) || {}
        const createWidgetViewRules = compConf.createFormDesignWidgetViewRules
        if (createWidgetViewRules) {
          const rules = createWidgetViewRules({ widget })
          if (rules && rules.length) {
            formRules[field] = rules
          }
        } else if (required) {
          formRules[field] = [
            { required: true, content: '该填写该字段！' }
          ]
        }
      }, { children: 'children' })
      reactData.formRules = formRules
    }

    const formViewMethods: FormViewMethods = {
      loadConfig,
      loadFormConfig,
      loadWidgetData
    }

    const formViewPrivateMethods: FormViewPrivateMethods = {
    }

    Object.assign($xeFormView, formViewMethods, formViewPrivateMethods)

    const renderVN = () => {
      const { formConfig, formRules } = reactData
      return h('div', {
        ref: refElem,
        class: ['vxe-form-view']
      }, [
        h(VxeFormComponent, {
          customLayout: true,
          span: 24,
          vertical: formConfig.vertical,
          rules: formRules
        }, {
          default () {
            const { widgetObjList } = reactData
            return widgetObjList.map(widget => {
              const { name } = widget
              const compConf = renderer.get(name) || {}
              const renderWidgetDesignView = compConf.renderFormDesignWidgetView
              const renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions = widget
              const params: VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams = { widget, isEditMode: false, isViewMode: true }
              return renderWidgetDesignView ? getSlotVNs(renderWidgetDesignView(renderOpts, params)) : []
            })
          }
        })
      ])
    }

    $xeFormView.renderVN = renderVN

    watch(() => props.config, () => {
      loadConfig(props.config)
    })

    loadConfig(props.config)

    return $xeFormView
  },
  render () {
    return this.renderVN()
  }
})
