<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/#/homenews">首页新闻管理</a></el-breadcrumb-item>
    </el-breadcrumb>
    <!--Card-->
    <el-card class="box-card">
      <!--列表上方-->
      <div slot="header" class="clearfix">
        <span>项目管理</span>
        <el-input v-model="searchContent" style="width: 15%;margin-left: 1%" placeholder="请输入内容"></el-input>
        <el-button @click="handleSearch(searchContent)" style="margin-left: 1%">检索</el-button>
        <el-button style="float: right" @click="showInsertDialog">添加新闻</el-button>
      </div>
      <!--列表-->
      <div class="text item">
        <template>
          <el-table
            :data="tbData"
            style="width: 100%">
            <el-table-column
              label="id"
              width="180">
              <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="新闻名称"
              width="180">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="图片"
              width="180">
              <template slot-scope="scope">
                <img class="el-icon-download" :src="scope.row.photo" width="100px" height="100px">
              </template>
            </el-table-column>
            <el-table-column label="文件" width="180">
              <template slot-scope="scope">
                <a :href="scope.row.url"><i class="el-icon-download"></i></a>
              </template>
            </el-table-column>
            <el-table-column
              label="是否展示"
              width="180">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.isShow"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="tbStatusChange(scope.row)">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="showEditDialog(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <!--分页-->
      <div class="block">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-count="pageCnt"
          @current-change="handleCurrentPageChange">
        </el-pagination>
      </div>
    </el-card>
    <!--修改信息Dialog-->
    <el-dialog title="修改成员信息" :visible.sync="editDialogFormVisible">
      <el-form :model="editDialog">
        <el-form-item label="ID" >
          <el-input  v-model="editDialog.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="姓名" >
          <el-input  v-model="editDialog.name"></el-input>
        </el-form-item>
        <el-form-item label="上传照片">
          <br>
          <el-upload
            name="img"
            class="avatar-uploader"
            action="http://47.93.200.138:8300/homenews/image"
            :show-file-list="false"
            :on-success="handleAvatarSuccess">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <img v-else class="el-icon-plus avatar-uploader-icon">
          </el-upload>
        </el-form-item>
        <el-form-item label="上传文件">
          <br>
          <el-upload
            name="file"
            action="http://47.93.200.138:8300/homenews/file"
            :show-file-list="false"
            :file-list="fileUrl"
            :on-success="handleFileSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlerEdit(editDialog)">确 定</el-button>
      </div>
    </el-dialog>
    <!--添加成员Dialog-->
    <el-dialog title="添加项目" :visible.sync="addDialogFormVisible">
      <el-form :model="addDialog" ref="insertFormRef">
        <el-form-item label="标题" >
          <el-input  v-model="addDialog.name"></el-input>
        </el-form-item>
        <el-form-item label="是否展示" >
          <el-switch
            v-model="addDialog.isShow"
            active-color="#13ce66"
            inactive-color="#ff4949"
            name="is_leader">
          </el-switch>
        </el-form-item>
      <el-form-item label="上传照片">
        <br>
        <el-upload
          name="img"
          class="avatar-uploader"
          action="http://47.93.200.138:8300/homenews/image"
          :show-file-list="false"
          :on-success="handleAvatarSuccess">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <img v-else class="el-icon-plus avatar-uploader-icon">
        </el-upload>
      </el-form-item>
      <el-form-item label="上传文件">
        <br>
        <el-upload
          name="file"
          action="http://47.93.200.138:8300/homenews/file"
          :show-file-list="false"
          :file-list="fileUrl"
          :on-success="handleFileSuccess">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlerAdd(addDialog)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'HomeNews',
  data () {
    return {
      fileUrl: '',
      imageUrl: '',
      searchContent: '',
      pageCnt: 0,
      tbData: [],
      editDialog: {
        id: '', name: '', photo: '', url: ''
      },
      addDialog: {
        name: '', isShow: true, photo: '', url: ''
      },
      addDialogFormVisible: false,
      editDialogFormVisible: false
    }
  },
  created () {
    this.getTbList()
  },
  methods: {
    handleSearch (searchContent) {
      this.getTbList(searchContent)
    },
    showEditDialog (index, row) {
      this.editDialogFormVisible = !this.editDialogFormVisible
      this.editDialog = row
    },
    handleDelete (index, row) {
      this.$http.delete('/homenews/' + row.id).then(res => {
        if (res.data.code === 200) {
          this.$message.success('删除成功')
          this.getTbList()
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    showInsertDialog () {
      this.addDialogFormVisible = !this.addDialogFormVisible
    },
    handlerEdit (editFormData) {
      const param = JSON.stringify(editFormData)
      this.$http.put('/homenews/' + editFormData.id, param, { headers: { 'Content-Type': 'application/json' } }).then(res => {
        if (res.data.code === 200) {
          this.$message.success('修改成功')
        } else {
          this.$message.error('修改失败')
        }
      })

      this.editDialogFormVisible = false
    },
    handlerAdd (addFormData) {
      const param = JSON.stringify(addFormData)
      this.$http.post('/homenews/insert', param, { headers: { 'Content-Type': 'application/json' } }).then(res => {
        if (res.data.code === 200) {
          this.getTbList()
          this.$message.success('修改成功')
        } else {
          this.$message.error('修改失败')
        }
      })
      this.addDialogFormVisible = false
    },
    handleCurrentPageChange (page) {
      this.getTbList('', page)
    },
    tbStatusChange (row) {
      this.$http.put('/homenews/' + row.id, { isShow: row.isShow, status: row.status }).then(res => {
        if (res.data.code === 200) {
          console.log(row)
          this.$message.success('修改成功')
        } else {
          this.$message.error('修改失败')
          row.isShow = !row.isShow
        }
      }).catch(res => {
        this.$message.error('修改失败')
        row.isShow = !row.isShow
      })
    },
    getTbList (keyword = '', pageNum = 1) {
      if (keyword === '') {
        this.$http.get('/homenews/get/all?pageNum=' + pageNum).then(res => {
          const cbInfo = res.data.data
          if (res.data.code === 200) {
            const { list } = cbInfo
            const { pageCnt } = cbInfo
            this.tbData = list
            this.pageCnt = pageCnt
          }
        })
      } else {
        this.$http.get('/homenews/get/keyword?keyword=' + keyword + '&pageNum=' + pageNum).then(res => {
          const cbInfo = res.data.data
          if (res.data.code === 200) {
            const { list } = cbInfo
            const { pageCnt } = cbInfo
            this.tbData = list
            this.pageCnt = pageCnt
          }
        })
      }
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      const { code } = res
      if (code === 200) {
        this.$message.success('上传成功')
      } else {
        this.$message.error('上传失败，请重新上传')
      }
      const { data: url } = res
      this.addDialog.photo = url
      this.editDialog.photo = url
    },
    handleFileSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      const { code } = res
      if (code === 200) {
        this.$message.success('上传成功')
      } else {
        this.$message.error('上传失败，请重新上传')
      }
      const { data: url } = res
      this.addDialog.url = url
      this.editDialog.url = url
    }
  }
}
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  margin-top: 1.2%;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
