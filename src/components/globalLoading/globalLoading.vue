<template>
  <div class="mask">
      <div class="loading">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
      </div>
  </div>
</template>

<script>
export default {
  name: "GlobalLoading"
};
</script>

<style lang="less" scoped>
    .mask{
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.2);
    }
</style>
