<template>
  <div>
    <vxe-table-select
      v-model="val1"
      multiple
      :options="tableData"
      :popup-config="popupConfig"
      :grid-config="gridConfig"
      @page-change="pageChangeEvent">
    </vxe-table-select>
  </div>
</template>

<script>
const allList = [
  { value: 'Test1', label: 'ff1', nickname: 'T1', role: 'Develop', sex: 'Man', age: 28, address: 'Shenzhen' },
  { value: 'Test2', label: 'ff2', nickname: 'T2', role: 'Test', sex: 'Women', age: 22, address: 'Guangzhou' },
  { value: 'Test3', label: 'ff3', nickname: 'T3', role: 'PM', sex: 'Man', age: 32, address: 'Shanghai' },
  { value: 'Test4', label: 'ff4', nickname: 'T4', role: 'Designer', sex: 'Women', age: 23, address: 'test abc' },
  { value: 'Test5', label: 'ff5', nickname: 'T5', role: 'Develop', sex: 'Women', age: 30, address: 'Shanghai' },
  { value: 'Test6', label: 'ff6', nickname: 'T6', role: 'Designer', sex: 'Women', age: 21, address: 'Shenzhen' },
  { value: 'Test7', label: 'ff7', nickname: 'T7', role: 'Test', sex: 'Man', age: 29, address: 'Shenzhen' },
  { value: 'Test8', label: 'ff8', nickname: 'T8', role: 'Develop', sex: 'Man', age: 35, address: 'test abc' },
  { value: 'Test9', label: 'ff9', nickname: 'T9', role: 'Develop', sex: 'Man', age: 35, address: 'Shenzhen' },
  { value: 'Test10', label: 'ff10', nickname: 'T10', role: 'Develop', sex: 'Man', age: 35, address: 'Guangzhou' },
  { value: 'Test11', label: 'ff11', nickname: 'T11', role: 'Develop', sex: 'Man', age: 49, address: 'Guangzhou' },
  { value: 'Test12', label: 'ff12', nickname: 'T12', role: 'Develop', sex: 'Women', age: 45, address: 'Shanghai' },
  { value: 'Test13', label: 'ff13', nickname: 'T13', role: 'Test', sex: 'Women', age: 35, address: 'Guangzhou' },
  { value: 'Test14', label: 'ff14', nickname: 'T14', role: 'Test', sex: 'Man', age: 29, address: 'Shanghai' },
  { value: 'Test15', label: 'ff15', nickname: 'T15', role: 'Develop', sex: 'Man', age: 39, address: 'Guangzhou' },
  { value: 'Test16', label: 'ff16', nickname: 'T16', role: 'Test', sex: 'Women', age: 35, address: 'Guangzhou' },
  { value: 'Test17', label: 'ff17', nickname: 'T17', role: 'Test', sex: 'Man', age: 39, address: 'Shanghai' },
  { value: 'Test18', label: 'ff18', nickname: 'T18', role: 'Develop', sex: 'Man', age: 44, address: 'Guangzhou' },
  { value: 'Test19', label: 'ff19', nickname: 'T19', role: 'Develop', sex: 'Man', age: 39, address: 'Guangzhou' },
  { value: 'Test20', label: 'ff20', nickname: 'T20', role: 'Test', sex: 'Women', age: 35, address: 'Guangzhou' },
  { value: 'Test21', label: 'ff21', nickname: 'T21', role: 'Test', sex: 'Man', age: 39, address: 'Shanghai' },
  { value: 'Test22', label: 'ff22', nickname: 'T22', role: 'Develop', sex: 'Man', age: 44, address: 'Guangzhou' }
]
export default {
  data () {
    const tableData = []
    const popupConfig = {
      width: 600,
      height: 400
    }
    const pagerConfig = {
      total: 0,
      currentPage: 1,
      pageSize: 10
    }
    const gridConfig = {
      border: true,
      loading: false,
      pagerConfig,
      columns: [
        { type: 'checkbox', width: 70 },
        { field: 'label', title: 'Name' },
        { field: 'role', title: 'Role' },
        { field: 'sex', title: 'Sex' },
        { field: 'address', title: 'Address' }
      ]
    }
    return {
      val1: [],
      tableData,
      popupConfig,
      pagerConfig,
      gridConfig
    }
  },
  methods: {
    pageChangeEvent ({ pageSize, currentPage }) {
      this.pagerConfig.currentPage = currentPage
      this.pagerConfig.pageSize = pageSize
      this.handlePageData()
    },
    // 模拟前端分页
    handlePageData () {
      this.gridConfig.loading = true
      setTimeout(() => {
        const { pageSize, currentPage } = this.pagerConfig
        this.pagerConfig.total = allList.length
        this.tableData = allList.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        this.gridConfig.loading = false
      }, 100)
    }
  },
  created () {
    this.handlePageData()
  }
}
</script>
