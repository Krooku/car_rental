<template>
  <div>
    <h2>Wypożyczalnia</h2>
    <car-list :cars="cars" />
  </div>
</template>

<script>
import api from '../api'
import CarList from '../components/CarList'

export default {
  name: 'Rental',
  components: { CarList },
  data () {
    return {
      error: null,
      cars: []
    }
  },
  async beforeRouteEnter (to, from, next) {
    const response = await api.listCars()

    if (response.status !== 200) {
      return (this.error = response.data.message)
    }
    next(vm => {
      vm.cars = response.data
    })
    next()
  }
}
</script>
