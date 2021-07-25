<template>
  <div class="form">
    <input
      v-if="type==0"
      :value="value"
      spellcheck="false"
      type="text"
      name="name"
      autocomplete="new password"
      minlength="1"
      :maxlength="maxlength"
      :required="required"
      :disabled="!active"
      @input="$emit('input', $event.target.value)"
    >
    <input
      v-else-if="type==1"
      :value="value"
      type="password"
      name="name"
      autocomplete="off"
      :maxlength="maxlength"
      :required="required"
      :disabled="!active"
      @input="$emit('input', $event.target.value)"
    >
    <input
      v-else-if="type==2"
      :value="value"
      type="email"
      name="name"
      autocomplete="off"
      :maxlength="maxlength"
      :required="required"
      :disabled="!active"
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
      :required="required"
      :disabled="!active"
      @input="$emit('input', $event.target.value)"
    >
    <label
      for="name"
      class="label-name"
    >
      <span
        ref="label"
        class="content-name"
      > {{ labelText }} </span>
    </label>
  </div>
</template>
<script>
export default {
  props: {
    /** 0 - text, 1 - password, 2 - email, *-- number */
    type: {
      type: Number,
      default: 0
    },
    value: {
      type: [String, Number],
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
    },
    isActive: {
      type: Boolean,
      default: true
    },
    required: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      active: this.isActive,
      val: this.value
    }
  },
  mounted () {
    if (!this.active) {
      this.$refs.label.classList.add('unactive')
    }
  },
  methods: {
    setActive (active) {
      if (this.active === active) {
        return
      }
      this.active = active
      if (this.active) {
        this.$refs.label.classList.remove('unactive')
        this.$refs.label.classList.add('unactive-leave')
        setTimeout(() => { this.$refs.label.classList.remove('unactive-leave') }, 800)
      } else {
        this.$refs.label.classList.add('unactive')
        this.val = ''
        this.$emit('input', this.val)
      }
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
    background-color: transparent;
    color: var(--input-text);
    padding-top: 13px;
    border: none;
    outline: none;
  }

  label {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    border-bottom: 1px solid var(--input-border);
  }

  label::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 100%;
    border-bottom: 1px solid var(--input-border-active);
    transform: translateX(-100%);
    transition: all 0.3s ease;
  }

  .content-name {
    position: absolute;
    color: var(--input-text);
    bottom: 0;
    left: 2px;
    transition: all 0.3s ease;
  }

  .unactive::before {
    content: '';
    position: absolute;
    width: 100%;
    top: 50%;
    border-top: solid 1px var(--input-disable-border);
    animation: move_border 0.8s linear;
  }

  .unactive-leave::before {
    content: '';
    position: absolute;
    width: 100%;
    top: 50%;
    border-top: solid 1px var(--input-disable-border);
    animation: move_border_r 0.8s linear;
  }

  input:focus + .label-name .content-name,
  input:valid + .label-name .content-name,
  input[type=number]:out-of-range + .label-name .content-name {
    transform: translateY(-170%);
    font-size: 14px;
    color: var(--input-text-active);
  }

  input[type=email]:invalid + .label-name .content-name {
    transform: translateY(-170%);
    font-size: 14px;
    color: var(--input-border-warning);
  }
  input[type=email]:invalid + .label-name {
    border-bottom: 1px solid var(--input-border-warning);
  }

  input:focus + .label-name::after,
  input:valid + .label-name::after {
    transform: translateX(0%);
  }

  input[type=number]:out-of-range + .label-name {
    border-bottom: 1px solid var(--input-border-warning);
  }

  input[type=number]:out-of-range + .label-name::after {
    border-bottom: 1px solid var(--input-border-warning);
  }
}
</style>
