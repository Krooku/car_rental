<template>
  <div>
    HOME PAGE
    <form id="form">
      <input
        id="from"
        placeholder="From"
        value="Brussel"
      >
      <input
        id="to"
        placeholder="To"
        value="Antwerpen"
      >
      <input
        type="submit"
        value="GO"
      >
    </form>

    <div id="map" />
  </div>
</template>

<script>
import api from '../api'

export default {
  // vuetify: new Vuetify(),
  name: 'Homepage',
  components: { },
  data () {
    return {
      error: null,
      cars: null
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
  },
  computed: {
  },
  async mounted () {
  },
  methods: {

  }
}
</script>

<style lang="scss">
        #map {
            height: 90%;
        }
.radio_box {
  width: 100%;
  justify-content: center;
  gap: 10px;
  .option {
    width: 70px;
    display: block;
    padding: 16px;
    background-color: red;
    text-align: center;
    border-radius: 3px;
    &:nth-child(2) {
      margin: 0 10px;
    }
    &--active {
      background-color: green;
    }
  }
}
</style>
