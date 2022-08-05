import ToolBar from '@/components/ToolBar'
import UploadExcel from '@/components/UploadExcel'
import ImageUpload from '@/components/ImageUpload'

export default {
  install(Vue) {
    // ToolBar.name ->> 组件的name值
    Vue.component(ToolBar.name, ToolBar)
    Vue.component(UploadExcel.name, UploadExcel)
    // 第一个参数 >> 组件的名称 >> string
    Vue.component(ImageUpload.name, ImageUpload)
  }
}

// export default function(Vue) {
//   Vue.component(ToolBar.name, ToolBar)
// }
