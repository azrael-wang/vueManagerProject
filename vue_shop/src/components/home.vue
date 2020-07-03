<template>
    <el-container>
        <el-header>
            <div class="logoBox">
                <img src="../assets/homeLogo.jpeg" alt="">
                <span>后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="isDrop ? '64px' : '200px'">
                <!-- 导航 -->
                <div class="Drop">
                  <template >
                    <i :class="isDrop ? 'el-icon-menu' : 'el-icon-s-grid'"
                    @click="toggleMenu"></i>
                  </template>
                </div>
                <el-menu
                default-active="/users"
                background-color="#D3DCE6"
                active-text-color="#409eff"
                unique-opened
                :collapse="isDrop"
                collapse-transition
                router
                >
                    <el-submenu :index="item.id + ''"
                    v-for="(item, index) in menuList"
                    :key="item.id">
                        <template slot="title">
                          <i :class="'iconfont ' + iconList[index]"
                          style="margin-right:8px;"></i>
                          <span>{{item.authName}}</span>
                        </template>
        <el-menu-item-group>
          <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children"
          :key="subItem.id"
          @click="saveNavState(subItem.path)"
          >
            <template>
            <i class="el-icon-apple"></i>
            <span>{{subItem.authName}}</span>
            </template>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
            </el-aside>
            <el-main>
              <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: null,
      iconList: [
        'icon-user',
        'icon-tijikongjian',
        'icon-shangpin',
        'icon-danju',
        'icon-baobiao',
      ],
      // TODO 做侧边栏收放
      isDrop: false,
      activePath: '',
    };
  },
  methods: {
    logout() {
      this.$router.push('/');
      window.sessionStorage.clear();
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus');
      if (res.meta.status === 200) {
        this.menuList = res.data;
        console.log(this.menuList);
      }
    },
    // TODO 保存导航链接 目的：刷新时当前导航高亮
    saveNavState(path) {
      window.sessionStorage.setItem('activePath', path);
      this.activePath = path;
    },
    toggleMenu() {
      this.isDrop = !this.isDrop;
    },
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem('activePath');
  },
};
</script>

<style lang="scss" scoped>
@keyframes move {
    0% {
        background-position: 0 0;
    }
    100% {
        /*宽度固定，如果为百分比背景不会滚动*/
        background-position: -300px 0;
    }
}

@media screen and (max-width: 700px) {
    .logoBox {
        img {
            width: 36px !important;
            height: 36px !important;
            border-radius: 18px !important;
            top: 12px !important;
        }
        span {
            margin-bottom: 0;
            font-size: 14px !important;
            margin-left: 12px !important;
            bottom: 0 !important;
        }
    }
}

.el-container {
    height: 100%;
    .el-header {
        background-color: #B3C0D1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .logoBox {
            height: 64px;
            img {
                display: inline-block;
                width: 48px;
                height: 48px;
                border-radius: 24px;
                border: 1px solid #fff;
                box-shadow: 0 0 16px #fff;
                position: relative;
                top: 6px;
            }
            span {
                color: white;
                font-size: 28px;
                font-weight: 700;
                margin-left: 28px;
                position: relative;
                bottom: 6px;
                /*设置背景渐变色*/
                background-image: linear-gradient(to right,
                grey,
                rgb(13, 144, 196),
                rgb(0, 217, 255),
                rgb(204, 15, 230),
                grey, rgb(13, 144, 196),
                rgb(0, 217, 255),
                rgb(204, 15, 230),
                grey, rgb(13, 144, 196),
                rgb(0, 217, 255),
                rgb(204, 15, 230), );
                /*chrome私有样式，加前缀，文字显示背景图片*/
                -webkit-background-clip: text;
                animation: move 5s infinite ease-in-out;
                /*文字颜色设为透明*/
                color: transparent;
                /*宽度固定*/
                width: 300px;
            }
        }
    }
    .el-aside {
        background-color: #D3DCE6;
        transition:  all .5s ease;
        .Drop {
          text-align: center;
          font-weight: 700;
        }
    }
    .el-main {
        background-color: #E9EEF3;
    }
}
</style>
