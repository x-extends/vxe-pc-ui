<template>
  <div>
    <vxe-table-select v-model="val1" v-bind="tableSelectOptions"></vxe-table-select>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { VxeTableSelectProps } from '../../../types'

interface RowVO {
  value: number
  label: string
  role: string
  sex: string
  age: number
  address: string
}

const val1 = ref()

const tableSelectOptions = reactive<VxeTableSelectProps<RowVO>>({
  filterable: true,
  filterConfig: {
    // filterMethod ({ filterValue, row }) {
    //   // 重写为精确匹配
    //   return row.label === filterValue
    // }
  },
  gridConfig: {
    border: true,
    columns: [
      { type: 'radio', width: 70 },
      { field: 'label', title: 'Name' },
      { field: 'role', title: 'Role' },
      { field: 'sex', title: 'Sex' },
      { field: 'address', title: 'Address' }
    ]
  },
  options: [
    { value: 10001, label: 'Test1', role: 'Develop', sex: 'Man', age: 28, address: 'test abc' },
    { value: 10002, label: 'Test2', role: 'Test', sex: 'Women', age: 22, address: 'Guangzhou' },
    { value: 10003, label: 'Test3', role: 'PM', sex: 'Man', age: 32, address: 'Shanghai' },
    { value: 10004, label: 'Test4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
    { value: 10005, label: 'Test5', role: 'PM', sex: 'Man', age: 32, address: 'Guangzhou' },
    { value: 10006, label: 'Test6', role: 'Develop', sex: 'Man', age: 24, address: 'test abc' },
    { value: 10007, label: 'Test7', role: 'Develop', sex: 'Man', age: 26, address: 'Shanghai' },
    { value: 10008, label: 'Test8', role: 'Test', sex: 'Women', age: 25, address: 'test abc' },
    { value: 10009, label: 'Test9', role: 'PM', sex: 'Women', age: 32, address: 'Guangzhou' },
    { value: 100010, label: 'Test10', role: 'Develop', sex: 'Women', age: 24, address: 'Guangzhou' }
  ]
})
</script>
