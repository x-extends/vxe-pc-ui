<template>
  <div>
    <div>
      <vxe-button status="primary" @click="insertEvent">顶部插入</vxe-button>
      <vxe-button status="primary" @click="insertAtEvent">底部插入</vxe-button>
      <vxe-button status="success" @click="getInsertEvent">获取新增</vxe-button>
      <vxe-button status="error" @click="getRemoveEvent">获取删除</vxe-button>
    </div>

    <vxe-list ref="listRef" v-bind="listOptions">
      <template #extra="{ row }">
        <vxe-button mode="text" status="primary" icon="vxe-icon-add" @click="insertNodeEvent(row)">当前插入</vxe-button>
        <vxe-button mode="text" status="primary" icon="vxe-icon-add" @click="insertNextNodeEvent(row)">下一行插入</vxe-button>
        <vxe-button mode="text" status="error" icon="vxe-icon-delete-fill" @click="removeEvent(row)">删除</vxe-button>
      </template>
    </vxe-list>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { VxeListInstance, VxeListProps } from '../../../types'
import { VxeUI } from '../../../packages'

interface RowVO {
  id: string
  label: string
}

const listRef = ref<VxeListInstance<RowVO>>()

const listOptions = reactive<VxeListProps>({
  height: 400,
  rowConfig: {
    keyField: 'id',
    isHover: true
  },
  data: [
    { id: '10001', label: '数据10001' },
    { id: '10002', label: '数据10002' },
    { id: '10003', label: '数据10003' },
    { id: '10004', label: '数据10004' },
    { id: '10005', label: '数据10005' },
    { id: '10006', label: '数据10006' },
    { id: '10007', label: '数据10007' },
    { id: '10008', label: '数据10008' },
    { id: '10009', label: '数据10009' },
    { id: '10010', label: '数据10010' },
    { id: '10011', label: '数据10011' },
    { id: '10012', label: '数据10012' },
    { id: '10013', label: '数据10013' },
    { id: '10014', label: '数据10014' },
    { id: '10015', label: '数据10015' },
    { id: '10016', label: '数据10016' },
    { id: '10017', label: '数据10017' },
    { id: '10018', label: '数据10018' },
    { id: '10019', label: '数据10019' },
    { id: '10020', label: '数据10020' },
    { id: '10021', label: '数据10021' },
    { id: '10022', label: '数据10022' },
    { id: '10023', label: '数据10023' },
    { id: '10024', label: '数据10024' },
    { id: '10025', label: '数据10025' },
    { id: '10026', label: '数据10026' },
    { id: '10027', label: '数据10027' },
    { id: '10028', label: '数据10028' },
    { id: '10029', label: '数据10029' },
    { id: '10030', label: '数据10030' }
  ]
})

const insertEvent = () => {
  const $list = listRef.value
  if ($list) {
    const record = {
      id: Date.now(),
      label: `标题 ${Date.now()}`
    }
    $list.insert(record)
  }
}

const insertAtEvent = () => {
  const $list = listRef.value
  if ($list) {
    const record = {
      id: Date.now(),
      label: `标题 ${Date.now()}`
    }
    $list.insertAt(record, -1)
  }
}

const insertNodeEvent = (row: RowVO) => {
  const $list = listRef.value
  if ($list) {
    const record = {
      id: Date.now(),
      label: `标题 ${Date.now()}`
    }
    $list.insertAt(record, row)
  }
}

const insertNextNodeEvent = (row: RowVO) => {
  const $list = listRef.value
  if ($list) {
    const record = {
      id: Date.now(),
      label: `标题 ${Date.now()}`
    }
    $list.insertNextAt(record, row)
  }
}

const getInsertEvent = () => {
  const $list = listRef.value
  if ($list) {
    const insertRecords = $list.getInsertRecords()
    VxeUI.modal.message({
      content: `新增行：${insertRecords.length}个`,
      status: 'success'
    })
    console.log('新增：', insertRecords)
  }
}

const removeEvent = (row: RowVO) => {
  const $list = listRef.value
  if ($list) {
    $list.remove(row)
  }
}

const getRemoveEvent = () => {
  const $list = listRef.value
  if ($list) {
    const removeRecords = $list.getRemoveRecords()
    VxeUI.modal.message({
      content: `删除行：${removeRecords.length}个`,
      status: 'success'
    })
    console.log('删除：', removeRecords)
  }
}
</script>
