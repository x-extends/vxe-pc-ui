<template>
  <div>
    <p>
      <vxe-button content="默认尺寸"></vxe-button>
      <vxe-button size="medium" content="中等尺寸"></vxe-button>
      <vxe-button size="small" content="小型尺寸"></vxe-button>
      <vxe-button size="mini" content="超小尺寸"></vxe-button>
    </p>

    <p>
      <vxe-button size="mini" content="超小下拉按钮">
        <template #dropdowns>
          <vxe-button mode="text" content="下拉按钮1"></vxe-button>
          <vxe-button mode="text" status="primary" content="下拉按钮2"></vxe-button>
          <vxe-button mode="text" content="下拉按钮3"></vxe-button>
        </template>
      </vxe-button>
      <vxe-button size="small" content="小型下拉按钮">
        <template #dropdowns>
          <vxe-button mode="text" content="下拉按钮1"></vxe-button>
          <vxe-button mode="text" status="success" content="下拉按钮2"></vxe-button>
          <vxe-button mode="text" content="下拉按钮3"></vxe-button>
        </template>
      </vxe-button>
      <vxe-button size="medium" content="固定向上" placement="top">
        <template #dropdowns>
          <vxe-button mode="text" content="下拉按钮1"></vxe-button>
          <vxe-button mode="text" status="warning" content="下拉按钮2"></vxe-button>
          <vxe-button mode="text" content="下拉按钮3"></vxe-button>
        </template>
      </vxe-button>
      <vxe-button content="固定向下" placement="bottom">
        <template #dropdowns>
          <vxe-button mode="text" content="下拉按钮1"></vxe-button>
          <vxe-button mode="text" status="danger" content="下拉按钮2"></vxe-button>
          <vxe-button mode="text" content="下拉按钮3"></vxe-button>
        </template>
      </vxe-button>
    </p>

    <p>
      <vxe-button mode="text" content="默认颜色"></vxe-button>
      <vxe-button mode="text" status="primary" content="主要颜色"></vxe-button>
      <vxe-button mode="text" status="success" content="信息颜色"></vxe-button>
      <vxe-button mode="text" status="info" content="信息颜色"></vxe-button>
      <vxe-button mode="text" status="warning" content="警告颜色"></vxe-button>
      <vxe-button mode="text" status="danger" content="危险颜色"></vxe-button>
    </p>

    <p>
      <vxe-button mode="text" content="默认禁用颜色" disabled></vxe-button>
      <vxe-button mode="text" status="primary" content="主要禁用颜色" disabled></vxe-button>
      <vxe-button mode="text" status="success" content="成功禁用颜色" disabled></vxe-button>
      <vxe-button mode="text" status="info" content="信息禁用颜色" disabled></vxe-button>
      <vxe-button mode="text" status="warning" content="警告禁用颜色" disabled></vxe-button>
      <vxe-button mode="text" status="danger" content="危险禁用颜色" disabled></vxe-button>
    </p>

    <p>
      <vxe-button mode="text" content="默认颜色" loading></vxe-button>
      <vxe-button mode="text" status="primary" content="主要颜色" loading></vxe-button>
      <vxe-button mode="text" status="success" content="成功颜色" loading></vxe-button>
      <vxe-button mode="text" status="info" content="信息颜色" loading></vxe-button>
      <vxe-button mode="text" status="warning" content="警告颜色" loading></vxe-button>
      <vxe-button mode="text" status="danger" content="危险颜色" loading></vxe-button>
    </p>

    <p>
      <vxe-button content="默认颜色"></vxe-button>
      <vxe-button status="primary" content="主要颜色"></vxe-button>
      <vxe-button status="success" content="成功颜色"></vxe-button>
      <vxe-button status="info" content="信息颜色"></vxe-button>
      <vxe-button status="warning" content="警告颜色"></vxe-button>
      <vxe-button status="danger" content="危险颜色"></vxe-button>
    </p>

    <p>
      <vxe-button content="默认禁用颜色" disabled></vxe-button>
      <vxe-button status="primary" content="主要禁用颜色" disabled></vxe-button>
      <vxe-button status="success" content="成功禁用颜色" disabled></vxe-button>
      <vxe-button status="info" content="信息禁用颜色" disabled></vxe-button>
      <vxe-button status="warning" content="警告禁用颜色" disabled></vxe-button>
      <vxe-button status="danger" content="危险禁用颜色" disabled></vxe-button>
    </p>

    <p>
      <vxe-button content="默认颜色" loading></vxe-button>
      <vxe-button status="primary" content="主要颜色" loading></vxe-button>
      <vxe-button status="success" content="成功颜色" loading></vxe-button>
      <vxe-button status="info" content="信息颜色" loading></vxe-button>
      <vxe-button status="warning" content="警告颜色" loading></vxe-button>
      <vxe-button status="danger" content="危险颜色" loading></vxe-button>
    </p>

    <p>
      <vxe-button transfer>
        <template #default>默认颜色</template>
        <template #dropdowns>
          <vxe-button mode="text" content="下拉按钮1"></vxe-button>
          <vxe-button mode="text" content="下拉按钮2"></vxe-button>
          <vxe-button mode="text" content="下拉按钮3"></vxe-button>
        </template>
      </vxe-button>
      <vxe-button status="primary" transfer>
        <template #default>主要颜色</template>
        <template #dropdowns>
          <vxe-button mode="text" content="下拉按钮1"></vxe-button>
          <vxe-button mode="text" content="下拉按钮2" status="primary"></vxe-button>
          <vxe-button mode="text" content="下拉按钮3"></vxe-button>
        </template>
      </vxe-button>
      <vxe-button status="success" transfer>
        <template #default>成功颜色</template>
        <template #dropdowns>
          <vxe-button mode="text" content="下拉按钮1"></vxe-button>
          <vxe-button mode="text" content="下拉按钮2" status="success"></vxe-button>
          <vxe-button mode="text" content="下拉按钮3"></vxe-button>
        </template>
      </vxe-button>
      <vxe-button status="info" transfer>
        <template #default>信息颜色</template>
        <template #dropdowns>
          <vxe-button mode="text" content="下拉按钮1"></vxe-button>
          <vxe-button mode="text" content="下拉按钮2" class="my-purple"></vxe-button>
          <vxe-button mode="text" content="下拉按钮3"></vxe-button>
        </template>
      </vxe-button>
      <vxe-button status="warning" transfer placement="top">
        <template #default>固定向上</template>
        <template #dropdowns>
          <vxe-button mode="text" content="下拉按钮1"></vxe-button>
          <vxe-button mode="text" content="下拉按钮2" status="warning"></vxe-button>
          <vxe-button mode="text" content="下拉按钮3"></vxe-button>
        </template>
      </vxe-button>
      <vxe-button status="danger" transfer placement="bottom">
        <template #default>固定向下</template>
        <template #dropdowns>
          <vxe-button mode="text" content="下拉按钮1"></vxe-button>
          <vxe-button mode="text" content="下拉按钮2" status="danger"></vxe-button>
          <vxe-button mode="text" content="下拉按钮3"></vxe-button>
        </template>
      </vxe-button>
    </p>

    <p>
      <vxe-button status="danger" transfer trigger="manual">
        <template #default>手动</template>
        <template #dropdowns>
          <vxe-button mode="text" content="下拉按钮1"></vxe-button>
          <vxe-button mode="text" content="下拉按钮2" status="danger"></vxe-button>
          <vxe-button mode="text" content="下拉按钮3"></vxe-button>
        </template>
      </vxe-button>
      <vxe-button status="danger" transfer trigger="click">
        <template #default>点击</template>
        <template #dropdowns>
          <vxe-button mode="text" content="下拉按钮1"></vxe-button>
          <vxe-button mode="text" content="下拉按钮2" status="danger"></vxe-button>
          <vxe-button mode="text" content="下拉按钮3"></vxe-button>
        </template>
      </vxe-button>
    </p>

    <p>
      <vxe-button icon="fa fa-plus" content="使用第三方图标"></vxe-button>
      <vxe-button status="primary" content="主要图标颜色" icon="fa fa-save"></vxe-button>
      <vxe-button status="success" content="成功图标颜色" icon="fa fa-check"></vxe-button>
      <vxe-button status="info" content="信息图标颜色" icon="fa fa-info"></vxe-button>
      <vxe-button status="warning" content="警告图标颜色" icon="fa fa-warning"></vxe-button>
      <vxe-button status="danger" content="危险图标颜色" icon="fa fa-trash-o"></vxe-button>
    </p>

    <p>
      <vxe-button content="默认图标颜色" icon="fa fa-download"></vxe-button>
      <vxe-button content="主要图标颜色" icon="fa fa-save my-primary"></vxe-button>
      <vxe-button content="成功图标颜色" icon="fa fa-check my-success"></vxe-button>
      <vxe-button content="信息图标颜色" icon="fa fa-info my-info"></vxe-button>
      <vxe-button content="警告图标颜色" icon="fa fa-warning my-warning"></vxe-button>
      <vxe-button content="危险图标颜色" icon="fa fa-trash-o my-danger"></vxe-button>
    </p>

    <p>
      <vxe-button content="圆角按钮"  round></vxe-button>
      <vxe-button content="圆角按钮" loading round></vxe-button>
      <vxe-button content="主要颜色" status="primary" round></vxe-button>
      <vxe-button content="成功颜色" status="success" round></vxe-button>
      <vxe-button content="信息颜色" status="info" round></vxe-button>
      <vxe-button content="警告颜色" status="warning" round></vxe-button>
      <vxe-button content="危险颜色" status="danger" round></vxe-button>
    </p>

    <p>
      <vxe-button icon="fa fa-plus" circle></vxe-button>
      <vxe-button loading circle></vxe-button>
      <vxe-button status="primary" icon="fa fa-save" circle></vxe-button>
      <vxe-button status="success" icon="fa fa-check" circle></vxe-button>
      <vxe-button status="info" icon="fa fa-info" circle></vxe-button>
      <vxe-button status="warning" icon="fa fa-warning" circle></vxe-button>
      <vxe-button status="danger" icon="fa fa-trash-o" circle></vxe-button>
    </p>

    <p>
      <vxe-button icon="fa fa-plus"></vxe-button>
      <vxe-button loading></vxe-button>
      <vxe-button status="primary" icon="fa fa-save"></vxe-button>
      <vxe-button status="success" icon="fa fa-check"></vxe-button>
      <vxe-button status="info" icon="fa fa-info"></vxe-button>
      <vxe-button status="warning" icon="fa fa-warning"></vxe-button>
      <vxe-button status="danger" icon="fa fa-trash-o"></vxe-button>
    </p>

    <p>
      <vxe-button content="使用第三方图标" mode="text" icon="fa fa-plus"></vxe-button>
      <vxe-button content="主要图标颜色" mode="text" status="primary" icon="fa fa-save"></vxe-button>
      <vxe-button content="成功图标颜色" mode="text" status="success" icon="fa fa-check"></vxe-button>
      <vxe-button content="信息图标颜色" mode="text" status="info" icon="fa fa-info"></vxe-button>
      <vxe-button content="警告图标颜色" mode="text" status="warning" icon="fa fa-warning"></vxe-button>
      <vxe-button content="危险图标颜色" mode="text" status="danger" icon="fa fa-trash-o"></vxe-button>
    </p>

    <p>
      <vxe-button mode="text" icon="fa fa-plus"></vxe-button>
      <vxe-button mode="text" icon="fa fa-refresh"></vxe-button>
      <vxe-button content="图标按钮" status="primary" icon="fa fa-download"></vxe-button>
      <vxe-button content="自定义按钮颜色" class="my-purple" icon="fa fa-save"></vxe-button>
      <vxe-button content="自定义图标颜色" icon="fa fa-graduation-cap my-green"></vxe-button>
    </p>

  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss">
.vxe-button.type--button.my-purple,
.vxe-button.type--button.my-purple:hover {
  color: #fff;
}
.vxe-button.type--button.my-purple {
  background-color: #800080;
}
.vxe-button.type--button.my-purple:active {
  background-color: #a50aa5;
}
.vxe-button.type--text.my-purple {
  color: #800080;
}
.vxe-button.type--text.my-purple:not(.is--disabled):hover {
  color: #a50aa5;
}
.my-green {
  color: #008000;
}
.my-primary {
  color: #3196ff;
}
.my-success {
  color: #67c23a;
}
.my-info {
  color: #909399;
}
.my-warning {
  color: #e6a23c;
}
.my-danger {
  color: #f56c6c;
}
</style>
