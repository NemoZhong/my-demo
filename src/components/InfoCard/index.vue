<template>
  <div class="info-card">
    <div class="title">{{title}}</div>
    <slot name="info-data" />
  </div>
</template>

<script>
export default {
  name: "InfoCard",
  props: {
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
.info-card {
  box-sizing: border-box;
  width: 100%;
  background-color: #F2EAF4;
  text-align: left;
  border-radius: 4px;
  padding: 16px 20px;
  .title {
    height: 20px;
    line-height: 20px;
    position: relative;
    margin-bottom: 16px;
    font-size: 16px;
    &::before {
      position: absolute;
      left: -20px;
      top: 0;
      display: block;
      content: "";
      width: 10px;
      height: 20px;
      background-color: #7c3595;
    }
  }
}
</style>
