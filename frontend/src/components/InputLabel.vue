<template>
  <div class="form">
    <input
      v-if="isText"
      :value="value"
      type="text"
      name="name"
      autocomplete="off"
      :maxlength="maxlength"
      required
      @input="$emit('input', $event.target.value)"
    >
    <input
      v-else
      :value="value"
      type="number"
      name="name"
      autocomplete="off"
      :min="min"
      :max="max"
      required
      @input="$emit('input', $event.target.value)"
    >
    <label
      for="name"
      class="label-name"
    >
      <span class="content-name"> {{ labelText }} </span>
    </label>
  </div>
</template>
<script>
export default {
  props: {
    isText: {
      type: Boolean,
      default: true
    },
    value: {
      type: String,
      default: ''
    },
    labelText: {
      type: String,
      default: 'test'
    },
    maxlength: {
      type: Number,
      default: 32
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 10000
    }
  }
}
</script>

<style lang="scss">
.form {
  width: 300px;
  position: relative;
  height: 50px;
  overflow: hidden;

  input {
    width: 100%;
    height: 100%;
    color: #595f6e;
    padding-top: 13px;
    // padding-right: 0;
    border: none;
    outline: none;
    // padding: 0;
  }

  label {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    border-bottom: 1px solid black;
  }

  label::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 100%;
    border-bottom: 3px solid #5fa8d3;
    transform: translateX(-100%);
    transition: all 0.3s ease;
  }

  .content-name {
    position: absolute;
    bottom: 0;
    left: 2px;
    transition: all 0.3s ease;
  }

  input:focus + .label-name .content-name,
  input:valid + .label-name .content-name,
  input[type=number]:out-of-range + .label-name .content-name {
    transform: translateY(-170%);
    font-size: 14px;
    color: #5fa8d3;
  }

  /* input:valid + .label-name .content-name {
    transform: translateY(-150%);
    font-size: 14px;
    color: #5fa8d3;
  } */

  input:focus + .label-name::after,
  input:valid + .label-name::after {
    transform: translateX(0%);
  }

  input[type=number]:out-of-range + .label-name {
    border-bottom: 1px solid red;
  }

  input[type=number]:out-of-range + .label-name::after {
    border-bottom: 3px solid red;
  }
}
</style>
