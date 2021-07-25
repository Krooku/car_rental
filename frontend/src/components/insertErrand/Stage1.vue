<template>
  <form
    class="flex_box stage"
    method="post"
    @submit.prevent="nextStage"
  >
    <input-label
      v-model="errandNumber"
      :type="0"
      :maxlength="64"
      label-text="Numer zlecenia"
    />
    <input-label
      v-model="carNumber"
      :type="0"
      :maxlength="10"
      label-text="Numer rej. auta klienta"
    />
    <input-label
      v-model="tugNumber"
      :type="0"
      :maxlength="10"
      label-text="Numer rej. holownika"
    />
    <button
      data-text="Wyślij"
      class="btn btn--winona"
      type="submit"
    >
      <span> Wyślij </span>
    </button>
  </form>
</template>

<script>
import InputLabel from '../InputLabel'
import api from '../../api'
export default {
  components: { InputLabel },
  data () {
    return {
      errandNumber: null,
      carNumber: null,
      tugNumber: null,
      errand: null,
      error: null
    }
  },
  methods: {
    async nextStage () {
      const response = await api.insertTowingErrand({ errandNumber: this.errandNumber, carNumber: this.carNumber, tugNumber: this.tugNumber })
      if (response.status !== 200) {
        console.log(response.data.message)
        return (this.error = response.data.message)
      }
      this.errand = response.data
      this.$emit('nextStage', this.errand)
    }
  }
}

</script>
