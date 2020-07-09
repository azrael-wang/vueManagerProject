<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="mt24">
      <el-row>
        <el-col :span="4">
          <el-alert
            title="有情提示"
            type="warning"
            description="只能选择三级类目">
          </el-alert>
        </el-col>
      </el-row>
      <!-- 分类选择 -->
      <el-row class="mt24">
        <el-col :span="8">
        <span>请选择分类： </span>
          <el-cascader
            clearable
            v-model="cascaderList"
            :options="paramsList"
            :props="caProps"
            @change="handleChange"
            :show-all-levels="false"
            >
          </el-cascader>
        </el-col>
      </el-row>
      <!-- 添加 -->
      <el-row class="mt24">
        <el-col :span="20">
          <el-tabs
          type="border-card"
          v-model="tabsName"
          @tab-click="tabChange"
          >
            <el-tab-pane label="动态参数"
            name="many"
            >
              <el-button type="primary" size="mini"
              round
              plain
              icon="el-icon-edit"
              :disabled="addIsDisable"
              @click="addVisible = true"
              >添加参数</el-button>
              <!-- many/only表格 -->
              <el-table
              border
              ref="dyTabRef"
              class="mt24"
              :header-cell-style="{'text-align': 'center'}"
              :cell-style="{'text-align': 'center'}"
              :data="manyTabsData"
              @expand-change="dyExpandChange"
              >
              <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i"
                class="mr12 mb12"
                plain
                round
                closable
                :disable-transitions="false"
                @close="handleTagClose(scope.row, i)"
                >
                {{item}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput"
                >+ New Tag</el-button>
              </template>
              </el-table-column>
              <el-table-column type="index"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary"
                  plain
                  round
                  closable
                  size="mini"
                  @click="manyEdit(scope.row.attr_id)"
                  >
                  <i class="el-icon-edit">编辑</i>
                  </el-button>
                    <el-button type="danger"
                  plain
                  round
                  size="mini"
                  @click="manyDel(scope.row.attr_id)"
                  >
                  <i class="el-icon-delete">删除</i>
                  </el-button>
                </template>
              </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态参数"
            name="only"
            >
              <el-button type="primary" size="mini"
              round
              plain
              icon="el-icon-edit"
              :disabled="addIsDisable"
              @click="addVisible = true"
              >添加属性</el-button>
              <el-table
              border
              class="mt24"
              ref="stTabRef"
              :header-cell-style="{'text-align': 'center'}"
              :cell-style="{'text-align': 'center'}"
              :data="onlyTabsData"
              @expand-change="stExpandChange"
              >
                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i"
                      class="mr12 mb12"
                      plain
                      round
                      closable
                      :disable-transitions="false"
                      @close="handleTagClose(scope.row, i)"
                      >
                      {{item}}
                      </el-tag>
                      <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                      >
                      </el-input>
                      <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput"
                      >+ New Tag</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column type="index"></el-table-column>
                  <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="primary"
                      plain
                      round
                      size="mini"
                      @click="manyEdit(scope.row.attr_id)"
                      >
                      <i class="el-icon-edit"
                      >编辑</i>
                      </el-button>
                        <el-button type="danger"
                          plain
                          round
                          size="mini"
                          @click="manyDel(scope.row.attr_id)"
                          >
                          <i class="el-icon-delete">删除</i>
                      </el-button>
                    </template>
                  </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-card>
    <!-- tabs添加参数弹框 -->
    <el-dialog
      :title="addTitle"
      :visible.sync="addVisible"
      width="50%"
      @close="addClose"
      >
      <el-form
      :model="addFormData"
      ref="addFormRef"
      :rules="addRulse"
      >
        <el-form-item
        prop="cate_name"
        label="分类名称："
        width="200px"
        >
        <el-input  v-model="addFormData.cate_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- tabs修改参数弹框 -->
     <el-dialog
      title="编辑参数"
      :visible.sync="editVisible"
      width="50%"
      @close="editClose"
      >
      <el-form
      :model="editFormData"
      ref="editFormRef"
      :rules="editRulse"
      >
        <el-form-item
        prop="attr_name"
        label="分类名称："
        width="200px"
        >
        <el-input  v-model="editFormData.attr_name"></el-input>
        </el-form-item>
      </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /*
      ! paramsList 分类数据列表
      * cascaderList 分类选择列表
      ? tabsName 导航栏数据
      todo addVisible 添加分类显隐
      */
      paramsList: [],
      cascaderList: [],
      caProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      tabsName: 'many',
      manyTabsData: [],
      onlyTabsData: [],
      addVisible: false,
      addFormData: {
        cate_name: '',
      },
      editVisible: false,
      editFormData: {
        attr_name: '',
      },
      addRulse: {
        cate_name: [
          {
            required: true, message: '你他妈到是写呀__Fuck!`Fuck~`Fuck***', trigger: 'blur',
          },
          {
            min: 1, max: 20, message: '太多太少都不好1-20为整好', trigger: 'blur',
          },
        ],
      },
      editRulse: {
        attr_name: [
          {
            required: true, message: '你他妈到是写呀__Fuck!`Fuck~`Fuck***', trigger: 'blur',
          },
          {
            min: 1, max: 20, message: '太多太少都不好1-20为整好', trigger: 'blur',
          },
        ],
      },
      // ? tag标签数据
      inputVisible: false,
      inputValue: '',
    };
  },
  created() {
    this.getParamsList();
  },
  methods: {
    async getParamsList() {
      const { data: res } = await this.$http.get('categories');
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.paramsList = res.data;
      return false;
    },
    handleChange(val) {
      if (val.length !== 3) return this.$message.error('请选择三级分类');
      this.$message.success('还是你会玩');
      this.cascaderList = val[val.length - 1];
      this.getTabsParams();
      return false;
    },
    tabChange() {
      this.getTabsParams();
    },
    async getTabsParams() {
      const _ = this;
      const { data: res } = await _.$http.get(`categories/${_.cateId}/attributes`, {
        params: { sel: _.tabsName },
      });
      if (res.meta.status !== 200) return _.$message.error(res.meta.msg);
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals === '' ? '' : item.attr_vals.split(' ');
      });
      if (_.tabsName === 'many') {
        this.manyTabsData = res.data;
      } else {
        this.onlyTabsData = res.data;
      }
      _.$message.success(res.meta.msg);
      return false;
    },
    // ? 弹框关闭事件
    addClose() {
      this.addVisible = false;
      this.$refs.addFormRef.clearValidate();
      this.addFormData.cat_name = '';
    },
    // ? 表单提交
    async addSubmit() {
      const validateConfirm = await this.$refs.addFormRef.validate();
      if (!validateConfirm) return this.$message.error('瞎鸡巴写，还想添加。姥姥');
      const { data: res } = await this.$http.post(
        `categories/${this.cateId}/attributes`,
        {
          attr_name: this.addFormData.cate_name,
          attr_sel: this.tabsName,
        },
      );
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
      this.getTabsParams();
      this.$message.success(res.meta.msg);
      this.addVisible = false;
      return false;
    },
    // ? 编辑
    async manyEdit(id) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`,
        {
          params: { attr_sel: this.tabsName },
        });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.editVisible = true;
      this.editFormData = res.data;
      return false;
    },
    editClose() {
      this.$refs.editFormRef.clearValidate();
      this.addFormData.attr_name = '';
    },
    async editSubmit() {
      const validateFirm = this.$refs.editFormRef.validate();
      if (!validateFirm) return this.$message.error('瞎鸡巴写，还想添加。姥姥');
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editFormData.attr_id}`,
        {
          attr_name: this.editFormData.attr_name,
          attr_sel: this.tabsName,
        });
      this.getTabsParams();
      this.editVisible = false;
      this.$message.success(res.meta.msg);
      return false;
    },
    async manyDel(id) {
      const confirm = await this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .catch((err) => err);
      if (confirm !== 'confirm') return this.$message.info('不删你丫点个蛋');
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`);
      if (res.meta.status !== 200) return this.$message.error('别tm点了，服务器点爆了');
      this.$message.success('这可就删了，别tm后悔');
      this.getTabsParams();
      return false;
    },
    // ? tag标签添加删除
    async handleTagClose(row, i) {
      row.attr_vals.splice(i, 1);
      this.tagsPutDelete(row);
    },
    async handleInputConfirm(row) {
      this.inputVisible = false;
      if (this.inputValue.trim() === '') return undefined;
      row.attr_vals.push(this.inputValue.trim());
      this.tagsPutDelete(row);
      return undefined;
    },
    // todo 添加删除tag标签请求方法
    async tagsPutDelete(row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' '),
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.getTabsParams();
      this.inputValue = '';
      this.$message.success(res.meta.msg);
      return undefined;
    },
    // todo 解决展开行同时展开多行bug
    dyExpandChange(row, expandedRows) {
      const that = this;
      if (expandedRows.length > 1) {
        that.$refs.dyTabRef.toggleRowExpansion(expandedRows[0]);
      }
    },
    stExpandChange(row, expandedRows) {
      const that = this;
      if (expandedRows.length > 1) {
        that.$refs.stTabRef.toggleRowExpansion(expandedRows[0]);
      }
    },
    // ? 让文本框自动获得焦点
    showInput() {
      this.inputVisible = true;
      // ! 通过v-if 显隐得元素需要重新渲染，$nextTick元素渲染得回调。此时元素已经完成渲染，即可获得$refs
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
  },
  computed: {
    addIsDisable() {
      if (this.cascaderList.length !== 0) {
        return false;
      }
      return true;
    },
    cateId() {
      if (this.cascaderList.length !== 0) {
        return this.cascaderList;
      }
      return '';
    },
    addTitle() {
      if (this.tabsName === 'many') {
        return '添加动态弹框';
      }
      return '添加静态弹框';
    },
  },
  watch: {
    cascaderList(newVal) {
      if (newVal.length === 0) {
        this.manyTabsData = [];
        this.onlyTabsData = [];
      }
    },
  },
};
</script>

<style lang="scss">
  .input-new-tag {
    width: 120px !important;
  }
</style>
