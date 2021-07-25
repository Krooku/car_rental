<template>
  <div>
    <form
      class="flex_box stage"
      method="post"
      @submit.prevent="nextStage"
    >
      <div
        v-if="!loaded"
        class="spinner"
      />
      <input-label
        v-model="errandObj.kilometers.drive"
        :type="2"
        label-text="Dojazd(KM)"
      />
      <input-label
        v-model="errandObj.DMC"
        :type="2"
        label-text="DMC"
      />
      <input-label
        v-model="errandObj.incidentPlace"
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
            class="btn answer_btn"
            :class="{ 'answer_btn--active': isTransport, '': !isTransport }"
            @click="showTransport(true)"
          >
            TAK
          </div>
          <div
            class="btn answer_btn"
            :class="{ 'answer_btn--active': !isTransport, '': isTransport }"
            @click="showTransport(false)"
          >
            NIE
          </div>
        </div>
        <drop-down>
          <div v-if="isTransport">
            <input-label
              ref="quantity"
              v-model="errandObj.transport.quantity"
              :type="2"
              label-text="Ilość transportowanych osób"
            />
            <check-box
              v-if="errandObj.transport.type || errandObj.transport.type === ''"
              ref="transport_type"
              v-model="errandObj.transport.type"
              text-label="Sposób transpotu osób"
              :options="['Kabina', 'Osobowy', 'Oba']"
            />
          </div>
        </drop-down>
      </div>
      <input-label
        v-model="errandObj.description"
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
        /><span v-if="photos.length>0">Wysyłanie {{ compliteSend }} z {{ photos.length }} </span>
      </p>
      <Camera
        v-if="takePhoto"
        @take="takePhotoF"
        @close="sendPhotos()"
      />
      <div
        data-text="Dalej(Holowanie)"
        class="btn btn--winona"
        @click="nextStage"
      >
        <span>Dalej(Holowanie)</span>
      </div>
    </form>
  </div>
</template>

<script>
import InputLabel from '../InputLabel'
import api from '../../api'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import Camera from '../Camera'
import CheckBox from '../CheckBox'
import DropDown from '../animations/DropDown'
export default {
  components: { InputLabel, DatePicker, Camera, CheckBox, DropDown },
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
      startErrandObject: {},
      errandObj: {
        kilometers: { drive: null },
        journey: { drive: null },
        transport: { quantity: null, type: null }
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
      error: null,
      properties: ['DMC', 'kilometers', 'incidentPlace', 'photos', 'journey', 'transport', 'description'],
      compliteSend: 0
    }
  },
  mounted () {
    if (this.errand) {
      this.errandObj = Object.assign(this.errandObj, this.errand)
      if (this.errandObj.transport === null) {
        this.errandObj.transport = { quantity: null, type: '' }
      }
      if (this.errandObj.transport.type === null) {
        this.errandObj.transport.type = ''
      }
      if (this.errandObj.transport.quantity) {
        this.isTransport = true
      }
      if (this.errandObj.journey.drive) {
        const newDate = new Date(this.errandObj.journey.drive)
        if (this.errandObj.journey.drive instanceof Date) {
          this.fullDate.date = this.formatDate(0, newDate)
        } else {
          this.fullDate.date = this.errandObj.journey.drive
        }
        if (newDate.getMinutes() < 10) {
          this.fullDate.time = `${newDate.getHours()}:0${newDate.getMinutes()}`
        } else {
          this.fullDate.time = `${newDate.getHours()}:${newDate.getMinutes()}`
        }
      }
    }
    const jsonStr = JSON.stringify(this.errandObj)
    this.startErrandObject = JSON.parse(jsonStr)
  },
  methods: {
    sendPhotos () {
      this.takePhoto = false
      this.photos.forEach(async (image) => {
        let t1 = performance.now()
        const res = await api.addImage({ errandId: this.errandId, image })
        if (res.status !== 200) {
          return console.log(res.data.error)
        }
        let t3 = performance.now()
        this.compliteSend++
        console.log(t3 - t1)
        console.log(res.data)
      })
    },
    getChanges (oldArray, newArray) {
      var changes
      if (JSON.stringify(oldArray) === JSON.stringify(newArray)) {
        return false
      }
      changes = []
      // let longerObj = newArray
      if (Object.keys(oldArray).length > Object.keys(newArray).length) {
        // longerObj = oldArray
      }
      // console.log(JSON.stringify(oldArray['kilometers']))
      // console.log(JSON.stringify(newArray['kilometers']))
      for (const property in newArray) {
        if (JSON.stringify(oldArray[property]) !== JSON.stringify(newArray[property])) {
          changes.push(property)
        }
      }
      console.log(changes)
      return changes.find(prop => {
        return this.properties.find(result => {
          return prop === result
        })
      })
    },
    showTransport (isTransport) {
      this.isTransport = isTransport
      // this.$refs.quantity.setActive(isTransport)
      if (this.$refs.transport_type) {
        // this.$refs.transport_type.setActive(isTransport)
      }
    },
    async nextStage (next = true) {
      if (this.compliteSend !== this.photos.length) {
        return
      }
      const splittedTime = this.fullDate.time.split(':')
      const date = new Date(this.fullDate.date)
      date.setHours(splittedTime[0])
      date.setMinutes(splittedTime[1])
      const oldDate = this.errandObj.journey.drive
      this.errandObj.journey.drive = date
      if (!this.getChanges(this.startErrandObject, this.errandObj)) {
        this.errandObj.journey.drive = oldDate
        this.$emit('nextStage', this.errandObj)
        return
      } else {
        this.errandObj.journey.drive = oldDate
      }
      if (this.errandObj.transport.quantity !== null) {
        var transport = this.errandObj.transport
      }
      // const response =
      this.loaded = false
      console.log(this.errandObj)
      await api.updateTowingErrandDrive({
        errandId: this.errandId,
        kilometers: this.errandObj.kilometers.drive,
        date: date,
        DMC: this.errandObj.DMC,
        incidentPlace: this.errandObj.incidentPlace,
        transport: transport,
        description: this.errandObj.description
      }).then(response => {
        if (response.status !== 200) {
          console.log(response.data.message)
          return (this.error = response.data.message)
        }
        this.loaded = true
        this.$emit('nextStage', response.data, next)
      }).catch(error => {
        console.log(error)
        if (error.status !== 200) {
          console.log(error.data.message)
          return (this.error = error.data.message)
        }
      })
      /* if (response.status !== 200) {
        console.log(response.data.message)
        return (this.error = response.data.message)
      }
      this.$emit('nextStage', response.data) */
    },
    takePhotoF (data) {
      this.photos.push(data)
    },
    formatDate (days = 0, date = new Date()) {
      date.setDate(date.getDate() + days)
      let month = '' + (date.getMonth() + 1)
      let day = '' + date.getDate()//  + days
      const year = date.getFullYear()
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
