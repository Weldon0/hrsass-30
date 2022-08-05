<template>
  <div>
    <el-upload
      :before-upload="beforeUpload"
      action="#"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :class="{completed: isCompleted}"
      :on-change="changeFile"
      :http-request="upload"
      :limit="1"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress style="width: 200px;" :percentage="percentage" />
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import COS from 'cos-js-sdk-v5'

// 初始化一个cos实例
// 腾讯云
// 图片的链接
// 静态文件资源不推荐直接放到服务器
// 服务器目的 >> 搭建服务
// 静态的文件放到服务器 >> 浪费资源
// 对象存储 >> 访问速度比较快
// 静态文件的

const cos = new COS({
  SecretId: 'AKIDzqRmqd9QQBftqVtzqQjmeS7WfYAbnjPo',
  SecretKey: '92f15tQgeLlulLegRu70dz4sOdcLnyrU'
})
console.log(cos)
export default {
  name: 'ImageUpload',
  data() {
    return {
      percentage: 0,
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
      return this.fileList.length >= 1
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
      // 如果uid一致，需要被删除
      // fileList是筛选之后的结果
      this.fileList = fileList
    },
    handlePictureCardPreview(file) {
      // 当前点击的图片的文件对象
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    beforeUpload(file) {
      // file上传的文件对象
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      //  判断上传的文件类型是否在预定的范围以内
      if (!types.includes(file.type)) {
        //  说明满足条件
        this.$message.error('文件类型不匹配')
        return false
      }

      //  判断文件的大小
      const maxSize = 5 * 1024 * 1024 // 1M=1024KB 1KB = 1024B
      if (file.size > maxSize) {
        this.$message.error('文件太大了')
        return false
      }
    },
    upload(params) {
      const { file } = params
      console.log(file)
      // console.log(params)
      // 开始文件上传到腾讯云对象存储
      // 如果上传的文件对象不存在，终止代码执行
      if (!file) return
      cos.putObject({
        Bucket: 'wuxiaohui-1254415986', // 存储桶
        Region: 'ap-nanjing', // 地域
        Key: file.name, // 文件名
        Body: file, // 要上传的文件对象
        StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
        onProgress: ({ percent }) => {
          // console.log(percent * 100)
          // console.log(this)
          this.percentage = percent * 100
        }
      }, (err, data) => {
        if (err) {
          this.$message.error(err?.message || '上传出错')
          return
        }
        // 替换url的时候，直接给最后一项替换，
        this.fileList.forEach(item => {
          if (item.uid === file.uid) {
            item.url = `http://${data.Location}`
            // 只有成功获取到了服务器端图片链接的时候，加一个标识
            // 目的：提交更新的时候，进行判断，如果当前文件对象里面没有upload属性，不进行提交
            item.upload = true
          }
        })
      })
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
