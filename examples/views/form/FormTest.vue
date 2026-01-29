<template>
  <div>
    <vxe-button status="primary" @click="toggleReadonly">切换只读</vxe-button>
    <vxe-button status="success" @click="toggleBorder">显示边框</vxe-button>
    <vxe-button status="success" @click="toggleBackground">显示背景</vxe-button>

    <vxe-form v-bind="formOptions"></vxe-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { VxeFormProps, VxeUploadPropTypes, VxeFormItemPropTypes } from '../../../types'

interface FormDataVO {
  name: string
  nickname: string
  num: number
  float: number
  integer: number
  amount: number
  date: string
  time: string
  year: string
  quarter: string
  month: string
  week: string
  datetime: string
  sex: string
  sexList: string[]
  type: string
  typeList: string[]
  flag1: boolean
  hobbies1: string
  hobbies2: string
  hobbiesList: string[]
  fileList1: VxeUploadPropTypes.ModelValue
  fileList2: VxeUploadPropTypes.ModelValue
  imgList1: VxeUploadPropTypes.ModelValue
  imgList2: VxeUploadPropTypes.ModelValue
  address: string
}

const sexItemRender = reactive<VxeFormItemPropTypes.ItemRender>({
  name: 'VxeSelect',
  options: [
    { label: '女', value: 'Women' },
    { label: '男', value: 'Man' }
  ]
})

const sexListItemRender = reactive<VxeFormItemPropTypes.ItemRender>({
  name: 'VxeSelect',
  props: {
    multiple: true
  },
  options: [
    { label: '女', value: 'Women' },
    { label: '男', value: 'Man' }
  ]
})

const typeItemRender = reactive<VxeFormItemPropTypes.ItemRender>({
  name: 'VxeSelect',
  optionGroups: [
    {
      label: '分类1',
      value: '1',
      options: [
        { label: '苹果', value: '1-1' },
        { label: '雪梨', value: '1-2' }
      ]
    },
    {
      label: '分类2',
      value: '2',
      options: [
        { label: '草莓', value: '2-1' },
        { label: '猕猴桃', value: '2-2' }
      ]
    }
  ]
})

const typeListItemRender = reactive<VxeFormItemPropTypes.ItemRender>({
  name: 'VxeSelect',
  props: {
    multiple: true
  },
  optionGroups: [
    {
      label: '分类1',
      value: '1',
      options: [
        { label: '苹果', value: '1-1' },
        { label: '雪梨', value: '1-2' }
      ]
    },
    {
      label: '分类2',
      value: '2',
      options: [
        { label: '草莓', value: '2-1' },
        { label: '猕猴桃', value: '2-2' }
      ]
    }
  ]
})

const hobbies1ItemRender = reactive<VxeFormItemPropTypes.ItemRender>({
  name: 'VxeRadioGroup',
  options: [
    { label: '爬山', value: '1' },
    { label: '干架', value: '2' },
    { label: '干饭', value: '3' },
    { label: '游泳', value: '4' },
    { label: '跑步', value: '5' }
  ]
})

const hobbies2ItemRender = reactive<VxeFormItemPropTypes.ItemRender>({
  name: 'VxeRadioGroup',
  props: {
    type: 'button'
  },
  options: [
    { label: '爬山', value: '1' },
    { label: '干架', value: '2' },
    { label: '干饭', value: '3' },
    { label: '游泳', value: '4' },
    { label: '跑步', value: '5' }
  ]
})

const hobbiesItemRender = reactive<VxeFormItemPropTypes.ItemRender>({
  name: 'VxeCheckboxGroup',
  options: [
    { label: '爬山', value: '1' },
    { label: '干架', value: '2' },
    { label: '干饭', value: '3' },
    { label: '游泳', value: '4' },
    { label: '跑步', value: '5' }
  ]
})

const actionItemRender = reactive<VxeFormItemPropTypes.ItemRender>({
  name: 'VxeButtonGroup',
  options: [
    { content: '重置', type: 'reset' },
    { content: '提交', type: 'submit', status: 'primary' }
  ]
})

const formOptions = reactive<VxeFormProps<FormDataVO>>({
  border: false,
  readonly: false,
  titleWidth: 140,
  titleColon: true,
  titleBackground: false,
  titleAlign: 'right',
  data: {
    name: 'test1',
    nickname: 'Testing',
    num: 4236985.3,
    integer: 100000,
    float: 31200.33,
    amount: 100000,
    date: '2025-02-02',
    time: '02:01:02',
    year: '2025-01-01',
    quarter: '2025-04-01',
    month: '2025-10-01',
    week: '2025-03-17',
    datetime: '2025-02-02 10:30:45',
    sex: 'Man',
    sexList: ['Man', 'Women'],
    type: '1-1',
    typeList: ['1-2', '2-2'],
    flag1: true,
    hobbies1: '5',
    hobbies2: '3',
    hobbiesList: ['3'],
    fileList1: [],
    fileList2: [
      { name: 'fj562.png', url: 'https://vxeui.com/resource/img/fj562.png' }
    ],
    imgList1: [],
    imgList2: [
      { name: 'fj562.png', url: 'https://vxeui.com/resource/img/fj562.png' }
    ],
    address: '广东省深圳市'
  },
  items: [
    { field: 'name', title: '名称', span: 24, itemRender: { name: 'VxeInput' } },
    { field: 'nickname', title: '输入框', span: 24, itemRender: { name: 'VxeInput' } },
    {
      span: 24,
      children: [
        { field: 'num', title: '数字', span: 12, itemRender: { name: 'VxeNumberInput' } },
        { field: 'integer', title: '整数', span: 12, itemRender: { name: 'VxeNumberInput', props: { type: 'integer' } } },
        { field: 'float', title: '小数', span: 12, itemRender: { name: 'VxeNumberInput', props: { type: 'float' } } },
        { field: 'amount', title: '金额', span: 12, itemRender: { name: 'VxeNumberInput', props: { type: 'amount' } } }
      ]
    },
    {
      span: 24,
      children: [
        { field: 'date', title: '日期', span: 12, itemRender: { name: 'VxeDatePicker' } },
        { field: 'year', title: '年份', span: 12, itemRender: { name: 'VxeDatePicker', props: { type: 'year' } } },
        { field: 'quarter', title: '季度', span: 12, itemRender: { name: 'VxeDatePicker', props: { type: 'quarter' } } },
        { field: 'month', title: '月份', span: 12, itemRender: { name: 'VxeDatePicker', props: { type: 'month' } } },
        { field: 'week', title: '周', span: 12, itemRender: { name: 'VxeDatePicker', props: { type: 'week' } } },
        { field: 'time', title: '时间', span: 12, itemRender: { name: 'VxeDatePicker', props: { type: 'time' } } },
        { field: 'datetime', title: '日期带时间', span: 12, itemRender: { name: 'VxeDatePicker', props: { type: 'datetime' } } }
      ]
    },
    { field: 'sex', title: '下拉框', span: 12, itemRender: sexItemRender },
    { field: 'sexList', title: '下拉框多选', span: 12, itemRender: sexListItemRender },
    { field: 'type', title: '下拉框分组', span: 12, itemRender: typeItemRender },
    { field: 'typeList', title: '下拉框分组多选', span: 12, itemRender: typeListItemRender },
    { field: 'flag1', title: '开关', span: 24, itemRender: { name: 'VxeSwitch' } },
    { field: 'hobbies1', title: '单选框', span: 24, itemRender: hobbies1ItemRender },
    { field: 'hobbies2', title: '单选按钮', span: 24, itemRender: hobbies2ItemRender },
    { field: 'hobbiesList', title: '复选框', span: 24, itemRender: hobbiesItemRender },
    { field: 'fileList1', title: '上传附件', span: 24, itemRender: { name: 'VxeUpload' } },
    { field: 'fileList2', title: '上传附件多选', span: 24, itemRender: { name: 'VxeUpload', props: { multiple: true } } },
    { field: 'imgList1', title: '上传图片', span: 24, itemRender: { name: 'VxeUpload', props: { mode: 'image' } } },
    { field: 'imgList2', title: '上传图片多选', span: 24, itemRender: { name: 'VxeUpload', props: { mode: 'image', multiple: true } } },
    { field: 'address', title: '文本域', span: 24, itemRender: { name: 'VxeTextarea' } },
    { align: 'center', span: 24, itemRender: actionItemRender }
  ],
  rules: {
    num: [
      { required: true, message: '必填' }
    ],
    date: [
      { required: true, message: '必填' }
    ],
    type: [
      { required: true, message: '必填' }
    ],
    fileList2: [
      { required: true, message: '必填' }
    ],
    imgList1: [
      { required: true, message: '必填' }
    ]
  }
})

const toggleReadonly = () => {
  formOptions.readonly = !formOptions.readonly
}

const toggleBorder = () => {
  formOptions.border = !formOptions.border
}

const toggleBackground = () => {
  formOptions.titleBackground = !formOptions.titleBackground
}
</script>
