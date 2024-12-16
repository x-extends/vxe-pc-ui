<template>
  <div>
    <p>
      <vxe-upload v-model="fileList1" :limit-size="30" show-error-status pasteToUpload :limit-count="10" :upload-method="uploadMethod"></vxe-upload>
    </p>
    <p>
      <vxe-upload v-model="imgList1" mode="image" multiple show-error-status pasteToUpload :upload-method="uploadMethod"></vxe-upload>
    </p>
    <p>
      <vxe-upload v-model="fileList" multiple drag-sort :limit-size="30" autoHiddenButton show-error-status :limit-count="10" showDownloadButton :upload-method="uploadMethod"></vxe-upload>
    </p>
    <p>
      <vxe-upload v-model="imgList" mode="image" drag-sort multiple :image-config="{circle: true}" show-error-status :upload-method="uploadMethod" showDownloadButton></vxe-upload>
    </p>
    <p>
      <vxe-upload v-model="fileList" multiple :limit-size="30" disabled autoHiddenButton show-error-status showDownloadButton :limit-count="10" :upload-method="uploadMethod"></vxe-upload>
    </p>
    <p>
      <vxe-upload v-model="imgList" mode="image" multiple disabled show-error-status :upload-method="uploadMethod"></vxe-upload>
    </p>
    <p>
      <vxe-upload v-model="fileList" multiple drag-sort :limit-size="30" showDownloadButton show-error-status :more-config="{maxCount: 2, layout: 'horizontal'}" show-progress>
        <template #corner>
          <vxe-button mode="text" icon="vxe-icon-edit"></vxe-button>
          <vxe-button mode="text" icon="vxe-icon-edit"></vxe-button>
        </template>
      </vxe-upload>
    </p>
    <p>
      <vxe-upload v-model="imgList" mode="image" multiple drag-sort show-error-status showDownloadButton :more-config="{maxCount: 2}" show-progress>
        <template #corner>
          <vxe-button mode="text" icon="vxe-icon-edit"></vxe-button>
          <vxe-button mode="text" icon="vxe-icon-edit"></vxe-button>
        </template>
      </vxe-upload>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      fileList1: [],
      fileList: [
        { name: '673.gif', type: 'gif', url: 'https://vxeui.com/resource/img/bq673.gif' },
        { name: 'fj573.gif', type: 'gif', url: 'https://vxeui.com/resource/img/img/fj573.jpeg' },
        { name: 'fj562.png', url: 'https://vxeui.com/resource/img/fj562.png' }
      ],
      imgList1: [],
      imgList: [
        { name: 'fj577.jpg', url: 'https://vxeui.com/resource/img/fj577.jpg' },
        { name: 'fj581.jpeg', url: 'https://vxeui.com/resource/img/fj581.jpeg' },
        { name: 'fj573.jpeg', url: 'https://vxeui.com/resource/img/fj573.jpeg' },
        { name: 'fj562.png', url: 'https://vxeui.com/resource/img/fj562.png' },
        { name: 'fj187.jpg', url: 'https://vxeui.com/resource/img/fj187.jpg' }
      ]
    }
  },
  methods: {
    uploadMethod  ({ file, updateProgress }: any) {
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
  }
})
</script>
