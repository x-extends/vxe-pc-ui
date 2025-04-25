<template>
  <div>
    <vxe-select v-model="val1" placeholder="自定义某一行模板" clearable>
      <vxe-option value="1" label="选项1"></vxe-option>
      <vxe-option value="2" label="选项2"></vxe-option>
      <vxe-option value="3" label="选项3">
        <template #default="{ option }">
          <span style="color: red">
            <i class="vxe-icon-question-circle-fill"></i>
            <span>{{ option.label }}</span>
          </span>
        </template>
      </vxe-option>
      <vxe-option value="4" label="选项4">
        <template #default>
          <span style="color: green">
            <i class="vxe-icon-question-circle-fill"></i>
            <span>选项4</span>
          </span>
        </template>
      </vxe-option>
      <vxe-option value="5" label="选项5"></vxe-option>
    </vxe-select>
  </div>
</template>

<script>
export default {
  data () {
    return {
      val1: null
    }
  }
}
</script>
