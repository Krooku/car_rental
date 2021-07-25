<template>
  <div id="login_site">
    <div>
      <form
        method="post"
        @submit.prevent="insertCar"
      >
        <input
          v-model="car.registrationNumber"
          type="text"
          placeholder="Numer rejestracyjny"
          required
        >
        <input
          v-model="car.brand"
          type="text"
          placeholder="brand"
          required
        >
        <input
          v-model="car.model"
          type="text"
          placeholder="model"
          required
        >
        <input
          v-model="car.classCar"
          type="text"
          placeholder="klasa"
          required
        >
        <input
          v-model="car.vin"
          type="text"
          placeholder="vin"
          required
        >
        <button type="submit">
          Stwórz
        </button>
      </form>
    </div>
  </div>
</template>

<script>

import api from '../api'

export default {
  data () {
    return {
      error: null,
      car: {
        registrationNumber: '',
        brand: '',
        model: '',
        classCar: '',
        vin: ''
      }
    }
  },
  methods: {
    async insertCar () {
      const response = await api.insertCar(this.car)

      if (response.status !== 200) {
        return (this.error = response.data.message)
      }
    }
  }
}
</script>
