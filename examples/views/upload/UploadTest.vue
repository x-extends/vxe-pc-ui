<template>
  <div>
    <p>
      <vxe-upload v-model="fileList1" :limit-size="30" show-error-status pasteToUpload :limit-count="10" :file-types="['pdf', 'xlsx']"></vxe-upload>
    </p>
    <p>
      <vxe-upload v-model="imgList1" mode="image" multiple show-error-status pasteToUpload></vxe-upload>
    </p>
    <p>
      <vxe-upload v-model="fileList" multiple drag-sort :auto-submit="false" show-submit-button :limit-size="30" show-list autoHiddenButton show-error-status :limit-count="10" showDownloadButton :upload-method="uploadMethod"></vxe-upload>
    </p>
    <p>
      <vxe-upload v-model="imgList" mode="image" drag-sort multiple :auto-submit="false" show-submit-button :image-config="{circle: true}" show-error-status :upload-method="uploadMethod" showDownloadButton></vxe-upload>
    </p>
    <p>
      <vxe-upload v-model="fileList" multiple :limit-size="30" disabled autoHiddenButton show-error-status showDownloadButton :limit-count="10" :upload-method="uploadMethod"></vxe-upload>
    </p>
    <p>
      <vxe-upload v-model="imgList" mode="image" multiple disabled show-error-status :upload-method="uploadMethod"></vxe-upload>
    </p>
    <p>
      <vxe-upload v-model="fileList" pasteToUpload multiple drag-sort :limit-size="30" showDownloadButton show-error-status :more-config="{maxCount: 2, layout: 'horizontal'}" show-progress>
        <template #corner>
          <vxe-button mode="text" icon="vxe-icon-edit"></vxe-button>
          <vxe-button mode="text" icon="vxe-icon-edit"></vxe-button>
        </template>
      </vxe-upload>
    </p>
    <p>
      <vxe-upload v-model="imgList" mode="image" pasteToUpload multiple drag-sort show-error-status showDownloadButton :more-config="{maxCount: 2}" show-progress>
        <template #corner>
          <vxe-button mode="text" icon="vxe-icon-edit"></vxe-button>
          <vxe-button mode="text" icon="vxe-icon-edit"></vxe-button>
        </template>
      </vxe-upload>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { VxeUploadPropTypes } from '../../../types'

const fileList1 = ref<VxeUploadPropTypes.ModelValue>([])
const fileList = ref<VxeUploadPropTypes.ModelValue>([
  { name: 'fj577.jpg', url: 'https://vxeui.com/resource/img/fj577.jpg' },
  { name: 'fj581.jpeg', url: 'https://vxeui.com/resource/img/fj581.jpeg' },
  { name: 'fj573.jpeg', url: 'https://vxeui.com/resource/img/fj573.jpeg' },
  { name: 'fj562.png', url: 'https://vxeui.com/resource/img/fj562.png' },
  { name: 'fj187.jpg', url: 'https://vxeui.com/resource/img/fj187.jpg' }
])
const imgList1 = ref<VxeUploadPropTypes.ModelValue>([])
const imgList = ref([
  { name: 'fj577.jpg', url: 'https://vxeui.com/resource/img/fj577.jpg' },
  { name: 'fj581.jpeg', url: 'https://vxeui.com/resource/img/fj581.jpeg' },
  { name: 'fj573.jpeg', url: 'https://vxeui.com/resource/img/fj573.jpeg' },
  { name: 'fj562.png', url: 'https://vxeui.com/resource/img/fj562.png' },
  { name: 'fj187.jpg', url: 'https://vxeui.com/resource/img/fj187.jpg' }
])

const uploadMethod: VxeUploadPropTypes.UploadMethod = ({ file, updateProgress }) => {
  const formData = new FormData()
  formData.append('file', file)
  return window.axios.post('/api/pub/upload/single', formData, {
    onUploadProgress (progressEvent: any) {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      updateProgress(percentCompleted)
    }
  }).then((res: any) => {
    return res.data
  })
}
</script>
