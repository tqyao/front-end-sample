<template>
  <el-container class="home_container">
    <!--    头部区域-->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <span>XX后台管理系统</span>
      </div>
      <el-button @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!--      侧边栏-->
      <el-aside :width="collapse ? '64px' : '200px'">
        <!--        侧边栏菜单-->
        <div class="toggle-button" @click="isCollapse">|||</div>
        <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#409EFF"
            unique-opened
            :collapse="collapse" :collapse-transition="false"
            :default-active="defaultActive"
            router>

          <!--          一级菜单-->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
<!--              iconsObj[item.id]-->
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!--            二级菜单-->
            <el-menu-item :index="'/' + child.path + ''" v-for="child in item.children"
                          :key="child.id" @click="activeItem(child.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ child.authName }}</span>
              </template>
            </el-menu-item>

          </el-submenu>

        </el-menu>
      </el-aside>
      <!--      主题区域-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      defaultActive: '',
      collapse: false,
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      }
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const {data: res} = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    isCollapse(){
      this.collapse = !this.collapse
    },
    activeItem(path){
      this.defaultActive = '/' + path
      window.sessionStorage.setItem('activePath', this.defaultActive)
    }
  },
  created() {
    this.getMenuList()
    this.defaultActive = window.sessionStorage.getItem('activePath')
  }
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}

.el-header {
  background-color: #373c41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;

  img {
    width: 15%;
  }

  > div {
    display: flex;
    align-items: center;
  }

  span {
    margin-left: 15px;
  }
}

.el-aside {
  background-color: #323744;
  .el-menu {
    border-right: 0;
  }
}

.el-main {
  background-color: #eaedf2;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>