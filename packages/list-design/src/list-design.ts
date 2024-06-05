import { defineComponent, ref, h, PropType, reactive, nextTick, provide } from 'vue'
import XEUtils from 'xe-utils'
import { toCssUnit } from '../../ui/src/dom'
import { getConfig, createEvent } from '../../ui'
import LayoutPreviewComponent from './layout-preview'
import LayoutSettingComponent from './layout-setting'

import type { VxeListDesignDefines, VxeListDesignPropTypes, ListDesignReactData, ListDesignPrivateRef, VxeListDesignPrivateComputed, VxeListDesignConstructor, VxeListDesignPrivateMethods, ListDesignMethods, ListDesignPrivateMethods, VxeFormDesignDefines } from '../../../types'

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
    config: {
      type: Object as PropType<VxeListDesignPropTypes.Config>,
      default: () => ({})
    },
    showPc: {
      type: Boolean as PropType<VxeListDesignPropTypes.ShowPc>,
      default: () => getConfig().listDesign.showPc
    },
    showMobile: {
      type: Boolean as PropType<VxeListDesignPropTypes.ShowMobile>,
      default: () => getConfig().listDesign.showMobile
    }
  },
  emits: [],
  setup (props, context) {
    const { emit, slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<ListDesignReactData>({
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

    const parseWidgetColumn = (widget: VxeFormDesignDefines.WidgetObjItem) => {
      return {
        title: widget.title,
        field: widget.field,
        visible: true
      }
    }

    /**
     * 解析表单设计 JSON
     */
    const parseFormDesignColumns = (config: VxeFormDesignDefines.FormDesignConfig) => {
      const tableColumns: VxeListDesignDefines.ListColumnObjItem[] = []
      if (config) {
        const { widgetData } = config
        if (widgetData) {
          widgetData.forEach(item => {
            // 如果是行列
            if (item.name === 'row') {
              //
            } else if (item.name === 'subTable') {
              // 如果是子表
            } else {
              tableColumns.push(parseWidgetColumn(item))
            }
          })
        }
      }
      return tableColumns
    }

    const configToSearchItems = (searchItems: VxeListDesignDefines.SearchItemObjItem[]): VxeListDesignDefines.SearchItemObjItem[] => {
      if (searchItems) {
        return searchItems.map(item => {
          return {
            field: item.field,
            title: item.title
          }
        })
      }
      return []
    }

    const configToListColumns = (listColumns: VxeListDesignDefines.ListColumnObjItem[]): VxeListDesignDefines.ListColumnObjItem[] => {
      if (listColumns) {
        return listColumns.map(item => {
          return {
            field: item.field,
            title: item.title,
            visible: !!item.visible
          }
        })
      }
      return []
    }

    const setConfig = (config: VxeListDesignDefines.ListDesignConfig) => {
      setSearchItems(config.searchItems)
      reactData.listTableColumns = configToListColumns(config.listColumns)
      return nextTick()
    }

    const getSearchItems = () => {
      return reactData.searchFormItems
    }

    const setSearchItems = (searchItems: VxeListDesignDefines.SearchItemObjItem[]) => {
      reactData.searchFormItems = configToSearchItems(searchItems)
      return nextTick()
    }

    const getListColumns = () => {
      return reactData.listTableColumns
    }

    const setListColumns = (listColumns: VxeListDesignDefines.ListColumnObjItem[]) => {
      reactData.listTableColumns = configToListColumns(listColumns)
      return nextTick()
    }

    const listDesignMethods: ListDesignMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, createEvent(evnt, { $listDesign: $xeListDesign }, params))
      },
      setFormDesignConfig (config) {
        reactData.listTableColumns = parseFormDesignColumns(config)
        return nextTick()
      },
      getSearchItems,
      setSearchItems,
      getListColumns,
      setListColumns,
      getConfig () {
        return {
          formConfig: {},
          searchItems: getSearchItems(),
          listColumns: getListColumns()
        }
      },
      setConfig
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

    return $xeListDesign
  },
  render () {
    return this.renderVN()
  }
})
