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
    return {
      timeTmpData:{},
      multipleSelection:[],
      formData:{},
      tableData:[],
      total:0,
      current:1,
      size:10,
      loading:true,
      globalSearchTxt:'',
      // 当前列 (用于渲染搜索行的Input)
      currentColumns:[],
      // 全部列 (用于列菜单显示，并绑定拖拽)
      allColumns:[],
      // 初始全部列(用于重置)
      originColumns:[],
      isIndeterminate:false,
      checkedColumns:[],
      searchHistoryList:[],
      orders:[]
    };
  },
  computed: {
    isCountUnit:(this)=>(unit)=>{
      if(unit.prop){
        return this.countRangeSearch.find(item=>item.prop===unit.prop)
      }
    },
    isSelectUnit:(this)=>(unit)=>{
      if(unit.prop){
        return this.selectSearch.find(item=>item.prop===unit.prop)
      }
    },
    isTimeUnit:(this)=>(unit)=>{
      if(unit.prop){
        return this.timeRange.find(item=>item.prop===unit.prop)
      }
    },
    canRowClick(){
      return this.$listeners['row-click']!==null
    },
    checkAll:{
      get(){
        return this.checkedColumns.length===this.allColumns.length
      },
      set(val){
        return val
      }
    }
  },
  watch:{
    formData(){
      this.current=1
    },
    size(){
      this.current=1
    },
    url(){
      if(this.eagerLoad){
        this.loadData()
      }
    },
    externParam:{
      handler(){
        if(this.eagerLoad){
          this.loadData()
        }
      },
      deep:true
    },
    checkedColumns:{
      handler(){
        // 使用setTimeout确保在vuedraggable异步后执行，再check获取到的输入框长度才正确
        setTimeout(()=>{
          this.setSearchInput()
        },100)
      }
    },
    allColumns:{
      handler(){
        const newColumns=[]
        const arr= this.$refs.table.columns
        // 保存property为空的列 , 如select,expand
        for(let i=0,len=arr.length;i<len;i++){
          if(arr[i]&&!arr[i].property){
            newColumns.push(arr[i])
          }
        }
        this.allColumns.forEach(column=>{
          this.$refs.table.columns.forEach(refColumn=>{
            if(column.property===refColumn.property){
              newColumns.push(refColumn)
            }
          })
        })
        this.$refs.table.columns=newColumns
        this.setSearchInput()
      }
    }
  },
  mounted() {
    this.loadData()
    console.error('需要修改element源码,可设置column')
    this.setDefaultCfg()
  },
  methods: {
    setDefaultCfg(){
      this.originColumns=_.cloneDeep(this.$refs.table.columns)
      this.allColumns=_.cloneDeep(this.$refs.table.columns).filter(column=>column.property!==undefined)
      this.$set(this,'checkedColumns',this.allColumns.map(it=>it.property))
      this.searchHistoryList=JSON.parse(localStorage.getItem('searchHistoryList'))||[]
    },
    clickSearchIcon(event){
      const arr=event.target.classList
      if(arr.includes('el-icon-search')){
        this.headerSearch()
      }
    },
    //设置表头多列排序类名
    tableHeadAddClass(row){
      const _order=this.orders.find(item=>item.column===row.column.property)
      if(_order){
        return _order.asc?'ascending':'descending'
      }
    },
    // 表头排序
    sortChange(row){
      const _orders=JSON.parse(JSON.stringify(this.orders))
      const _column=_orders.find(it=>it.column===row.prop)
      if(!_column){
        _orders.push({
          column:row.prop,
          asc:row.order==='ascending'
        })
      }else{
        if(row.order===null){
          _column.asc=null
          _column.column=null
        }else{
          _column.asc=row.order==='ascending'
        }
      }
      this.$set(this,'orders',_orders)
      this.loadData()
    },
    //设置搜索时间范围字段及格式
    getTimeRange(item,timeRangeCfg){
      const _chooseTime=this.timeTmpData[item.prop]
      if(_chooseTime&&_chooseTime.length===2){
        this.formData[timeRangeCfg.formKey[0]]=moment(_chooseTime[0]).format(timeRangeCfg.momentFormat||'YYYY-MM-DD HH:mm:ss')
        this.formData[timeRangeCfg.formKey[1]]=moment(_chooseTime[1]).format(timeRangeCfg.momentFormat||'YYYY-MM-DD HH:mm:ss')
      }else{
        this.formData[timeRangeCfg.formKey[0]]=null
        this.formData[timeRangeCfg.formKey[1]]=null
      }
      this.loadData()
    },
    // 设置搜索选择项字段
    getSelectItem(item){
      const value=this.formData[item.prop]
      if(value===''||value===undefined){
        delete this.formData[item.prop]
      }
      this.loadData()
    },
    headerSearch:_.debance(function(){
      this.searchHistoryList.unshift(this.globalSearchTxt)
      this.searchHistoryList=[...new Set(this.searchHistoryList)].slice(0,5)
      localStorage.setItem('searchHistoryList',JSON.stringify(this.searchHistoryList))
      this.loadData()
    },500),
    refresh(){
      this.$refs.table.columns=this.originColumns
      this.formData={}
      this.$set(this,'order',[])
      this.timeTmpData={}
      this.setSearchInput()
      this.checkedColumns=this.allColumns.map(it=>it.property)
      this.allColumns=_.cloneDeep(this.originColumns).filter(column=>column.property!==undefined)
      this.globalSearchTxt=null
      this.loadData()
    },
    // 选中列
    handleCheckedColumns(value){
      const checkedCount = value.length
      this.isIndeterminate=checkedCount>0 && checkedCount<this.allColumns.length
      this.filterColumn()
    },
    // 全选列
    checkAllColumn(val){
      this.checkedColumns= val ? this.allColumns.map(it=>it.property):[]
      this.isIndeterminate=false
      this.filterColumn()
    },
    // 过滤未选中的列
    filterColumn(){
      const _arr = this.allColumns.map(item=>item.property)
      this.$refs.table.columns=this.originColumns.filter(column=>this.checkedColumns.includes(column.property)||column.property!==undefined).sort((a,b)=>_arr.indexOf(a.property) - _arr.indexOf(b.property))
    },
    onRowClick(...props){
      this.$emit('row-click',...props)
    },
    onRowSelect(val){
      this.multipleSelection=val
      this.$emit('row-select',val)
    },
    handleSizeChange(size){
      this.size=size
      this.loadData()
    },
    handlePageChange(){
      this.current=current
      this.loadData(false)
    },
    // 有选择列的时候使用，设置回显选中行， 按唯一值的键名和值判断是否选中
    selectRow(keyname,value,selected){
      this.tableData.forEach(row=>{
        if(row[keyname]===value&&value!==undefined){
          this.$refs.table.toggleRowSelection(row,selected)
        }else{
           this.$refs.table.toggleRowSelection(row,false)
        }
      })
    },
    //设置输入框长度
    setSearchInput(){
      this.$set(this,'currentColumns',this.$refs.table.columns.map(column=>{
        this.$set(this.formData,column.property,null)
        return {
          prop:column.property,
          width:column.realWidth||column.width,
          label:column.label
        }
      }))
    },
    async loadData(resetPage=true){
      // 过滤空的搜索字段
      for(const key in this.formData){
        if(this.formData[key]===''||this.formData[key]===undefined){
          delete this.formData[key]
        }
      }
      if(resetPage){
        this.current=1
      }
      this.loading=true
      let params
      if(this.usePage){
        params={
          current:this.current,
          size:this.size,
          ...this.formData,
          ...this.externParam
        }
      }else{
        params={
          ...this.formData,
          ...this.externParam
        }
      }
      try{
        const res = await setTimeout(()=>{},1000)
        if(res && res.success){
          const {data}=res
          if(this.usePage){
            data=data||{}
            this.tableData=this.dataTransfer(data.records)||data.records||[]
            this.total=data.total
          }else{
             this.tableData=this.dataTransfer(data)||data||[]
          }
        }else{
          this.tableData=[]
          this.total=0
        }
      }catch(e){
          this.tableData=[]
          this.total=0
          this.$message.error(e.message)
      }finally{
        this.loading=false
      }
    }
  },
};
</script>

<style lang="less" scoped>

</style>
