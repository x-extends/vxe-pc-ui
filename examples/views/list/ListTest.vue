<template>
  <div>
    <p>
      <vxe-button @click="loadData(10)">加载10条</vxe-button>
      <vxe-button @click="loadData(500)">加载500条</vxe-button>
      <vxe-button @click="loadData(10000)">加载1w条</vxe-button>
      <vxe-button @click="loadData(100000)">加载10w条</vxe-button>
      <vxe-button @click="loadData(300000)">加载30w条</vxe-button>
      <vxe-button @click="loadData(500000)">加载50w条</vxe-button>
    </p>

    <p>
      <vxe-list height="240" class="my-list" :loading="demo1.loading" :data="demo1.list1">
        <template #default="{ items }">
          <div class="my-list-item" v-for="(item, index) in items" :key="index">{{ item.label }}</div>
        </template>
      </vxe-list>
    </p>

    <div class="vxe-row">
      <div class="vxe-col--4">
        <vxe-list class="my-list" height="200" :data="demo1.list2">
          <template #default="{ items }">
            <div class="my-list-item" v-for="(item, index) in items" :key="index">{{ item.label }}</div>
          </template>
        </vxe-list>
      </div>
      <div class="vxe-col--4">
        <vxe-list class="my-list" height="200" :data="demo1.list3">
          <template #default="{ items }">
            <div class="my-list-item" v-for="(item, index) in items" :key="index">
              <img src="/vxe-table/static/other/img2.gif" height="28">
              <span>{{ item.label }}</span>
            </div>
          </template>
        </vxe-list>
      </div>
      <div class="vxe-col--4">
        <vxe-list class="my-ul-list" height="200" :data="demo1.list4" :scroll-y="{sItem: 'li'}">
          <template #default="{ items }">
            <ul>
              <li v-for="(item, index) in items" :key="index">
                <img src="/vxe-table/static/other/img1.gif" height="28">
                <span>{{ item.label }}</span>
              </li>
            </ul>
          </template>
        </vxe-list>
      </div>
      <div class="vxe-col--12">
        <vxe-list class="my-table-list" height="200" :data="demo1.list5" :scroll-y="{gt: 60, sItem: '.my-tr'}">
          <template #default="{ items }">
            <table>
              <tbody>
                <tr class="my-tr" v-for="item in items" :key="item.id">
                  <td>{{ item.label }} - 列1</td>
                  <td>{{ item.label }} - 列2</td>
                  <td>{{ item.label }} - 列3</td>
                </tr>
              </tbody>
            </table>
          </template>
        </vxe-list>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, nextTick } from 'vue'
import { VxeUI } from '../../../packages'

interface ItemVO {
  [key: string]: any;
}

const mockList: ItemVO[] = []

const demo1 = reactive({
  loading: false,
  list1: [] as ItemVO[],
  list2: [] as ItemVO[],
  list3: [] as ItemVO[],
  list4: [] as ItemVO[],
  list5: [] as ItemVO[]
})

// 模拟后台
const getList = (size: number): Promise<ItemVO[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (size > mockList.length) {
        for (let index = mockList.length; index < size; index++) {
          mockList.push({
            id: index,
            label: `row_${index}`
          })
        }
      }
      resolve(mockList.slice(0, size))
    }, 100)
  })
}

const loadData = async (size: number) => {
  demo1.loading = true
  demo1.list1 = await getList(size)
  demo1.loading = false
  const startTime = Date.now()
  await nextTick()
  await VxeUI.modal.message({ content: `渲染 ${size} 行，用时 ${Date.now() - startTime}毫秒`, status: 'info' })
}

// 初始化
onMounted(async () => {
  demo1.list1 = await getList(200)
  demo1.list2 = await getList(200)
  demo1.list3 = await getList(500)
  demo1.list4 = await getList(2000)
  demo1.list5 = await getList(4000)
})
</script>

<style scoped>
.my-list {
  border: 1px solid #e8eaec;
}
.my-list .my-list-item {
  height: 28px;
  padding-left: 15px;
}
.my-ul-list {
  border: 1px solid #e8eaec;
}
.my-ul-list li {
  height: 40px;
}
.my-table-list {
  border: 1px solid #e8eaec;
}
.my-table-list table {
  width: 100%;
  text-align: center;
}
.my-table-list .my-tr {
  height: 32px;
}
.my-table-list .my-tr:hover {
  background-color: #f5f7fa;
}
.my-table-list td {
  border-right: 1px solid #e8eaec;
}
</style>
