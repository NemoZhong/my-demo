<template>
  <div class="normal-title">{{ title }}</div>
</template>

<script>
export default {
  name: "NormalTitle",
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
.normal-title {
  position: relative;
  height: 20px;
  line-height: 20px;
  margin-bottom: 16px;
  font-size: 16px;
  background-color: #fff;
  text-align: left;
  box-sizing: border-box;
  padding-left: 16px;
  &::before {
    position: absolute;
    left: 0;
    top: 0;
    display: block;
    content: "";
    width: 8px;
    height: 20px;
    background-color: #7c3595;
  }
}
</style>
