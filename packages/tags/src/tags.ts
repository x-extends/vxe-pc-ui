import {
  ComponentOptions,
  computed,
  defineComponent,
  h,
  PropType,
  reactive, Ref,
  ref,
  resolveComponent, unref
} from 'vue'
import {
  TagsReactData,
  VxeTagsEmits,
  VxeTagsPrivateRef,
  VxeTagsPropTypes
} from '../../../types/components/tags'
import { isFunction, isObject, isString, pick, uniqueId } from 'xe-utils'
import { VxeTagConstructor, VxeTagInstance, VxeTagProps } from '../../../types'

export default defineComponent({
  name: 'vxeTags',
  props: {
    modelValue: {
      type: Array as PropType<VxeTagsPropTypes.modelValue>,
      default: () => []
    },
    color: {
      type: String as PropType<VxeTagsPropTypes.color>,
      default: 'default'
    },
    size: {
      type: String as PropType<VxeTagsPropTypes.size>,
      default: 'medium'
    },
    closable: {
      type: Boolean as PropType<VxeTagsPropTypes.closable>,
      default: false
    },
    round: {
      type: Boolean as PropType<VxeTagsPropTypes.round>,
      default: false
    },
    tagStyle: {
      type: String as PropType<VxeTagsPropTypes.tagStyle>,
      default: 'default'
    },
    icon: {
      type: String as PropType<VxeTagsPropTypes.icon>
    },
    iconSet: {
      type: String as PropType<VxeTagsPropTypes.iconSet>,
      default: ''
    },
    align: {
      type: String as PropType<VxeTagsPropTypes.align>,
      default: 'middle'
    },
    creator: {
      type: [Function, Boolean] as PropType<VxeTagsPropTypes.creator>
    }
  },
  emits: [
    'update:modelValue',
    'close',
    'edit',
    'icon-click',
    'tag-created'
  ] as VxeTagsEmits,
  setup (props, context) {
    const { slots, emit } = context
    const xID = uniqueId()
    const reactData = reactive<TagsReactData>({
      inited: false,
      innerTags: props.modelValue
    })
    const refElem = ref() as Ref<HTMLSpanElement>
    const refTags = ref<VxeTagInstance[]>([])
    const activeTag = ref() as Ref<VxeTagInstance>
    const refMaps: VxeTagsPrivateRef = {
      refElem,
      refTags,
      activeTag
    }
    const $vxtags = {
      xID,
      props,
      context,
      reactData,
      getRefMaps: () => refMaps
    } as unknown as VxeTagConstructor
    const parentProps = computed(() => {
      const extendProps = pick({ ...props }, [
        'color',
        'size',
        'closable',
        'editable',
        'round',
        'tagStyle',
        'icon',
        'iconSet',
        'align'
      ])
      if (props.creator) {
        extendProps.editable = true
      }
      return extendProps
    })

    const isSimple = computed(() => props.modelValue.every((item) => !isObject(item)))
    const closeTag = (index: number) => {
      const { innerTags } = reactData
      innerTags.splice(index, 1)
      emit('update:modelValue', innerTags)
    }
    const interleave = (arr: Array<any>, x: any) => arr.flatMap((e: any) => [e, x]).slice(0, -1)
    const renderTags = () => {
      const { innerTags } = reactData
      const tags = innerTags.map((item, index) => h(resolveComponent('vxe-tag') as ComponentOptions, {
        key: uniqueId(),
        ref: refTags.value[index],
        onClose: () => closeTag(index),
        onEdit: (value: string) => {
          if (isString(innerTags[index])) {
            innerTags[index] = value
          } else {
            (innerTags[index] as VxeTagProps).content = value
          }
          emit('update:modelValue', innerTags)
          emit('edit', { $event: { index, tag: item } })
        },
        content: isSimple.value ? item : (item as VxeTagProps).content,
        ...(isSimple.value ? parentProps.value : { ...parentProps.value, ...(item as VxeTagProps) })
      }))
      const separator = renderSeparator()
      return interleave(tags, separator)
    }
    const renderCreator = () => {
      return h(resolveComponent('vxe-button') as ComponentOptions, {
        icon: 'vxe-icon-square-plus-square',
        type: 'text',
        status: 'primary',
        onClick: () => {
          if (props.creator) {
            const created = isFunction(props.creator) ? props.creator(props.modelValue) : ''
            const tag = isSimple.value
              ? isString(created) ? created : created?.content
              : created === ''
                ? {
                    ...unref(parentProps),
                    content: ''
                  }
                : created
            reactData.innerTags.push(tag)
            emit('update:modelValue', reactData.innerTags)
            emit('tag-created', { $event: { tag } })
            activeTag.value = refTags.value[refTags.value.length - 1]
            /* activeTag 进入编辑状态 */
            activeTag.value?.startEditing()
          }
        }
      })
    }
    const renderSeparator = () => slots?.separator?.() ?? null
    const renderVN = () => {
      return h('span', {
        ref: refElem,
        class: ['vxe-tags-wrapper']
      }, [
        ...renderTags(),
        props.creator ? renderCreator() : null
      ])
    }
    $vxtags.renderVN = renderVN
    return $vxtags
  },
  render () {
    return this.renderVN()
  }

})
