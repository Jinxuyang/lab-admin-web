<template>
  <div>
    <el-container>
      <el-container>
        <el-aside width="200px">
          <el-menu
            default-active="2"
            :router="true">
            <!--<el-menu-item index="/dashboard">
              <i class="el-icon-s-data"></i>
              <span slot="title">DashBoard</span>
            </el-menu-item>-->
            <el-menu-item index="/member">
              <i class="el-icon-user"></i>
              <span slot="title">成员管理</span>
            </el-menu-item>
            <el-menu-item index="/project">
              <i class="el-icon-s-claim"></i>
              <span slot="title">项目管理</span>
            </el-menu-item>
            <el-menu-item index="/direction">
              <i class="el-icon-s-flag"></i>
              <span slot="title">研究方向管理</span>
            </el-menu-item>
            <el-menu-item index="/homenews">
              <i class="el-icon-news"></i>
              <span slot="title">首页新闻管理</span>
            </el-menu-item>
            <el-menu-item index="/introduction">
              <i class="el-icon-collection"></i>
              <span slot="title">简介管理</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
  }
}
</script>

<style scoped>

</style>
