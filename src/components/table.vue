<!--该组件的大小由父组件控制-->
<!--各列宽度没有设置，后续调整-->
<!--车牌固定列的数据key必须为vehicleNo-->
<template>
    <div class="myTable padding10" ref="tableBox" id="myTable__">
      <div class="table_"  :class="{'p_b':isHasPagination}">
        <el-table
          ref="table"
          v-loading="loading"
          :data="tableData"
          :border="true"
          :max-height="maxHeight"
          @selection-change="checkBoxchange"
          @cell-click="cellClick"
          @row-click="rowClick"
          style="width: 100%">
          <el-table-column type="selection" width="30" v-if="ishasCheckbox"></el-table-column>
          <template v-for="(item,index) in headData">
            <el-table-column
              v-if="item.hasOwnProperty('handelLink')&&item.hasOwnProperty('linkName')"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :formatter="item.formatter"
              show-overflow-tooltip
            >
              <template slot-scope="scope" v-if="item.hasOwnProperty('handelLink')&&item.hasOwnProperty('linkName')">
			          <span  v-if="item.hasOwnProperty('handelLink')&&item.hasOwnProperty('linkName')" :class="{'link-type':item.linkName}" @click.stop.pervent='item.handelLink(scope.row)'>{{item.linkName?item.linkName:item.content}}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :formatter="item.formatter"
              :fixed="getFixed(item)"
              show-overflow-tooltip
            />
          </template>
            <el-table-column
              fixed="right"
              :label="optionName"
              :width="optionWidth"
              v-if="isNeedOperate">
              <template slot-scope="scope">
                <!--将每一行的数据传给插槽，父组件可以通过此获取数据-->
                <slot :data="scope"></slot>
              </template>
            </el-table-column>
        </el-table>
      </div>
      <div class="pagination-wrapper"  v-show="isHasPagination" ref="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
          :small="isSmall"
          class="el-pagination"
        >
        </el-pagination>
      </div>
    </div>
</template>
<style lang="less">
  @import "../common/const";
  .myTable{
    height: 100%;
    box-sizing: border-box;
    .table_{
      /*TODO 滚动条放在底部
      *传表格最高高度，需要额外计算
      *固定列的高度要重新计算
      */
      overflow: hidden;
      height: 100%;
      position: relative;
      z-index: 1;
      &.p_b{
        @media (max-width: 1600px) and (max-height: 1000px){
          padding-bottom: 26px;
        }
        padding-bottom: 42px;
      }
      .el-table-column--selection{
        &>.cell{
          padding-left: 7px;
          padding-right: 7px;
        }
        /*width: 38px!important;*/
      }
      .el-table__fixed-body-wrapper .el-table__body tbody tr td:nth-last-child(1){
        /*border-left: 1px solid #ebeef5;*/
      }
      .el-table{
        height: 100%;
        font-size: 12px;
        colgroup.gutter{
          display: table-cell !important;
        }
        th.gutter {
          display: table-cell !important;
        }
        .el-table__body-wrapper{
          // 这里会导致表格主体部分和固定列不对齐
            height: 100%;
          .el-table__body{
            width: 100% !important;
          }
          }
        td,th{
          padding: 0;
        }
        th{
          color:rgba(0,0,0,0.85);
          font-weight: 600;
          background-color: #FAFAFA;
        }
        td{
          color:rgba(0,0,0,0.65);
        }
        .cell{
          height: 36px;
          line-height: 36px;
        }
        @media (max-height: 1000px) and (max-width: 1600px){
          .cell{
            height: 26px;
            line-height: 26px;
          }
        }
      }
    }
    .pagination-wrapper{
      overflow: hidden;
      margin-top: -32px;
      background-color: #fff;
      position: relative;
      z-index: 2;
      font-size: 12px;
        @media (max-width: 1600px) and (max-height: 1000px){
          .el-input--mini .el-input__inner{
            height: 22px;
            line-height: 22px;
          }
          margin-top:-26px;
          .el-pagination__jump{
            margin-left: 10px;
          }
          .btn-next,.btn-prev{
            padding: 0;
          }
          .el-input{
            margin: 0;
          }
        }
      .el-pagination{
        text-align: right;
        font-size: 12px;
        .el-pagination__total,.el-pagination__sizes .el-input .el-input__inner,.el-pager li,.el-pagination__jump,.el-input{
          font-size: 12px;
        }
      }
    }
    .link-type,.link-type:focus {
      display: block;
      color: #337ab7;
      cursor: pointer;
      &:hover {
        color: rgb(32, 160, 255);
      }
    }
  }
  .el-select-dropdown__item{
  font-size: 12px!important;
  }
</style>
<script>
  import {cloneObj} from '../util/util';
  export default {
    props: {
      // 行点击
//      rowClick: {
//        type: Function,
//        default: function () {}
//      },
      optionName: {
        type: String,
        default: '操作'
      },
      // 操作列的宽度
      optionWidth: {
       type: Number,
       default: 100
      },
      // 是否显示操作列
      isNeedOperate: {
        type: Boolean,
        default: true
      },
      // 是否显示分页组件
      isHasPagination: {
        type: Boolean,
        default: true
      },
      headData: {
        type: Array,
        default: []
      },
      bodyData: {
        type: Array,
        default: function () {
          return [];
        }
      },
      // 是否显示checkbox
      ishasCheckbox: {
        type: Boolean,
        default: false
      },
      // 总页数
      totalPage: {
        type: Number,
        default: 100
      },
      pageSize: {
        type: Number,
        default: 10
      },
      currentPage: {
        type: Number,
        default: 10
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        cloneHead: [],
        maxHeight: 0,
        tableData: [],
        tableShowData: [],
        pageSizes: [10, 20, 50, 100],
        isSmall: false,
        maxDataCount: 0, // 加载过的最大数据量
        isDoAjax: true   // 节流
      };
    },
    created () {
      // 深度克隆表格主体数据
      this.tableData = cloneObj(this.bodyData);
//      this.getShowTableData();
//      this.initMaxDataCount();
    },
    mounted () {
      this.$nextTick(() => {
        this.changePaginationSize();
      });
    },
    computed: {
      total () {
        return this.tableData.length;
      },
      changebodyData () {
        let ary = [];
        this.bodyData.forEach((p) => {
          ary.push(p);
        });
        return ary;
      }
    },
    destroyed () {
    },
    methods: {
      rowClick (row, event, column) {
        if (this.ishasCheckbox) {
          this.$refs.table.toggleRowSelection(row, event, column);
        }
        this.$emit('rowClick', row, event, column);
      },
      loadmore () {
        this.$emit('loadmore');
      },
      getFixed (item) {
        if (item.hasOwnProperty('fixed')) {
          return true;
        }
      },
      initMaxDataCount () {
        this.maxDataCount = this.bodyData.length === 0 ? 0 : this.pageSize * this.currentPage;
      },
      changePaginationSize () {
        if (window.screen.availWidth <= 1600 && window.screen.availHeight < 1000) {
          this.isSmall = true;
        };
      },
      // 分页插件的事件
      // size-change,pageSize,改变时会触发,回调参数每页条数
      // current-change,currentPage,改变时会触,回调参数当前页
      // prev-click,用户点击上一页按钮改变当前页后触,回调参数当前页
      // next-click,用户点击下一页按钮改变当前页后触,回调参数当前页
      handleSizeChange (val) {
        console.log('每页大小', val);
//        this.currentPage = 1;
//        this.pageSize = val;
        if (this.isDoAjax) {
          this.$emit('sizeChange',
            {
              pageSize: val,
              currentPage: this.currentPage
            });
        }
      },
      handleCurrentChange (val) {
        console.log('当前页码', val);
//        this.currentPage = val;
        if (this.isDoAjax) {
          this.$emit('currentChange',
            {
              pageSize: this.pageSize,
              currentPage: val
            });
        }
      },
    getShowTableData () {
      this.tableShowData = this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    },
      // 点击checkbox
      checkBoxchange (e) {
        console.log('选中', e);
        this.$emit('checkBoxchange', e);
      },
      cellClick(row, column, cell, event) {
        // console.log(row, column, cell, event);
         this.$emit('cellClick', row, column, cell, event);
      }
    },
    watch: {
//      pageSize () {
//        this.currentPage = 1;
//        this.getShowTableData();
//      },
//      currentPage () {
//        this.getShowTableData();
//      },
      pageSize (newSize, oldSize) {
        this.pageSize = newSize;
//        if (newSize * this.currentPage > this.maxDataCount) {
//          this.maxDataCount = newSize * this.currentPage;
//          this.isDoAjax = true;
//        } else {
//          this.isDoAjax = false;
//        }
      },
      currentPage (newCurrent, oldCurrent) {
        this.currentPage = newCurrent;
//        if (newCurrent * this.pageSize > this.maxDataCount) {
//          this.maxDataCount = newCurrent * this.pageSize;
//          this.isDoAjax = true;
//        } else {
//          this.isDoAjax = false;
//        }
      },
      headData: {
         handler () {
          //  this.$forceUpdate();
          this.tableData = cloneObj(this.bodyData);
          // console.log('数据发生变化', this.tableData);
        },
        deep: true
      },
      bodyData: {
        handler () {
          this.tableData = cloneObj(this.bodyData);
          // console.log('数据发生变化', this.tableData);
        },
        deep: true
      }
    }
  };
</script>
