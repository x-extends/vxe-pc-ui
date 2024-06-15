import { defineComponent, h, resolveComponent, inject, ref, watch, onMounted } from 'vue'
import VxeFormComponent from '../../form/src/form'

import { VxeListDesignConstructor, VxeListDesignPrivateMethods, VxeGridComponent, VxeTablePropTypes, VxeGridInstance } from '../../../types'

export default defineComponent({
  name: 'ListDesignLayoutView',
  props: {},
  emits: [],
  setup () {
    const $xeListDesign = inject<(VxeListDesignConstructor & VxeListDesignPrivateMethods) | null>('$xeListDesign', null)

    if (!$xeListDesign) {
      return () => []
    }

    const { reactData: listDesignReactData } = $xeListDesign

    const refGrid = ref<VxeGridInstance>()

    const tableData = ref<VxeTablePropTypes.Data>([])

    const updateTableData = () => {
      const { listTableColumns } = listDesignReactData
      const data: Record<string, any>[] = [{}, {}]
      data.forEach(row => {
        listTableColumns.forEach(column => {
          row[column.field] = '-'
        })
      })
      tableData.value = data
    }

    const dataFlag = ref(0)
    watch(() => listDesignReactData.listTableColumns ? listDesignReactData.listTableColumns.length : -1, () => {
      dataFlag.value++
    })
    watch(() => listDesignReactData.listTableColumns, () => {
      dataFlag.value++
    })
    watch(dataFlag, () => {
      updateTableData()
    })

    onMounted(() => {
      updateTableData()
    })

    return () => {
      const { searchFormItems, listTableColumns } = listDesignReactData

      return h('div', {
        class: 'vxe-list-design--preview'
      }, [
        h('div', {
          class: 'vxe-list-design--preview-wrapper'
        }, [
          h('div', {
            class: 'vxe-list-design--preview-search'
          }, [
            h('div', {
              class: 'vxe-list-design--preview-title'
            }, '查询条件'),
            searchFormItems.length
              ? h(VxeFormComponent, {
                items: searchFormItems
              })
              : h('div', {
                class: 'vxe-list-design--widget-form-empty-data'
              }, [
                h('span', {}, '暂无查询条件')
              ])
          ]),
          h('div', {
            class: 'vxe-list-design--preview-table'
          }, [
            h('div', {
              class: 'vxe-list-design--preview-title'
            }, '列表字段'),
            h(resolveComponent('vxe-grid') as VxeGridComponent, {
              ref: refGrid,
              columns: listTableColumns,
              data: tableData.value,
              columnConfig: {
                minWidth: 80
              }
            })
          ])
        ])
      ])
    }
  }
})
