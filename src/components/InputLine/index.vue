<template>
  <div class="input-container">
    <el-input
      :class="['input-line', isValidated ? '' : 'error']"
      v-model="currentValue"
      v-bind="$attrs"
      v-on="$listeners"
      @blur="blurFn"
      @input.native="handleModelInput"
    ></el-input>
  </div>
</template>

<script>
export default {
  name: "InputLine",
  props: {
    value: [String, Number],
    validateEvent: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentValue: "",
      isValidated: true
    };
  },
  watch: {
    value(newValue) {
      this.currentValue = newValue;
    }
  },
  methods: {
    blurFn() {
      this.$emit("blur", event);
      if (this.$parent.$options.componentName === "ElFormItem") {
        if (this.validateEvent) {
          this.$parent.$emit("el.form.blur", [this.currentValue]);
        }
      }
    },
    handleModelInput(event) {
      const value = event.target.value;
      this.$emit("input", value);
      if (this.$parent.$options.componentName === "ElFormItem") {
        if (this.validateEvent) {
          this.$parent.$emit("el.form.change", [value]);
        }
      }
      this.$emit("change", value);
    }
  }
};
</script>

<style lang="less" scoped>
.input-container {
  box-sizing: border-box;
  width: 100%;
  text-align: left;
  .input-line {
    /deep/ .el-input__inner,
    .el-textarea__inner {
      outline: none;
      border: none;
      background-color: transparent;
      border-radius: 0;
      height: 30px;
      line-height: 30px;
      background-image: linear-gradient(#7c3595, #7c3595),
        linear-gradient(#c0c0c0, #c0c0c0);
      background-size: 0px 1px, 100% 1px;
      background-repeat: no-repeat;
      background-position: center bottom, center 100%;
      &:focus {
        background-size: 100% 1px, 100% 1px;
        transition: all 0.5s;
        border: none;
        outline: none;
      }
    }
    /deep/ .el-input__icon {
      line-height: 30px;
    }
  }
  .input-line.error {
    /deep/ .el-input__inner {
      outline: none;
      border: none;
      background-color: transparent;
      border-radius: 0;
      height: 30px;
      line-height: 30px;
      background-image: linear-gradient(red, red),
        linear-gradient(#c0c0c0, #c0c0c0);
      background-size: 100% 1px, 100% 1px;
      background-repeat: no-repeat;
      background-position: center bottom, center 100%;
    }
  }
}
</style>
