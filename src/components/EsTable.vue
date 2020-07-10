<template>
  <div class="table-container">
      <el-row type="flex" class="table-tool">
        <el-row class="left-tool-bar" type="flex">
          <slot name="left-menu-extend"/>
          <el-tooltip content="重置" class="menu-item refresh">
            <span class="table-tool-bar-item">
              <i class="el-icon-refresh-right" @click="refresh"></i>
            </span>
          </el-tooltip>
          <slot name="right-menu-extend"/>
        </el-row>  
        <el-row class="table-global-search flex-1" type="flex">
          <input-line class="header-search" list="historyList" v-model="globalSearchTxt" @keyup.enter.native="headerSearch"></input-line>
          <datalist id="historyList">
            <option v-for="(history,idx) in searchHistoryList" :key="idx" :value="history"></option>
          </datalist>
          <i class="el-icon-search header-search-icon" @click="headerSearch"></i>
        </el-row>
        <el-row type="flex">
          <el-form ref="form" :inline="true">
            <slot name="searchform" :formData="formData"></slot>
          </el-form>
        </el-row>
        <el-row class="right-tool-bar" type="flex">
          <div v-if="usePage" class="scf-table-paging">
            <el-pagination
              :background="true"
              layout="sizes,total,prev,next"
              :total="total"
              :current-page="current" 
              :page-size="size" 
              @current-change="handlePageChange"
              @size-change="handleSizeChange"
              >
            </el-pagination>
          </div>
          <div class="right-tool-bar-content">
            <slot name="menu-extend"/>
            <el-tooltip class="menu-item" content="列设置">
              <el-dropdown trigger="click" class="column-menu" :hide-on-click="true">
                <i class="el-icon-s-grid"></i>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="checkAllColumn">&nbsp;列展示</el-checkbox>
                  </el-dropdown-item>
                  <el-checkbox-group v-model="checkedColumns" @change=handleCheckedColumns>
                    <vue-draggable v-model="allColumns">
                      <el-dropdown-item v-for="(item,idx) in allColumns" :key="idx">
                      <el-checkbox :label="item.property">&nbsp;{{item.label}}</el-checkbox>
                      </el-dropdown-item>
                    </vue-draggable>
                  </el-checkbox-group>
                </el-dropdown-menu>
              </el-dropdown>
            </el-tooltip>
          </div>
        </el-row>
      </el-row>
      <el-table
        ref="table"
        :data="tableData"
        v-loading="loading"
        :span-method="spanMethod"
        :rowKey="rowKey"
        :row-class-name="canRowClick?'hoverPointer':''"
        :class="[showSearchLine?'search-line-table':'']"
        :header-cell-class-name="tableHeadAddClass"
        @row-click="onRowClick"
        @selection-change="onRowSelect"
        @sort-change="sortChange"
        tooltip-effect="dark"
        v-bind="$attrs"
        v-on="$listeners"
      >
        <div slot="append" class="search-box" v-if="showSearchLine">
          <div v-for="(item,i) in currentColumns" :key="i">
            <el-select
              v-if="isSelectUnit(item)"
              v-model="formData[item.prop]"
              :style="{width:item.width+'px'}"
              clearable 
              @change="getSelectItem(item)"  
            >
              <el-option v-for="(option,idx) in isSelectUnit(item).options" :key="idx" :value="option.value" :label="option.label"></el-option>
            </el-select>
            <el-date-picker
              v-else-if="isTimeUnit(item)"
              v-model="timeTmpData[item.prop]"
              :type="dataType"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :unlink-panels="false"
              @change="getTimeRange(item,isTimeUnit(item))"
            >
            </el-date-picker>
            <div v-else-if="isCountUnit(item)" :style="{width:item.width+'px'}">
              <input type="text" style="width:40%" v-model="formData[isCountUnit(item).formKey[0]]" @keyup.enter="loadData">
              <span>-</span>
              <input type="text" style="width:40%" v-model="formData[isCountUnit(item).formKey[1]]" @keyup.enter="loadData">
            </div>
            <input v-else type="text" :style="{width:item.width+'px'}" v-model="formData[item.prop]" @keyup.enter="loadData" :readonly="!item.prop||item.prop==='handle'">
          </div>
        </div>
        <slot name="display-table"></slot>
      </el-table>
  </div>
</template>

<script>
import InputLine from '@/components/InputLine/'
import VueDraggable from 'vuedraggable'
import service from "@/utils/request"
import qs from 'qs'
import moment from 'moment'
import _ from 'lodash'

export default {
  name: "EsTable",
  components:{InputLine,VueDraggable},
  props: {
    globalSearch:{
      type:Boolean,
      default:true
    },
    columnConfig:{
      type:Boolean,
      default:true
    },
    selectSearch:{
      type:Array,
      default(){
        return []
      }
    },
    timeRange:{
      type:Array,
      default(){
        return []
      }
    },
    dateType:{
      type:String,
      default(){
        return 'datetimerange'
      }
    },
    countRangeSearch:{
      type:Array,
      default(){
        return []
      }
    },
    rowGap:{
      validator(val){
        return [0,1,2].includes(val)
      },
      type:Number,
      default:2
    },
    showSearchLine:{
      type:Boolean,
      default:true
    },
    usePage:{
      type:Boolean,
      default:true
    },
    // 默认选中必传
    rowKey:{
      type:String,
      // 不要设置默认key,如果数据中没有写死的默认key(如id),会影响表头半选状态
      default:""
    },
    url:{
      type:String,
      default:'/'
    },
    externParam:{
      type:Object,
      default:()=>({})
    },
    spanMethod:Function,
    dataTransfer:{
      type:Function,
      default(item){
        return item
      }
    },
    eagerLoad:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {};
  },
  methods: {
    headerSearch(){

    }
  },
};
</script>

<style lang="less" scoped>

</style>
