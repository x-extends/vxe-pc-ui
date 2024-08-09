import { defineComponent, h, inject, ref, watch, onMounted, createCommentVNode, nextTick, computed } from 'vue'
import { VxeUI, getI18n } from '../../ui'
import { errLog } from '../../ui/src/log'
import VxeFormComponent from '../../form/src/form'

import { VxeListDesignConstructor, VxeListDesignPrivateMethods, VxeGridComponent, VxeTablePropTypes, VxeGridInstance, VxeGridPropTypes } from '../../../types'

export default defineComponent({
  name: 'ListDesignLayoutView',
  props: {},
  emits: [],
  setup () {
    const VxeTableGridComponent = VxeUI.getComponent<VxeGridComponent>('VxeGrid')

    const $xeListDesign = inject<(VxeListDesignConstructor & VxeListDesignPrivateMethods) | null>('$xeListDesign', null)

    if (!$xeListDesign) {
      return () => []
    }

    const { reactData: listDesignReactData } = $xeListDesign

    const refGrid = ref<VxeGridInstance>()

    const tableData = ref<VxeTablePropTypes.Data>([])

    const tableColumn = computed(() => {
      const { formData, listTableColumns } = listDesignReactData
      const { showSeq, actionButtonList } = formData
      const columns: VxeGridPropTypes.Columns = []
      if (showSeq) {
        columns.unshift({
          type: 'seq',
          field: '_seq',
          width: 70
        })
      }
      if (actionButtonList && actionButtonList.length) {
        columns.push({
          field: '_active',
          title: getI18n('vxe.table.actionTitle'),
          width: 'auto',
          cellRender: {
            name: 'VxeButtonGroup',
            options: []
          }
        })
      }
      columns.push(...listTableColumns)
      return columns
    })

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

    if (process.env.VUE_APP_VXE_ENV === 'development') {
      nextTick(() => {
        if (!VxeTableGridComponent) {
          errLog('vxe.error.reqComp', ['vxe-grid'])
        }
      })
    }

    return () => {
      const { searchFormItems } = listDesignReactData

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
                class: 'vxe-list-design--field-configs-empty-data'
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
            VxeTableGridComponent
              ? h(VxeTableGridComponent, {
                ref: refGrid,
                columns: tableColumn.value,
                data: tableData.value,
                showOverflow: true,
                border: true,
                columnConfig: {
                  minWidth: 'auto',
                  resizable: true
                },
                rowConfig: {
                  isHover: true
                },
                scrollX: {
                  enabled: false
                },
                scrollY: {
                  enabled: false
                }
              })
              : createCommentVNode()
          ])
        ])
      ])
    }
  }
})
