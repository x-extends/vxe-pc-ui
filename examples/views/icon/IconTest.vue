<template>
  <div>
    <ul class="vxe-row icon-list">
      <li class="vxe-col--4" v-for="name in iconList" :key="name">
        <vxe-icon :name="name"></vxe-icon>
        <div class="title">{{ name }}</div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const iconList = ref([
  'radio-checked', 'checkbox-checked', 'mobile', 'align-left', 'align-center', 'align-right', 'pc', 'layout', 'click-button', 'select', 'textarea', 'file', 'signature', 'input', 'title', 'switch', 'add-user', 'row-col', 'tabs', 'subtable', 'add-users', 'shuzikuang', 'association-form', 'sort', 'sort-desc', 'sort-asc', 'end-page', 'home-page', 'time', 'feedback', 'lightning', 'cloudy', 'heavy-rain', 'moon', 'sunny', 'location', 'location-fill', 'microphone-fill', 'microphone', 'share', 'share-fill', 'flag', 'flag-fill', 'platform', 'goods-fill', 'goods', 'funnel-clear', 'envelope', 'envelope-open-fill', 'envelope-open', 'envelope-fill', 'message-fill', 'chat', 'chat-fill', 'send', 'send-fill', 'user', 'user-fill', 'wechat', 'alipay', 'indicator', 'file-excel', 'file-pdf', 'file-image', 'file-markdown', 'file-ppt', 'file-word', 'file-zip', 'file-txt', 'refresh', 'checkbox-unchecked', 'information', 'info-circle-fill', 'info-circle', 'chart-radar', 'chart-bar-x', 'repeat', 'voice-fill', 'voice', 'flow-branch', 'comment', 'folder', 'folder-open', 'picture', 'picture-fill', 'bell', 'bell-fill', 'undo', 'home', 'home-fill', 'checkbox-checked-fill', 'checkbox-indeterminate-fill', 'fullscreen', 'minimize', 'print', 'upload', 'download', 'cloud-upload', 'cloud-download', 'spinner', 'close', 'custom-column', 'edit', 'zoom-in', 'caret-down', 'caret-up', 'caret-right', 'caret-left', 'square-checked-fill', 'square-close', 'square-down', 'square-left', 'square-caret-right', 'square-minus', 'square-plus', 'square-right', 'square-up', 'square-checked', 'square-down-fill', 'square-minus-fill', 'square-close-fill', 'square-left-fill', 'square-caret-right-fill', 'square-up-fill', 'square-right-fill', 'square-plus-fill', 'square-plus-square', 'square-fill', 'square-square', 'sort-alpha-desc', 'sort-alpha-asc', 'sort-numeric-asc', 'sort-numeric-desc', 'star-fill', 'star', 'star-half', 'lock-fill', 'unlock-fill', 'question', 'exclamation', 'ellipsis-h', 'ellipsis-v', 'save', 'setting', 'setting-fill', 'link', 'chart-pie', 'chart-line', 'swap', 'num-list', 'copy', 'company', 'swap-right', 'swap-left', 'table', 'merge-cells', 'paste', 'cut', 'lock', 'unlock', 'chart-bar-y', 'fixed-left-fill', 'fixed-left', 'fixed-right-fill', 'fixed-right', 'swap-down', 'swap-up', 'square', 'check', 'question-circle-fill', 'error-circle-fill', 'delete', 'dot', 'success-circle', 'delete-fill', 'minus', 'maximize', 'question-circle', 'warning-circle', 'warning-circle-fill', 'eye-fill', 'search', 'funnel', 'eye-fill-close', 'search-zoom-in', 'arrow-right', 'arrow-left', 'arrow-up', 'calendar', 'arrow-down', 'warning-triangle', 'add', 'arrow-double-left', 'arrow-double-right', 'menu', 'warning-triangle-fill', 'error-circle', 'zoom-out', 'success-circle-fill', 'radio-checked-fill', 'radio-unchecked'
])
</script>

<style lang="scss" scoped>
.icon-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: 26px;
  text-align: center;
  border-top: 1px solid #eee;
  border-left: 1px solid #eee;
  overflow: hidden;
  margin: 0;
  padding: 0;
  &:after {
    content: "";
    clear: both;
  }
  & > li {
    height: 100px;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    width: 12.5%;
    padding-top: 10px;
    & > i {
      color: #606266;
      border-color: #606266;
    }
    &:hover {
      & > i {
        color: #5CB6FF;
        border-color: #5CB6FF;
      }
    }
    .title {
      font-size: 14px;
      margin-top: 10px;
    }
  }
}
</style>
