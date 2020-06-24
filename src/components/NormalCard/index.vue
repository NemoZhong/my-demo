<template>
  <div class="normal-card">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "NormalCard",
  props: {},
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
.normal-card {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0px 0px 4px #bbb;
}
</style>
