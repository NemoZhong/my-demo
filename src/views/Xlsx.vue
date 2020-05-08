<template>
  <div class="xlsx-container">
    <el-upload
      class="upload-demo"
      drag
      action=""
      multiple
      accept=".xlsx"
      :on-exceed="exceed"
      :limit="1"
      :on-remove="remove"
      :http-request="()=>{}"
      :before-upload="uploadFile"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div class="el-upload__tip" slot="tip">1次只能上传1个xls文件，且不超过500kb</div>
    </el-upload>
    <el-button type="primary" class="export-btn" @click="exportTable">导出</el-button>
    <div class="preview-excel">
      <el-table id="table" class="listTable_ele" :data="listTable" stripe border style="width:100%">
        <el-table-column prop="name" label="姓名" width="200" align="center"></el-table-column>
        <el-table-column prop="age" label="年龄" width="200" align="center"></el-table-column>
        <el-table-column prop="grade" label="成绩" width="200" align="center"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import XLSX from "xlsx";
import FileSaver from "file-saver";
export default {
  data() {
    return {
      listTable: []
    };
  },
  methods: {
    async uploadFile(file) {
      const fileReader = new FileReader();
      fileReader.onload = ev => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary"
          });
          for (let sheet in workbook.Sheets) {
            //循环读取每个文件
            const sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
            //若当前sheet没有数据，则continue
            if (sheetArray.length == 0) {
              continue;
            }
            console.log("读取文件");
            console.log(sheetArray);
            for (let item in sheetArray) {
              let rowTable = {};
              //这里的rowTable的属性名注意要与上面表格的prop一致
              //sheetArray的属性名与上传的表格的列名一致
              rowTable.name = sheetArray[item]['姓名'];
              rowTable.age = sheetArray[item]['年龄'];
              rowTable.grade = sheetArray[item]['成绩'];
              this.listTable.push(rowTable);
            }
          }
        } catch (e) {
          this.$message.warning("文件类型不正确！");
        }
      };
      fileReader.readAsBinaryString(file);
    },
    //上传1个以上文件时弹窗提示错误
    exceed: function() {
      this.$message.error("最多只能上传1个xls文件");
    },
    //删除文件
    remove() {
      this.listTable = [];
    },
    exportTable() {
      let wb = XLSX.utils.table_to_book(document.querySelector("#table"));
      /* #table 就是表格的id */
      let wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          "导出数据.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    }
  }
};
</script>

<style lang="less" scoped>
.xlsx-container {
  width: 100%;
  display: flex;
  justify-content: space-around;
  .export-btn{
      height: 40px;
  }
}
</style>
