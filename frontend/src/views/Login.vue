<template>
  <div class="flex_box">
    <form
      class="flex_box login"
      method="post"
      @submit.prevent="handleLogin"
    >
      <input-label
        v-model="user.username"
        :type="0"
        label-text="Nazwa użytkownika"
      />
      <input-label
        v-model="user.password"
        :type="1"
        label-text="Hasło"
      />
      <p
        v-if="error"
        class="message message--error"
      >
        {{ error }}
      </p>
      <button
        data-text="Zaloguj się"
        class="btn btn--winona"
        type="submit"
      >
        <span>Zaloguj się</span>
      </button>
    </form>
  </div>
</template>

<script>

import api from '../api'
import InputLabel from '../components/InputLabel'

export default {
  components: {
    InputLabel
  },
  data () {
    return {
      error: null,
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async handleLogin () {
      const response = await api.login(this.user)

      if (response.status !== 200) {
        return (this.error = response.data.message)
      }
      this.$store.dispatch('login', response.data)
      this.$router.push({ name: 'homepage' })
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes show {
  from { opacity: 0 }
  to { opacity: 1 }
}

.login {
  flex-direction: column;
  align-content: space-between;
  justify-content: center;
  margin: 13% 8%;
  gap: 20px;
  opacity: 1;
  animation-name: show;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

</style>
