<template>
  <div>
    <div style="height: 800px;">
      aaa
    </div>
    <vxe-table
      show-footer
      :row-config="{useKey: true}"
      :column-config="{useKey: true}"
      :footer-data="footerData"
      :tooltip-config="tooltipConfig"
      :header-tooltip-config="headerTooltipConfig"
      :footer-tooltip-config="footerTooltipConfig"
      :data="tableData">
      <vxe-column field="seq" type="seq" width="70"></vxe-column>
      <vxe-column field="name" title="名称"></vxe-column>
      <vxe-column field="role" title="角色"></vxe-column>
      <vxe-column field="date" title="Date"></vxe-column>
      <vxe-column field="rate" title="Rate"></vxe-column>
      <vxe-column field="address" title="Address" width="160"></vxe-column>
      <vxe-column type="html" field="content" title="Content" width="200"></vxe-column>
    </vxe-table>
    <div style="height: 800px;">
      aaa
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { VxeTablePropTypes } from '../../../types/components/table'

interface RowVO {
  name: string
  role: string
  date: string
  rate: number
  address: string
  content: string
}

const tableData = ref<RowVO[]>([
  { name: 'Test1', role: '前端', date: '2020-02-28', rate: 5, address: 'address1', content: 'xxxxx1<br>换行换行11111111111' },
  { name: 'Test2', role: '后端', date: '2020-02-22', rate: 2, address: 'address2', content: 'xxxxx1<br>换行换行2' },
  { name: 'Test3', role: '前端', date: '2020-01-01', rate: 0, address: 'address3', content: 'xxxxx1<br>换行换行<br>3333' },
  { name: 'Test4', role: '设计师', date: '2020-02-23', rate: 1, address: 'address4', content: 'xxxxx1<br>换行换行4' },
  { name: 'Test5', role: '前端', date: '2020-01-20', rate: 3, address: 'address5', content: 'xxxxx1<br>换行换行55' }
])

const headerTooltipConfig = reactive<VxeTablePropTypes.HeaderTooltipConfig<RowVO>>({
  showAll: true,
  enterable: true,
  contentMethod: ({ column }) => {
    const { field, title } = column
    // 重写默认的提示内容
    if (field === 'date' || field === 'rate') {
      return `自定义表头：${title}`
    }
    // 其余的单元格使用默认行为
    return null
  }
})

const tooltipConfig = reactive<VxeTablePropTypes.TooltipConfig<RowVO>>({
  showAll: true,
  enterable: true,
  contentMethod: ({ column, row }) => {
    const { field } = column
    // 重写默认的提示内容
    if (field === 'date' || field === 'rate') {
      return `自定义单元格：${row[field]}`
    }
    // 其余的单元格使用默认行为
    return null
  }
})

const footerTooltipConfig = reactive<VxeTablePropTypes.FooterTooltipConfig<RowVO>>({
  showAll: true,
  enterable: true,
  contentMethod: ({ column, row }) => {
    const { field } = column
    // 重写默认的提示内容
    if (field === 'date' || field === 'rate') {
      return `自定义表尾：${row[field]}`
    }
    // 其余的单元格使用默认行为
    return null
  }
})

const footerData = ref<VxeTablePropTypes.FooterData>([
  { seq: '合计', date: '2020-09-05', rate: 999.8 }
])
</script>
