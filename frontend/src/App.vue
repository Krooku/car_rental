<template>
  <div class="main-container">
    <div
      ref="curtain"
      class="curtain"
    />
    <div class="test">
      <nav
        v-if="loggedIn"
        ref="nav"
        class="nav"
      >
        <router-link
          to="/"
          class="logo"
        >
          <span class="hidden">Route to home page</span>
          {{ appName }}
        </router-link>
        <menu-icon
          v-if="mobileMenu"
          ref="m_menu"
          v-model="isActiveMenu"
          @clickFunc="addAnimation"
        />
      </nav>
    </div>
    <nav
      v-if="isActiveMenu"
      class="flex_box nav_items"
    >
      <router-link
        to="/"
        class="item"
      >
        <span class="hidden">Route to rental contracts</span>
        <p
          :class="{ active: currentRouteName === 'homepage' }"
          @click="addAnimationFromMenu(currentRouteName === 'homepage')"
        >
          Wynajmy
        </p>
      </router-link>
      <router-link
        to="/insertTowingErrand"
        class="item"
      >
        <span class="hidden">Route to insert errand page</span>
        <p
          :class="{ active: currentRouteName === 'insertTowingErrand' }"
          @click="addAnimationFromMenu(currentRouteName === 'insertTowingErrand')"
        >
          Dodaj zlecenie
        </p>
      </router-link>
      <router-link
        to="/towingErrand"
        class="item"
      >
        <span class="hidden">Route to towing errands</span>
        <p
          :class="{ active: currentRouteName === 'towingErrand', inactive: currentRouteName !== 'towingErrand' }"
          @click="addAnimationFromMenu(currentRouteName === 'towingErrand')"
        >
          Zlecenia
        </p>
      </router-link>
      <router-link
        v-if="getRole === 'admin'"
        to="/register"
        class="item"
      >
        <span class="hidden">Route to create new account</span>
        <p
          :class="{ active: currentRouteName === 'register', inactive: currentRouteName !== 'register' }"
          @click="addAnimationFromMenu(currentRouteName === 'register')"
        >
          Stwórz konto
        </p>
      </router-link>
      <div
        class="item"
        @click="logout()"
      >
        <span class="hidden">Log out from site</span>
        <p @click="addAnimationFromMenu">
          Wyloguj się
        </p>
      </div>
    </nav>
    <router-view
      ref="view"
      class="content-view"
    />
  </div>
</template>

<script>
import api from './api'
import MenuIcon from './components/MenuIcon'

export default {
  components: { MenuIcon },
  data () {
    return {
      appName: process.env.VUE_APP_NAME || 'TransPol',
      mobileMenu: true,
      isActiveMenu: false
    }
  },
  computed: {
    userLoaded () { return this.$store.getters.userLoaded },
    loggedIn () { return this.$store.getters.loggedIn },
    username () { return this.loggedIn && this.$store.getters.username },
    getRole () { return this.$store.getters.role },
    currentRouteName () { return this.$route.name }
  },
  mounted () {

  },
  methods: {
    addAnimation () {
      this.$refs.curtain.classList.add('show_animation')
      setTimeout(() => {
        this.$refs.curtain.classList.remove('show_animation')
        this.$refs.curtain.classList.add('hide_animation')
        if (this.$refs.view.$el.classList.value.search('hidden') === -1) this.$refs.view.$el.classList.add('hidden')
        if (this.$refs.view.$el.classList.value.search('hidden') !== -1 && !this.isActiveMenu) this.$refs.view.$el.classList.remove('hidden')
        setTimeout(() => {
          this.$refs.curtain.classList.remove('hide_animation')
          this.$refs.m_menu.unblock()
        }, 500)
      }, 1000)
    },
    addAnimationFromMenu (block) {
      if (block) return
      this.isActiveMenu = false
      this.$refs.m_menu.Block()
      this.$refs.curtain.classList.add('show_animation')
      setTimeout(() => {
        this.$refs.curtain.classList.remove('show_animation')
        this.$refs.curtain.classList.add('hide_animation')
        // if (this.$refs.view.$el.classList.value.search('hidden') === -1) this.$refs.view.$el.classList.add('hidden')
        // if (this.$refs.view.$el.classList.value.search('hidden') !== -1 && !this.isActiveMenu) this.$refs.view.$el.classList.remove('hidden')
        setTimeout(() => {
          this.$refs.curtain.classList.remove('hide_animation')
          this.$refs.m_menu.unblock()
          this.$refs.m_menu.setClicked(false)
        }, 500)
      }, 1000)
    },
    logout () {
      // this.addAnimation()
      this.$refs.nav.classList.add('hideY_animation')
      this.isActiveMenu = false
      setTimeout(async () => {
        const response = await api.logout()
        if (response.status === 200) {
          this.$store.dispatch('logout')
          this.$router.push({ name: 'login' })
        }
      }, 1400)
    }
  }
}
</script>

<style lang="scss">
@keyframes hideY {
  from { transform: translate(-50%, 0%); }
  to { transform: translate(-50%, -100%); }
}

@keyframes show {
  from { transform: translateX(-100%); }
  to { transform: translateX(0%); }
}

@keyframes hide {
  from { transform: translateX(0%); }
  to { transform: translateX(100%); }
}

@keyframes backgroundAnimation {
  0% {background-position:0% 65%}
  50% {background-position:100% 36%}
  100% {background-position:0% 65%}
}

.hideY_animation {
    animation-name: hideY;
    animation-duration: 0.5s;
    animation-timing-function: cubic-bezier(.59,.7,.82,.4);
    animation-fill-mode: forwards;
}

.show_animation {
    animation-name: show;
    animation-duration: 0.5s;
    animation-timing-function: cubic-bezier(.59,.7,.82,.4);
    animation-fill-mode: forwards;
}

.hide_animation {
    animation-name: hide;
    animation-duration: 0.5s;
    animation-timing-function: cubic-bezier(.59,.7,.82,.4);
    animation-fill-mode: forwards;
}

body {
  margin: 0;
  overflow-y: scroll;
  overflow-x: hidden;
  font-family: Roboto;
  // background: rgb(26,21,36);
  background: rgb(91, 15, 243);
  background: linear-gradient(142deg, rgba(26,21,36,1) 0%, rgb(78, 59, 124) 20%, rgb(36, 31, 49) 40%, rgba(18,20,31,1) 67%, rgba(14,16,27,1) 80%);
  width: 100%;
  height: 100%;
  background-size: 200% 200%;
  animation: backgroundAnimation 15s ease infinite;
}

a, router-link {
  text-decoration: none;
  color: var(--color-white);
}

.main-container {
  position: relative;
  min-height: 100vh;
  max-height: 100%;
  .curtain {
    z-index: 1;
    position: absolute;
    background: var(--color-bg);
    width: 100%;
    height: 100vh;
    transform: translateX(-100%);
  }
  .test {
    // position: relative;
    height: 60px;
    // padding: 20px;
    nav {
      box-sizing: border-box;
      z-index: 2;
      width: 100%;
      position: absolute;
      display: flex;
      left: 50%;
      transform: translate(-50%, 0);
      max-width: 1600px;
      padding: 20px;
      justify-content: space-between;
      align-items: center;
      color: var(--color-white);

      .logo {
        justify-self: flex-start;
        // color: var(--color-white)
      }
    }
  }
  .nav_items {
    flex-direction: column;
    padding: 20vh 0 0 20vw;
    gap: 15px;
    font-size: 24px;
    height: 100%;
    .item {
      color: var(--color-some-blue);
      align-self: flex-start;

      &:hover {
        color: var(--color-white);
        cursor: pointer;
      }

      p {
        padding: 0;
        margin: 0;
      }
      .active {
        cursor: default;
        color: var(--color-white)
      }
    }
  }
}
</style>
