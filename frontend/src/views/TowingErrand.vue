<template>
  <div
    v-if="show"
    class="flex_box center"
  >
    <div
      v-if="!loaded"
      class="spinner"
    />
    <div class="flex_box dates">
      <div class="date-box">
        <span class="content-name">
          Od daty
        </span>
        <date-picker
          v-model="fromDate"
          class="date"
          value-type="format"
          required
        />
      </div>
      <div class="date-box">
        <span class="content-name">
          Do daty
        </span>
        <date-picker
          v-model="toDate"
          class="date"
          value-type="format"
          required
        />
      </div>
      <button @click="getErrandsByDate()">
        Szukaj
      </button>
    </div>

    <div class="wrapper">
      <input
        v-model="query"
      >
      <!-- <div
        v-if="errands && errands.length > 0"
        class="table"
      >
        <div class="row">
        <span> Numer zlecenia </span> <span> Kierowca </span> <span> Status </span>
        </div> -->

      <!-- <transition-group
        name="list-complete"
        tag="div"
        class="table"
      >
        <div
          v-for="index in fields.length"
          :key="index"
          class="list-complete-item"
        >
          <div v-if="fields[index-1] === 'errandNumber'">
            Numer Zlecenia
          </div>
          <div v-else-if="fields[index-1] === 'userId'">
            Kierowca
          </div>
          <div v-else-if="fields[index-1] === 'status'">
            Status
          </div>
          <div v-else>
            {{ fields[index-1] }}
          </div>
        </div>
      </transition-group> -->
      <div class="table">
        <p> Numer zlecenia </p>
        <p> Kierowca </p>
        <p> Status </p>
        <transition-group
          name="list-complete"
          tag="p"
        >
          <span
            v-for="item in filtered"
            :key="item._id"
            class="list-complete-item border"
          >
            <router-link
              :to="{ name: 'errand', params: { towingErrandId: item._id}}"
            >
              {{ item.errandNumber }}
            </router-link>
          </span>
        </transition-group>
        <transition-group
          name="list-complete"
          tag="p"
        >
          <span
            v-for="item in filtered"
            :key="item._id"
            class="list-complete-item border"
          >
            <span v-if="item.userId !== null"> {{ item.userId.username }} </span>
            <span v-else> null </span>
          </span>
        </transition-group>
        <transition-group
          name="list-complete"
          tag="p"
        >
          <span
            v-for="item in filtered"
            :key="item._id"
            class="list-complete-item border"
          >
            {{ item.status }}
          </span>
        </transition-group>
      </div>
      <!-- <transition-group
          name="list-complete"
          tag="div"
        >
          <div
            v-for="(err, index) in filtered"
            :key="err._id"
            :data-index="index"
            class="row list-complete-item"
          >
            <div class="field">
              <router-link
                v-if="err.status === 'during'"
                :to="{ name: 'insertTowingErrandWithId', params: { towingErrandId: err._id}}"
              >
                {{ err.errandNumber }}
              </router-link>
              <router-link
                v-else
                :to="{ name: 'errand', params: { towingErrandId: err._id }}"
              >
                {{ err.errandNumber }}
              </router-link>
            </div>
            <div class="field">
              {{ err.userId.username }}
            </div>
            <div
              v-if="err.status === 'during'"
              class="field"
            >
              W trakcie
            </div>
            <div
              v-else-if="err.status === 'realized'"
              class="field"
            >
              Zrealizowane
            </div>
            <div
              v-else-if="err.status === 'canceled'"
              class="field"
            >
              Anulowane
            </div>
          </div>
        </transition-group> -->
      <!-- </div> -->
    </div>
    <p v-if="!errands || errands.length == 0">
      Brak zleceń
    </p>
  </div>
</template>

<script>
import api from '../api'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
// import Velocity from 'velocity-animate'
export default {
  components: { DatePicker },
  data () {
    return {
      query: '',
      search: null,
      loadedErrands: 10,
      error: null,
      errands: null,
      filtered: [],
      loaded: true,
      show: false,
      el: null,
      fromDate: null,
      toDate: null,
      fieldsNumber: 0,
      fields: [],
      columnNumber: 0
    }
  },
  computed: {
    computedList: function () {
      var vm = this
      return this.errands.filter(function (item) {
        return item.errandNumber.toLowerCase().indexOf(vm.query.toLowerCase()) !== -1
      })
    }
  },
  watch: {
    query: function (val, oldVal) {
      // this.filtered = this.errands
      this.filtered = this.errands.filter((item, index) => {
        // console.log(`${item.errandNumber} ${item.errandNumber.toLowerCase().indexOf(this.query.toLowerCase()) !== -1}`)
        // if (index === 0) return item
        return item.errandNumber.toLowerCase().indexOf(this.query.toLowerCase()) !== -1
      })
      // this.fieldsNumber = this.filtered.length * this.columnNumber
      // this.fillFields()
      console.log(this.filtered)
    }
  },
  mounted () {
    setTimeout(() => {
      this.show = true
    }, 500)
  },
  async beforeRouteUpdate (to, from, next) {
    const response = await api.listTowingErrands('today', { fromDate: null, toDate: null })

    if (response.status !== 200) {
      return next({ name: 'insertTowingErrand' })
    }
    this.errands = response.data
    this.filtered = response.data
    // this.fillFields()
    // this.fieldsNumber = this.errands.length * this.columnNumber
    next()
  },
  async beforeRouteEnter (to, from, next) {
    const response = await api.listTowingErrands('brak', { fromDate: null, toDate: null })

    if (response.status !== 200) {
      return next({ name: 'insertTowingErrand' })
    }
    next(vm => {
      console.log(response.data)
      vm.errands = response.data
      vm.filtered = response.data
      // vm.fillFields()
      // vm.fieldsNumber = vm.errands.length * vm.columnNumber
    })
    // next()
  },
  methods: {
    async getErrandsByDate () {
      const response = await api.listTowingErrands('dowolny', { fromDate: this.fromDate, toDate: this.toDate })

      if (response.status !== 200) {
        this.$router.push({ name: 'insertTowingErrand' })
      }
      console.log(response.data)
      this.errands = response.data
      this.filtered = response.data
    },
    fillFields () {
      if (this.fields.length > 0) {
        this.fields.splice(this.columnNumber, this.fields.length)
      }
      this.filtered.forEach((item, index) => {
        if (index === 0 && this.fields.length === 0) {
          for (const property in item) {
            if (property === '_id') {
              console.log(property)
              this.fields.push(property); this.columnNumber++
            }
          }
        }
        for (const property in item) {
          if (property === '_id') {
            if (property === 'userId') {
              this.fields.push(item[property].username)
            } else {
              this.fields.push(item[property])
            }
          }
        }
      })
      console.log(this.fields)
    },
    filterList () {
      this.filtered = this.errands
      this.filtered = this.errands.filter((item) => {
        // console.log(`${item.errandNumber} ${item.errandNumber.toLowerCase().indexOf(this.query.toLowerCase()) !== -1}`)
        return item.errandNumber.toLowerCase().indexOf(this.query.toLowerCase()) !== -1
      })
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

.center {
  justify-content: center;
  flex-direction: column;
  // max-width: 400px;
  padding-bottom: 20px;
  align-items: center;

  .dates {
    flex-direction: column;
    max-width: 300px;
    align-items: center;
  }

  .wrapper {
    // position: relative;
    // max-width: 100%;
    width: 100%;
    .table {
      // position: relative;
      // width: auto;
      width: 100%;
        // display: flex;
        // flex-direction: column;
        display: grid;
        grid-template-columns: minmax(50%, auto) minmax(auto, 1fr) minmax(auto, 1fr);
        white-space: nowrap;
      color: white;
      // background-color: violet;
      .border {
        border: solid black 1px;
        padding: 4px;
      }

      .row {
        display: grid;
        width: 100%;
        grid-template-columns: minmax(auto, 1fr) minmax(auto, 1fr) minmax(auto, 1fr);

      }
      .row {
        // position: absolute;
        // width: 100%;
        // min-width: 300px;
        // max-width: 1000px;
        // background-color: red;
        // display: flex;
        .tab {
          // width: 100%;
        }
      }
    }
  }
}

.list-complete-item {
  transition: all 1s;
  // flex: 0 0 33.333333%;
  display: flex;
  color: white;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(-30px);
}
.list-complete-leave-active {
  position: absolute;
  width: 100%;
  div {
    // position: absolute;
  }
}
</style>
