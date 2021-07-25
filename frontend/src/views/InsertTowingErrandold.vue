<template>
  <div>
    <div
      v-if="!loaded"
      class="spinner"
    />
    <div class="flex_box">
      <form
        class="flex_box errand"
        method="post"
        @submit.prevent="insertPhotos"
      >
        <input-label
          v-model="errandNumber"
          :type="0"
          :maxlength="64"
          label-text="Numer zlecenia"
        />
        <input-label
          v-model="kilometers.drive"
          :type="2"
          label-text="Dojazd(KM)"
        />
        <input-label
          v-model="kilometers.towing"
          :type="2"
          label-text="Holowanie(KM)"
        />
        <input-label
          v-model="kilometers.return"
          :type="2"
          label-text="Powrót(KM)"
        />
        <div class="date-box">
          <span class="content-name">
            Data dojazdu
          </span>
          <date-picker
            v-model="journey.planningDate"
            class="date"
            value-type="format"
            :placeholder="rent.planningDate"
            required
          />
        </div>
        <div class="date-box">
          <span class="content-name">
            Godzina dojazdu
          </span>
          <date-picker
            v-model="returnTime"
            class="date"
            :minute-step="1"
            :hour-options="hours"
            format="HH:mm"
            value-type="format"
            type="time"
            :placeholder="returnTime"
          />
        </div>
        <div class="date-box">
          <span class="content-name">
            Data holowania
          </span>
          <date-picker
            v-model="rent.planningDate"
            class="date"
            value-type="format"
            :placeholder="rent.planningDate"
            required
          />
        </div>
        <div class="date-box">
          <span class="content-name">
            Godzina holowania
          </span>
          <date-picker
            v-model="returnTime"
            class="date"
            :minute-step="1"
            :hour-options="hours"
            format="HH:mm"
            value-type="format"
            type="time"
            :placeholder="returnTime"
          />
        </div>
        <div class="date-box">
          <span class="content-name">
            Data powrotu
          </span>
          <date-picker
            v-model="rent.planningDate"
            class="date"
            value-type="format"
            :placeholder="rent.planningDate"
            required
          />
        </div>
        <div class="date-box">
          <span class="content-name">
            Godzina powrotu
          </span>
          <date-picker
            v-model="returnTime"
            class="date"
            :minute-step="1"
            :hour-options="hours"
            format="HH:mm"
            value-type="format"
            type="time"
            :placeholder="returnTime"
          />
        </div>

        <p
          class="clickable"
          @click="takePhoto=!takePhoto"
        >
          Zrób zdjęcia
          <i
            class="icon fas fa-camera"
          />
        </p>
        <p
          v-if="error"
          class="message message--error"
        >
          {{ error }}
        </p>
        <button
          type="submit"
          @click="verifyInput()"
        >
          Wyślij
        </button>
      </form>
    </div>
    <Camera
      v-if="takePhoto"
      @take="takePhotoF"
      @close="takePhoto=false"
    />
    <swiper
      class="swiper"
      :options="swiperOption"
    >
      <swiper-slide
        v-for="photo in photos"
        :key="photo"
        class="slide"
      >
        <img :src="photo">
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
</template>

<script>
import Camera from '../components/Camera'
import InputLabel from '../components/InputLabel'
import api from '../api'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.min.css'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'

export default {
  components: { Camera, InputLabel, Swiper, SwiperSlide, DatePicker },
  data () {
    return {
      swiperOption: {
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      errandNumber: null,
      photos: [],
      takePhoto: false,
      error: null,
      loaded: true
    }
  },
  methods: {
    verifyInput () {
      if (!this.errandNumber || this.errandNumber === '') { return (this.loaded = true) }
      return (this.loaded = false)
    },
    takePhotoF (data) {
      this.photos.push(data)
    },
    async insertPhotos () {
      const response = await api.insertPhotos({ errandNumber: this.errandNumber, photos: this.photos })
      this.loaded = true
      if (response.status !== 200) {
        return (this.error = response.data.message)
      }
      this.$router.push({ name: 'errand', params: { towingErrandId: response.data } })
    }
  }
}

</script>

<style lang="scss" scoped>
.slide {
    width: 100vw !important;
    img {
        margin: 0 auto;
        width: 100%;
        max-width: 1200px;
        height: auto;
    }
}

.errand {
    margin: 0 auto;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    align-items: center;

    .clickable {
        cursor: pointer;
        .icon {
            margin-left: 5px;
        }
    }
}
</style>
