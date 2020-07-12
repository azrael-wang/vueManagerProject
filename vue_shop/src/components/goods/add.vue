<template>
    <div>
     <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
      <el-card class="mt24">
      <el-alert
        title="添加商品信息"
        :type="alertInfo"
        center
        show-icon>
      </el-alert>
      <el-steps
        class="mt24"
        :active="actIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品照片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
    <el-form
    label-width="100px"
    ref="formAddRef"
    :model="addForm"
    :rules="rules"
    label-position="top"
    >
      <el-tabs
      tab-position="left"
      style="height: 600px;"
      class="mt24"
      type="border-card"
      v-model="actIndex"
      :before-leave="befroeTabLeave"
      @tab-click="tabClick"
      >
        <el-tab-pane
        name="0"
        label="商品名称"
        >
          <el-form-item
            label="商品名称"
            prop="goods_name"
          >
            <el-input
            v-model="addForm.goods_name"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="商品价格"
            prop="goods_price"
          >
            <el-input
            type="number"
            v-model="addForm.goods_price"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="商品重量"
            prop="goods_weight"
          >
            <el-input
            type="number"
            v-model="addForm.goods_weight"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="商品数量"
            prop="goods_number"
          >
            <el-input
            type="number"
            v-model="addForm.goods_number"
            ></el-input>
          </el-form-item>
          <el-form-item
          label="商品分类"
          prop="goods_cat"
          >
            <el-cascader
              clearable
              v-model="addForm.goods_cat"
              :options="cateList"
              :props="cascaderProps"
              @change="handleChange">
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane
        label="商品参数"
        name="1"
        >
          <el-form-item
          v-for="item in manyTabData" :key="item.attr_id"
          :label="item.attr_name"
          >
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox
              border
              size="mini"
              v-for="(_item, i) in item.attr_vals" :key="i"
              :label="_item"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane
        label="商品属性"
        name="2"
        style="height:600px;overflow:auto;"
        >
          <el-form-item
          v-for="item in onlyTabData" :key="item.attr_id"
          :label="item.attr_name"
          >
          <el-input
          v-model="item.attr_vals"
          ></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品照片"
        name="3"
        >
        <el-upload
          list-type="picture"
          :action="uploadUrl"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :headers="uploadToken"
          :on-success="uploadSuccess"
          >
          <el-button
          size="mini"
          type="primary"
          round
          plain
          >图片上传</el-button>
        </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容"
        name="4"
        >
          <quill-editor
            ref="myQuillEditor"
            v-model="addForm.goods_introduce"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)"
          />
          <el-button
          class="mt24"
          type="primary"
          @click="add"
          >添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <el-dialog
      title="图片预览"
      :visible.sync="previewDialogVisible"
      width="50%"
      @close="previewHandleClose">
       <el-image
       fit="fill"
       :src="previeUrl"
       ></el-image>
    </el-dialog>
  </el-card>
    </div>
</template>

<script>
export default {
  data() {
    return {
      // todo 图片上传路径
      uploadUrl: 'http://127.0.0.1:8899/api/private/v1/upload',
      // todo tabs当前索引
      actIndex: 0,
      alertInfo: 'info',
      // todo 商品分类列表
      cateList: [],
      // todo 商品参数列表 manyTabData: 动态参数 onlyTabData: 静态参数
      manyTabData: [],
      onlyTabData: [],
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // todo 商品分类数组
        goods_cat: [],
        pics: [],
        // todo 图文本信息
        goods_introduce: '',
      },
      rules: {
        goods_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          {
            min: 0, max: 20, message: '长度在 0 到 20 个字符', trigger: 'blur',
          },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
      },
      // todo 级联选择器配置
      cascaderProps: {
        expandTrigger: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // todo 图片列表
      fileList: [],
      // todo 上传图片增加token字段
      uploadToken: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      // todo 图片预览弹框
      previewDialogVisible: false,
      previeUrl: '',
      // todo 富文本编译器内容
      editorOption: {},
    };
  },
  created() {
    this.getCatelist();
  },
  methods: {
    async getCatelist() {
      const { data: res } = await this.$http.get('categories');
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.cateList = res.data;
      return false;
    },
    // todo 级联选择器变化数组
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    // todo 标签页选择事件
    befroeTabLeave(newName, oldName) {
      if (this.addForm.goods_cat.length !== 3 && oldName === '0') {
        this.$message.info('请选择三级分类');
        return false;
      }
      return undefined;
    },
    // todo tab点击事件
    async tabClick(actTab) {
      console.log(actTab);
      if (actTab.name === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'many' },
        });
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals.length > 1 ? item.attr_vals.split(' ') : [];
        });
        this.manyTabData = res.data;
        this.$message.success(res.meta.msg);
      } else if (actTab.name === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'only' },
        });
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.onlyTabData = res.data;
        this.$message.success(res.meta.msg);
      }
      return undefined;
    },
    // todo 点击图片预览效果事件
    handlePreview(file) {
      console.log(file);
      this.previewDialogVisible = true;
      this.previeUrl = file.response.data.url;
    },
    // todo 删除图片事件
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      const index = this.addForm.pics.findIndex((item) => filePath === item.pic);
      this.addForm.pics.splice(index, 1);
    },
    // todo 图片上传成功事件
    uploadSuccess(res) {
      console.log(res);
      this.addForm.pics.push({ pic: res.data.tmp_path });
    },
    // todo 图片预览关闭事件
    previewHandleClose() {
      this.previeUrl = '';
    },
    // todo 文本编译器
    onEditorBlur(quill) {
      console.log('editor blur!', quill);
    },
    onEditorFocus(quill) {
      console.log('editor focus!', quill);
    },
    onEditorReady(quill) {
      console.log('editor ready!', quill);
    },
    onEditorChange({ quill, html, text }) {
      console.log('editor change!', quill, html, text);
      this.content = html;
    },
    async add() {
      // 表单提交先进行表单认证
      const formValidate = await this.$refs.formAddRef.validate()
        .catch((err) => err);
      console.log(formValidate);
      if (!formValidate) return this.$message.error('请填写必要表单项');
      const formData = this._.cloneDeep(this.addForm);
      formData.goods_cat = formData.goods_cat.join(',');
      formData.attrs = [];
      // 处理动态参数
      this.manyTabData.forEach((item) => {
        formData.attrs.push({
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(' '),
        });
      });
      // 处理静态参数
      this.onlyTabData.forEach((item) => {
        formData.attrs.push({
          attr_id: item.attr_id,
          attr_value: item.attr_vals,
        });
      });
      const { data: res } = await this.$http.post('goods', formData);
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.$router.push('/goods');
      return undefined;
    },
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length !== 3) {
        return null;
      }
      return this.addForm.goods_cat[2];
    },
  },
};
</script>

<style lang="scss" scoped>
  .el-tabs {
    height: 600px;
  }
  .el-checkbox {
    margin-left: 0 !important;
  }
</style>
