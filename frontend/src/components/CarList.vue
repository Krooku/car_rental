<template>
  <div class="flex_box tiles">
    <car-tile
      v-for="car in cars"
      :key="car._id"
      :car="car"
    />
  </div>
</template>
<script>
import CarTile from './CarTile'
export default {
  components: {
    CarTile
  },
  props: {
    cars: {
      type: Array,
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
.tiles {
    margin-top: 20vh;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
    .tile {
        width: 250px;
        background-color: red;
        text-align: center;
        border-radius: 2px;
        padding: 10px 20px;
        margin-top: 5px;
    }
}
</style>
