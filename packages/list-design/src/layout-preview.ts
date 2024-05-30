import { defineComponent, h, resolveComponent, inject, ref, watch } from 'vue'
import VxeFormComponent from '../../form/src/form'

import { VxeListDesignConstructor, VxeListDesignPrivateMethods, VxeGridComponent, VxeTablePropTypes } from '../../../types'

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

    const tableData = ref<VxeTablePropTypes.Data>([])

    watch(() => listDesignReactData.listTableColumns, () => {
      tableData.value = []
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
            h(VxeFormComponent, {
              items: searchFormItems
            })
          ]),
          h('div', {
            class: 'vxe-list-design--preview-table'
          }, [
            h(resolveComponent('vxe-grid') as VxeGridComponent, {
              columns: listTableColumns,
              data: tableData.value
            })
          ])
        ])
      ])
    }
  }
})
