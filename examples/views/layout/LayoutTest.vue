<template>
  <div>
    <div class="row-wrapper">
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
    </div>

    <div class="row-wrapper">
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
    </div>

    <div class="row-wrapper">
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
    </div>

    <div class="row-wrapper">
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
    </div>

    <div class="row-wrapper">
      <vxe-row>
        <vxe-col span="8">
          <div class="mybg">平分1</div>
        </vxe-col>
        <vxe-col span="8">
          <div class="mybg">超出自动换行超出自动换行超出自动换行超出自动换行超出自动换行超出自动换行</div>
        </vxe-col>
        <vxe-col span="8" ellipsis>
          <span class="mybg">超出省略隐藏超出省略隐藏超出省略隐藏超出省略隐藏超出省略隐藏</span>
        </vxe-col>
      </vxe-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.row-wrapper {
  width: 90%;
  margin: 10px 0;
  border: 1px solid red;
}
.mybg {
  background-color: #409eff;
}
</style>
