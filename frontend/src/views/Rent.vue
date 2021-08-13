<template>
  <div>
    {{ testRent.carId }}
    <div @click="createRent()">
      testowy button
    </div>
  </div>
</template>

<script>
import api from '../api'

export default {
  data () {
    return {
      error: null,
      rent: null,
      emptyRent: {
        carId: this.$route.params.carId,
        name: '',
        startDate: '',
        endDate: '',
        days: 0,
        planningReturnPlace: '',
        phoneNumber: ''
      },
      testRent: {
        carId: this.$route.params.carId,
        name: 'test',
        startDate: new Date(),
        endDate: new Date(),
        days: 0,
        planningReturnPlace: 'U wiki na chacie ',
        phoneNumber: '1414123123'
      }
    }
  },
  methods: {
    async createRent () {
      this.testRent.endDate.setDate(this.testRent.endDate.getDate() + 1)
      const response = await api.createRent(this.testRent)

      if (response.status !== 200) {
        return (this.error = response.data.message)
      }
      console.log('done without error')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
