<template>
  <div>
    <vxe-row :gutter="5">
      <vxe-col>
        <div class="mybg">自适应宽度1</div>
      </vxe-col>
      <vxe-col>
        <div class="mybg">自适应宽度2</div>
      </vxe-col>
      <vxe-col>
        <div class="mybg">自适应宽度3</div>
      </vxe-col>
    </vxe-row>

    <vxe-row :gutter="[10, 10]">
      <vxe-col>
        <div class="mybg">自适应宽度1</div>
      </vxe-col>
      <vxe-col fill>
        <div class="mybg">自适铺满剩余宽度</div>
      </vxe-col>
      <vxe-col>
        <div class="mybg">自适应宽度3</div>
      </vxe-col>
    </vxe-row>

    <vxe-row :gutter="['5px', '16px']">
      <vxe-col span="8">
        <div class="mybg">平分1</div>
      </vxe-col>
      <vxe-col span="8">
        <div class="mybg">平分1</div>
      </vxe-col>
      <vxe-col span="8">
        <div class="mybg">平分1</div>
      </vxe-col>
      <vxe-col span="8">
        <div class="mybg">平分1</div>
      </vxe-col>
      <vxe-col span="8">
        <div class="mybg">平分1</div>
      </vxe-col>
      <vxe-col span="8">
        <div class="mybg">平分1</div>
      </vxe-col>
      <vxe-col span="8">
        <div class="mybg">平分1</div>
      </vxe-col>
    </vxe-row>

    <vxe-row :gutter="10" vertical>
      <vxe-col>
        <div class="mybg">平分1</div>
      </vxe-col>
      <vxe-col>
        <div class="mybg">平分2</div>
      </vxe-col>
      <vxe-col>
        <div class="mybg">平分3</div>
      </vxe-col>
      <vxe-col>
        <div class="mybg">平分4</div>
      </vxe-col>
    </vxe-row>

    <vxe-row>
      <vxe-col span="8">
        <div class="mybg">平分1</div>
      </vxe-col>
      <vxe-col span="8">
        <div class="mybg">超出自动换行超出自动换行超出自动换行超出自动换行超出自动换行超出自动换行</div>
      </vxe-col>
      <vxe-col span="8" ellipsis>
        <div class="mybg">超出省略隐藏超出省略隐藏超出省略隐藏超出省略隐藏超出省略隐藏</div>
      </vxe-col>
    </vxe-row>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.mybg {
  background-color: #409eff;
}
</style>
