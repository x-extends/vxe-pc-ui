import { defineComponent, ref, PropType, h, reactive, resolveComponent, provide, watch, nextTick } from 'vue'
import { createEvent } from '../../ui'
import XEUtils from 'xe-utils'

import type { ListViewReactData, ListViewPrivateRef, VxeListViewPropTypes, VxeGridComponent, VxeListViewEmits, VxeListViewPrivateComputed, VxeListViewConstructor, VxeListDesignDefines, ListViewMethods, ListViewPrivateMethods, VxeListViewPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeListView',
  props: {
    config: {
      type: Object as PropType<VxeListViewPropTypes.Config>,
      default: () => ({})
    },
    data: Array as PropType<VxeListViewPropTypes.Data>,
    viewRender: Object as PropType<VxeListViewPropTypes.ViewRender>
  },
  emits: [

  ] as VxeListViewEmits,
  setup (props, context) {
    const { emit } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<ListViewReactData>({
      searchFormItems: [],
      listTableColumns: []
    })

    const refMaps: ListViewPrivateRef = {
      refElem
    }

    const computeMaps: VxeListViewPrivateComputed = {
    }

    const $xeListView = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeListViewConstructor & VxeListViewPrivateMethods

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

    const loadConfig = (config: Partial<VxeListDesignDefines.ListDesignConfig> | null) => {
      if (config) {
        setSearchItems(config.searchItems || [])
        reactData.listTableColumns = configToListColumns(config.listColumns || [])
      }
      return nextTick()
    }

    const setSearchItems = (searchItems: VxeListDesignDefines.SearchItemObjItem[]) => {
      reactData.searchFormItems = configToSearchItems(searchItems)
      return nextTick()
    }

    const listViewMethods: ListViewMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, createEvent(evnt, { $listView: $xeListView }, params))
      },
      loadConfig
    }

    const listViewPrivateMethods: ListViewPrivateMethods = {
    }

    Object.assign($xeListView, listViewMethods, listViewPrivateMethods)

    const renderVN = () => {
      const { data } = props
      const { listTableColumns } = reactData
      return h('div', {
        ref: refElem,
        class: ['vxe-list-view']
      }, [
        h('div', {}, [
          h(resolveComponent('vxe-grid') as VxeGridComponent, {
            columns: listTableColumns,
            data: data,
            columnConfig: {
              minWidth: 80
            }
          })
        ])
      ])
    }

    $xeListView.renderVN = renderVN

    watch(() => props.config, () => {
      loadConfig(props.config)
    })

    loadConfig(props.config)

    provide('$xeListView', $xeListView)

    return $xeListView
  },
  render () {
    return this.renderVN()
  }
})
