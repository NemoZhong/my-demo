<template>
  <div class="container">
    <vuedraggable class="tools" :options="dragOption" @start="saveCurrentItem" @end="onEnd">
      <transition-group>
        <div v-for="item in handleList" :key="item.id">
          <div class="handle-item" :style="{'background-color':item.color}">{{item.name}}</div>
        </div>
      </transition-group>
    </vuedraggable>
    <div class="flow-container">
      <div class="flow-row" v-for="flow in flowList" :key="flow.id">
        <div class="flow-item">{{flow.name}}</div>
        <vuedraggable
          v-model="flow.column"
          :options="sortOption"
          @sort="onSort(flow)"
          @add="onAdd(flow)"
          class="flow-sort"
        >
          <div
            class="item"
            v-for="(item,index) in flow.column"
            @dblclick="editData($event,item)"
            :key="index"
            :style="{'background-color':item.color}"
          >
            {{item.name}}
            <div class="del" @click.prevent="deleteFlow(flow,item)">×</div>
          </div>
        </vuedraggable>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 800px;
  border: 1px solid #ccc;
  display: flex;
  .tools {
    width: 200px;
    background: #ccc;
    .handle-item {
      width: 80%;
      border-radius: 4px;
      line-height: 50px;
      color: #fff;
      margin: 20px 0 0 20px;
    }
  }
  .flow-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    .flow-row {
      flex: 1;
      display: flex;
      width: 100%;
      border-bottom: 1px solid #ccc;
      .flow-item {
        width: 200px;
        height: 100%;
        border-right: 1px solid #ccc;
        line-height: 100px;
      }
      .flow-sort {
        display: flex;
        width: 100%;
        height: 100%;
        .handle-item {
          display: none;
        }
        .item {
          position: relative;
          flex: 1;
          height: 100%;
          line-height: 100px;
          color: #fff;
          .del {
            position: absolute;
            width: 40px;
            height: 40px;
            border-radius: 20px;
            line-height: 40px;
            font-size: 40px;
            right: 10px;
            bottom: 10px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
<script>
import vuedraggable from "vuedraggable";
//利用vuex 辅助函数来操作vuexjs中的数据
export default {
  name: "Home",
  components: { vuedraggable },
  data() {
    return {
      sortOption: {
        group: {
          name: "components", //前面说的name,在这里就起了作用，不一样，是不能放入的
          pull: true,
          put: true
        },
        sort: true,
        animation: 300 //给了个动画，看起来舒服些
      },
      dragOption: {
        group: {
          name: "components", //这个很重要，其他的与之能产生关联的拖拽框就靠这name 一定要一致
          pull: "clone",
          put: false
        },
        sort: false //默然为true。这里我们只需要他拖拽，无需能拖动排序
      },
      flowList: [
        {
          id: 0,
          name: "初审",
          column: []
        },
        {
          id: 1,
          name: "三方调查",
          column: []
        },
        {
          id: 2,
          name: "终审",
          column: []
        },
        {
          id: 3,
          name: "签署",
          column: []
        }
      ],
      handleList: [
        {
          id: 0,
          name: "通过",
          color: "#5db35d"
        },
        {
          id: 1,
          name: "拒绝",
          color: "#d65655"
        }
      ],
      currentItem: null
    };
  },
  computed: {},
  watch: {},
  mounted() {
    console.log(this);
  },
  methods: {
    saveCurrentItem(item) {
      this.currentItem = JSON.parse(
        JSON.stringify(
          this.handleList.find((handle, index) => index === item.oldIndex)
        )
      );
    },
    onEnd(res) {
      console.log("onEnd",res);
      this.currentItem = null;
    },
    onSort(res) {
      //排序产生的事件
      console.log("onSort", res);
      if (res.from === res.to) {
        // console.log(11111)
      }
    },
    onAdd(res) {
      //组件增加产生的事件
      console.log("onAdd", res);
      if (this.currentItem) {
        const flow = this.flowList.find(flow => flow.id === res.id);
        this.currentItem.uniqueKey = +new Date();
        flow.column.push(this.currentItem);
      }
    },
    deleteFlow(flow, item) {
      console.log("del", flow, item.uniqueKey);
      flow.column = flow.column.filter(col => col.uniqueKey !== item.uniqueKey);
    },
    editData(e, data) {
      console.log("item-clicked", e, data);
      const oldText = data.name;
      const newInput = document.createElement("input");
      newInput.type = "text";
      newInput.value = oldText;
      newInput.style.cssText =
        "width:40%;height:60px;border:none;border-radius:2px;outline:none;font-size:20px;";
      data.name = "";
      e.target.appendChild(newInput);
      // 设置选择文本的内容或设置光标位置
      newInput.setSelectionRange(0, oldText.length);
      newInput.focus();
      newInput.onblur = function() {
        data.name = this.value === oldText ? oldText : this.value;
        e.target.removeChild(newInput);
      };
    }
  }
};
</script>
