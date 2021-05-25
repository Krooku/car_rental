<template>
  <div>
    test
  </div>
</template>

<script>
// import Vuetify from 'vuetify/lib'

export default {
  // vuetify: new Vuetify(),
  name: 'Homepage',
  data () {
    return {
    }
  },
  async beforeRouteEnter (to, from, next) {
    alert('hej')
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

</style>
