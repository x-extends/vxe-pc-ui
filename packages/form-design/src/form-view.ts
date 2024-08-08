import { defineComponent, ref, h, reactive, nextTick, PropType, inject, provide, watch, createCommentVNode } from 'vue'
import XEUtils from 'xe-utils'
import { renderer, createEvent } from '../../ui'
import { getSlotVNs } from '../../ui/src/vn'
import { createDefaultFormViewPCFormConfig } from './default-setting-data'
import VxeFormComponent from '../../form/src/form'
import VxeFormGatherComponent from '../../form/src/form-gather'
import VxeFormItemComponent from '../../form/src/form-item'
import { configToWidget } from './widget-info'

import type { VxeGlobalRendererHandles, VxeFormViewPropTypes, FormViewReactData, ValueOf, FormViewPrivateRef, FormViewMethods, FormViewPrivateMethods, VxeFormViewEmits, VxeFormViewPrivateComputed, VxeFormProps, VxeFormDesignDefines, VxeFormViewConstructor, VxeFormViewPrivateMethods, VxeFormPropTypes, VxeFormInstance, VxeFormViewDefines, VxeFormDesignLayoutStyle, VxeFormEvents } from '../../../types'

export default defineComponent({
  name: 'VxeFormView',
  props: {
    modelValue: Object as PropType<VxeFormViewPropTypes.ModelValue>,
    config: Object as PropType<VxeFormViewPropTypes.Config>,
    viewRender: Object as PropType<VxeFormViewPropTypes.ViewRender>,
    createFormConfig: Function as PropType<VxeFormViewPropTypes.CreateFormConfig>
  },
  emits: [
    'update:modelValue',
    'submit',
    'reset'
  ] as VxeFormViewEmits,
  setup (props, context) {
    const { emit, slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()
    const formRef = ref<VxeFormInstance>()

    const $xeFormDesignLayoutStyle = inject<VxeFormDesignLayoutStyle | null>('$xeFormDesignLayoutStyle', null)

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

    const clearConfig = () => {
      return loadConfig({
        formConfig: {},
        widgetData: []
      })
    }

    const loadConfig = (config: VxeFormDesignDefines.FormDesignConfig | null) => {
      if (config) {
        const { formConfig, widgetData } = config
        loadFormConfig(formConfig || {})
        loadWidgetData(widgetData || [])
      }
      return nextTick()
    }

    const parseConfig = (config: VxeFormDesignDefines.FormDesignConfig | null) => {
      const { formConfig, widgetData } = config || {}
      const widgetObjList = parseWidgetData(widgetData || [])
      return {
        ...parseForm(widgetObjList),
        formConfig: parseFormConfig(formConfig || {}),
        widgetData: widgetObjList
      }
    }

    const parseFormConfig = (formConfig: VxeFormProps) => {
      const { viewRender, createFormConfig } = props
      const params: VxeFormViewDefines.CreateFormConfigParams = { viewRender, formConfig }
      if (createFormConfig) {
        return createFormConfig(params)
      }
      const { name } = viewRender || {}
      const compConf = renderer.get(name) || {}
      const createPCFormConfig = compConf ? compConf.createFormViewFormConfig : null
      return Object.assign({}, createPCFormConfig ? createPCFormConfig(params) : createDefaultFormViewPCFormConfig(params))
    }

    const loadFormConfig = (formConfig: VxeFormProps) => {
      reactData.formConfig = parseFormConfig(formConfig)
      return nextTick()
    }

    const parseForm = (widgetObjList: VxeFormDesignDefines.WidgetObjItem[]) => {
      const formData: VxeFormPropTypes.Data = {}
      const formRules: VxeFormPropTypes.Rules = {}
      XEUtils.eachTree(widgetObjList, widget => {
        const { name, field, required } = widget
        const compConf = renderer.get(name) || {}
        const createWidgetFieldValue = compConf.createFormDesignWidgetFieldValue
        const createWidgetFieldRules = compConf.createFormDesignWidgetFieldRules
        formData[field] = createWidgetFieldValue ? createWidgetFieldValue({ widget, $formView: $xeFormView }) : getWidgetDefaultValue(widget)
        if (createWidgetFieldRules) {
          const rules = createWidgetFieldRules({ widget, $formView: $xeFormView })
          if (rules && rules.length) {
            formRules[field] = rules
          }
        } else if (required) {
          formRules[field] = getWidgetDefaultRule()
        }
      }, { children: 'children' })
      return {
        formData,
        formRules
      }
    }

    const parseWidgetData = (widgetData: VxeFormDesignDefines.WidgetObjItem[]) => {
      return (widgetData || []).map(item => configToWidget(item))
    }

    const loadWidgetData = (widgetData: VxeFormDesignDefines.WidgetObjItem[]) => {
      const widgetObjList = parseWidgetData(widgetData)
      reactData.widgetObjList = widgetObjList
      const { formData, formRules } = parseForm(widgetObjList)
      reactData.formRules = formRules
      emit('update:modelValue', Object.assign(formData, props.modelValue))
      return nextTick()
    }

    const getWidgetDefaultValue = (widget: VxeFormDesignDefines.WidgetObjItem) => {
      switch (widget.name) {
        case 'subtable':
          return []
      }
      return null
    }

    const getWidgetDefaultRule = () => {
      return [
        { required: true, content: '该填写该字段！' }
      ]
    }

    const updateWidgetStatus = (widget: VxeFormDesignDefines.WidgetObjItem, value: any) => {
      const { field } = widget
      const $form = formRef.value
      if ($form) {
        $form.updateStatus({ field }, value)
      }
      return nextTick()
    }

    const setItemValue = (widget: VxeFormDesignDefines.WidgetObjItem, value: any) => {
      const { modelValue } = props
      const { field } = widget
      const $form = formRef.value
      if (modelValue) {
        modelValue[field] = value
      }
      if ($form) {
        $form.updateStatus({ field }, value)
      }
      return nextTick()
    }

    const getItemValue = (widget: VxeFormDesignDefines.WidgetObjItem) => {
      const { modelValue } = props
      if (modelValue) {
        return modelValue[widget.field]
      }
      return null
    }

    const dispatchEvent = (type: ValueOf<VxeFormViewEmits>, params: any, evnt: Event) => {
      emit(type, createEvent(evnt, { $formView: $xeFormView }, params))
    }

    const toWidgetFields = (widget?: VxeFormDesignDefines.WidgetObjItem<any> | VxeFormDesignDefines.WidgetObjItem<any>[]) => {
      if (widget) {
        if (XEUtils.isArray(widget)) {
          return widget.map(item => item.name)
        } else {
          return [widget.name]
        }
      }
      return null
    }

    const formViewMethods: FormViewMethods = {
      dispatchEvent,
      clearConfig,
      loadConfig,
      parseConfig,
      loadFormConfig,
      loadWidgetData,
      updateWidgetStatus,
      setItemValue,
      getItemValue,
      validate () {
        const $form = formRef.value
        if ($form) {
          return $form.validate()
        }
        return nextTick()
      },
      validateWidget (widget) {
        const $form = formRef.value
        if ($form) {
          return $form.validateField(toWidgetFields(widget))
        }
        return nextTick()
      },
      clearValidate (widget) {
        const $form = formRef.value
        if ($form) {
          return $form.clearValidate(toWidgetFields(widget))
        }
        return nextTick()
      },
      reset () {
        const $form = formRef.value
        if ($form) {
          return $form.reset()
        }
        return nextTick()
      },
      /**
       * 已废弃
       * @deprecated
       */
      updateItemStatus: updateWidgetStatus
    }

    const handleSubmit: VxeFormEvents.Submit = (params) => {
      dispatchEvent('submit', params, params.$event)
    }

    const handleReset: VxeFormEvents.Reset = (params) => {
      dispatchEvent('reset', params, params.$event)
    }

    const formViewPrivateMethods: FormViewPrivateMethods = {
    }

    Object.assign($xeFormView, formViewMethods, formViewPrivateMethods)

    const renderVN = () => {
      const { modelValue } = props
      const { formConfig, formRules, widgetObjList } = reactData
      const headerSlot = slots.header
      const footerSlot = slots.footer

      return h('div', {
        ref: refElem,
        class: 'vxe-form-view'
      }, [
        h(VxeFormComponent, {
          ref: formRef,
          data: modelValue,
          customLayout: true,
          span: 24,
          vertical: formConfig.vertical,
          titleBold: formConfig.titleBold,
          titleColon: formConfig.titleColon,
          titleAlign: formConfig.titleAlign,
          titleWidth: formConfig.titleWidth,
          rules: formRules,
          onSubmit: handleSubmit,
          onReset: handleReset
        }, {
          default () {
            return [
              headerSlot
                ? h(VxeFormItemComponent, {}, {
                  default () {
                    return headerSlot({})
                  }
                })
                : createCommentVNode(),
              ...widgetObjList.map(widget => {
                const { name } = widget
                const compConf = renderer.get(name) || {}
                const renderWidgetDesignView = compConf.renderFormDesignWidgetView
                const renderWidgetDesignPreview = compConf.renderFormDesignWidgetPreview
                const renderWidgetDesignMobilePreview = compConf.renderFormDesignWidgetMobilePreview
                const renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions = widget
                const params: VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams = { widget, isEditMode: false, isViewMode: true, $formDesign: null, $formView: $xeFormView }
                return h(VxeFormGatherComponent, {
                  key: widget.id
                }, {
                  default () {
                    // 如果处于表单设计器-样式设置-预览模式下
                    if ($xeFormDesignLayoutStyle) {
                      if ($xeFormDesignLayoutStyle.reactData.activeTab === 2) {
                        if (renderWidgetDesignMobilePreview) {
                          return getSlotVNs(renderWidgetDesignMobilePreview(renderOpts, params))
                        }
                      } else {
                        if (renderWidgetDesignPreview) {
                          return getSlotVNs(renderWidgetDesignPreview(renderOpts, params))
                        }
                      }
                    }
                    return renderWidgetDesignView ? getSlotVNs(renderWidgetDesignView(renderOpts, params)) : []
                  }
                })
              }),
              footerSlot
                ? h(VxeFormGatherComponent, {
                  span: 24
                }, {
                  default () {
                    return footerSlot({})
                  }
                })
                : createCommentVNode()
            ]
          }
        })
      ])
    }

    $xeFormView.renderVN = renderVN

    watch(() => props.config, (value) => {
      loadConfig(value || {})
    })

    if (props.config) {
      loadConfig(props.config)
    }

    provide('$xeFormView', $xeFormView)

    return $xeFormView
  },
  render () {
    return this.renderVN()
  }
})
