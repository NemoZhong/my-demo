<template>
  <div class="step-container">
    <div :class="['step-item',step.active?'active':'']" v-for="(step,index) in steps" :key="index" @click="currentStep(step.id)">{{step.name}}</div>
  </div>
</template>

<script>
export default {
  name: "NormalSteps",
  props: {
    steps: {
      type: Array,
      default() {
        [];
      }
    }
  },
  data() {
    return {};
  },
  methods: {
      currentStep(id){
        if(id>=this.steps.find(step=>step.active).id)return
        this.steps.forEach(step=>step.active=false)
        this.steps.find(step=>step.id===id).active=true
      }
  },
};
</script>

<style lang="less" scoped>
.step-container {
  width: 100%;
  display: flex;
  user-select: none;
  .step-item {
    cursor: pointer;
    box-sizing: border-box;
    padding: 10px 40px;
    font-size: 14px;
    background-color: #eee;
    clip-path: polygon(0% 0%, 88% 0%, 100% 50%, 88% 100%, 0% 100%, 12% 50%);
    &:first-of-type {
      clip-path: polygon(0% 0%, 88% 0%, 100% 50%, 88% 100%, 0% 100%);
    }
    &:last-of-type {
      clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 12% 50%);
    }
  }
  .step-item.active{
    background-color: #7c3595;
    color: #fff;
  }
}
</style>
