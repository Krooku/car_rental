<template>
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
      v-model="errandObj.kilometers.return"
      :type="2"
      label-text="Powrót(KM)"
    />
    <input-label
      v-model="errandObj.surcharge"
      :type="2"
      label-text="Dopłata"
    />
    <div class="date-box">
      <span class="content-name">
        Data Powrotu
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
        Godzina Powrotu
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
    <input-label
      v-model="errandObj.description"
      :type="0"
      :maxlength="128"
      label-text="Uwagi"
    />
    <div
      data-text="Wróc(Holowanie)"
      class="btn btn--winona"
      @click="nextStage(true, false)"
    >
      <span>Wróc(Holowanie)</span>
    </div>
    <div
      data-text="Do weryfikacji"
      class="btn btn--winona"
      @click="nextStage()"
    >
      <span>Do weryfikacji</span>
    </div>
  </form>
</template>

<script>
import InputLabel from '../InputLabel'
import api from '../../api'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
export default {
  components: { InputLabel, DatePicker },
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
        kilometers: { return: null },
        journey: { return: null }
      },
      kilometers: null,
      fullDate: {
        date: this.formatDate(),
        time: this.formatTime()
      },
      surcharge: null,
      description: null,
      loaded: true,
      error: null,
      properties: ['kilometers', 'journey', 'surcharge', 'description']
    }
  },
  mounted () {
    if (this.errand) {
      this.errandObj = Object.assign(this.errandObj, this.errand)

      if (this.errandObj.journey.return) {
        const newDate = new Date(this.errandObj.journey.return)
        if (this.errandObj.journey.return instanceof Date) {
          this.fullDate.date = this.formatDate(0, newDate)
        } else {
          this.fullDate.date = this.errandObj.journey.return
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
      console.log(JSON.stringify(oldArray['kilometers']))
      console.log(JSON.stringify(newArray['kilometers']))
      for (const property in newArray) {
        if (JSON.stringify(oldArray[property]) !== JSON.stringify(newArray[property])) {
          changes.push(property)
        }
      }
      return changes.find(prop => {
        return this.properties.find(result => {
          return prop === result
        })
      })
    },
    async nextStage (next = true, add = true) {
      const splittedTime = this.fullDate.time.split(':')
      const date = new Date(this.fullDate.date)
      date.setHours(splittedTime[0])
      date.setMinutes(splittedTime[1])
      const oldDate = this.errandObj.journey.return
      this.errandObj.journey.return = date
      if (!this.getChanges(this.startErrandObject, this.errandObj)) {
        this.errandObj.journey.return = oldDate
        this.$emit('nextStage', this.errandObj, next, add)
        return
      } else {
        this.errandObj.journey.return = oldDate
      }
      this.loaded = false
      await api.updateTowingErrandReturn({
        errandId: this.errandId,
        kilometers: this.errandObj.kilometers.return,
        date: date,
        surcharge: this.errandObj.surcharge,
        description: this.errandObj.description
      }).then(response => {
        if (response.status !== 200) {
          console.log(response.data.message)
          return (this.error = response.data.message)
        }
        this.loaded = true
        this.$emit('nextStage', response.data, next, add)
      }).catch(error => {
        console.log(error)
        if (error.status !== 200) {
          console.log(error.data.message)
          return (this.error = error.data.message)
        }
      })
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
