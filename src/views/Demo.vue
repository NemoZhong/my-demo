<template>
  <div class="demo-container">
    <NormalCard>
      <NormalTitle title="标题" />
      <InfoCard title="产品类型统计">
        <template v-slot:info-data>
          <el-form :model="demo" :rules="demoRules" :show-message="false">
            <el-form-item prop="name" label="用户名">
              <input-line
                v-model="demo.name"
                name="name"
                placeholder="用户名以字母开头"
              ></input-line>
            </el-form-item>
          </el-form>
        </template>
      </InfoCard>
    </NormalCard>
    <NormalSteps :steps="steps" />
    <TreeTable :data="data" :columns="columns" border />
  </div>
</template>

<style lang="less"></style>

<script>
import InfoCard from "@/components/InfoCard/";
import InputLine from "@/components/InputLine/";
import NormalCard from "@/components/NormalCard/";
import NormalTitle from "@/components/NormalTitle/";
import NormalSteps from "@/components/NormalSteps/";
import TreeTable from "@/components/TreeTable/";
export default {
  name: "Demo",
  components: {
    InfoCard,
    InputLine,
    NormalCard,
    NormalTitle,
    NormalSteps,
    TreeTable
  },
  data() {
    const validate = (rule, value, callback) => {
      if (!/^[A-Za-z]/.test(value)) {
        callback(new Error("用户名以字母开头"));
      } else {
        callback();
      }
    };
    return {
      demo: {
        name: ""
      },
      demoRules: {
        name: [{ required: true, trigger: "blur", validator: validate }]
      },
      steps: [
        {
          id: 0,
          name: "步骤1"
        },
        {
          id: 1,
          name: "步骤2",
          active: true
        },
        {
          id: 2,
          name: "步骤3"
        }
      ],
      columns: [
        {
          text: "事件",
          value: "event",
          width: 200
        },
        {
          text: "ID",
          value: "id"
        },
        {
          text: "时间线",
          value: "timeLine"
        },
        {
          text: "备注",
          value: "comment"
        }
      ],
      data: [
        {
          id: 0,
          event: "事件1",
          timeLine: 50,
          comment: "无"
        },
        {
          id: 1,
          event: "事件1",
          timeLine: 100,
          comment: "无",
          children: [
            {
              id: 2,
              event: "事件2",
              timeLine: 10,
              comment: "无"
            },
            {
              id: 3,
              event: "事件3",
              timeLine: 90,
              comment: "无",
              children: [
                {
                  id: 4,
                  event: "事件4",
                  timeLine: 5,
                  comment: "无"
                },
                {
                  id: 5,
                  event: "事件5",
                  timeLine: 10,
                  comment: "无"
                },
                {
                  id: 6,
                  event: "事件6",
                  timeLine: 75,
                  comment: "无",
                  children: [
                    {
                      id: 7,
                      event: "事件7",
                      timeLine: 50,
                      comment: "无",
                      children: [
                        {
                          id: 71,
                          event: "事件71",
                          timeLine: 25,
                          comment: "xx"
                        },
                        {
                          id: 72,
                          event: "事件72",
                          timeLine: 5,
                          comment: "xx"
                        },
                        {
                          id: 73,
                          event: "事件73",
                          timeLine: 20,
                          comment: "xx"
                        }
                      ]
                    },
                    {
                      id: 8,
                      event: "事件8",
                      timeLine: 25,
                      comment: "无"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
  },
  methods: {}
};
</script>
