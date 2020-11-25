<template>
  <div class="topList-wrap">
    <div class="top-wrap">
      <el-button type="primary" @click="add">新增置顶</el-button>
    </div>
    <div class="table-wraper">
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column
          v-for="(item, index) in headData"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        >
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="del(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper" ref="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
          class="el-pagination"
          background
        >
        </el-pagination>
      </div>
    </div>

    <el-dialog
      title="添加置顶"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
    >
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column type="selection" width="30"></el-table-column>
        <el-table-column
          v-for="(item, index) in headData"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        >
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="del(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import myTable from "@/components/table";
export default {
  data() {
    return {
      input: "",
      loading: false,
      dialogVisible: false,
      totalPage: 100,
      pageSize: 10,
      currentPage: 1,
      headData: [
        {
          prop: "name",
          label: "名称",
          width: 100,
        },
        {
          prop: "describe",
          label: "描述",
          width: 200,
        },
        {
          prop: "baseInfo",
          label: "基础信息",
          width: 200,
        },
        {
          prop: "buildeDate",
          label: "成立时间",
          width: 150,
        },
        {
          prop: "createDate",
          label: "新建时间",
          width: 150,
        },
        {
          prop: "supperType",
          label: "所属一级类别",
          width: 100,
        },
        {
          prop: "subType",
          label: "所属二级类别",
          width: 100,
        },
      ],
      tableData: [
        {
          id: "1", // 项目id
          name: "出版项目1", // 项目名称
          describe: "这是一个牛逼的项目",
          buildeDate: "2020-11-25", // 项目成立时间
          createDate: "2020-11-24", // 这条数据建立的时间
          imgurl: [
            // 项目图片
            "https://www.baidu.com/img/PC_803382a656108089122dc9a79d2729e8.png",
            "https://www.baidu.com/img/PC_803382a656108089122dc9a79d2729e8.png",
          ],
          videos: [],
          supperType: "展览&演讲/", // 一级类型
          subType: "演讲/", // 二级类型
        },
      ],
    };
  },
  components: {
    myTable,
  },
  mounted() {},
  methods: {
    handleSelectionChange() {},
    handleSizeChange() {},
    handleCurrentChange() {},
    add() {
      this.dialogVisible = true;
    },
    del() {},
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
  },
};
</script>

<style scoped lang="less">
.topList-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  .table-wraper{
    flex: 1;
    position: relative;
    .pagination-wrapper{
      position: absolute;
      bottom: 0;
    }
  }
  .top-wrap {
    margin-bottom: 20px;
  }
}
</style>