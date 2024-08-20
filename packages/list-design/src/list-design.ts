import { defineComponent, ref, h, PropType, reactive, nextTick, provide, watch } from 'vue'
import XEUtils from 'xe-utils'
import { toCssUnit } from '../../ui/src/dom'
import { getConfig, createEvent, renderer } from '../../ui'
import { createListDesignActionButton } from '../render/util'
import { getDefaultSettingFormData } from './default-setting-data'
import LayoutPreviewComponent from './layout-preview'
import LayoutSettingComponent from './layout-setting'

import type { VxeListDesignDefines, VxeListDesignPropTypes, ListDesignReactData, ListDesignPrivateRef, VxeListDesignPrivateComputed, VxeListDesignConstructor, VxeListDesignPrivateMethods, ListDesignMethods, ListDesignPrivateMethods, VxeFormDesignDefines, VxeGlobalRendererHandles } from '../../../types'

export default defineComponent({
  name: 'VxeListDesign',
  props: {
    size: {
      type: String as PropType<VxeListDesignPropTypes.Size>,
      default: () => getConfig().listDesign.size
    },
    height: {
      type: [String, Number] as PropType<VxeListDesignPropTypes.Height>,
      default: () => getConfig().listDesign.height
    },
    config: Object as PropType<VxeListDesignPropTypes.Config>,
    showPc: {
      type: Boolean as PropType<VxeListDesignPropTypes.ShowPc>,
      default: () => getConfig().listDesign.showPc
    },
    showMobile: {
      type: Boolean as PropType<VxeListDesignPropTypes.ShowMobile>,
      default: () => getConfig().listDesign.showMobile
    },
    actionCodes: Array as PropType<VxeListDesignPropTypes.ActionCodes>,
    formRender: Object as PropType<VxeListDesignPropTypes.FormRender>
  },
  emits: [],
  setup (props, context) {
    const { emit, slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<ListDesignReactData>({
      formData: {} as VxeListDesignDefines.DefaultSettingFormDataObjVO,
      searchFormData: {},
      searchFormItems: [],
      listTableColumns: []
    })

    const refMaps: ListDesignPrivateRef = {
      refElem
    }

    const computeMaps: VxeListDesignPrivateComputed = {
    }

    const $xeListDesign = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeListDesignConstructor & VxeListDesignPrivateMethods

    const systemConfigList: VxeGlobalRendererHandles.CreateListDesignSettingActionButtonConfigResult[] = []
    const customConfigList: VxeGlobalRendererHandles.CreateListDesignSettingActionButtonConfigResult[] = []
    renderer.forEach((item, name) => {
      const { createListDesignSettingActionButtonConfig } = item
      if (createListDesignSettingActionButtonConfig) {
        const params = { name }
        const btnConfig = Object.assign(createListDesignActionButton({ code: name }), createListDesignSettingActionButtonConfig(params))
        if (btnConfig.type === 'custom') {
          customConfigList.push(btnConfig)
        } else {
          systemConfigList.push(btnConfig)
        }
      }
    })

    const parseWidgetColumn = (widget: VxeFormDesignDefines.WidgetObjItem) => {
      return {
        title: widget.title,
        field: widget.field,
        visible: !widget.hidden,
        width: '',
        cellRender: {
          name: widget.name,
          props: widget.options
        }
      }
    }

    /**
     * 解析表单设计 JSON
     */
    const parseFormDesignColumns = (config: Partial<VxeFormDesignDefines.FormDesignConfig>) => {
      const tableColumns: VxeListDesignDefines.ListColumnObjItem[] = []
      if (config) {
        const { widgetData } = config
        if (widgetData) {
          widgetData.forEach(item => {
            const { name } = item
            if (name) {
              // 如果是行列
              if (name === 'row') {
                item.children.forEach(childItem => {
                  if (childItem.name) {
                    tableColumns.push(parseWidgetColumn(childItem))
                  }
                })
              } else if (name === 'subTable') {
              // 如果是子表
              } else {
                tableColumns.push(parseWidgetColumn(item))
              }
            }
          })
        }
      }
      return tableColumns
    }

    const configToSearchItems = (searchItems: VxeListDesignDefines.SearchItemObjItem[]): {
      data: Record<string, any>
      items: VxeListDesignDefines.SearchItemObjItem[]
    } => {
      if (searchItems) {
        const data: Record<string, any> = {}
        const items = searchItems.map(item => {
          data[item.field] = null
          return {
            field: item.field,
            title: item.title,
            folding: item.folding,
            itemRender: item.itemRender
          }
        })
        return {
          items,
          data
        }
      }
      return { items: [], data: {} }
    }

    const configToListColumns = (listColumns: VxeListDesignDefines.ListColumnObjItem[]): VxeListDesignDefines.ListColumnObjItem[] => {
      if (listColumns) {
        return listColumns.map(item => {
          return {
            field: item.field,
            title: item.title,
            visible: !!item.visible,
            width: item.width,
            cellRender: XEUtils.clone(item.cellRender)
          }
        })
      }
      return []
    }

    const loadConfig = (config: Partial<VxeListDesignDefines.ListDesignConfig>) => {
      const { formConfig, searchItems, listColumns } = config
      if (formConfig) {
        loadFormConfig(formConfig)
      }
      if (searchItems) {
        setSearchItems(searchItems)
      }
      if (listColumns) {
        reactData.listTableColumns = parseColumnConfigs(listColumns)
      }
      return nextTick()
    }

    const parseColumnConfigs = (listColumns: VxeListDesignDefines.ListColumnObjItem[]) => {
      return configToListColumns(listColumns)
    }

    const loadFormConfig = (data: any) => {
      reactData.formData = Object.assign({}, createSettingForm(), data)
      return nextTick()
    }

    const getSearchItems = () => {
      return reactData.searchFormItems
    }

    const setSearchItems = (searchItems: VxeListDesignDefines.SearchItemObjItem[]) => {
      const { data, items } = configToSearchItems(searchItems)
      reactData.searchFormData = data
      reactData.searchFormItems = items
      return nextTick()
    }

    const getListColumns = () => {
      return reactData.listTableColumns
    }

    const setListColumns = (listColumns: VxeListDesignDefines.ListColumnObjItem[]) => {
      reactData.listTableColumns = parseColumnConfigs(listColumns)
      return nextTick()
    }

    const createSettingForm = () => {
      const { actionCodes, formRender } = props
      let conf = getDefaultSettingFormData()
      // 处理默认按钮
      if (actionCodes && actionCodes.length) {
        if (!conf.actionButtonList || !conf.actionButtonList.length) {
          const defActionBtnList: VxeListDesignDefines.DefaultSettingFormActionButton[] = []
          actionCodes.forEach(item => {
            if (XEUtils.isObject(item) && item.default) {
              const sysItem = systemConfigList.find(obj => obj.code === item.code)
              if (sysItem) {
                defActionBtnList.push(createListDesignActionButton({
                  type: sysItem.type,
                  code: sysItem.code
                }))
              }
            }
          })
          conf.actionButtonList = defActionBtnList
        }
      }
      // 如果为自定义渲染
      if (formRender && formRender.name) {
        const compConf = renderer.get(formRender.name)
        const createFormConfig = compConf ? compConf.createListDesignSettingFormConfig : null
        const params = { name: formRender.name }
        conf = ((createFormConfig ? createFormConfig(params) : {}) || {}) as any
      }

      return conf
    }

    const initSettingForm = () => {
      reactData.formData = createSettingForm()
    }

    const clearConfig = () => {
      loadConfig({
        searchItems: [],
        listColumns: []
      })
      initSettingForm()
      return nextTick()
    }

    const listDesignMethods: ListDesignMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, createEvent(evnt, { $listDesign: $xeListDesign }, params))
      },
      loadFormDesignConfig (config) {
        const { listTableColumns } = reactData
        const oldMaps: Record<string, VxeListDesignDefines.ListColumnObjItem> = {}
        XEUtils.eachTree(listTableColumns, item => {
          oldMaps[item.field] = item
        }, { children: 'children' })
        const columns = parseFormDesignColumns(config)
        XEUtils.eachTree(columns, item => {
          const oldItem = oldMaps[item.field]
          if (oldItem) {
            if (oldItem.width) {
              item.width = oldItem.width
            }
            item.visible = oldItem.visible
          }
        }, { children: 'children' })
        reactData.listTableColumns = columns
        return nextTick()
      },
      reloadFormDesignConfig (config) {
        reactData.listTableColumns = parseFormDesignColumns(config)
        return nextTick()
      },
      getSearchItems,
      setSearchItems,
      getListColumns,
      setListColumns,
      getConfig () {
        return {
          formConfig: reactData.formData,
          searchItems: getSearchItems(),
          listColumns: getListColumns()
        }
      },
      loadConfig,
      reloadConfig (config) {
        clearConfig()
        return loadConfig(config)
      },
      clearConfig
    }

    const listDesignPrivateMethods: ListDesignPrivateMethods = {
    }

    Object.assign($xeListDesign, listDesignMethods, listDesignPrivateMethods)

    const renderVN = () => {
      const { height } = props
      const headerSlot = slots.header

      return h('div', {
        ref: refElem,
        class: 'vxe-list-design',
        style: height
          ? {
              height: toCssUnit(height)
            }
          : null
      }, [
        h('div', {
          class: 'vxe-list-design--header'
        }, headerSlot ? headerSlot({}) : []),
        h('div', {
          class: 'vxe-list-design--body'
        }, [
          h(LayoutPreviewComponent),
          h(LayoutSettingComponent)
        ])
      ])
    }

    $xeListDesign.renderVN = renderVN

    provide('$xeListDesign', $xeListDesign)

    watch(() => props.config, (value) => {
      loadConfig(value || {})
    })

    initSettingForm()

    if (props.config) {
      loadConfig(props.config)
    }

    return $xeListDesign
  },
  render () {
    return this.renderVN()
  }
})
