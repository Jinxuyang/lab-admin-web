<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/#/project">项目管理</a></el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>项目管理</span>
        <el-input v-model="searchContent" style="width: 15%;margin-left: 1%" placeholder="请输入内容"></el-input>
        <el-button @click="handleSearch(searchContent)" style="margin-left: 1%">检索</el-button>
        <el-button style="float: right" @click="showInsertProjectDialog">添加新项目</el-button>
      </div>
      <div class="text item">
        <template>
          <el-table
            :data="projectData"
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
              label="负责人"
              width="180">
              <template slot-scope="scope">
                <span>{{scope.row.manager}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="项目号"
              width="180">
              <template slot-scope="scope">
                <span>{{scope.row.number}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="开始时间"
              width="180">
              <template slot-scope="scope">
                <span>{{scope.row.start}}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="结束时间"
              width="180">
              <template slot-scope="scope">
                <span>{{scope.row.start}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="是否完成"
              width="180">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="projectStatusChange(scope.row)">
                </el-switch>
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
                  @change="projectStatusChange(scope.row)">
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
      <el-form :model="editProject">
        <el-form-item label="ID" >
          <el-input  v-model="editProject.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="姓名" >
          <el-input  v-model="editProject.name"></el-input>
        </el-form-item>
        <el-form-item label="负责人" >
          <el-input  v-model="editProject.manager"></el-input>
        </el-form-item>
        <el-form-item label="项目号" >
          <el-input  v-model="editProject.number"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" >
          <el-input  v-model="editProject.start"></el-input>
        </el-form-item>
        <el-form-item label="结束时间" >
          <el-input  v-model="editProject.end"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editProjectMe(editProject)">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加成员" :visible.sync="addDialogFormVisible">
      <el-form :model="addProject" ref="insertFormRef">
        <el-form-item label="姓名" >
          <el-input  v-model="addProject.name"></el-input>
        </el-form-item>
        <el-form-item label="负责人" >
          <el-input  v-model="addProject.manager"></el-input>
        </el-form-item>
        <el-form-item label="项目号" >
          <el-input  v-model="addProject.number"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" >
          <el-input  v-model="addProject.start"></el-input>
        </el-form-item>
        <el-form-item label="结束时间" >
          <el-input  v-model="addProject.end"></el-input>
        </el-form-item>
        <el-form-item label="是否完成" >
          <el-switch
            v-model="addProject.isLeader"
            active-color="#13ce66"
            inactive-color="#ff4949"
            name="is_show">
          </el-switch>
        </el-form-item>
        <el-form-item label="是否展示" >
          <el-switch
            v-model="addProject.isShow"
            active-color="#13ce66"
            inactive-color="#ff4949"
            name="is_leader">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addProjectMe(addProject)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Project',
  data () {
    return {
      searchContent: '',
      pageCnt: 0,
      projectData: [],
      editProject: {
        id: '', name: '', manager: '', number: '', start: '', end: ''
      },
      addProject: {
        name: '', manager: '', number: '', start: '', end: '', isShow: true, status: false
      },
      addDialogFormVisible: false,
      editDialogFormVisible: false
    }
  },
  created () {
    this.getProjectList()
  },
  methods: {
    handleSearch (searchContent) {
      this.getProjectList(searchContent)
    },
    showEditDialog (index, row) {
      this.editDialogFormVisible = !this.editDialogFormVisible
      this.editProject = row
    },
    handleDelete (index, row) {
      this.$http.delete('/project/' + row.id).then(res => {
        if (res.data.code === 200) {
          this.$message.success('删除成功')
          this.getProjectList()
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    showInsertProjectDialog () {
      this.addDialogFormVisible = !this.addDialogFormVisible
    },
    editProjectMe (editFormData) {
      const param = JSON.stringify(editFormData)
      this.$http.put('/project/' + editFormData.id, param, { headers: { 'Content-Type': 'application/json' } }).then(res => {
        if (res.data.code === 200) {
          this.$message.success('修改成功')
        } else {
          this.$message.error('修改失败')
        }
      })

      this.editDialogFormVisible = false
    },
    addProjectMe (addFormData) {
      const param = JSON.stringify(addFormData)
      this.$http.post('/project/insert', param, { headers: { 'Content-Type': 'application/json' } }).then(res => {
        if (res.data.code === 200) {
          this.getProjectList()
          this.$message.success('修改成功')
        } else {
          this.$message.error('修改失败')
        }
      })
      this.addDialogFormVisible = false
    },
    handleCurrentPageChange (page) {
      this.getProjectList('', page)
    },
    projectStatusChange (row) {
      this.$http.put('/project/' + row.id, { isShow: row.isShow, isLeader: row.isLeader }).then(res => {
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
    getProjectList (keyword = '', pageNum = 1) {
      if (keyword === '') {
        this.$http.get('/project/get/all?pageNum=' + pageNum).then(res => {
          const cbInfo = res.data.data
          if (res.data.code === 200) {
            const { list } = cbInfo
            const { pageCnt } = cbInfo
            this.projectData = list
            this.pageCnt = pageCnt
          }
        })
      } else {
        this.$http.get('/project/get/keyword?keyword=' + keyword + '&pageNum=' + pageNum).then(res => {
          const cbInfo = res.data
          if (res.data.code === 200) {
            const { list } = cbInfo
            const { pageCnt } = cbInfo
            this.projectData = list
            this.pageCnt = pageCnt
          }
        })
      }
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
