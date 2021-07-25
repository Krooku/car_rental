<template>
  <div>
    <p> {{ textLabel }} </p>
    <div
      ref="container"
      class="flex_box options"
    >
      <div
        v-for="(option, index) in options"
        ref="options"
        :key="option"
        class="option"
        @click="setValue(option, index)"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    },
    textLabel: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      selected: this.value,
      active: this.isActive
    }
  },
  mounted () {
    if (!this.isActive) {
      this.$refs.container.classList.add('unactive')
    }
    this.$refs.options.forEach(element => {
      element.style.margin = `0 0 0 ${element.clientHeight}px`
      element.style.width = `${element.clientHeight}px`
    })
    if (this.value && this.value !== '') {
      this.setActive(true)
      this.setValue(this.value, this.options.indexOf(this.value))
    }
  },
  methods: {
    handleValue () {
      this.$emit('input', this.selected)
    },
    setValue (option, index) {
      if (!this.active) {
        return
      }
      if (Object.values(this.$refs.options[index].classList).find(element => element === 'option-active')) {
        this.$refs.options[index].classList.remove('option-active')
        this.selected = ''
      } else {
        this.$refs.options.forEach(element => {
          element.classList.remove('option-active')
        })
        this.$refs.options[index].classList.add('option-active')
        this.selected = option
      }
      this.handleValue()
    },
    setActive (active) {
      if (this.active === active) {
        return
      }
      this.active = active
      if (this.active) {
        this.$refs.container.classList.remove('unactive')
        this.$refs.container.classList.add('unactive-leave')
        setTimeout(() => { this.$refs.container.classList.remove('unactive-leave') }, 800)
      } else {
        this.$refs.container.classList.add('unactive')
        this.$refs.options.forEach(element => {
          element.classList.remove('option-active')
        })
        this.selected = ''
        this.handleValue()
      }
    }
  }
}

</script>

<style lang="scss" scoped>
.options {
    justify-content: space-between;
    padding: 0 20px 0 0;
    overflow: hidden;

    .option {
        position: relative;
        cursor: pointer;
    }
    .option::before {
        content: '';
        position: absolute;
        width: 50%;
        height: 50%;
        border: solid 1px black;
        left: -90%;
        top: 50%;
        transform: translate(0, -55%);
        transition: background-color 1s;
        &:hover::before {
            background-color: green;
        }
    }

    .option-active::before {
        content: '';
        position: absolute;
        width: 50%;
        height: 50%;
        background-color: green;
        left: -90%;
        top: 50%;
        transform: translate(0, -55%);
    }
}

.unactive {
    position: relative;
    &::before {
        content: '';
        position: absolute;
        border-top: solid 1px black;
        width: 100%;
        top: 50%;
        animation: move_border 0.8s linear;
    }
}
.unactive-leave {
    position: relative;
    &::before {
        content: '';
        position: absolute;
        width: 100%;
        top: 50%;
        border-top: solid 1px black;
        animation: move_border_r 0.8s linear;
    }
}
</style>
