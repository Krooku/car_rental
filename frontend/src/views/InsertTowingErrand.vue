<template>
  <div
    v-if="show"
    class="flex_box container"
  >
    <div
      v-if="!loaded"
      class="spinner"
    />
    <transition
      name="fade"
      mode="out-in"
    >
      <div
        v-if="errandId && loaded && stage !== 4 && endAnim"
        class="flex_box stages"
      >
        <div
          class="circle"
          :class="{ 'circle--active': stage==1, 'circle--inactive': stage!=1 }"
          @click="navStages(1)"
        />
        <div
          class="circle"
          :class="{ 'circle--active': stage==2, 'circle--inactive': stage!=2 }"
          @click="navStages(2);"
        />
        <div
          class="circle"
          :class="{ 'circle--active': stage==3, 'circle--inactive': stage!=3 }"
          @click="navStages(3)"
        />
      </div>
    </transition>
    <transition
      v-if="loaded"
      name="slide"
      mode="out-in"
    >
      <stage-1
        v-if="stage===0"
        key="stage1"
        @nextStage="nextStage"
      />
      <stage-2
        v-else-if="stage===1 && errandId"
        ref="stage2"
        key="stage2"
        :errand-id="errandId"
        :errand="errand"
        @nextStage="nextStage"
      />
      <stage-3
        v-else-if="stage===2 && errandId"
        ref="stage3"
        key="stage3"
        :errand-id="errandId"
        :errand="errand"
        @nextStage="nextStage"
      />
      <stage-4
        v-else-if="stage===3 && errandId"
        ref="stage4"
        key="stage4"
        :errand-id="errandId"
        :errand="errand"
        @nextStage="nextStage"
      />
      <div
        v-else
        class="flex_box column"
      >
        <div
          data-text="Wróć"
          class="btn btn--winona"
          @click="stage=3; endAnimation()"
        >
          <span>Wróć</span>
        </div>
        <div
          data-text="Zakończ zlecenie"
          class="btn btn--winona"
          @click="finishErrand('Zrealizowane')"
        >
          <span>Zakończ zlecenie</span>
        </div>
        <div
          data-text="Anuluj zlecenie"
          class="btn btn--winona"
          @click="finishErrand('Anulowane')"
        >
          <span>Anuluj zlecenie</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import api from '../api'
import Stage1 from '../components/insertErrand/Stage1'
import Stage2 from '../components/insertErrand/Stage2'
import Stage3 from '../components/insertErrand/Stage3'
import Stage4 from '../components/insertErrand/Stage4'
export default {
  components: { Stage1, Stage2, Stage3, Stage4 },
  data () {
    return {
      errandId: this.$route.params.towingErrandId,
      stage: -1,
      error: null,
      loaded: false,
      errand: null,
      show: false,
      endAnim: true
    }
  },
  async beforeRouteEnter (to, from, next) {
    if (!to.params.towingErrandId) {
      return next(vm => {
        vm.loaded = true
        vm.stage = 0
      })
    }
    const errand = await api.getErrand(to.params.towingErrandId)
    if (errand.status !== 200) {
      return next({ name: 'insertTowingErrand' })
    }
    next(vm => {
      vm.errand = errand.data
      vm.stage = 1
      vm.loaded = true
    })
  },
  mounted () {
    alert('check consolelog')
    console.log(this.$parent)

    setTimeout(() => {
      this.show = true
    }, 500)
    if (this.errandId) {
      this.stage = 1
    } else {
      this.stage = 0
    }
  },
  methods: {
    async finishErrand (status) {
      const response = await api.updateStatus({ errandId: this.errandId, status })

      if (response.status !== 200) {
        return (this.error = response.data.message)
      }
      this.$router.push({ name: 'errand', params: { towingErrandId: this.errandId } })
    },
    async navStages (number) {
      if (number === this.stage || !this.$refs[`stage${this.stage + 1}`]) return

      console.log(this.stage + 1)
      this.$refs[`stage${this.stage + 1}`].nextStage(false).then(() => {
        this.stage = number
      })
    },
    nextStage (errand, next = true, add = true) {
      if (errand) {
        this.errand = errand
        if (this.errandId !== errand._id) {
          this.errandId = errand._id
        }
      }
      if (this.stage === 0) this.endAnimation()
      if (next && add) this.stage++
      else if (next && !add) this.stage--
    },
    verifyInput () {
      if (!this.errandNumber || this.errandNumber === '') { return (this.loaded = true) }
      return (this.loaded = false)
    },
    takePhotoF (data) {
      this.photos.push(data)
    },
    async insertTowingErrand () {
      const response = await api.insertTowingErrand({ errandNumber: this.errandNumber, photos: this.photos })
      this.loaded = true
      if (response.status !== 200) {
        return (this.error = response.data.message)
      }
      this.$router.push({ name: 'errand', params: { towingErrandId: response.data } })
    },
    endAnimation () {
      this.endAnim = false
      setTimeout(() => {
        this.endAnim = true
      }, 1000)
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
    // background-color: red;
    .stages {
        justify-content: space-evenly;
        width: 100%;
        max-width: 500px;
    }
}

/*.slide {
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
}*/
</style>
