<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list.sync="fileList"
      :limit="1"
      :class="{completed: isCompleted}"
      :on-change="changeFile"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'ImageUpload',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      // 指定默认的图片
      fileList: [
        {
          url: 'https://img1.baidu.com/it/u=464544556,3606969129&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
        }
      ]
    }
  },
  // 判断是否已经有一张头像，如果是，则隐藏上传按钮
  computed: {
    isCompleted() {
      return this.fileList.length === 1
    }
  },
  methods: {
    changeFile(file, fileList) {
      // fileList最终的文件列表
      // 直接push可能导致同一个文件被重复添加
      console.log(fileList)
      // this.fileList.push(file)
      this.fileList = fileList
    },
    handleRemove(file, fileList) {
      // file是点击的文件
      // 如果uid一致，需要被删除
      // this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      this.fileList = fileList
    },
    handlePictureCardPreview(file) {
      // 当前点击的图片的文件对象
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped lang="scss">
.completed {
  ::v-deep .el-upload--picture-card {
    display: none;
  }
}
</style>
