<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="100px"
    class="demo-ruleForm"
  >
    <el-form-item label="名称" prop="name">
      <el-input v-model="ruleForm.name"></el-input>
    </el-form-item>
    <el-form-item label="一级分类" prop="supperType" required>
      <el-select v-model="ruleForm.supperType" placeholder="请选择活动区域">
        <el-option label="项目" value="1"></el-option>
        <el-option label="展览&演讲" value="2"></el-option>
        <el-option label=" 出版" value="3"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类" prop="subType" required>
      <el-select v-model="ruleForm.subType" placeholder="请选择活动区域">
        <el-option
          v-for="(item, index) in subTypeList"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="新建时间" prop="buildeDate" required>
      <el-date-picker
        type="date"
        placeholder="选择日期"
        v-model="ruleForm.buildeDate"
        style="width: 100%"
      ></el-date-picker>
    </el-form-item>
    <el-form-item label="基本信息" prop="baseInfo" required>
      <el-input type="textarea" v-model="ruleForm.baseInfo"></el-input>
    </el-form-item>
    <el-form-item label="说明信息" prop="describe" required>
      <el-input type="textarea" v-model="ruleForm.describe"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')"
        >立即创建</el-button
      >
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      subTypeList: [
        {
          label: "建筑",
          value: "1",
        },
        {
          label: "改造",
          value: "2",
        },
        {
          label: "城乡研究",
          value: "3",
        },
        //
        {
          label: "展览",
          value: "1",
        },
        {
          label: "演讲",
          value: "2",
        },
        ///
        {
          label: "书籍出版",
          value: "1",
        },
        {
          label: "国内刊物",
          value: "2",
        },
        {
          label: "国际刊物",
          value: "3",
        },
      ],
      ruleForm: {
        name: "",
        describe: "",
        baseInfo: "",
        buildeDate: "", // 项目成立时间
        supperType: "", // 一级类型
        subType: "", // 二级类型
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
        ],
        describe: [
          { required: true, message: "请输入说明信息", trigger: "blur" },
        ],
        baseInfo: [
          { required: true, message: "请输入基础信息", trigger: "blur" },
        ],
        supperType: [
          { required: true, message: "请选择一级类别", trigger: "change" },
        ],
        subType: [
          { required: true, message: "请选择二级类别", trigger: "change" },
        ],
        buildeDate: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' },
            { type: 'date', required: true, message: '请选择日期', trigger: 'blur' }
        ]
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
<style lang="less" scoped>
.el-input,
.el-select {
  width: 400px;
}
</style>