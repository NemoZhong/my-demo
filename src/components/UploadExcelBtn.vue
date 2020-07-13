<template>
  <span>
      <el-upload 
        accept=".xlsx,.xls" 
        :show-file-list="false" 
        :data="{uploadType:'BILL'}" 
        :action="url" 
        :on-change="readExcel"
        :auto-upload="autoUpload"
        :on-success="uploadSuccess"
        :file-list="fileList"
        >
        <slot name='button'>
            <el-button :icon="icon" :tip="tip"></el-button>
        </slot>
      </el-upload>
  </span>
</template>

<script>
import XLSX from 'xlsx'
export default {
  name: "UploadExcelBtn",
  props: {
      icon:{
          type:String,
          default:''
      },
      tip:{
          type:String,
          default:''
      },
      excelParams:{
          type:Object,
          default(){
              return {}
          }
      },
      dataIndex:{
          type:Number,
          default:0
      },
      autoUpload:{
          type:Boolean,
          default:true
      }
  },
  data() {
    return {
        url:'#',
        excelResultData:[],
        fileList:[]
    };
  },
  methods: {
      async uploadSuccess(response,file,fileList){
          const {excelResultData,dataIndex}=this
          this.$emit('uploadSuccess',{
              list:excelResultData,
              attachmentId:response.data.attachmentId,
              attachmentName:response.data.attachmentName,
              index:dataIndex
          })
          this.$message.success('Excel文件上传读取成功')
      },
      async readExcel(file,fileList){
        const fileReader = new FileReader();
        fileReader.onload = ev => {
            try {
                const data = ev.target.result;
                const workbook = XLSX.read(data, {
                    type: "binary"
                });
                for (const sheet in workbook.Sheets) {
                    //循环读取每个文件
                    const sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
                    //若当前sheet没有数据，则continue
                    if (sheetArray.length == 0) {
                        continue;
                    }
                    const resultData=[]
                    sheetArray.forEach((item,index) => {
                        const dataItem={}
                        Object.keys(this.excelParams).forEach(key=>{
                            dataItem[key]=(this.excelParams[key]?item[this.excelParams[key]]:'')
                        })
                        resultData.push(dataItem)
                    });
                    this.$set(this,'excelResultData',resultData)
                    this.fileList=fileList.slice(-1)
                    if(!this.autoUpload){
                        this.$message.success('Excel识别成功')
                        this.$emit('readExcelSuccess',{
                            list:this.excelResultData,
                            index:this.dataIndex
                        })
                    }
                }
            } catch (e) {
            this.$message.warning("文件类型不正确！");
            }
        };
        fileReader.readAsBinaryString(file.raw);
      }
  },
};
</script>

<style lang="less" scoped>

</style>
