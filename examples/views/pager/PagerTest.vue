<template>
  <div>
    <p>
      <vxe-pager
        align="left"
        v-model:current-page="page1.currentPage"
        v-model:page-size="page1.pageSize"
        :total="page1.totalResult">
      </vxe-pager>
      <vxe-pager
        align="left"
        size="medium"
        v-model:current-page="page2.currentPage"
        v-model:page-size="page2.pageSize"
        :total="page2.totalResult">
      </vxe-pager>
      <vxe-pager
        align="left"
        size="small"
        v-model:current-page="page2.currentPage"
        v-model:page-size="page2.pageSize"
        :total="page2.totalResult">
      </vxe-pager>
      <vxe-pager
        align="left"
        size="mini"
        v-model:current-page="page2.currentPage"
        v-model:page-size="page2.pageSize"
        :total="page2.totalResult">
      </vxe-pager>
    </p>

    <p>
      <vxe-pager
        v-model:current-page="page4.currentPage"
        v-model:page-size="page4.pageSize"
        :total="page4.totalResult"
        :layouts="['Home', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'End', 'Sizes', 'FullJump', 'Total']">
      </vxe-pager>

      <vxe-pager
        background
        v-model:current-page="page5.currentPage"
        v-model:page-size="page5.pageSize"
        :total="page5.totalResult"
        :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']">
      </vxe-pager>
    </p>

    <p>
      <vxe-tooltip ref="xTip"></vxe-tooltip>
      <vxe-table
        border
        height="200"
        :data="demo6.tableData">
        <vxe-column type="seq" width="60"></vxe-column>
        <vxe-column field="name" title="Name"></vxe-column>
        <vxe-column field="sex" title="Sex"></vxe-column>
        <vxe-column field="age" title="Age"></vxe-column>
      </vxe-table>
      <vxe-pager
        perfect
        v-model:current-page="page6.currentPage"
        v-model:page-size="page6.pageSize"
        :total="page6.totalResult"
        :page-sizes="[10, 20, 100, {label: '大量数据', value: 1000}, {label: '全量数据', value: -1}]"
        :layouts="['Home', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'End', 'Sizes', 'FullJump', 'Total']">
        <template #left>
          <vxe-button content="更多操作" size="small">
            <template #dropdowns>
              <vxe-button content="批量修改" mode="text"></vxe-button>
              <vxe-button content="批量管理" mode="text"></vxe-button>
              <vxe-button content="批量删除" mode="text"></vxe-button>
            </template>
          </vxe-button>
        </template>
        <template #right>
          <img src="/vxe-table/static/other/img1.gif" height="34">
          <img src="/vxe-table/static/other/img1.gif" height="34">
          <img src="/vxe-table/static/other/img1.gif" height="34">
        </template>
      </vxe-pager>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

const page1 = reactive({
  currentPage: 1,
  pageSize: 10,
  totalResult: 200
})

const page2 = reactive({
  currentPage: 1,
  pageSize: 10,
  totalResult: 200
})

// const page3 = reactive({
//   currentPage: 1,
//   pageSize: 10,
//   totalResult: 200
// })

const page4 = reactive({
  currentPage: 1,
  pageSize: 10,
  totalResult: 300
})

const page5 = reactive({
  currentPage: 1,
  pageSize: 10,
  totalResult: 300
})

const page6 = reactive({
  currentPage: 1,
  pageSize: 10,
  totalResult: 300
})

const demo6 = reactive({
  tableData: [
    { id: 10001, name: 'Test1', role: 'Develop', sex: 'Man', age: 28, address: 'test abc' },
    { id: 10002, name: 'Test2', role: 'Test', sex: 'Women', age: 22, address: 'Guangzhou' },
    { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', age: 32, address: 'Shanghai' },
    { id: 10004, name: 'Test4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' }
  ]
})
</script>
