<template>
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table
        class="mt24 eltable"
        :data="rolesList"
        border
        stripe
        :header-cell-style="{'text-align': 'center'}"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
          <el-row v-for="(_item) in scope.row.children" :key="_item.id"
          class="alcenter bdtop"
          >
            <el-col :span="4"
            >
              <el-tag type="primary"
                closable
                @close="tagClose(scope.row, _item.id)"
              >{{_item.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="20" >
              <el-row v-for="(__item, __index) in _item.children" :key="__item.id"
              :class="[__index === 0 ? '' : 'bdtop', 'alcenter']"
              >
                <el-col :span="6">
                <el-tag
                  type="success"
                  closable
                  @close="tagClose(scope.row, __item.id)"
                >{{__item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span='18'>
                <el-tag
                  type="warning"
                  closable
                  @close="tagClose(scope.row, ___item.id)"
                  v-for="___item in __item.children" :key="___item.id"
                >{{___item.authName}}</el-tag>
              </el-col>
              </el-row>
            </el-col>
          </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column
        prop="roleName"
        label="角色名称"
        ></el-table-column>
         <el-table-column
          label="角色描述"
          prop="roleDesc"
        ></el-table-column>
        <el-table-column
        label="操作"
        >
        <template slot-scope="scope">
          <el-button type="primary">
        <i class="el-icon-edit">编辑</i>
        </el-button>
        <el-button type="danger">
        <i class="el-icon-delete">删除</i>
        </el-button>
        <el-button type="warning">
        <i class="el-icon-setting" @click="getRightsList(scope.row)">分配角色</i>
        </el-button>
        </template>
        </el-table-column>
      </el-table>
      </el-card>
      <!--分配权限弹框-->
      <el-dialog
        title="分配权限"
        :visible.sync="dialogRights"
        width="30%"
        @close="rightsSelectedList = []"
        >
        <el-tree
          :data="rightsList"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="rightsSelectedList"
          :props="defaultProps"
          icon-class="el-icon-arrow-right"
          ref="rightTree"
          >
        </el-tree>
        <span slot="footer" class="dialog-footer">
      <el-button @click="dialogRights = false">取 消</el-button>
      <el-button type="primary" @click="dialogConfirm">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      // TODO 角色列表
      rolesList: [],
      // TODO 权限显示弹框
      dialogRights: false,
      // TODO 权限列表
      rightsList: [],
      // TODO 权限树显示规则 el-Tree规则
      defaultProps: {
        label: 'authName',
        children: 'children',
      },
      // TODO el-Tree（权限树） 默认选中数组
      rightsSelectedList: [],
    };
  },
  created() {
    // TODO 获取用户数据
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles');
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.rolesList = res.data;
      this.$message.success(res.meta.msg);
      return false;
    },
    async tagClose(role, id) {
      const confirmRu = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err);
      console.log(confirmRu);
      if (confirmRu !== 'confirm') {
        return this.$message.info('取消删除');
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败');
      }
      this.getRolesList();
      this.$message.success('删除成功');
      return false;
    },
    async getRightsList(role) {
      this.roleId = role.id;
      const { data: res } = await this.$http.get('rights/tree');
      // console.log('role');
      // console.log(role);
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.rightsList = res.data;
      this.getThreeTreeId(role, this.rightsSelectedList);
      this.dialogRights = true;
      this.$message.success(res.meta.msg);
      return false;
    },
    async dialogConfirm() {
      this.dialogRights = false;
      const refTree = this.$refs.rightTree;
      const ids = [...refTree.getHalfCheckedKeys(), ...refTree.getCheckedKeys()].join(',');
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: ids });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.getRolesList();
      this.$message.success(res.meta.msg);
      return false;
    },
    getThreeTreeId(node, arr) {
      if (!node.children) {
        arr.push(node.id);
      } else {
        node.children.forEach((item) => this.getThreeTreeId(item, arr));
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .el-breadcrumb {
    margin-bottom: 24px;
  }
  .rolesManger {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .eltable {
    .el-tag {
      margin-right: 24px;
      margin-bottom: 12px;
    }
    .alcenter {
      display: flex;
      align-items: center;
      padding-top: 12px;
    }
    .bdtop {
      border-top: 1px solid #ccc;
    }
  }
</style>
