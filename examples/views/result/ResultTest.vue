<template>
  <div>
    <p>
      <vxe-result title="成功" type="success" content="操作成功"></vxe-result>
    </p>
    <p>
      <vxe-result title="失败" type="error" content="操作失败"></vxe-result>
    </p>
    <p>
      <vxe-result title="警告" type="warning" content="请确认是否操作">
        <template #extra>
          <vxe-button status="primary">返回</vxe-button>
          <vxe-button status="error">刷新</vxe-button>
        </template>
      </vxe-result>
    </p>
  </div>
</template>

<script lang="ts" setup>
</script>
