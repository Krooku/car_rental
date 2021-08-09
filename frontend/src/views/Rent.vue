<template>
  <div>
    rent
  </div>
</template>

<script>
// import api from '../api'

export default {
  data () {
    return {
      error: null,
      rent: {
        carId: '',
        name: '',
        startDate: '',
        endDate: '',
        days: 0,
        planningReturnPlace: '',
        phoneNumber: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
