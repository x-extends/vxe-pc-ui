<template>
  <div>
    <p>
      <vxe-button @click="loadList(10)">加载10条</vxe-button>
      <vxe-button @click="loadList(500)">加载500条</vxe-button>
      <vxe-button @click="loadList(10000)">加载1w条</vxe-button>
      <vxe-button @click="loadList(100000)">加载10w条</vxe-button>
      <vxe-button @click="loadList(250000)">加载25w条</vxe-button>
    </p>

    <vxe-list v-bind="listOptions">
      <template #header>
        <div>2222</div>
      </template>
      <template #footer>
        <div>333</div>
      </template>
    </vxe-list>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, nextTick, reactive } from 'vue'
import { VxeUI } from '../../../packages'
import { VxeListProps } from '../../../types'

interface ItemVO {
  id: number
  label: string
}

const listOptions = reactive<VxeListProps>({
  height: 600,
  loading: false,
  showCheckbox: true,
  showRadio: true,
  rowConfig: {
    isHover: true,
    isCurrent: true,
    keyField: 'id',
    contentField: 'label'
  },
  radioConfig: {
    highlight: true
  },
  checkboxConfig: {
    highlight: true
  },
  dragConfig: {},
  virtualYConfig: {
    enabled: true
  },
  data: []
})

// 模拟后台
const mockList: ItemVO[] = []
const getList = (size: number) => {
  return new Promise<ItemVO[]>(resolve => {
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

const loadList = async (size: number) => {
  listOptions.loading = true
  listOptions.data = await getList(size)
  listOptions.loading = false
  const startTime = Date.now()
  await nextTick()
  await VxeUI.modal.message({
    content: `渲染 ${size} 行，用时 ${Date.now() - startTime}毫秒`,
    status: 'info'
  })
}

onMounted(async () => {
  loadList(200)
})
</script>
