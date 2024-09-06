<template>
  <div>
    <p>
      <vxe-pulldown v-model="demo1.visible" >
        <template #default>
          <vxe-input v-model="demo1.value1" placeholder="可搜索的下拉框" @focus="focusEvent1" @keyup="keyupEvent1"></vxe-input>
        </template>
        <template #dropdown>
          <div class="my-dropdown1">
            <div class="list-item1" v-for="item in demo1.list1" :key="item.value" @click="selectEvent1(item)">
              <i class="fa fa-user-o"></i>
              <span>{{ item.label }}</span>
            </div>
          </div>
        </template>
      </vxe-pulldown>

      <vxe-pulldown ref="xDown2">
        <template #default>
          <vxe-input v-model="demo2.value2" placeholder="可搜索的大数据下拉框" @focus="focusEvent2" @keyup="keyupEvent2"></vxe-input>
        </template>
        <template #dropdown>
          <vxe-list height="200" class="my-dropdown2" :data="demo2.list2" auto-resize>
            <template #default="{ items }">
              <div class="list-item2" v-for="item in items" :key="item.value" @click="selectEvent2(item)">
                <i class="fa fa-envelope-o"></i>
                <span>{{ item.label }}</span>
              </div>
            </template>
          </vxe-list>
        </template>
      </vxe-pulldown>

      <vxe-pulldown ref="xDown3" destroy-on-close>
        <template #default>
          <vxe-button icon="fa fa-table" @click="clickEvent3">切换下拉表格</vxe-button>
        </template>
        <template #dropdown>
          <div class="my-dropdown3">
            <vxe-table
              auto-resize
              :data="demo3.tableData3">
              <vxe-column field="name" title="Name"></vxe-column>
              <vxe-column field="role" title="Role"></vxe-column>
              <vxe-column field="sex" title="Sex"></vxe-column>
            </vxe-table>
          </div>
        </template>
      </vxe-pulldown>

      <vxe-pulldown ref="xDown4" transfer>
        <template #default>
          <vxe-input v-model="demo4.value4" suffix-icon="fa fa-search" placeholder="实现下拉分页表格" @keyup="keyupEvent4" @focus="focusEvent4" @suffix-click="suffixClick4"></vxe-input>
        </template>
        <template #dropdown>
          <div class="my-dropdown4">
            <vxe-grid
              border
              highlight-hover-row
              auto-resize
              height="auto"
              :loading="demo4.loading4"
              :pager-config="demo4.tablePage4"
              :data="demo4.tableData4"
              :columns="demo4.tableColumn4"
              @cell-click="cellClickEvent4"
              @page-change="pageChangeEvent4">
            </vxe-grid>
          </div>
        </template>
      </vxe-pulldown>
    </p>
    <p>
      <vxe-pulldown :options="pullOptions" trigger="click" showPopupShadow transfer>
        <template #default>
          <img src="https://vxeui.com/resource/img/bq546.gif" style="width: 30px;height: 30px;" />
        </template>
      </vxe-pulldown>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface ItemVO1 {
  label: string;
  value: string;
}

interface ItemVO2 {
  label: string;
  value: string;
}

const data1: ItemVO1[] = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
  { label: '选项4', value: '4' },
  { label: '选项5', value: '5' },
  { label: '选项6', value: '6' },
  { label: '选项7', value: '7' },
  { label: '选项8', value: '8' },
  { label: '选项9', value: '9' },
  { label: '选项10', value: '10' },
  { label: '选项11', value: '11' },
  { label: '选项12', value: '12' }
]

const data2: ItemVO2[] = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
  { label: '选项4', value: '4' },
  { label: '选项5', value: '5' },
  { label: '选项6', value: '6' },
  { label: '选项7', value: '7' },
  { label: '选项8', value: '8' },
  { label: '选项9', value: '9' },
  { label: '选项10', value: '10' },
  { label: '选项11', value: '11' },
  { label: '选项12', value: '12' }
]

export default Vue.extend({
  data () {
    return {
      demo1: {
        visible: false,
        value1: '',
        list1: data1
      },
      demo2: {
        value2: '',
        list2: data2
      },
      demo3: {
        tableData3: [
          { name: 'Test1', role: '前端', sex: '男' },
          { name: 'Test2', role: '后端', sex: '男' },
          { name: 'Test3', role: '测试', sex: '男' },
          { name: 'Test4', role: '设计师', sex: '女' }
        ]
      },
      demo4: {
        value4: '',
        tableColumn4: [
          { field: 'name', title: 'Name' },
          { field: 'role', title: 'Role' },
          { field: 'sex', title: 'Sex' }
        ],
        loading4: false,
        tableData4: [] as any[],
        tableList4: [
          { name: 'Test1', role: '前端', sex: '男' },
          { name: 'Test2', role: '后端', sex: '男' },
          { name: 'Test3', role: '测试', sex: '男' },
          { name: 'Test4', role: '设计师', sex: '女' },
          { name: 'Test5', role: '前端', sex: '男' },
          { name: 'Test6', role: '前端', sex: '男' },
          { name: 'Test7', role: '前端', sex: '男' }
        ],
        tablePage4: {
          total: 0,
          currentPage: 1,
          pageSize: 10
        }
      },
      pullOptions: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
        { label: '选项3', value: '3' },
        { label: '选项4', value: '4' },
        { label: '选项5sdfdsfdsfsfsfsffsfsfsdffsffsf', value: '5' },
        { label: '选项6', value: '6' },
        { label: '选项7', value: '7' },
        { label: '选项8', value: '8' }
      ]
    }
  },
  methods: {
    focusEvent1 () {
      this.demo1.visible = true
    },
    keyupEvent1 () {
      this.demo1.list1 = this.demo1.value1 ? data1.filter((item) => item.label.indexOf(this.demo1.value1) > -1) : data1
    },
    selectEvent1  (item: ItemVO1) {
      this.demo1.value1 = item.label
      this.demo1.visible = false
      this.demo1.list1 = data1
    },
    focusEvent2 () {
      const $pulldown2 = this.$refs.xDown2 as any
      $pulldown2.showPanel()
    },
    keyupEvent2  () {
      this.demo2.list2 = this.demo2.value2 ? data2.filter((item) => item.label.indexOf(this.demo2.value2) > -1) : data2
    },
    selectEvent2 (item: ItemVO2) {
      const $pulldown2 = this.$refs.xDown2 as any
      this.demo2.value2 = item.label
      $pulldown2.hidePanel().then(() => {
        this.demo2.list2 = data2
      })
    },
    clickEvent3 () {
      const $pulldown3 = this.$refs.xDown3 as any
      $pulldown3.togglePanel()
    },
    focusEvent4  () {
      const $pulldown4 = this.$refs.xDown4 as any
      $pulldown4.showPanel()
    },
    keyupEvent4  () {
      this.demo4.loading4 = true
      setTimeout(() => {
        this.demo4.loading4 = false
        if (this.demo4.value4) {
          this.demo4.tableData4 = this.demo4.tableList4.filter((row) => row.name.indexOf(this.demo4.value4) > -1)
        } else {
          this.demo4.tableData4 = this.demo4.tableList4.slice(0)
        }
      }, 100)
    },
    suffixClick4  () {
      const $pulldown4 = this.$refs.xDown4 as any
      $pulldown4.togglePanel()
    },
    cellClickEvent4 ({ row }: any) {
      const $pulldown4 = this.$refs.xDown4 as any
      this.demo4.value4 = row.name
      $pulldown4.hidePanel()
    },
    pageChangeEvent4 ({ currentPage, pageSize }: any) {
      this.demo4.tablePage4.currentPage = currentPage
      this.demo4.tablePage4.pageSize = pageSize
    }
  },
  mounted () {
    this.keyupEvent4()
  }
})
</script>
