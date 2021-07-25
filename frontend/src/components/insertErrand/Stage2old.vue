<template>
  <form
    class="flex_box stage"
    method="post"
    @submit.prevent="nextStage"
  >
    <input-label
      v-model="kilometers"
      :type="2"
      label-text="Dojazd(KM)"
    />
    <input-label
      v-model="DMC"
      :type="2"
      label-text="DMC"
    />
    <input-label
      v-model="incidentPlace"
      :type="0"
      :maxlength="64"
      label-text="Miejsce zdarzenia"
    />
    <div class="date-box">
      <span class="content-name">
        Data dojazdu
      </span>
      <date-picker
        v-model="fullDate.date"
        class="date"
        value-type="format"
        :placeholder="fullDate.date"
        required
      />
    </div>
    <div class="date-box">
      <span class="content-name">
        Godzina dojazdu
      </span>
      <date-picker
        v-model="fullDate.time"
        class="date"
        :minute-step="1"
        format="HH:mm"
        value-type="format"
        type="time"
        :placeholder="fullDate.time"
      />
    </div>
    <div
      class="transport_container"
      :class="{ 'transport_container--active': isTransport, '': !isTransport }"
    >
      <p> Czy odbędzie się transport osób? </p>
      <div class="flex_box answer">
        <div
          class="answer_btn"
          :class="{ 'answer_btn--active': isTransport, '': !isTransport }"
          @click="isTransport=true; $refs.quantity.setActive(true); $refs.transport_type.setActive(true)"
        >
          TAK
        </div>
        <div
          class="answer_btn"
          :class="{ 'answer_btn--active': !isTransport, '': isTransport }"
          @click="isTransport=false; $refs.quantity.setActive(false); $refs.transport_type.setActive(false)"
        >
          NIE
        </div>
      </div>
      <input-label
        ref="quantity"
        v-model="transport.quantity"
        :type="2"
        :is-active="false"
        label-text="Ilość transportowanych osób"
      />
      <check-box
        ref="transport_type"
        v-model="transport.type"
        :is-active="false"
        text-label="Sposób transpotu osób"
        :options="['Kabina', 'Osobowy', 'Oba']"
      />
    </div>
    <input-label
      v-model="description"
      :type="0"
      :maxlength="128"
      label-text="Uwagi"
    />
    <p
      class="clickable"
      @click="takePhoto=!takePhoto"
    >
      Zrób zdjęcia
      <i
        class="icon fas fa-camera"
      />
    </p>
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
    <button
      type="submit"
    >
      Wyślij
    </button>
  </form>
</template>

<script>
import InputLabel from '../InputLabel'
import api from '../../api'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import Camera from '../Camera'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.min.css'
import CheckBox from '../CheckBox'
export default {
  components: { InputLabel, DatePicker, Camera, Swiper, SwiperSlide, CheckBox },
  props: {
    errandId: {
      type: String,
      required: true
    },
    errand: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      swiperOption: {
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      kilometers: null,
      fullDate: {
        date: this.formatDate(),
        time: this.formatTime()
      },
      DMC: null,
      incidentPlace: null,
      photos: [],
      isTransport: false,
      transport: {
        quantity: null,
        type: ''
      },
      description: null,
      takePhoto: false,
      loaded: true,
      error: null
    }
  },
  mounted () {
    if (this.errand) {
      if (this.errand.kilometers.drive) {
        this.kilometers = this.errand.kilometers.drive.toString()
      }
      if (this.errand.DMC) {
        this.DMC = this.errand.DMC.toString()
      }
      if (this.errand.incidentPlace) {
        this.incidentPlace = this.errand.incidentPlace
      }
      if (this.errand.photos) {
        this.photos = this.errand.photos
      }
      if (this.errand.description) {
        this.description = this.errand.description
      }
      if (this.errand.journey.drive) {
        this.fullDate.date = this.errand.journey.drive
        const newDate = new Date(this.errand.journey.drive)
        if (newDate.getMinutes() < 10) {
          this.fullDate.time = `${newDate.getHours()}:0${newDate.getMinutes()}`
        } else {
          this.fullDate.time = `${newDate.getHours()}:${newDate.getMinutes()}`
        }
      }
    }
  },
  methods: {
    checkChanges () {

    },
    async nextStage () {
      const splittedTime = this.fullDate.time.split(':')
      const date = new Date(this.fullDate.date)
      date.setHours(splittedTime[0])
      date.setMinutes(splittedTime[1])
      if (this.transport.quantity !== null) {
        var transport = this.transport
      }
      const response = await api.updateTowingErrandDrive({
        errandId: this.errandId,
        kilometers: this.kilometers,
        date: date,
        DMC: this.DMC,
        incidentPlace: this.incidentPlace,
        photos: this.photos,
        transport: transport,
        description: this.description
      })
      if (response.status !== 200) {
        console.log(response.data.message)
        return (this.error = response.data.message)
      }
      this.$emit('nextStage', response.data)
    },
    takePhotoF (data) {
      this.photos.push(data)
    },
    formatDate (days = 0) {
      const d = new Date()
      d.setDate(d.getDate() + days)
      let month = '' + (d.getMonth() + 1)
      let day = '' + d.getDate()//  + days
      const year = d.getFullYear()

      if (month.length < 2) { month = `0${month}` }
      if (day.length < 2) { day = `0${day}` }

      return [year, month, day].join('-')
    },
    formatTime () {
      const d = new Date()
      d.setDate(d.getDate())
      let time = ''
      const hours = d.getHours()
      const minutes = d.getMinutes()

      if (hours < 10) {
        time += `0${hours}:` // '0' + hours + ':'
      } else {
        time += `${hours}:` // hours + ':'
      }
      if (minutes < 10) {
        time += `0${minutes}` // '0' + minutes
      } else {
        time += minutes
      }
      return time
    }
  }
}

</script>
