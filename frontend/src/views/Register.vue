<template>
  <div class="flex_box container">
    <form
      method="post"
      @submit.prevent="handleRegister"
    >
      <input-label
        v-model="user.username"
        :type="0"
        label-text="Nazwa użytkownika"
      />
      <input-label
        v-model="user.email"
        :type="2"
        label-text="E-mail"
      />
      <div>
        <p>Typ konta</p>
        <input
          id="member"
          v-model="user.role"
          type="radio"
          value="member"
        >
        <label for="member">Zwykłe</label>
        <br>
        <input
          id="two"
          v-model="user.role"
          type="radio"
          value="admin"
        >
        <label for="two">Administrator</label>
      </div>
      <p
        v-if="message.text"
        :class="message.style"
      >
        {{ message.text }}
      </p>
      <button
        class="btn btn--winona"
        type="submit"
        data-text="Stwórz konto"
      >
        <span>Stwórz konto</span>
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
      user: {},
      emptyUser: {
        username: '',
        email: '',
        role: ''
      },
      message: {
        style: null,
        text: null
      }
    }
  },
  created () {
    this.resetUser()
  },
  methods: {
    resetUser () {
      Object.assign(this.user, this.emptyUser)
    },
    displayMessage (type, message) {
      this.message.style = `message message--${type}`
      this.message.text = message
    },
    async handleRegister () {
      const response = await api.register(this.user)

      if (response.status !== 200) {
        return void this.displayMessage('error', response.data.message)
      }

      this.displayMessage(
        'success',
        `Rejestracja udana. Dane do logowania na nowe konto zostały wysłane na e-mail ${this.user.email}. Nie doszedł mail? Sprawdź folder spam.`
      )

      this.resetUser()
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
    align-items: center;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    gap: 20px;
    padding: 10vh 0;

}
</style>
