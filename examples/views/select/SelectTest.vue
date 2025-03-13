<template>
  <div>
    <vxe-select v-model="val1" placeholder="远程搜索" :options="opts1" :remote-method="remoteMethod" clearable filterable remote></vxe-select>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { VxeSelectPropTypes } from '../../../types'
import XEUtils from 'xe-utils'

const val1 = ref()
const opts1 = ref<VxeSelectPropTypes.Options>([])

let idKey = 1

const remoteMethod: VxeSelectPropTypes.RemoteMethod = ({ searchValue }) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const list = XEUtils.range(0, XEUtils.random(1, 10)).map(() => {
        return {
          value: idKey++,
          label: `选项${idKey}_${searchValue}`
        }
      })
      opts1.value = list
      resolve()
    }, 200)
  })
}
</script>
