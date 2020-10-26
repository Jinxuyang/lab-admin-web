<template>
<div>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item><a href="/#/member">成员管理</a></el-breadcrumb-item>
  </el-breadcrumb>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>成员管理</span>
      <el-input v-model="searchContent" style="width: 15%;margin-left: 1%" placeholder="请输入内容"></el-input>
      <el-button @click="handleSearch(searchContent)" style="margin-left: 1%">检索</el-button>
      <el-button style="float: right" @click="showInsertMemberDialog">添加新成员</el-button>
    </div>
    <div class="text item">
      <template>
        <el-table
          :data="memberData"
          style="width: 100%">
          <el-table-column
            label="id"
            width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="姓名"
            width="180">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="职位"
            width="180">
            <template slot-scope="scope">
              <span>{{scope.row.position}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="个人介绍"
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
              {{scope.row.is_show}}
              <el-switch
                v-model="scope.row.isShow"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="memberStatusChange(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="是否为实验室带头人"
            width="180">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isLeader"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="memberStatusChange(scope.row)">
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
    <div class="block">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-count="pageCnt"
        @current-change="handleCurrentPageChange">
      </el-pagination>
    </div>
  </el-card>
  <el-dialog title="修改成员信息" :visible.sync="editDialogFormVisible">
    <el-form :model="editMember">
      <el-form-item label="ID" >
        <el-input  v-model="editMember.id" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="姓名" >
        <el-input  v-model="editMember.name"></el-input>
      </el-form-item>
      <el-form-item label="职位" >
        <el-input  v-model="editMember.position"></el-input>
      </el-form-item>
      <el-form-item label="简介" >
        <el-input type="textarea" v-model="editMember.introduction"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="editMemberMe(editMember)">确 定</el-button>
    </div>
  </el-dialog>

  <el-dialog title="添加成员" :visible.sync="addDialogFormVisible">
    <el-form :model="addMember" ref="insertFormRef">
      <el-form-item label="姓名" >
        <el-input v-model="addMember.name" name="name" ></el-input>
      </el-form-item>
      <el-upload
        drag
        class="upload-demo"
        action="http://localhost:8300/member/insert/photo"
        name="img"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <el-form-item label="职位" >
        <el-input v-model="addMember.position" name="position" ></el-input>
      </el-form-item>
      <el-form-item label="简介" >
        <el-input v-model="addMember.introduction" name="introduction" type="textarea" ></el-input>
      </el-form-item>
      <el-form-item label="是否为带头人" >
        <el-switch
          v-model="addMember.isLeader"
          active-color="#13ce66"
          inactive-color="#ff4949"
          name="is_show">
        </el-switch>
      </el-form-item>
      <el-form-item label="是否展示" >
        <el-switch
          v-model="addMember.isShow"
          active-color="#13ce66"
          inactive-color="#ff4949"
          name="is_leader">
        </el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="addMemberMe(addMember)">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
export default {
  name: 'Member',
  data () {
    return {
      imageUrl: '',
      searchContent: '',
      pageCnt: 0,
      memberData: [],
      editMember: {
        id: '', name: '', position: '', introduction: ''
      },
      addMember: {
        name: '', position: '', introduction: '', isShow: true, isLeader: false, photo: ''
      },
      addDialogFormVisible: false,
      editDialogFormVisible: false
    }
  },
  created () {
    this.getMemberList()
  },
  methods: {
    handleSearch (searchContent) {
      this.getMemberList(searchContent)
    },
    showEditDialog (index, row) {
      this.editDialogFormVisible = !this.editDialogFormVisible
      this.editMember = row
    },
    handleDelete (index, row) {
      this.$http.delete('/member/' + row.id).then(res => {
        if (res.data.code === 200) {
          this.$message.success('删除成功')
          this.getMemberList()
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    showInsertMemberDialog () {
      this.addDialogFormVisible = !this.addDialogFormVisible
    },
    editMemberMe (editFormData) {
      const param = JSON.stringify(editFormData)
      this.$http.put('/member/' + editFormData.id, param, { headers: { 'Content-Type': 'application/json' } }).then(res => {
        if (res.data.code === 200) {
          this.$message.success('修改成功')
        } else {
          this.$message.error('修改失败')
        }
      })

      this.editDialogFormVisible = false
    },
    addMemberMe (addFormData) {
      const param = JSON.stringify(addFormData)
      this.$http.post('/member/insert', param, { headers: { 'Content-Type': 'application/json' } }).then(res => {
        if (res.data.code === 200) {
          this.getMemberList()
          this.$message.success('修改成功')
        } else {
          this.$message.error('修改失败')
        }
      })
      this.addDialogFormVisible = false
    },
    handleCurrentPageChange (page) {
      this.getMemberList('', page)
    },
    memberStatusChange (row) {
      this.$http.put('/member/' + row.id, { isShow: row.isShow, isLeader: row.isLeader }).then(res => {
        if (res.data.code === 200) {
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
    getMemberList (keyword = '', pageNum = 1) {
      if (keyword === '') {
        this.$http.get('/member/get/all?pageNum=' + pageNum).then(res => {
          const cbInfo = res.data.data
          if (res.data.code === 200) {
            const { list } = cbInfo
            const { pageCnt } = cbInfo
            this.memberData = list
            this.pageCnt = pageCnt
          }
        })
      } else {
        this.$http.get('/member/get/keyword?keyword=' + keyword + '&pageNum=' + pageNum).then(res => {
          const cbInfo = res.data.data
          if (res.data.code === 200) {
            const { list } = cbInfo
            const { pageCnt } = cbInfo
            this.memberData = list
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
      console.log(res)
      this.addMember.photo = url
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
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
