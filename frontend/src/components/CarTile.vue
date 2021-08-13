<template>
  <div class="tile">
    <p> {{ car.registrationNumber }} </p>
    <p> {{ car.model }} {{ car.brand }}</p>
    <router-link
      :to="{ name: 'rent', params: { carId: car._id}}"
    >
      Wypożycz
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    car: {
      type: Object,
      required: true
    }
  },
  mounted () {
    var body = document.body
    body.classList.add('modal-open')
  },
  methods: {
    closeModal () {
      this.$emit('close')
      var body = document.body
      body.classList.remove('modal-open')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
