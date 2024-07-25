import { defineComponent, ref, h, reactive, PropType, createCommentVNode, Ref, nextTick } from 'vue'
import XEUtils from 'xe-utils'
import { getSlotVNs } from '../../ui/src/vn'

import type {
  VxeTagPropTypes,
  TagReactData,
  TagPrivateRef,
  VxeTagPrivateComputed,
  VxeTagConstructor,
  VxeTagPrivateMethods,
  VxeTagEmits, VxeTagMethods
} from '../../../types'
import { getFuncText } from '../../ui/src/utils'

export default defineComponent({
  name: 'VxeTag',
  props: {
    content: [String, Number] as PropType<VxeTagPropTypes.content>,
    color: {
      type: String as PropType<VxeTagPropTypes.color>,
      default: 'default'
    },
    size: {
      type: String as PropType<VxeTagPropTypes.size>,
      default: 'medium'
    },
    closable: {
      type: Boolean as PropType<VxeTagPropTypes.closable>,
      default: false
    },
    editable: {
      type: Boolean as PropType<VxeTagPropTypes.editable>,
      default: false
    },
    round: Boolean as PropType<VxeTagPropTypes.round>,
    tagStyle: {
      type: String as PropType<VxeTagPropTypes.tagStyle>,
      default: 'default'
    },
    icon: String as PropType<VxeTagPropTypes.icon>,
    iconSet: {
      type: String as PropType<VxeTagPropTypes.iconSet>,
      default: ''
    },
    align: {
      type: String as PropType<VxeTagPropTypes.align>,
      default: 'middle'
    }
  },
  emits: [
    'close',
    'update:content',
    'icon-click',
    'edit'
  ] as VxeTagEmits,
  setup (props, context) {
    const { slots, emit } = context
    const xID = XEUtils.uniqueId()
    const tagStyleList = [
      'default', 'outline', 'flag', 'dashed', 'mark', 'arrow'
    ]
    const reactData = reactive<TagReactData>({
      inited: false,
      editing: false
    })
    const refElem = ref() as Ref<HTMLSpanElement>
    const refContent = ref() as Ref<HTMLSpanElement>
    const refMaps = {
      refElem
    }
    const closeTag = (event: Event) => new Promise(() => {
      event.stopPropagation()
      emit('close', { $event: { tag: $vxtag } })
    })
    const startEditing = () => new Promise(resolve => {
      if (props.editable && !reactData.editing) {
        reactData.editing = true
        nextTick(() => {
          refContent.value.focus()
          const range = document.createRange()
          range.selectNodeContents(refContent.value)
          const selection = window.getSelection()
          selection?.removeAllRanges()
          selection?.addRange(range)
          resolve(true)
        })
      } else {
        resolve(true)
      }
    })
    const handleContentEdited = () => {
      if (props.editable) {
        if (reactData.editing) {
          emit('update:content', refContent.value.innerText)
          emit('edit', refContent.value.innerText)
        }
        reactData.editing = false
      }
    }
    const handleIconClick = () => {
      emit('icon-click', { $event: { tag: $vxtag } })
    }
    let tagMethods = {} as VxeTagMethods
    const $vxtag = {
      xID,
      props,
      context,
      reactData,
      getRefMaps: () => refMaps
    } as unknown as VxeTagConstructor
    tagMethods = {
      dispatchEvent (type, params, event) {
        emit(type, Object.assign({ $tag: $vxtag, $event: event }, params))
      },
      close: closeTag,
      startEditing
    }
    Object.assign($vxtag, tagMethods)
    const renderContent = () => slots?.default?.() ?? getFuncText(props.content)
    const renderIcon = () => slots?.icon?.() ?? (props.icon
      ? h('i', {
        class: [
          'vxe-tag--icon',
          props.iconSet,
          props.icon
        ],
        onClick: handleIconClick
      })
      : null)
    const renderVN = () => {
      const presetColors = [
        'default', 'info', 'primary', 'success', 'warning', 'danger', 'error', 'perfect'
      ]
      return h('span', {
        ref: refElem,
        class: [
          'vxe-tag',
          props.editable && reactData.editing ? 'is--editing' : '',
          props.closable ? 'vxe-tag--closable' : '',
            `size--${props.size}`,
            `vxe-tag-type--${tagStyleList.includes(props.tagStyle) ? props.tagStyle : 'default'}`,
            props.round ? 'is--round' : '',
            `vxe-tag-align--${props.align}`,
            props.color
              ? presetColors.includes(props.color)
                ? `vxe-tag-color--${props.color}`
                : ''
              : 'vxe-tag-color--default',
            {
              closable: props.closable
            }
        ],
        style: presetColors.includes(props.color)
          ? null
          : {
              '--tag-color': props.color
            }
      },
      [
        props.closable
          ? h('div',
            {
              class: 'vxe-tag-close-icon',
              onClick: (event: Event) => {
              // closeTag(event)
                tagMethods.dispatchEvent('close', {}, event)
              }
            },
            [
              'x'
            ]
          )
          : null,
        slots?.avatar?.() ?? null,
        h('span', {
          class: ['vxe-tag-content', { 'tag-select-none': props.editable }],
          ref: refContent,
          contentEditable: props.editable && reactData.editing,
          onClick: startEditing,
          onBlur: handleContentEdited,
          onKeydown: (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
              handleContentEdited()
            } else if (event.key === 'Escape') {
              handleContentEdited()
            } else if (event.key === 'Tab') {
              handleContentEdited()
            }
          }
        }, renderContent()),
        renderIcon()
      ]
      )
    }
    $vxtag.renderVN = renderVN
    return $vxtag
  },
  render () {
    return this.renderVN()
  }
})
