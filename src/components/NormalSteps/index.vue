<template>
  <div class="step-container">
    <div
      :class="['step-item', step.active ? 'active' : '']"
      v-for="(step, index) in steps"
      :key="index"
      @click="currentStep(step.id)"
    >
      {{ step.name }}
    </div>
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
    currentStep(id) {
      if (id >= this.steps.find(step => step.active).id) return;
      this.steps.forEach(step => (step.active = false));
      this.steps.find(step => step.id === id).active = true;
    }
  },
  beforeCreate() {
    console.log("s1");
  },
  created() {
    console.log("s2");
  },
  beforeMount() {
    console.log("s3");
  },
  mounted() {
    console.log("s4");
  },
  beforeUpdate() {
    console.log("s5");
  },
  updated() {
    console.log("s6");
  },
  beforeDestroy() {
    console.log("s7");
  },
  destroyed() {
    console.log("s8");
  }
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
    padding: 8px 32px;
    font-size: 14px;
    background-color: #eee;
    &:not(:first-of-type){
      margin-left: -6px;
    }
    clip-path: polygon(0% 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 0% 100%, 10px 50%);
    &:last-of-type {
      clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 10px 50%);
    }
    &:first-of-type {
      clip-path: polygon(0% 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 0% 100%);
    }
  }
  .step-item.active {
    background-color: #7c3595;
    color: #fff;
  }
}
</style>
