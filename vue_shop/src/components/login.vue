<template>
<div class="loginbg">
    <div class="loginBox">
        <div class="avatar_box">
            <img src="@/assets/welcomeLogo.gif" alt />
        </div>
        <el-form :inline="false"
        :model="formData"
        :rules="loginFormRules"
        ref="loginFormRef"
        class="demo-form-inline">
            <el-form-item prop="uname">
                <el-input class="inputBox"
                v-model="formData.uname"
                prefix-icon="iconfont icon-user"></el-input>
            </el-form-item>
            <el-form-item  prop="password">
                <el-input class="inputBox"
                v-model="formData.password"
                prefix-icon="iconfont icon-lock_fill" type="password"></el-input>
            </el-form-item>
        </el-form>
        <div class="buttonComponent">
            <el-button type="primary" @click="goSubmit('loginFormRef')">登录</el-button>
            <el-button type="info" @click="resetVal('loginFormRef')">重置</el-button>
        </div>
    </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      /*  // TODO 登录表单得数据 在form表单元素上定义表单接收对象
      *  // TODO 在每一个表单元素上绑定表单对象内得具体数据
      */
      formData: {
        uname: 'admin',
        password: '123456',
      },
      // TODO 表单验证规则对象
      loginFormRules: {
        // TODO 验证用户名
        uname: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur',
        },
        {
          min: 3,
          max: 5,
          message: '长度在 3 到 5 个字符',
          trigger: 'blur',
        },
        ],
        // TODO 验证密码
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur',
        },
        {
          min: 6,
          max: 15,
          message: '长度在 6 到 15 个字符',
          trigger: 'blur',
        },
        ],
      },
    };
  },
  methods: {
    // TODO 登录方法
    goSubmit(refName) {
      this.$refs[refName].validate(async (valid) => {
        if (!valid) return false;
        const { data: res } = await this.$http.post('login', {
          username: this.formData.uname,
          password: this.formData.password,
        });
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error('登录失败');
        this.$message.success('登录成功');
        // TODO 保存登录后得token
        window.sessionStorage.setItem('token', res.data.token);
        this.$router.push('/home');
        return false;
      });
    },
    // TODO 重置方法
    resetVal(refName) {
      this.$refs[refName].resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.loginbg {
    background-color: #2b4b6b;
    height: 100%;

    .loginBox {
        width: 450px;
        height: 300px;
        border-radius: 8px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #ffffff;
        box-shadow: 0 0 10px #fff;

        .avatar_box {
            height: 130px;
            width: 130px;
            border: 1px solid #fff;
            border-radius: 50%;
            box-shadow: 0 0 10px #fff;
            position: absolute;
            top: -65px;
            left: 50%;
            margin-left: -65px;

            img {
                display: block;
                height: 100%;
                border-radius: 50%;
            }
        }

        .demo-form-inline {
            margin-top: 100px;
            padding: 0 28px 0 28px;

            .inputBox {
                box-sizing: border-box;
            }
        }

        .buttonComponent {
            position: absolute;
            right: 28px;
            bottom: 28px;
        }
    }
}
</style>
