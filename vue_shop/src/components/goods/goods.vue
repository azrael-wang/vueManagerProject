<template>
  <div class="class-name">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="mt24">
        <el-row :gutter="20">
            <el-col :span="12">
              <el-input
              class="searchCss"
              placeholder="请输入内容"
              clearable
              v-model="queryInfo.query"
              @clear="getGoodsList"
              >
                <el-button
                slot="append"
                icon="el-icon-search"
                @click="getGoodsList"
                ></el-button>
              </el-input>
              <el-button
              type="primary"
              round
              plain
              @click="goodAdd"
              >添加商品</el-button>
            </el-col>
        </el-row>
        <!-- table表格 -->
        <el-table
        stripe
        border
        class="mt24"
        :data="goodsList"
        :header-cell-style="{'text-align': 'center'}"
        :cell-class-name="columnStyle"
        >
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column
          label="商品名称"
          prop="goods_name"
          width="520px"
          ></el-table-column>
          <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          ></el-table-column>
          <el-table-column
          label="商品数量"
          prop="goods_number"
          ></el-table-column>
          <el-table-column
          label="创建时间"
          prop="add_time"
          width="160px"
          >
            <template slot-scope="scope">
              {{scope.row.add_time | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column
          label="操作"
          width="130px"
          >
            <template slot-scope="scope">
              <el-button
              type="primary"
              round
              plain
              icon="el-icon-edit"
              size="small"
              @click="showEdit(scope.row)"
              ></el-button>
               <el-button
              type="warning"
              round
              plain
              icon="el-icon-delete"
              size="small"
              @click="goodsDel(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="mt24">
          <el-col :span=12 :offset="8">
              <el-pagination
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
                :total="total">
              </el-pagination>
          </el-col>
        </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // todo 搜索内容/数据列表/搜索条件
      sreachVal: '',
      goodsList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 6,
      },
      total: 0,
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.goodsList = res.data.goods;
      this.total = res.data.total;
      this.$message.success(res.meta.msg);
      return undefined;
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    columnStyle() {
      return 'columnStyle';
    },
    // todo 删除
    async goodsDel(row) {
      const confirm = await this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .catch((err) => err);
      if (confirm !== 'confirm') return this.$message.info('不删你丫点个蛋');
      const { data: res } = await this.$http.delete(`goods/${row.goods_id}`);
      if (res.meta.status !== 200) return this.$message.error('别tm点了，服务器点爆了');
      this.$message.success('这可就删了，别tm后悔');
      this.getGoodsList();
      return false;
    },
    // todo 添加商品
    goodAdd() {
      this.$router.push('/goods/add');
    },
  },
};
</script>

<style lang="scss">
  .columnStyle {
    font-size: 12px;
    text-align: left;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }
  .el-table .cell {
    white-space: nowrap !important;
  }
  .searchCss {
    width: 320px !important;
    margin-right: 24px;
  }
</style>
