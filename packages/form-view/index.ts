import { App } from 'vue'
import VxeFormViewComponent from '../form-design/src/form-view'
import { dynamicApp } from '../dynamics'

export const VxeFormView = Object.assign(VxeFormViewComponent, {
  install: function (app: App) {
    app.component(VxeFormViewComponent.name as string, VxeFormViewComponent)
  }
})

dynamicApp.component(VxeFormViewComponent.name as string, VxeFormViewComponent)

export const FormView = VxeFormView
export default VxeFormView
