<template>
  <div>
    <vxe-table-select v-model="val1" :options="opts1" :columns="columns1"></vxe-table-select>
    <vxe-table-select v-model="val2" :options="opts2" :columns="columns2" multiple></vxe-table-select>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { VxeTableSelectPropTypes } from '../../../types'

export default Vue.extend({
  data () {
    const columns1: VxeTableSelectPropTypes.Columns = [
      { field: 'name', title: 'Name' },
      { field: 'role', title: 'Role' },
      { field: 'sex', title: 'Sex' }
    ]
    const opts1 = [
      { name: 'Test1', role: 'Test', sex: 'man', label: 'Test1', value: 1 },
      { name: 'Test2', role: 'Test', sex: 'man', label: 'Test2', value: 2 },
      { name: 'Test3', role: 'Test', sex: 'man', label: 'Test3', value: 3 },
      { name: 'Test4', role: 'Test', sex: 'man', label: 'Test4', value: 4 },
      { name: 'Test5', role: 'Test', sex: 'man', label: 'Test5', value: 5 },
      { name: 'Test6', role: 'Test', sex: 'man', label: 'Test6', value: 6 }
    ]

    const columns2: VxeTableSelectPropTypes.Columns = [
      { field: 'name', title: 'Name' },
      { field: 'role', title: 'Role' },
      { field: 'sex', title: 'Sex' }
    ]
    const opts2 = [
      { name: 'Test1', role: 'Test', sex: 'man', label: 'Test1', value: 1 },
      { name: 'Test2', role: 'Test', sex: 'man', label: 'Test2', value: 2 },
      { name: 'Test3', role: 'Test', sex: 'man', label: 'Test3', value: 3 },
      { name: 'Test4', role: 'Test', sex: 'man', label: 'Test4', value: 4 },
      { name: 'Test5', role: 'Test', sex: 'man', label: 'Test5', value: 5 },
      { name: 'Test6', role: 'Test', sex: 'man', label: 'Test6', value: 6 }
    ]

    return {
      val1: 2,
      columns1,
      opts1,
      val2: [3, 4],
      columns2,
      opts2
    }
  },
  methods: {
    tabToadEvent (params: any) {
      console.log(params)
    }
  }
})
</script>
