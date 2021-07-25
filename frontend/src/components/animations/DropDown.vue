<template>
  <transition
    enter-active-class="enter-active"
    leave-active-class="leave-active"
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <slot />
  </transition>
</template>

<script>
export default {
  methods: {
    /**
     * @param {HTMLElement} element
     */
    beforeEnter (element) {
      requestAnimationFrame(() => {
        if (!element.style.height) {
          element.style.height = '0'
        }
        element.style.display = null
      })
    },
    /**
     * @param {HTMLElement} element
     */
    enter (element) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          element.style.height = `${element.scrollHeight}px`
        })
      })
    },
    /**
     * @param {HTMLElement} element
     */
    afterEnter (element) {
      element.style.height = null
    },
    /**
     * @param {HTMLElement} element
     */
    beforeLeave (element) {
      requestAnimationFrame(() => {
        if (!element.style.height) {
          element.style.height = `${element.offsetHeight}px`
        }
      })
    },
    /**
     * @param {HTMLElement} element
     */
    leave (element) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          element.style.height = '0'
        })
      })
    },
    /**
     * @param {HTMLElement} element
     */
    afterLeave (element) {
      element.style.height = null
    }
  }
}
</script>

<style lang="scss" scoped>
.enter-active,
.leave-active {
  overflow: hidden;
  transition: height .5s linear;
}
.expand-enter-active,
.expand-leave-active {
  transition: height 1.5s ease;
  height: 100%;
}
.expand-enter,
.expand-leave-to {
  height: 0;
  overflow: hidden;
}
</style>
