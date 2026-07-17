<template>
  <div>
    <vxe-button @click="printEvent">直接打印</vxe-button>
    <vxe-grid ref="gridRef" v-bind="gridOptions"></vxe-grid>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { VxeGridInstance, VxeGridProps } from 'vxe-table'

interface RowVO {
  id: number
  name: string
  role: string
  sex: string
  age: number
  address: string
}

const gridRef = ref<VxeGridInstance<RowVO>>()

const gridOptions = reactive<VxeGridProps<RowVO>>({
  border: true,
  showFooter: true,
  height: 400,
  columns: [
    { field: 'seq', type: 'seq', width: 70 },
    { field: 'name', title: 'Name', minWidth: 300 },
    { field: 'role', title: 'Role', width: 200 },
    { field: 'sex', title: 'Sex', width: 100 },
    { field: 'address', title: 'Address', width: 200 }
  ],
  data: [
    { id: 10001, name: 'Test1', role: 'Develop', sex: 'Man', age: 28, address: 'test abc' },
    { id: 10002, name: 'Test2', role: 'Test', sex: 'Women', age: 22, address: 'Guangzhou' },
    { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', age: 32, address: 'Shanghai' },
    { id: 10004, name: 'Test4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
    { id: 10005, name: 'Test5', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
    { id: 10006, name: 'Test6', role: 'Test', sex: 'Women', age: 24, address: 'Shanghai' },
    { id: 10007, name: 'Test7', role: 'Designer', sex: 'Women', age: 24, address: 'Guangzhou' },
    { id: 10008, name: 'Test8', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
    { id: 10009, name: 'Test9', role: 'Designer', sex: 'Women', age: 24, address: 'Guangzhou' },
    { id: 10010, name: 'Test10', role: 'PM', sex: 'Women', age: 24, address: 'Shanghai' },
    { id: 10011, name: 'Test11', role: 'Designer', sex: 'Women', age: 38, address: 'Shanghai' },
    { id: 10012, name: 'Test12', role: 'Designer', sex: 'Women', age: 39, address: 'Shanghai' },
    { id: 10013, name: 'Test13', role: 'Develop', sex: 'Women', age: 35, address: 'Shanghai' },
    { id: 10014, name: 'Test14', role: 'Designer', sex: 'Women', age: 30, address: 'test abc' },
    { id: 10015, name: 'Test15', role: 'Designer', sex: 'Women', age: 27, address: 'Shanghai' },
    { id: 10016, name: 'Test16', role: 'PM', sex: 'Women', age: 24, address: 'Guangzhou' },
    { id: 10017, name: 'Test17', role: 'Designer', sex: 'Women', age: 27, address: 'Shanghai' },
    { id: 10018, name: 'Test18', role: 'Test', sex: 'Women', age: 24, address: 'test abc abc' },
    { id: 10019, name: 'Test19', role: 'Develop', sex: 'Women', age: 26, address: 'Shanghai' },
    { id: 10020, name: 'Test20', role: 'Designer', sex: 'Women', age: 19, address: 'Shanghai' },
    { id: 10021, name: 'Test21', role: 'Designer', sex: 'Women', age: 57, address: 'Shanghai' },
    { id: 10022, name: 'Test22', role: 'PM', sex: 'Women', age: 24, address: 'Shanghai' },
    { id: 10023, name: 'Test23', role: 'Designer', sex: 'Women', age: 65, address: 'test abc' },
    { id: 10024, name: 'Test24', role: 'Develop', sex: 'Women', age: 24, address: 'Shanghai' },
    { id: 10025, name: 'Test25', role: 'Develop', sex: 'Women', age: 45, address: 'Shanghai' },
    { id: 10026, name: 'Test26', role: 'PM', sex: 'Women', age: 24, address: 'Shanghtest abcai' },
    { id: 10027, name: 'Test27', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
    { id: 10028, name: 'Test28', role: 'Develop', sex: 'Women', age: 44, address: 'Guangzhou' },
    { id: 10029, name: 'Test29', role: 'PM', sex: 'Women', age: 24, address: 'test abc' },
    { id: 10030, name: 'Test30', role: 'Designer', sex: 'Women', age: 33, address: 'Shanghai' },
    { id: 10031, name: 'Test31', role: 'Test', sex: 'Women', age: 24, address: 'Shanghai' },
    { id: 10032, name: 'Test32', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
    { id: 10033, name: 'Test33', role: 'Test', sex: 'Women', age: 21, address: 'test abc' },
    { id: 10034, name: 'Test34', role: 'Designer', sex: 'Women', age: 32, address: 'Guangzhou' },
    { id: 10035, name: 'Test35', role: 'Designer', sex: 'Women', age: 29, address: 'Shanghai' },
    { id: 10036, name: 'Test36', role: 'PM', sex: 'Women', age: 24, address: 'test abc abchai' },
    { id: 10037, name: 'Test37', role: 'Develop', sex: 'Women', age: 49, address: 'Shanghai' },
    { id: 10038, name: 'Test38', role: 'Designer', sex: 'Women', age: 48, address: 'Guangzhou' },
    { id: 10039, name: 'Test39', role: 'Test', sex: 'Women', age: 43, address: 'Shanghai' },
    { id: 10040, name: 'Test40', role: 'Develop', sex: 'Women', age: 37, address: 'Shanghai' },
    { id: 10041, name: 'Test41', role: 'Develop', sex: 'Women', age: 37, address: 'Shanghai' },
    { id: 10042, name: 'Test42', role: 'Develop', sex: 'Women', age: 37, address: 'Shanghai' },
    { id: 10043, name: 'Test43', role: 'Develop', sex: 'Women', age: 37, address: 'Shanghai' },
    { id: 10044, name: 'Test44', role: 'Develop', sex: 'Women', age: 37, address: 'Shanghai' },
    { id: 10045, name: 'Test45', role: 'Develop', sex: 'Women', age: 37, address: 'Shanghai Shanghai ShanghaiShanghai Shanghai Shanghai' },
    { id: 10046, name: 'Test46', role: 'Develop', sex: 'Women', age: 37, address: 'Shanghai' },
    { id: 10047, name: 'Test47', role: 'Develop', sex: 'Women', age: 37, address: 'Shanghai' },
    { id: 10048, name: 'Test48', role: 'Develop', sex: 'Women', age: 37, address: 'Shanghai' },
    { id: 10049, name: 'Test49', role: 'Develop', sex: 'Women', age: 37, address: 'Shanghai' },
    { id: 10050, name: 'Test50', role: 'Develop', sex: 'Women', age: 37, address: 'Shanghai' },
    { id: 10051, name: 'Test51', role: 'Develop', sex: 'Women', age: 37, address: 'Shanghai' },
    { id: 10052, name: 'Test52', role: 'Develop', sex: 'Women', age: 37, address: 'Shanghai' },
    { id: 10053, name: 'Test53', role: 'Develop', sex: 'Women', age: 37, address: 'Shanghai' },
    { id: 10054, name: 'Test54', role: 'Develop', sex: 'Women', age: 37, address: 'Shanghai' },
    { id: 10055, name: 'Test55', role: 'Develop', sex: 'Women', age: 37, address: 'Shanghai' },
    { id: 10056, name: 'Test56', role: 'Develop', sex: 'Women', age: 37, address: 'Shanghai' },
    { id: 10057, name: 'Test57', role: 'Develop', sex: 'Women', age: 37, address: 'Shanghai' },
    { id: 10058, name: 'Test58', role: 'Develop', sex: 'Women', age: 37, address: 'Shanghai' },
    { id: 10059, name: 'Test59', role: 'Develop', sex: 'Women', age: 37, address: 'Shanghai' },
    { id: 10060, name: 'Test60', role: 'Develop', sex: 'Women', age: 37, address: 'Shanghai' }
  ],
  footerData: [
    { seq: '合计', sex: '666', age: '999' }
  ]
})

const printEvent = () => {
  const $grid = gridRef.value
  if ($grid) {
    // $grid.print()
    $grid.exportData({ type: 'html' })
  }
}
</script>
