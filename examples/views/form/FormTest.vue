<template>
  <div>
    <vxe-form vertical border title-background title-colon :data="demo1.formData1" @submit="searchEvent" @reset="resetEvent">
      <vxe-form-item title="名称" field="name" :item-render="{}" titleBold :titlePrefix="{content:'ff'}" :titleSuffix="{content:'xx'}">
        <template #prefix>
          222
        </template>
        <template #suffix>
          1111
        </template>
        <template #default="{ data }">
          <vxe-input v-model="data.name" placeholder="请输入名称" clearable></vxe-input>
        </template>
      </vxe-form-item>
      <vxe-form-item title="昵称" field="nickname" :item-render="{}">
        <template #default="{ data }">
          <vxe-input v-model="data.nickname" placeholder="请输入昵称"></vxe-input>
        </template>
      </vxe-form-item>
      <vxe-form-item title="性别" field="sex" :item-render="{}">
        <template #default="{ data }">
          <vxe-select v-model="data.sex" placeholder="请选择性别" clearable>
            <vxe-option value="1" label="女"></vxe-option>
            <vxe-option value="2" label="男"></vxe-option>
          </vxe-select>
        </template>
      </vxe-form-item>
      <vxe-form-item>
        <template #default>
          <vxe-button type="submit" status="primary" content="默认尺寸"></vxe-button>
        </template>
      </vxe-form-item>
    </vxe-form>

    <vxe-form title-background :data="demo1.formData1" @submit="searchEvent" @reset="resetEvent" size="medium">
      <vxe-form-item title="名称" field="name" :item-render="{}">
        <template #default="{ data }">
          <vxe-input v-model="data.name" placeholder="请输入名称" clearable></vxe-input>
        </template>
      </vxe-form-item>
      <vxe-form-item title="昵称" field="nickname" :item-render="{}">
        <template #default="{ data }">
          <vxe-input v-model="data.nickname" placeholder="请输入昵称" clearable></vxe-input>
        </template>
      </vxe-form-item>
      <vxe-form-item title="性别" field="sex" :item-render="{}">
        <template #default="{ data }">
          <vxe-select v-model="data.sex" placeholder="请选择性别" clearable>
            <vxe-option value="1" label="女"></vxe-option>
            <vxe-option value="2" label="男"></vxe-option>
          </vxe-select>
        </template>
      </vxe-form-item>
      <vxe-form-item>
        <template #default>
          <vxe-button type="submit" status="primary" content="中等尺寸"></vxe-button>
        </template>
      </vxe-form-item>
    </vxe-form>

    <vxe-form :data="demo1.formData1" @submit="searchEvent" @reset="resetEvent" size="small">
      <vxe-form-item title="名称" field="name" :item-render="{}">
        <template #default="{ data }">
          <vxe-input v-model="data.name" placeholder="请输入名称" clearable></vxe-input>
        </template>
      </vxe-form-item>
      <vxe-form-item title="昵称" field="nickname" :item-render="{}">
        <template #default="{ data }">
          <vxe-input v-model="data.nickname" placeholder="请输入昵称" clearable></vxe-input>
        </template>
      </vxe-form-item>
      <vxe-form-item title="性别" field="sex" :item-render="{}">
        <template #default="{ data }">
          <vxe-select v-model="data.sex" placeholder="请选择性别" clearable>
            <vxe-option value="1" label="女"></vxe-option>
            <vxe-option value="2" label="男"></vxe-option>
          </vxe-select>
        </template>
      </vxe-form-item>
      <vxe-form-item>
        <template #default>
          <vxe-button type="submit" status="primary" content="小型尺寸"></vxe-button>
        </template>
      </vxe-form-item>
    </vxe-form>

    <vxe-form :data="demo1.formData1" @submit="searchEvent" @reset="resetEvent" size="mini">
      <vxe-form-item title="名称" field="name" :item-render="{}">
        <template #default="{ data }">
          <vxe-input v-model="data.name" placeholder="请输入名称" clearable></vxe-input>
        </template>
      </vxe-form-item>
      <vxe-form-item title="昵称" field="nickname" :item-render="{}">
        <template #default="{ data }">
          <vxe-input v-model="data.nickname" placeholder="请输入昵称" clearable></vxe-input>
        </template>
      </vxe-form-item>
      <vxe-form-item title="性别" field="sex" :item-render="{}">
        <template #default="{ data }">
          <vxe-select v-model="data.sex" placeholder="请选择性别" clearable>
            <vxe-option value="1" label="女"></vxe-option>
            <vxe-option value="2" label="男"></vxe-option>
          </vxe-select>
        </template>
      </vxe-form-item>
      <vxe-form-item>
        <template #default>
          <vxe-button type="submit" status="primary" content="超小尺寸"></vxe-button>
        </template>
      </vxe-form-item>
    </vxe-form>

    <p class="tip">表单校验</p>

    <vxe-form
    readonly border title-background
      title-colon
      ref="xForm"
      title-align="right"
      title-width="100"
      :data="demo2.formData2"
      :rules="demo2.formRules2"
      :loading="demo2.loading2"
      @submit="submitEvent2"
      @reset="resetEvent">
      <vxe-form-group span="12" title="分组1" vertical>
        <vxe-form-item title="名称" field="name" span="24"></vxe-form-item>
        <vxe-form-item title="昵称" span="24">
          <template #title>
            <span style="color: red;">自定义标题</span>
          </template>
          <template #default="{ data }">
            <span>自定义 {{ data.nickname }}</span>
          </template>
        </vxe-form-item>
        <vxe-form-item title="标题貌似有点长呢" field="sex" span="24" :item-render="{}" title-overflow>
          <template #default="params">
            <vxe-select v-model="params.data.sex" placeholder="请选择性别" clearable>
              <vxe-option value="1" label="女"></vxe-option>
              <vxe-option value="2" label="男"></vxe-option>
            </vxe-select>
          </template>
        </vxe-form-item>
        <vxe-form-item title="标题貌似有点长呢" field="age" span="24" :item-render="{autofocus:'input'}" title-overflow="title">
          <template #default="params">
            <vxe-input v-model="params.data.age" type="integer" placeholder="请输入年龄" clearable></vxe-input>
          </template>
        </vxe-form-item>
        <vxe-form-item title="标题貌似有点长呢" field="date" span="24" :item-render="{}" title-overflow="ellipsis">
          <template #default="{ data }">
            <vxe-input v-model="data.date" type="date" placeholder="请选择日期" clearable></vxe-input>
          </template>
        </vxe-form-item>
      </vxe-form-group>
      <vxe-form-group span="12" title="分组2">
        <vxe-form-item title="标题貌似有点长呢标题貌似有点长呢" field="address" span="24" :item-render="{}">
          <template #default="{ data }">
            <vxe-textarea v-model="data.address" placeholder="请输入地址" :autosize="{minRows: 6, maxRows: 10}" clearable></vxe-textarea>
          </template>
        </vxe-form-item>
      </vxe-form-group>
      <vxe-form-item align="center" span="24">
        <template #default>
          <vxe-button type="submit" status="primary" content="基本表单"></vxe-button>
          <vxe-button type="reset" content="重置"></vxe-button>
        </template>
      </vxe-form-item>
    </vxe-form>

    <p class="tip">默认渲染方式为配置式，不支持自定义的布局，可以通过设置 custom-layout 切换为自定义布局</p>

    <vxe-form
      ref="xForm3"
      v-model:collapseStatus="demo3.collapseStatus3"
      :data="demo3.formData3"
      :rules="demo3.formRules3"
      title-align="right"
      title-width="100"
      title-colon
      custom-layout>
      <div style="color: red;">使用自定义布局</div>
      <vxe-form-item title="名称" field="name" :item-render="{}">
        <template #default="{ data }">
          <vxe-input v-model="data.name" placeholder="请输入名称" clearable></vxe-input>
        </template>
      </vxe-form-item>
      <div style="border: 1px dashed green;padding: 10px;">
        <vxe-form-item title="昵称" field="nickname" :item-render="{}" :title-prefix="{ message: '左边图标', icon: 'fa fa-exclamation-circle' }">
          <template #default="{ data }">
            <vxe-input v-model="data.nickname" placeholder="请输入昵称" clearable></vxe-input>
          </template>
        </vxe-form-item>
        <vxe-form-item title="性别" field="sex" :item-render="{}" :title-prefix="{ message: '左边图标', icon: 'fa fa-thumbs-up' }" :title-suffix="{ message: '右边图标', icon: 'fa fa-mars-stroke' }">
          <template #title>
            <span style="color: red;">标题</span>
          </template>
          <template #default="{ data }">
            <vxe-select v-model="data.sex" placeholder="请选择性别" clearable>
              <vxe-option value="1" label="女"></vxe-option>
              <vxe-option value="2" label="男"></vxe-option>
            </vxe-select>
          </template>
        </vxe-form-item>
        <vxe-form-item title="地区选择" field="region" :item-render="{}">
          <template #default="{ data }">
            <vxe-tree-select v-model="data.region" :options="regionOptions" placeholder="请选择地区" clearable></vxe-tree-select>
          </template>
        </vxe-form-item>
        <vxe-form-item title="年龄" field="age" :item-render="{}" :title-suffix="{ message: '右边图标', icon: 'fa fa-info-circle' }">
          <template #default="{ data }">
            <vxe-input v-model="data.age" type="integer" placeholder="请输入年龄" clearable></vxe-input>
          </template>
        </vxe-form-item>
        <vxe-form-item title="是否禁用" field="active" :item-render="{}">
          <template #default="{ data }">
            <vxe-switch v-model="data.active" open-label="是" close-label="否"></vxe-switch>
          </template>
        </vxe-form-item>
        <div>
          <vxe-checkbox v-model="demo3.collapseStatus3" content="查看更多" :checked-value="false" :unchecked-value="true"></vxe-checkbox>
        </div>
        <vxe-form-item title="日期" field="date" :item-render="{}" folding>
          <template #default="{ data }">
            <vxe-input v-model="data.date" type="date" placeholder="请选择日期" clearable></vxe-input>
          </template>
        </vxe-form-item>
        <vxe-form-item title="兴趣爱好" field="flagList" :item-render="{}" folding>
          <template #default="{ data }">
            <vxe-checkbox-group v-model="data.flagList">
              <vxe-checkbox label="1" content="爬山"></vxe-checkbox>
              <vxe-checkbox label="2" content="跑步"></vxe-checkbox>
              <vxe-checkbox label="3" content="听歌"></vxe-checkbox>
            </vxe-checkbox-group>
          </template>
        </vxe-form-item>
        <vxe-form-item title="运动" field="exercise" :item-render="{}" folding>
          <template #default="{ data }">
            <vxe-radio-group v-model="data.exercise">
              <vxe-radio label="1" content="爬山"></vxe-radio>
              <vxe-radio label="2" content="跑步"></vxe-radio>
            </vxe-radio-group>
          </template>
        </vxe-form-item>
        <div>
          <vxe-form-item align="center" collapse-node>
            <template #default>
              <vxe-button status="primary" content="手动提交方式" @click="searchEvent3"></vxe-button>
              <vxe-button content="重置" @click="resetEvent3"></vxe-button>
            </template>
          </vxe-form-item>
        </div>
      </div>
    </vxe-form>

    <p class="tip">配置式表单</p>

    <vxe-form :data="demo4.formData4" :items="demo4.formItems4" :rules="demo4.rules" :valid-config="{theme: 'beautify'}">
      <template #myaddress="{ data }">
        <vxe-input v-model="data.address" placeholder="自定义插槽模板"></vxe-input>
      </template>
    </vxe-form>

  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { VxeUI } from '../../../packages'
import { VxeFormEvents, VxeFormPropTypes, VxeFormInstance, VxeButtonEvents } from '../../../types'

const demo1 = reactive({
  formData1: {
    name: '',
    nickname: '',
    sex: '1'
  }
})

const demo2 = reactive({
  loading2: false,
  formData2: {
    name: 'test1',
    nickname: 'Testing',
    sex: '',
    age: 26,
    date: null,
    address: '左右布局'
  },
  formRules2: {
    name: [
      { required: true, message: '请输入名称' },
      { min: 3, max: 5, message: '长度在 3 到 5 个字符' }
    ],
    sex: [
      { required: true, message: '请选择性别' }
    ],
    age: [
      { required: true, message: '请输入年龄' },
      {
        validator ({ itemValue }) {
          // 自定义校验
          if (Number(itemValue) > 35 || Number(itemValue) < 18) {
            return new Error('年龄在 18 ~ 35 之间')
          }
        }
      }
    ],
    date: [
      { required: true, message: '必填校验' }
    ]
  } as VxeFormPropTypes.Rules
})

const xForm3 = ref({} as VxeFormInstance)
const demo3 = reactive({
  collapseStatus3: true,
  formData3: {
    name: '',
    nickname: '',
    sex: '2',
    age: 30,
    status: '1',
    weight: null,
    date: null,
    region: null,
    active: false,
    single: '1',
    flagList: [],
    exercise: '1'
  },
  formRules3: {
    name: [
      { required: true, message: '请输入' }
    ],
    nickname: [
      { required: true, message: '请输入' }
    ],
    date: [
      { required: true, message: '请输入' }
    ]
  }
})

const regionOptions = ref([
  {
    label: '广东省',
    value: 11,
    children: [
      {
        label: '广州市',
        value: 3333,
        children: [
          { label: '天河区', value: 555 },
          { label: '荔湾区', value: 6666 }
        ]
      },
      {
        label: '深圳市',
        value: 44444,
        children: [
          { label: '福田区', value: 7777 },
          { label: '南山区', value: 8888 }
        ]
      }
    ]
  }
])

const demo4 = reactive({
  formData4: {
    name: '',
    nickname: '',
    sex: '0',
    role: '',
    region: null,
    age: 22,
    val1: [],
    val2: false,
    val3: '',
    flag: false,
    address: ''
  },
  rules: {
    name: [
      { required: true, message: '请输入名称' }
    ],
    role: [
      { required: true, message: '请输入名称' }
    ]
  },
  formItems4: [
    {
      title: '左侧',
      span: 12,
      children: [
        { field: 'name', title: '名称', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
        { field: 'sex', title: '性别', span: 8, itemRender: { name: '$select', options: [{ value: '0', label: '女' }, { value: '1', label: '男' }], props: { placeholder: '请选择性别' } } },
        { field: 'role', title: '角色', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入角色' } } },
        { field: 'age', title: '年龄', span: 24, itemRender: { name: '$input', props: { type: 'number', placeholder: '请输入年龄' } } },
        { field: 'region', title: '地区选择', span: 24, itemRender: { name: 'VxeTreeSelect', options: regionOptions.value } },
        { field: 'val1', title: '复选框-组', span: 12, itemRender: { name: '$checkbox', options: [{ label: '爬山', value: '11' }, { label: '健身', value: '22' }] } },
        { field: 'val2', title: '复选框', span: 12, itemRender: { name: '$checkbox' } },
        { field: 'val3', title: '单选框', span: 12, itemRender: { name: '$radio', options: [{ label: '是', value: 'Y' }, { label: '否', value: 'N' }] } },
        { field: 'flag', title: '开关', span: 24, itemRender: { name: '$switch', props: { openLabel: '是', closeLabel: '否' } } },
        { field: 'address', title: '地区', span: 24, slots: { default: 'myaddress' } }
      ]
    },
    {
      title: '右侧',
      span: 12,
      children: [
        { field: 'nickname', title: '昵称', span: 24, itemRender: { name: '$input', props: { placeholder: '请输入昵称' } } }
      ]
    },
    { align: 'center', span: 24, itemRender: { name: '$buttons', children: [{ props: { type: 'submit', content: '配置式表单', status: 'primary' } }, { props: { type: 'reset', content: '重置' } }] } }
  ] as VxeFormPropTypes.Items
})

const submitEvent2: VxeFormEvents.Submit = () => {
  demo2.loading2 = true
  setTimeout(() => {
    demo2.loading2 = false
    VxeUI.modal.message({ content: '保存成功', status: 'success' })
  }, 1000)
}

const searchEvent: VxeFormEvents.Submit = async () => {
  VxeUI.modal.message({ content: '查询事件', status: 'info' })
}

const resetEvent: VxeFormEvents.Reset = () => {
  VxeUI.modal.message({ content: '重置事件', status: 'info' })
}

const searchEvent3: VxeButtonEvents.Click = async () => {
  const $form = xForm3.value
  const errMap = await $form.validate()
  if (errMap) {
    return
  }
  VxeUI.modal.message({ content: '查询事件', status: 'info' })
}

const resetEvent3: VxeButtonEvents.Click = () => {
  const $form = xForm3.value
  $form.reset()
  VxeUI.modal.message({ content: '重置事件', status: 'info' })
}
</script>
