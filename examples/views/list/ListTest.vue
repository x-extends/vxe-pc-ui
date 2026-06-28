<template>
  <div>
    <vxe-button status="success" @click="resultEvent">获取数据</vxe-button>

    <vxe-list ref="listRef" v-bind="listOptions"></vxe-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { VxeListInstance, VxeListProps } from '../../../types'

interface RowVO {
  id: number
  label: string
}

export default Vue.extend({
  data () {
    const listOptions: VxeListProps<RowVO> = {
      height: 400,
      loading: false,
      rowConfig: {
        useKey: true,
        keyField: 'id',
        contentField: 'label'
      },
      dragConfig: {
        icon: 'vxe-icon-sort'
      },
      virtualYConfig: {
        enabled: true
      },
      data: [
        { id: 10001, label: '数据10001' },
        { id: 10002, label: '数据10002' },
        { id: 10003, label: '数据10003' },
        { id: 10004, label: '数据10004' },
        { id: 10005, label: '数据10005' },
        { id: 10006, label: '数据10006' },
        { id: 10007, label: '数据10007' },
        { id: 10008, label: '数据10008' },
        { id: 10009, label: '数据10009' },
        { id: 10010, label: '数据10010' },
        { id: 10011, label: '数据10011' },
        { id: 10012, label: '数据10012' },
        { id: 10013, label: '数据10013' },
        { id: 10014, label: '数据10014' },
        { id: 10015, label: '数据10015' },
        { id: 10016, label: '数据10016' },
        { id: 10017, label: '数据10017' },
        { id: 10018, label: '数据10018' },
        { id: 10019, label: '数据10019' },
        { id: 10020, label: '数据10020' },
        { id: 10021, label: '数据10021' },
        { id: 10022, label: '数据10022' },
        { id: 10023, label: '数据10023' },
        { id: 10024, label: '数据10024' },
        { id: 10025, label: '数据10025' },
        { id: 10026, label: '数据10026' },
        { id: 10027, label: '数据10027' },
        { id: 10028, label: '数据10028' },
        { id: 10029, label: '数据10029' },
        { id: 10030, label: '数据10030' }
      ]
    }

    return {
      listOptions
    }
  },
  methods: {
    resultEvent () {
      const $list = this.$refs.listRef as VxeListInstance<RowVO>
      if ($list) {
        const listData = $list.getFullData()
        console.log(listData)
      }
    }
  }
})
</script>
