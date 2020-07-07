<template>
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
      <el-table
      :data="rightsList"
      border
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'left'}"
      :row-class-name="tableRowClassName"
      width="50%"
      >
        <el-table-column
        type="index"
        label="#"
        >
        </el-table-column>
        <el-table-column
        property="authName"
        label="权限说明"
        >
        </el-table-column>
        <el-table-column
        prop="path"
        label="路径"
        >
        </el-table-column>
         <el-table-column
        prop="level"
        label="权限等级"
        >
        <template slot-scope="scope">
          <el-tag
          v-if="scope.row.level == 0 "
          >一级</el-tag>
          <el-tag type="success"
          v-else-if="scope.row.level == 1 "
          >二级</el-tag>
          <el-tag type="warning"
          v-else
          >三级</el-tag>
        </template>
        </el-table-column>
      </el-table>
      </el-card>
    </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: [],
    };
  },
  methods: {
    async getRightList() {
      const { data: res } = await this.$http.get('/rights/list');
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      // console.log(res.data);
      this.rightsList = res.data;
      this.$message.success(res.meta.msg);
      return false;
    },
    tableRowClassName({ rowIndex }) {
      let val;
      if (rowIndex % 2 === 0) {
        val = 'warning-row';
      } else if (rowIndex % 2 === 1) {
        val = 'success-row';
      }
      return val;
    },
  },
  created() {
    this.getRightList();
  },
};
</script>

<style lang="scss" scoped>

.el-breadcrumb {
  margin-bottom: 24px;
}
.cellStyle {
  text-align: center;
}
</style>
