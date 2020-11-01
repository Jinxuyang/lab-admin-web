<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/#/direction">项目管理</a></el-breadcrumb-item>
    </el-breadcrumb>
    <!--Card-->
    <el-card class="box-card">
      <!--列表上方-->
      <div slot="header" class="clearfix">
        <span>项目管理</span>
        <el-input v-model="searchContent" style="width: 15%;margin-left: 1%" placeholder="请输入内容"></el-input>
        <el-button @click="handleSearch(searchContent)" style="margin-left: 1%">检索</el-button>
        <el-button style="float: right" @click="showInsertDialog">添加方向</el-button>
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
              label="项目名称"
              width="180">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="简介"
              width="180">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.introduction" placement="top">
                  <span>查看简介</span>
                </el-tooltip>
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
                  @click="showPhotoListDialog(scope.$index, scope.row)">查看图片</el-button>
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
    <el-dialog title="修改方向信息" :visible.sync="editDialogFormVisible">
      <el-form :model="editDialog">
        <el-form-item label="ID" >
          <el-input  v-model="editDialog.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="姓名" >
          <el-input  v-model="editDialog.name"></el-input>
        </el-form-item>
        <el-form-item label="介绍" >
          <el-input  v-model="editDialog.introduction" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <br>
          <el-image
            :key="photo"
            :randValue="randValue"
            v-for="photo in editDialog.photos"
            :src="photo"
            :preview-src-list="editDialog.photos"
            style="width: 100px; height: 100px;margin-right: 2px">
          </el-image>
          <br>
          <el-button
            size="mini"
            type="danger"
            style="width: 99px"
            v-for="photo in editDialog.photos"
            :key="photo"
            @click="deletePhoto(photo)">
            删除
          </el-button>
        </el-form-item>
        <el-form-item label="上传图片">
          <br>
          <el-upload
            ref="upload"
            name="img"
            action="http://47.93.200.138:8300/direction/insert/photo"
            :on-success="handleSuccess"
            :on-error="handleError"
            :file-list="fileList"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload();editDialog.photos = urlList">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlerEdit(editDialog)">确 定</el-button>
      </div>
    </el-dialog>
    <!--添加成员Dialog-->
    <el-dialog title="添加方向" :visible.sync="addDialogFormVisible">
      <el-form :model="addDialog" ref="insertFormRef">
        <el-form-item label="姓名" >
          <el-input  v-model="addDialog.name"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            ref="upload"
            name="img"
            action="http://47.93.200.138:8300/direction/insert/photo"
            :on-success="handleSuccess"
            :on-error="handleError"
            :file-list="fileList"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="简介" >
          <el-input  v-model="addDialog.introduction" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="是否展示" >
          <el-switch
            v-model="addDialog.isShow"
            active-color="#13ce66"
            inactive-color="#ff4949"
            name="is_leader">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlerAdd(addDialog, fileList)">确 定</el-button>
      </div>
    </el-dialog>
    <!--查看图片Dialog-->
    <el-dialog title="查看图片" :visible.sync="showPhotoDialogVisible">
      <div>
        <el-image
          :key="photo"
          v-for="photo in showPhotoList"
          :src="photo"
          :preview-src-list="showPhotoList"
          style="width: 100px; height: 100px;margin-right: 2px">
        </el-image>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Direction',
  data () {
    return {
      randValue: '123',
      showPhotoList: [],
      urlList: [],
      fileList: [],
      searchContent: '',
      pageCnt: 0,
      tbData: [],
      editDialog: {
        id: '', name: '', introduction: '', photos: []
      },
      addDialog: {
        name: '', introduction: '', isShow: true, photos: []
      },
      addDialogFormVisible: false,
      editDialogFormVisible: false,
      showPhotoDialogVisible: false
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
      this.urlList = []
      console.log(this.fileList)
      this.editDialogFormVisible = !this.editDialogFormVisible
      this.editDialog = row
      console.log(row)
    },
    handleDelete (index, row) {
      this.$http.delete('/direction/' + row.id).then(res => {
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
      this.$http.put('/direction/' + editFormData.id, param, { headers: { 'Content-Type': 'application/json' } }).then(res => {
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
      this.$http.post('/direction/insert', param, { headers: { 'Content-Type': 'application/json' } }).then(res => {
        if (res.data.code === 200) {
          this.getTbList()
          this.$message.success('修改成功')
          this.urlList = []
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
      this.$http.put('/direction/' + row.id, { isShow: row.isShow, status: row.status }).then(res => {
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
        this.$http.get('/direction/get/all?pageNum=' + pageNum).then(res => {
          const cbInfo = res.data.data
          if (res.data.code === 200) {
            const { list } = cbInfo
            const { pageCnt } = cbInfo
            this.tbData = list
            this.pageCnt = pageCnt
          }
        })
      } else {
        this.$http.get('/direction/get/keyword?keyword=' + keyword + '&pageNum=' + pageNum).then(res => {
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
    submitUpload () {
      this.$refs.upload.submit()
    },
    handleSuccess (response) {
      this.$message.success('上传成功')
      this.urlList.push(response.data)
      this.addDialog.photos = this.urlList
      this.editDialog.photos = this.urlList
    },
    showPhotoListDialog (index, row) {
      this.showPhotoDialogVisible = !this.showPhotoDialogVisible
      this.showPhotoList = row.photos
      console.log(this.showPhotoList)
    },
    handleError (err) {
      this.$message.success('上传失败')
      console.log(err)
    },
    deletePhoto (photo) {
      this.$http.delete('/direction/photo?url=' + photo).then(res => {
        if (res.data.code === 200) {
          this.$message.success('删除成功')
          const index = this.editDialog.photos.indexOf(photo)
          this.editDialog.photos[index] = ''
          this.randValue = photo
        } else {
          this.$message.error('删除失败')
        }
        console.log(res)
      }).catch(res => {
        this.$message.error('删除失败')
        console.log(res)
      })
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
</style>
