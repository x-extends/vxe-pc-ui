<template>
  <div>
    <vxe-table-select v-model="val1" :columns="columnList" :grid-config="gridConfig"></vxe-table-select>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { VxeTableSelectPropTypes } from '../../../types'

interface RowVO {
  value: string
  label: string
  nickname: string
  role: string
  sex: string
  age: number
  address: string
}

const list = [
  { value: 'Test1', label: 'Test1', nickname: 'T1', role: 'Develop', sex: 'Man', age: 28, address: 'Shenzhen' },
  { value: 'Test2', label: 'Test2', nickname: 'T2', role: 'Test', sex: 'Women', age: 22, address: 'Guangzhou' },
  { value: 'Test3', label: 'Test3', nickname: 'T3', role: 'PM', sex: 'Man', age: 32, address: 'Shanghai' },
  { value: 'Test4', label: 'Test4', nickname: 'T4', role: 'Designer', sex: 'Women', age: 23, address: 'test abc' },
  { value: 'Test5', label: 'Test5', nickname: 'T5', role: 'Develop', sex: 'Women', age: 30, address: 'Shanghai' },
  { value: 'Test6', label: 'Test6', nickname: 'T6', role: 'Designer', sex: 'Women', age: 21, address: 'Shenzhen' },
  { value: 'Test7', label: 'Test7', nickname: 'T7', role: 'Test', sex: 'Man', age: 29, address: 'Shenzhen' },
  { value: 'Test8', label: 'Test8', nickname: 'T8', role: 'Develop', sex: 'Man', age: 35, address: 'test abc' },
  { value: 'Test9', label: 'Test9', nickname: 'T9', role: 'Develop', sex: 'Man', age: 35, address: 'Shenzhen' },
  { value: 'Test10', label: 'Test10', nickname: 'T10', role: 'Develop', sex: 'Man', age: 35, address: 'Guangzhou' },
  { value: 'Test11', label: 'Test11', nickname: 'T11', role: 'Develop', sex: 'Man', age: 49, address: 'Guangzhou' },
  { value: 'Test12', label: 'Test12', nickname: 'T12', role: 'Develop', sex: 'Women', age: 45, address: 'Shanghai' },
  { value: 'Test13', label: 'Test13', nickname: 'T13', role: 'Test', sex: 'Women', age: 35, address: 'Guangzhou' },
  { value: 'Test14', label: 'Test14', nickname: 'T14', role: 'Test', sex: 'Man', age: 29, address: 'Shanghai' },
  { value: 'Test15', label: 'Test15', nickname: 'T15', role: 'Develop', sex: 'Man', age: 39, address: 'Guangzhou' },
  { value: 'Test16', label: 'Test16', nickname: 'T16', role: 'Test', sex: 'Women', age: 35, address: 'Guangzhou' },
  { value: 'Test17', label: 'Test17', nickname: 'T17', role: 'Test', sex: 'Man', age: 39, address: 'Shanghai' },
  { value: 'Test18', label: 'Test18', nickname: 'T18', role: 'Develop', sex: 'Man', age: 44, address: 'Guangzhou' },
  { value: 'Test19', label: 'Test19', nickname: 'T19', role: 'Develop', sex: 'Man', age: 39, address: 'Guangzhou' },
  { value: 'Test20', label: 'Test20', nickname: 'T20', role: 'Test', sex: 'Women', age: 35, address: 'Guangzhou' },
  { value: 'Test21', label: 'Test21', nickname: 'T21', role: 'Test', sex: 'Man', age: 39, address: 'Shanghai' },
  { value: 'Test22', label: 'Test22', nickname: 'T22', role: 'Develop', sex: 'Man', age: 44, address: 'Guangzhou' }
]

const val1 = ref()

const columnList = ref<VxeTableSelectPropTypes.Columns>([
  { type: 'radio', width: 70 },
  { field: 'label', title: 'Name' },
  { field: 'role', title: 'Role' },
  { field: 'sex', title: 'Sex' },
  { field: 'address', title: 'Address' }
])

// 模拟接口
const findPageList = (pageSize: number, currentPage: number, formData: any) => {
  console.log(`调用查询接口 pageSize=${pageSize} currentPage=${currentPage} formData=`, formData)
  return new Promise<{
    result: RowVO[]
    page: {
      total: number
    }
  }>(resolve => {
    setTimeout(() => {
      resolve({
        result: list.slice((currentPage - 1) * pageSize, currentPage * pageSize),
        page: {
          total: list.length
        }
      })
    }, 100)
  })
}

const gridConfig = reactive<VxeTableSelectPropTypes.GridConfig>({
  border: true,
  pagerConfig: {},
  formConfig: {
    items: [
      { field: 'name', title: 'Name', itemRender: { name: 'VxeInput' } },
      {
        itemRender: {
          name: 'VxeButtonGroup',
          options: [
            { type: 'submit', content: '搜索', status: 'primary' },
            { type: 'reset', content: '重置' }
          ]
        }
      }
    ]
  },
  proxyConfig: {
    form: true,
    ajax: {
      query: ({ form, page }) => {
        // 默认接收 Promise<{ result: [], page: { total: 100 } }>
        return findPageList(page.pageSize, page.currentPage, form)
      }
    }
  }
})
</script>
