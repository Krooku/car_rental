<template>
  <div v-if="show">
    <div
      v-if="!loaded"
      class="spinner"
    />
    <div v-if="errand">
      <div class="flex_box top-row">
        <p class="errand-number">
          {{ errand.errandNumber }}
        </p>
        <button @click="downloadFiles()">
          Pobierz <i class="fas fa-download" />
        </button>
      </div>
      <swiper
        class="swiper"
        :options="swiperOption"
      >
        <swiper-slide
          v-for="photo in errand"
          :key="photo._id"
          class="slide"
        >
          <img :src="photo.data">
        </swiper-slide>
        <div
          slot="button-prev"
          class="swiper-button-prev"
        />
        <div
          slot="button-next"
          class="swiper-button-next"
        />
      </swiper>
    </div>
  </div>
</template>

<script>
import api from '../api'
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.min.css'

export default {
  components: { Swiper, SwiperSlide },
  data () {
    return {
      errandId: this.$route.params.towingErrandId,
      errand: {},
      swiperOption: {
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      loaded: false,
      show: false
    }
  },
  mounted () {
    setTimeout(() => {
      this.show = true
    }, 500)
  },
  async beforeRouteUpdate (to, from, next) {
    const errand = await api.getImages(to.params.towingErrandId)

    if (errand.status !== 200) {
      return next({ name: 'homepage' })
    }
    this.errand = errand.data
    this.loaded = true
    next()
  },
  async beforeRouteEnter (to, from, next) {
    const errand = await api.getImages(to.params.towingErrandId)

    if (errand.status !== 200) {
      return next({ name: 'homepage' })
    }
    next(vm => {
      // set car to rent
      // Object.assign(vm.errand, errand.data) // ?
      console.log(errand.data)
      vm.errand = errand.data
      vm.loaded = true
    })

    /* const [errand, user] = await Promise.all([
      api.getErrand(to.params.errandId),
      api.getUser()
    ])

    if (errand.status !== 200 || user.status !== 200) next({ name: 'homepage' })

    next(vm => {
      Object.assign(vm.errand, errand.data) // ?
      vm.errand = errand.data
      Object.assign(vm.user, user.data) // ?
      vm.user = user.data
    }) */
  },
  methods: {
    downloadFiles () {
      this.loaded = false
      let zip = new JSZip()
      let i = 1
      this.errand.forEach((errand) => {
        let base64 = errand.data
        let index = base64.indexOf(',')
        if (index !== -1) { base64 = base64.substring(index + 1, base64.length) }

        zip.folder('images').file(`image${i}.jpg`, base64, { base64: true })
        i++
      })
      zip.generateAsync({ type: 'blob' }).then(content => {
        // Generate a binary stream
        FileSaver.saveAs(content, 'test.zip') // Save the file with file-saver Custom file name
        this.loaded = true
      }, err => {
        console.log(err)
        this.loaded = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.top-row {
    justify-content: space-between;
    margin: 0 15%;
    .errand-number {
        align-self: flex-end;
        font-weight: bold;
        letter-spacing: 2px;
        font-size: 16px;
    }
    button {
        border: none;
        background: none;

        &:hover {
            cursor: pointer;
        }
    }
}
.slide {
    // width: 100%;
    img {
        display: block;
        margin: 0 auto;
        width: 100%;
        max-width: 1600px;
        height: auto;
        &:hover {
          cursor: move;
        }
    }
}

</style>
