<template>
  <div
    class="container"
    :class="{ change: clicked }"
    @click="Click()"
  >
    <div class="bar bar--1" />
    <div class="bar bar--2" />
    <div class="bar bar--3" />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
      block: false
    }
  },
  data () {
    return {
      clicked: false
    }
  },
  methods: {
    Click () {
      if (this.block) return
      this.$emit('clickFunc', this.clicked)
      this.block = true
      this.clicked = !this.clicked
      setTimeout(() => {
        this.$emit('input', this.clicked)
      }, 500)
    },
    Block () {
      this.block = true
    },
    unblock () {
      this.block = false
    },
    setClicked (bool) {
      this.clicked = false
    }
  }
}
</script>

<style lang="scss" scoped>

.container {
    position: relative;
    overflow: hidden;
    width: 35px;
    height: 20px;
    cursor: pointer;
    transition: transform 0.5s ease-in-out;
    .bar {
        position: absolute;
        width: 35px;
        height: 3px;
        background-color: var(--color-white);//#333;
        transition: transform 0.4s, opacity 0.4s;
        &--2 {
            top: 50%;
            transform: translate(25%, -50%);
        }
        &--3 {
            bottom: 0;
        }
    }
    &:hover .bar--2 {
        top: 50%;
        transform: translate(0%, -50%);
    }
}

.change {
  .bar {
    &--1 {
      -webkit-transform: rotate(-45deg) translate(-9px, 7px);
      transform: rotate(-45deg) translate(-9px, 7px);
    }
    &--2 {
      opacity: 0;
    }
    &--3 {
      -webkit-transform: rotate(45deg) translate(-8px, -7px);
      transform: rotate(45deg) translate(-8px, -7px);
    }
  }
}
</style>
