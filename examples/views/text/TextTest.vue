<template>
  <div>
    <p>
      <vxe-text content="默认颜色"></vxe-text>
      <vxe-text status="primary" content="主要颜色"></vxe-text>
      <vxe-text status="success" content="信息颜色"></vxe-text>
      <vxe-text status="info" content="信息颜色"></vxe-text>
      <vxe-text status="warning" content="警告颜色"></vxe-text>
      <vxe-text status="danger" content="危险颜色"></vxe-text>
    </p>

    <p>
      <vxe-text content="默认图标颜色" icon="vxe-icon-info-circle"></vxe-text>
      <vxe-text content="主要图标颜色" icon="vxe-icon-info-circle"></vxe-text>
      <vxe-text content="成功图标颜色" icon="vxe-icon-info-circle"></vxe-text>
      <vxe-text content="信息图标颜色" icon="vxe-icon-info-circle"></vxe-text>
      <vxe-text content="警告图标颜色" suffix-icon="vxe-icon-info-circle"></vxe-text>
      <vxe-text content="危险图标颜色" suffix-icon="vxe-icon-info-circle" loading></vxe-text>
    </p>

    <p>
      <vxe-text content="复制内容123" click-to-copy></vxe-text>
      <vxe-text copy-layout="right" click-to-copy>复制内容456</vxe-text>
    </p>

  </div>
</template>
