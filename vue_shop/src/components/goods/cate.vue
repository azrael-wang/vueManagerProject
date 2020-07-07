<template>
  <div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="mt24">
        <el-button type="primary" @click="addCate">添加分类</el-button>
        <zk-table
        class="mt24"
        ref="cateTable"
        :data="catesList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
        >
          <template slot="isOk" slot-scope="scope">
            <i class="el-icon-circle-check"
            style="color:lightgreen"
            v-if="!scope.row.cat_deleted"
            ></i>
            <i class="el-icon-circle-close"
            style="color:block"
            v-else
            ></i>
          </template>
          <template slot="sortTemplate" slot-scope="scope">
          <el-tag type="success"
          v-if="scope.row.cat_level === 0"
          >一级</el-tag>
          <el-tag type="warning"
          v-else-if="scope.row.cat_level === 1"
          >二级</el-tag>
          <el-tag type="danger"
          v-else
          >三级</el-tag>
          </template>
          <template slot="opt">
          <el-button type="primary">
          <i class="el-icon-edit">编辑</i>
          </el-button>
          <el-button type="danger">
          <i class="el-icon-delete">删除</i>
          </el-button>
          </template>
        </zk-table>
        <el-pagination
          class="mt24"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="queryInfo.pagenum"
          :page-size="queryInfo.pagesize"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
      <!-- 添加分类弹框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addVisible"
        width="50%"
        @close="cascaderClose"
        >
        <el-form ref="addFrom"
        :model="addFromVal"
        :rules="addFromRules"
        >
          <el-row>
            <el-col :span='12'>
              <el-form-item
              label="分类名称"
              prop="cat_name"
              >
                <el-input v-model="addFromVal.cat_name" placeholder="请输入分类名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
           <el-row>
            <el-col :span='12'>
              <el-form-item>
              <el-cascader
              ref="cascaderRef"
              :options="cascaderList"
              placeholder="请选择分类项"
              clearable
              show-all-levels
              change-on-select
              v-model="cascaderSelList"
              :props="cascaderProps"
              @change="cascaderChange"
              ></el-cascader>
          </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="addFromSubmit">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catesList: [],
      total: 0,
      addVisible: false,
      addFromVal: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0,
      },
      // TODO 级联选择器
      cascaderList: [],
      cascaderSelList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      addFromRules: {
        cat_name: [
          {
            required: true, message: '请输入活动名称', trigger: 'blur',
          },
          {
            min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur',
          },
        ],
      },
      // TODO 商品分类table数据
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // TODO table-tree 列规则
      columns: [
        {
          label: '商品名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk',
        },
        {
          label: '排序',
          type: 'template',
          template: 'sortTemplate',
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt',
        },
      ],
    };
  },
  created() {
    this.getCatesList();
  },
  methods: {
    // TODO 获取分类列表
    async getCatesList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.catesList = res.data.result;
      this.total = res.data.total;
      return false;
    },
    // TODO 分页处理函数
    handleSizeChange(newPageSize) {
      this.pagesize = newPageSize;
      this.getCatesList();
    },
    handleCurrentChange(newPage) {
      this.pagenum = newPage;
      this.getCatesList();
    },
    // TODO 获取级联选择器数据
    async addCate() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.cascaderList = res.data;
      this.addVisible = true;
      return false;
    },
    // TODO 级联选择器change事件
    cascaderChange(val) {
      if (val.length === 0) {
        this.addFromVal.cat_pid = 0;
        this.addFromVal.cat_level = 0;
        this.cascaderSelList = [];
      } else {
        this.addFromVal.cat_pid = val[val.length - 1];
        this.addFromVal.cat_level = val.length;
      }
    },
    // TODO 添加分类dialog关闭
    cascaderClose() {
      this.$refs.addFrom.resetFields();
      this.addFromVal.cat_name = '';
      this.addFromVal.cat_pid = 0;
      this.addFromVal.cat_level = 0;
      this.cascaderSelList = [];
    },
    // TODO 分类提交
    async addFromSubmit() {
      const bool = await this.$refs.addFrom.validate()
        .catch((err) => err);
      if (!bool || this.cascaderSelList.length === 0) return this.$message.error('表单认证失败');
      const { data: res } = await this.$http.post('categories', this.addFromVal);
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.getCatesList();
      this.addVisible = false;
      return false;
    },
  },
};
</script>

<style lang="scss">

</style>
