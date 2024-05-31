<template>
  <div>
    <p>
      <vxe-upload v-model="fileList" multiple :limit-size="30" autoHiddenButton show-error-status :limit-count="10" :upload-method="uploadMethod"></vxe-upload>
    </p>
    <p>
      <vxe-upload v-model="imgList" mode="image" show-error-status autoHiddenButton :upload-method="uploadMethod"></vxe-upload>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { VxeUploadPropTypes } from '../../../types'

const fileList = ref([])
const imgList = ref([])

const uploadMethod: VxeUploadPropTypes.UploadMethod = ({ file, updateProgress }) => {
  const formData = new FormData()
  formData.append('file', file)
  return window.axios.post('https://api.vxetable.cn/demo/api/pub/upload/single', formData, {
    onUploadProgress (progressEvent: any) {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      updateProgress(percentCompleted)
    }
  }).then((res: any) => {
    return {
      ...res.data,
      url: `https://api.vxetable.cn${res.data.url}`
    }
  })
}
</script>
