import { defineComponent, ref, h, PropType, reactive, provide, watch, nextTick, ComponentOptions } from 'vue'
import { getConfig, getIcon, getI18n, renderer, createEvent } from '../../ui'
import { toCssUnit } from '../../ui/src/dom'
import { FormDesignWidgetInfo, getWidgetConfigGroup, getWidgetConfigCustomGroup, configToWidget } from './widget-info'
import XEUtils from 'xe-utils'
import VxeButtonComponent from '../../button/src/button'
import LayoutWidgetComponent from './layout-widget'
import LayoutPreviewComponent from './layout-preview'
import LayoutSettingComponent from './layout-setting'
import LayoutStyleComponent from './layout-style'
import { getDefaultSettingFormData } from './default-setting-data'

import type { VxeFormDesignDefines, VxeFormDesignPropTypes, VxeFormDesignEmits, FormDesignInternalData, FormDesignReactData, FormDesignPrivateRef, VxeFormDesignPrivateComputed, VxeFormDesignConstructor, VxeFormDesignPrivateMethods, FormDesignMethods, FormDesignPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeFormDesign',
  props: {
    size: {
      type: String as PropType<VxeFormDesignPropTypes.Size>,
      default: () => getConfig().formDesign.size
    },
    config: Object as PropType<VxeFormDesignPropTypes.Config>,
    height: {
      type: [String, Number] as PropType<VxeFormDesignPropTypes.Height>,
      default: () => getConfig().formDesign.height
    },
    widgets: {
      type: Array as PropType<VxeFormDesignPropTypes.Widgets>,
      default: () => XEUtils.clone(getConfig().formDesign.widgets) || []
    },
    showPc: {
      type: Boolean as PropType<VxeFormDesignPropTypes.ShowPc>,
      default: () => getConfig().formDesign.showPc
    },
    showMobile: {
      type: Boolean as PropType<VxeFormDesignPropTypes.ShowMobile>,
      default: () => getConfig().formDesign.showMobile
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
    const { emit, slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()
    const refLayoutStyle = ref<any>()

    const reactData = reactive<FormDesignReactData>({
      formData: {} as VxeFormDesignDefines.DefaultSettingFormDataObjVO,
      widgetConfigs: [],
      widgetObjList: [],
      dragWidget: null,
      sortWidget: null,
      activeWidget: null,
      sortSubWidget: null
    })

    const internalData = reactive<FormDesignInternalData>({
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
      internalData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeFormDesignConstructor & VxeFormDesignPrivateMethods

    const createWidget = (name: string) => {
      return new FormDesignWidgetInfo($xeFormDesign, name, reactData.widgetObjList) as VxeFormDesignDefines.WidgetObjItem
    }

    const createEmptyWidget = () => {
      return new FormDesignWidgetInfo($xeFormDesign, '', reactData.widgetObjList) as VxeFormDesignDefines.WidgetObjItem
    }

    const loadConfig = (config: Partial<VxeFormDesignDefines.FormDesignConfig>) => {
      if (config) {
        const { formConfig, widgetData } = config
        loadFormConfig(formConfig || {})
        loadWidgetData(widgetData || [])
      }
      return nextTick()
    }

    const getFormConfig = (): VxeFormDesignPropTypes.FormData => {
      return XEUtils.clone(reactData.formData, true)
    }

    const loadFormConfig = (data: VxeFormDesignPropTypes.FormData) => {
      reactData.formData = Object.assign({}, data) as VxeFormDesignDefines.DefaultSettingFormDataObjVO
      return nextTick()
    }

    const getWidgetData = (): VxeFormDesignDefines.WidgetObjItem[] => {
      const objList = XEUtils.clone(reactData.widgetObjList, true)
      XEUtils.eachTree(objList, item => {
        item.model.value = null
      }, { children: 'children' })
      return objList
    }

    const loadWidgetData = (widgetData: VxeFormDesignDefines.WidgetObjItem[]) => {
      reactData.widgetObjList = (widgetData || []).map(item => configToWidget(item))
      return nextTick()
    }

    const openStyleSetting = () => {
      const $layoutStyle = refLayoutStyle.value
      if ($layoutStyle) {
        $layoutStyle.openStylePreview()
      }
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
          widgetData: getWidgetData()
        }
      },
      clearConfig () {
        reactData.widgetObjList = []
        createSettingForm()
        return nextTick()
      },
      loadConfig,
      getFormConfig,
      loadFormConfig,
      getFormData () {
        const { widgetObjList } = reactData
        const formData: Record<string, any> = {}
        XEUtils.eachTree(widgetObjList, widget => {
          formData[widget.field] = null
        }, { children: 'children' })
        return formData
      },
      getWidgetData,
      loadWidgetData,
      refreshPreviewView () {
        const $layoutStyle = refLayoutStyle.value
        if ($layoutStyle) {
          $layoutStyle.updatePreviewView()
        }
        return nextTick()
      },
      openStyleSetting
    }

    const updateWidgetConfigs = () => {
      const { widgets } = props
      const widgetConfs: VxeFormDesignDefines.WidgetConfigGroup[] = []
      const baseWidgets: VxeFormDesignDefines.WidgetObjItem[] = []
      const layoutWidgets: VxeFormDesignDefines.WidgetObjItem[] = []
      const advancedWidgets: VxeFormDesignDefines.WidgetObjItem[] = []
      const customGroups: VxeFormDesignDefines.WidgetConfigGroup[] = []

      renderer.forEach((item, name) => {
        const { createFormDesignWidgetConfig } = item
        if (createFormDesignWidgetConfig) {
          const widthItem = createWidget(name)
          const widgetGroup = getWidgetConfigGroup(name)
          const widgetCustomGroup = getWidgetConfigCustomGroup(name, $xeFormDesign)
          // 如果自定义组
          if (widgetCustomGroup) {
            const cusGroup = customGroups.find(item => item.title === widgetCustomGroup)
            if (cusGroup) {
              cusGroup.children.push(widthItem)
            } else {
              customGroups.push({
                title: widgetCustomGroup,
                children: [widthItem]
              })
            }
          } else {
            switch (widgetGroup) {
              case 'layout':
                layoutWidgets.push(widthItem)
                break
              case 'advanced':
                advancedWidgets.push(widthItem)
                break
              default:
                // 已废弃 title
                if (!['title'].includes(widthItem.name)) {
                  baseWidgets.push(widthItem)
                }
                break
            }
          }
        }
      })

      if (baseWidgets.length) {
        widgetConfs.push({
          group: 'base',
          children: baseWidgets
        })
      }
      if (layoutWidgets.length) {
        widgetConfs.push({
          group: 'layout',
          children: layoutWidgets
        })
      }
      if (advancedWidgets.length) {
        widgetConfs.push({
          group: 'advanced',
          children: advancedWidgets
        })
      }
      if (customGroups.length) {
        widgetConfs.push(...customGroups)
      }

      if (widgets && widgets.length) {
        reactData.widgetConfigs = props.widgets.map(config => {
          return {
            title: config.customGroup,
            group: config.group,
            children: config.children
              ? config.children.map(name => {
                const widthItem = createWidget(name)
                return widthItem
              })
              : []
          }
        })
      } else {
        reactData.widgetConfigs = widgetConfs
      }
    }

    const formDesignPrivateMethods: FormDesignPrivateMethods = {
      handleClickWidget (evnt: KeyboardEvent, item: VxeFormDesignDefines.WidgetObjItem) {
        if (item && item.name) {
          evnt.stopPropagation()
          reactData.activeWidget = item
          formDesignMethods.dispatchEvent('click-widget', { widget: item }, evnt)
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
          // 如果是行控件，使用空的控件占位
          if (parent && parent.name === 'row') {
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
      const { formRender, showPc, showMobile } = props
      let formData: Record<string, any> = getDefaultSettingFormData({
        pcVisible: showPc,
        mobileVisible: showMobile
      })
      if (formRender) {
        const compConf = renderer.get(formRender.name)
        const createFormConfig = compConf ? compConf.createFormDesignSettingFormConfig : null
        formData = (createFormConfig ? createFormConfig({}) : {}) || {}
      }

      reactData.formData = formData as VxeFormDesignDefines.DefaultSettingFormDataObjVO
    }

    const openStylePreviewEvent = () => {
      openStyleSetting()
    }

    Object.assign($xeFormDesign, formDesignMethods, formDesignPrivateMethods)

    const renderLayoutHeader = () => {
      return h('div', {
        class: 'vxe-form-design--header-wrapper'
      }, [
        h('div', {
          class: 'vxe-form-design--header-left'
        }),
        h('div', {
          class: 'vxe-form-design--header-middle'
        }),
        h('div', {
          class: 'vxe-form-design--header-right'
        }, [
          h(VxeButtonComponent, {
            mode: 'text',
            status: 'primary',
            icon: getIcon().FORM_DESIGN_STYLE_SETTING,
            content: getI18n('vxe.formDesign.styleSetting.btn'),
            onClick: openStylePreviewEvent
          })
        ])
      ])
    }

    const renderVN = () => {
      const { height } = props
      const headerSlot = slots.header
      return h('div', {
        ref: refElem,
        class: 'vxe-form-design',
        style: height
          ? {
              height: toCssUnit(height)
            }
          : null
      }, [
        h('div', {
          class: 'vxe-form-design--header'
        }, headerSlot ? headerSlot({}) : renderLayoutHeader()),
        h('div', {
          class: 'vxe-form-design--body'
        }, [
          h(LayoutWidgetComponent),
          h(LayoutPreviewComponent),
          h(LayoutSettingComponent),
          h(LayoutStyleComponent as ComponentOptions, {
            ref: refLayoutStyle
          })
        ])
      ])
    }

    $xeFormDesign.renderVN = renderVN

    watch(() => props.widgets, () => {
      updateWidgetConfigs()
    })

    watch(() => props.widgets, () => {
      updateWidgetConfigs()
    })

    watch(() => props.config, (value) => {
      loadConfig(value || {})
    })

    createSettingForm()
    updateWidgetConfigs()
    if (props.config) {
      loadConfig(props.config)
    }

    provide('$xeFormDesign', $xeFormDesign)

    return $xeFormDesign
  },
  render () {
    return this.renderVN()
  }
})
