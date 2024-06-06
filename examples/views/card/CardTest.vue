<template>
  <div>
    <p>
      <vxe-card>
        sadasdsadasdasddaddad
      </vxe-card>
    </p>

    <p>
      <vxe-card title="标题试试">
      sadasdsadasdasddaddad
      </vxe-card>
    </p>

    <p>
      <vxe-card title="标题试试">
        <template #title>
          <span>1211</span>
        </template>
        <template #extra>
          <span>33</span>
        </template>
        <template #footer>
          <span>footerfooterfooterfooter</span>
        </template>
        <template #left>
          <span>leftleftleftleftleft</span>
        </template>
        <template #right>
          <span>rightrightrightright</span>
        </template>
      </vxe-card>
    </p>

    <p>
      <vxe-card title="标题试试" :height="200">
        <template #title>
          <span>1211</span>
        </template>
        <template #extra>
          <span>33</span>
        </template>
        <template #footer>
          <span>footerfooterfooterfooter</span>
        </template>
        <template #left>
          <span>leftleftleftleftleft</span>
        </template>
        <template #right>
          <span>rightrightrightright</span>
        </template>
        <template #default>
          <div>11111111</div>
          <div>11111111</div>
          <div>11111111</div>
          <div>11111111</div>
          <div>11111111</div>
          <div>11111111</div>
          <div>11111111</div>
          <div>11111111</div>
        </template>
      </vxe-card>
    </p>
  </div>
</template>
