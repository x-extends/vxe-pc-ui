<template>
  <div>
    <vxe-table-select v-model="val1" :options="opts1" :columns="columns1"></vxe-table-select>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { VxeTableSelectPropTypes } from '../../../types'

const val1 = ref('')
const columns1 = ref<VxeTableSelectPropTypes.Columns>([
  { field: 'name', title: 'Name' },
  { field: 'role', title: 'Role' },
  { field: 'sex', title: 'Sex' }
])
const opts1 = ref([
  { name: 'Test1', role: 'Test', sex: 'man', label: 'Test1', value: 1 },
  { name: 'Test2', role: 'Test', sex: 'man', label: 'Test2', value: 2 },
  { name: 'Test3', role: 'Test', sex: 'man', label: 'Test3', value: 3 },
  { name: 'Test4', role: 'Test', sex: 'man', label: 'Test4', value: 4 },
  { name: 'Test5', role: 'Test', sex: 'man', label: 'Test5', value: 5 },
  { name: 'Test6', role: 'Test', sex: 'man', label: 'Test6', value: 6 }
])
</script>
