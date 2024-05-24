import { defineComponent, ref, h, PropType, reactive, provide, watch, nextTick } from 'vue'
import { getConfig, getI18n, renderer, createEvent } from '@vxe-ui/core'
import { toCssUnit } from '../../ui/src/dom'
import { FormDesignWidgetInfo } from './widget-info'
import XEUtils from 'xe-utils'
import LayoutWidgetComponent from './layout-widget'
import LayoutViewComponent from './layout-view'
import LayoutSettingComponent from './layout-setting'
import { getDefaultSettingFormData } from './setting-data'

import type { VxeFormDesignDefines, VxeFormDesignPropTypes, VxeFormDesignEmits, FormDesignReactData, FormDesignPrivateRef, VxeFormDesignPrivateComputed, VxeFormDesignConstructor, VxeFormDesignPrivateMethods, FormDesignMethods, FormDesignPrivateMethods, VxeFormProps } from '../../../types'

export default defineComponent({
  name: 'VxeFormDesign',
  props: {
    size: {
      type: String as PropType<VxeFormDesignPropTypes.Size>,
      default: () => getConfig().formDesign.size
    },
    height: {
      type: [String, Number] as PropType<VxeFormDesignPropTypes.Height>,
      default: () => getConfig().formDesign.height
    },
    widgets: {
      type: Array as PropType<VxeFormDesignPropTypes.Widgets>,
      default: () => XEUtils.clone(getConfig().formDesign.widgets) || []
    },
    formConfig: {
      type: Object as PropType<VxeFormDesignPropTypes.FormConfig>,
      default: () => XEUtils.clone(getConfig().formDesign.formConfig, true)
    },
    formRender: Object as PropType<VxeFormDesignPropTypes.FormRender>
  },
  emits: [
    'click-widget',
    'add-widget',
    'copy-widget',
    'remove-widget'
  ] as VxeFormDesignEmits,
  setup (props, context) {
    const { emit } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<FormDesignReactData>({
      formConfig: {},
      formData: {} as VxeFormDesignPropTypes.FormData,
      widgetConfigs: [],
      widgetObjList: [],
      dragWidget: null,
      sortWidget: null,
      activeWidget: null
    })

    const refMaps: FormDesignPrivateRef = {
      refElem
    }

    const computeMaps: VxeFormDesignPrivateComputed = {
    }

    const $xeFormDesign = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeFormDesignConstructor & VxeFormDesignPrivateMethods

    const createWidget = (name: string) => {
      return new FormDesignWidgetInfo(name, reactData.widgetObjList) as VxeFormDesignDefines.WidgetObjItem
    }

    const createEmptyWidget = () => {
      return new FormDesignWidgetInfo('', reactData.widgetObjList) as VxeFormDesignDefines.WidgetObjItem
    }

    const loadConfig = (config: VxeFormDesignDefines.FormDesignConfig) => {
      if (config) {
        const { formConfig, widgetData } = config
        loadFormConfig(formConfig || {})
        loadWidgetData(widgetData || [])
      }
      return nextTick()
    }

    const getFormConfig = (): VxeFormProps => {
      return Object.assign({}, reactData.formConfig)
    }

    const loadFormConfig = (formConfig: VxeFormProps) => {
      reactData.formConfig = Object.assign({}, formConfig)
      return nextTick()
    }

    const getWidgetData = (): VxeFormDesignDefines.WidgetObjItem[] => {
      return reactData.widgetObjList.slice(0)
    }

    const loadWidgetData = (widgetData: VxeFormDesignDefines.WidgetObjItem[]) => {
      reactData.widgetObjList = widgetData ? widgetData.slice(0) : []
      return nextTick()
    }

    const formDesignMethods: FormDesignMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, createEvent(evnt, { $xeFormDesign }, params))
      },
      createWidget,
      createEmptyWidget,
      getConfig () {
        return {
          formConfig: getFormConfig(),
          formData: reactData.formData,
          widgetData: getWidgetData()
        }
      },
      loadConfig,
      getFormConfig,
      loadFormConfig,
      getWidgetData,
      loadWidgetData
    }

    const updateWidgetConfigs = () => {
      const { widgets } = props
      let widgetConfs: VxeFormDesignDefines.WidgetConfigItem[] = []
      if (widgets && widgets.length) {
        widgetConfs = props.widgets.slice(0)
      } else {
        const baseWidgets: string[] = []
        const layoutWidgets: string[] = []
        const advancedWidgets: string[] = []
        const customGroups: VxeFormDesignDefines.WidgetConfigItem[] = []
        renderer.forEach((item, name) => {
          const { formDesignWidgetName, formDesignWidgetGroup, formDesignWidgetCustomGroup } = item
          if (formDesignWidgetName) {
            // 如果自定义组
            if (formDesignWidgetCustomGroup) {
              const cusGroup = customGroups.find(item => item.title === formDesignWidgetCustomGroup)
              if (cusGroup) {
                cusGroup.children.push(name)
              } else {
                customGroups.push({
                  title: formDesignWidgetCustomGroup,
                  children: [name]
                })
              }
            } else {
              switch (formDesignWidgetGroup) {
                case 'layout':
                  layoutWidgets.push(name)
                  break
                case 'advanced':
                  advancedWidgets.push(name)
                  break
                default:
                  baseWidgets.push(name)
                  break
              }
            }
          }
        })
        if (baseWidgets.length) {
          widgetConfs.push({
            title: getI18n('vxe.formDesign.widget.baseGroup'),
            children: baseWidgets
          })
        }
        if (layoutWidgets.length) {
          widgetConfs.push({
            title: getI18n('vxe.formDesign.widget.layoutGroup'),
            children: layoutWidgets
          })
        }
        if (advancedWidgets.length) {
          widgetConfs.push({
            title: getI18n('vxe.formDesign.widget.advancedGroup'),
            children: advancedWidgets
          })
        }
        if (customGroups.length) {
          widgetConfs.push(...customGroups)
        }
      }
      reactData.widgetConfigs = widgetConfs
    }

    const formDesignPrivateMethods: FormDesignPrivateMethods = {
      handleClickWidget (evnt: KeyboardEvent, item: VxeFormDesignDefines.WidgetObjItem) {
        if (item && item.name) {
          reactData.activeWidget = item
          formDesignMethods.dispatchEvent('click-widget', { item }, evnt)
        }
      },
      handleCopyWidget (evnt: KeyboardEvent, widget: VxeFormDesignDefines.WidgetObjItem) {
        const { widgetObjList } = reactData
        const rest = XEUtils.findTree(widgetObjList, obj => obj.id === widget.id, { children: 'children' })
        if (rest) {
          evnt.stopPropagation()
          const { path } = rest
          const rootIndex = Number(path[0])
          const newWidget = createWidget(widget.name)
          // 标题副本
          if (newWidget.title) {
            newWidget.title = getI18n('vxe.formDesign.widget.copyTitle', [`${widget.title}`.replace(getI18n('vxe.formDesign.widget.copyTitle', ['']), '')])
          }
          if (rootIndex >= widgetObjList.length - 1) {
            widgetObjList.push(newWidget)
          } else {
            widgetObjList.splice(rootIndex + 1, 0, newWidget)
          }
          reactData.activeWidget = newWidget
          reactData.widgetObjList = [...widgetObjList]
          formDesignMethods.dispatchEvent('copy-widget', { widget, newWidget }, evnt)
        }
      },
      handleRemoveWidget (evnt: KeyboardEvent, widget: VxeFormDesignDefines.WidgetObjItem) {
        const { widgetObjList } = reactData
        const rest = XEUtils.findTree(widgetObjList, obj => obj.id === widget.id, { children: 'children' })
        if (rest) {
          const { index, parent, items } = rest
          evnt.stopPropagation()
          if (index >= items.length - 1) {
            reactData.activeWidget = items[index - 1]
          } else {
            reactData.activeWidget = items[index + 1] || null
          }
          // 如果是子控件
          if (parent) {
            items[index] = createEmptyWidget()
          } else {
            items.splice(index, 1)
          }
          reactData.widgetObjList = [...widgetObjList]
          formDesignMethods.dispatchEvent('remove-widget', { widget }, evnt)
        }
      }
    }

    const createSettingForm = () => {
      const { formConfig, formRender } = props
      let formData: Record<string, any> = getDefaultSettingFormData()
      if (formRender) {
        const compConf = renderer.get(formRender.name)
        const createFormConfig = compConf ? compConf.createFormDesignSettingFormConfig : null
        formData = (createFormConfig ? createFormConfig({}) : {}) || {}
      }

      reactData.formConfig = formConfig
      reactData.formData = formData
    }

    Object.assign($xeFormDesign, formDesignMethods, formDesignPrivateMethods)

    const renderVN = () => {
      const { height } = props
      return h('div', {
        ref: refElem,
        class: 'vxe-design-form',
        style: height
          ? {
              height: toCssUnit(height)
            }
          : null
      }, [
        h(LayoutWidgetComponent),
        h(LayoutViewComponent),
        h(LayoutSettingComponent)
      ])
    }

    $xeFormDesign.renderVN = renderVN

    watch(() => props.widgets, () => {
      updateWidgetConfigs()
    })

    watch(() => props.formRender, () => {
      createSettingForm()
    })

    createSettingForm()
    updateWidgetConfigs()

    provide('$xeFormDesign', $xeFormDesign)

    return $xeFormDesign
  },
  render () {
    return this.renderVN()
  }
})
