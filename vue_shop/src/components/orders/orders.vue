<template>
  <div class="class-name">
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card
      class="mt24"
    >
      <el-row>
        <el-col :span=8>
          <el-input
          placeholder="请输入检索内容"
          v-model="queryInfo.query"
          clearable
          >
            <el-button
            slot="append"
            icon="el-icon-search"
            @click="getOdersList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-row class="mt24">
        <el-col :span=24>
          <el-table
          :data="ordersList"
          border
          stripe
          :header-cell-style="{'text-align': 'center'}"
          :cell-class-name="columnStyle"
          >
          <el-table-column
          type="index"
          label="#"
          ></el-table-column>
          <el-table-column
          label="订单编号"
          prop="order_number"
          ></el-table-column>
          <el-table-column
          label="订单价格"
          prop="order_price"
          ></el-table-column>
          <el-table-column
          label="是否付款"
          >
            <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
              <el-tag v-else type="success">已付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column
          label="是否发货"
          prop="is_send"
          >
           <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.is_send === '否'">未发货</el-tag>
              <el-tag v-else type="success">已发货</el-tag>
            </template>
          </el-table-column>
          <el-table-column
          label="下单时间"
          >
            <template slot-scope="scope">
              {{scope.row.update_time | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column
          label="操作"
          >
            <template slot-scope="scope">
            <el-button
            type="primary"
            round
            plain
            size="mini"
            icon="el-icon-edit"
            @click="edit(scope.row)"
            >
            </el-button>
            <el-button
            type="success"
            round
            plain
            size="mini"
            icon="el-icon-location"
            @click="showProgressBox"
            >
             </el-button>
            </template>
          </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row class="mt24">
        <el-col>
          <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[2, 5, 10]"
          :page-size="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          >
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>
    <!-- 编辑 -->
    <el-dialog
      title="编辑"
      :visible.sync="dialogEditVisible"
      width="50%"
      @close="editClose"
      >
      <el-form
      ref="editFormRef"
      :model="editForm"
      :rules="editRules"
      >
        <el-form-item
        label="省市县"
        prop="address1"
        >
        <el-cascader
        clearable
        :options="cityData"
        v-model="editForm.address1"
        ></el-cascader>
        </el-form-item>
        <el-form-item
        label="详细地址"
        prop="address2"
        >
        <el-input v-model="editForm.address2" clearable></el-input>
        </el-form-item>
      </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogEditVisible = false">取 消</el-button>
            <el-button type="primary" @click="editConfirm">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog
    title="物流进度"
    :visible.sync="dialogProsessVisible"
    width="50%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline> 
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js';
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 6,
      },
      total: 0,
      progressInfo: [],
      ordersList: [],
      // todo 省市县
      cityData,
      // todo 编辑dialog
      dialogEditVisible: false,
      editForm: {
        address1: '',
        address2: '',
      },
      editRules: {
        address1: [
          { required: true, message: '请选择省市县', trigger: 'blur' },
        ],
        address2: [
          { required: true, message: '详细地址不能为空', trigger: 'blur' },
        ],
      },
      // todo 进度弹框
      dialogProsessVisible: false,
    };
  },
  created() {
    this.getOdersList();
  },
  methods: {
    async getOdersList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.ordersList = res.data.goods;
      this.total = res.data.total;
      return false;
    },
    columnStyle() {
      return 'columnStyle';
    },
    // todo 分页
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getOdersList();
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getOdersList();
    },
    // todo 编辑
    edit() {
      this.dialogEditVisible = true;
    },
    editConfirm() {},
    editClose() {
      this.editForm.address1 = '';
      this.editForm.address2 = '';
      this.$refs.editFormRef.resetFields();
    },
    async showProgressBox() {
      this.dialogProsessVisible = true;
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580');
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.message);
      this.$message.success(res.meta.message);
      this.progressInfo = res.data;
    },
  },
  computed: {},
  watch: {},
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
</style>
