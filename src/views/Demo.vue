<template>
  <div class="demo-container">
    <NormalCard>
      <NormalTitle title="标题" />
      <InfoCard title="产品类型统计">
        <template v-slot:info-data>
          <el-form :model="demo" :rules="demoRules" :show-message="false">
            <el-form-item prop="name" label="用户名">
              <input-line v-model="demo.name" name="name" placeholder="用户名以字母开头"></input-line>
            </el-form-item>
          </el-form>
        </template>
      </InfoCard>
    </NormalCard>
    <NormalSteps :steps="steps"/>
  </div>
</template>

<style lang="less">
</style>

<script>
import InfoCard from "@/components/InfoCard/";
import InputLine from "@/components/InputLine/";
import NormalCard from "@/components/NormalCard/";
import NormalTitle from "@/components/NormalTitle/";
import NormalSteps from "@/components/NormalSteps/";
export default {
  name: "Demo",
  components: { InfoCard, InputLine, NormalCard, NormalTitle, NormalSteps },
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
        name: [{ required: true, trigger: "blur",validator:validate }]
      },
      steps:[{
        id:0,
        name:'步骤1'
      },{
        id:1,
        name:'步骤2',
        active:true
      },{
        id:2,
        name:'步骤3'
      }]
    };
  },
  methods: {
  }
};
</script>
