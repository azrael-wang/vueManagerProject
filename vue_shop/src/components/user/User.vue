<template>
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片视图 -->
      <el-card >
        <el-row :gutter="14" style="margin-bottom:24px;">
            <el-col :span="8">
                <el-input placeholder="请输入内容"
                class="input-with-select"
                v-model="queryInfo.query"
                clearable
                @clear="inputClear"
                >
                     <el-button slot="append" icon="el-icon-search"
                     @click="getUserList"
                     ></el-button>
                </el-input>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" @click="addUserVisible = true">添加用户</el-button>
            </el-col>
        </el-row>
        <!-- 表格 -->
        <el-row>
            <el-col :span="24">
              <el-table
              :data="userList"
              border
              stripe
              fit
              >
                <el-table-column
                type="index"
                label="#"
                >
                </el-table-column>
                <el-table-column
                prop="username"
                label="姓名"
                >
                </el-table-column>
                <el-table-column
                prop="email"
                label="邮箱"
                >
                </el-table-column>
                <el-table-column
                prop="mobile"
                label="电话"
                >
                </el-table-column>
                <el-table-column
                prop="role_name"
                label="角色"
                >
                </el-table-column>
                <el-table-column
                prop="mg_state"
                label="状态"
                >
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.mg_state"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="userStateChange(scope.row)">
                  </el-switch>
                </template>
                </el-table-column>
                <el-table-column
                label="操作"
                >
                  <el-tooltip
                  content="编辑"
                  placement="top"
                  :enterable="false"
                  >
                    <el-button class="el-icon-edit"
                    type="primary"
                    size="mini"
                    circle
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip
                  content="删除"
                  placement="top"
                  :enterable="false"
                  >
                    <el-button class="el-icon-delete"
                    type="danger"
                    size="mini"
                    circle
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip
                  content="分配角色"
                  placement="top"
                  :enterable="false"
                  >
                    <el-button class="el-icon-setting"
                    type="info"
                    size="mini"
                    circle
                    ></el-button>
                  </el-tooltip>

                </el-table-column>
              </el-table>
            </el-col>
        </el-row>
        <!-- 分页 -->
        <el-row >
          <el-col :span="24">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[2, 5, 10, 20]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-col>
        </el-row>
      </el-card>
      <el-dialog
        title="添加用户"
        :visible.sync="addUserVisible"
        width="50%"
        @close="addDialogClosed"
        >
        <!-- 内容区域 -->
        <el-form
        :model="addUserForm"
        status-icon
        :rules="addUserRules"
        ref="addUserFormRef"
        label-width="100px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUserForm.username" clearable></el-input>
          </el-form-item>
           <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="addUserForm.password" clearable></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input
            v-model="addUserForm.email"
            clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input
            v-model="addUserForm.mobile"
            clearable
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addUserVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    const checkEmail = (rule, value, cb) => {
      // 验证邮箱
      const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error('请输入正确的邮箱'));
      return false;
    };
    const checkMobile = (rule, value, cb) => {
      // 验证邮箱
      const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error('请输入合法手机号'));
      return false;
    };
    return {
      userList: [],
      total: 0,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      // 添加用户弹框
      addUserVisible: false,
      // TODO 添加用户表单对象
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // TODO 添加用户表单验证对象
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 1,
            max: 12,
            message: '长度在 1 到 12 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users',
        { params: this.queryInfo });
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error('数据获取失败');
      this.userList = res.data.users;
      this.total = res.data.total;
      return false;
    },
    handleSizeChange(curPageSize) {
      this.queryInfo.pagesize = curPageSize;
      this.getUserList();
    },
    handleCurrentChange(curPage) {
      this.queryInfo.pagenum = curPage;
      this.getUserList();
    },
    async userStateChange(UserParams) {
      const userInfo = UserParams;
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`,
      );
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error(res.meta.msg);
      }
      return this.$message.success(res.meta.msg);
    },
    // TODO 清空输入框
    inputClear() {
      this.queryInfo.query = '';
      this.getUserList();
    },
    // TODO 监听添加用户对话框得关闭事件
    addDialogClosed() {
      // TODO 从表单得ref中调用resetFields() 方法清除验证，和表单数据
      this.$refs.addUserFormRef.resetFields();
    },
    // TODO 添加用户
    addUser() {
      this.$refs.addUserFormRef.validate(async (vaild) => {
        if (!vaild) return this.$message.error('用户信息不完整');
        // TODO 验证成功
        const { data: res } = await this.$http.post('users', this.addUserForm);
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
        // TODO 关闭对话框
        this.addUserVisible = false;
        // TODO 刷新列表
        this.getUserList();
        return false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .el-breadcrumb {
      margin-bottom: 12px;
  }
  .el-card {
    box-shadow: 2px 2px 6px #ddd !important;
  }
  .el-pagination {
    margin-top: 12px;
  }
</style>
