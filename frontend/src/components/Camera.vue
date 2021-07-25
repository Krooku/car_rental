<template>
  <div class="camera">
    <video
      autoplay
      playsinline
      class="feed"
    />
    <i
      class="icon fas fa-window-close"
      @click="$emit('close')"
    />
    <div
      id="snap"
      @click="takepicture"
    />
    <canvas
      id="canvas"
      class="hidden"
    />
    <div :class="{ flash: isFlash, 'hidden': !isFlash }" />
    <div
      v-if="visiblePhoto"
      class="taken-photo"
    >
      <img
        id="photo"
        :src="data"
        alt="Hmm, cos nie tak"
      >
      <div
        class="btn1"
        @click="save(false)"
      >
        Zrób nowe
      </div>
      <div
        class="btn2"
        @click="save(true)"
      >
        Zapisz
      </div>
    </div>
    <!-- <div class="output">
      <img
        id="photo"
        alt="The screen capture will appear in this box."
      >
    </div> -->
  </div>
</template>

<script>

export default {
  name: 'Camera',
  data () {
    return {
      front: false,
      videoPlayer: null,
      canvas: null,
      photo: null,
      snapBtn: null,
      width: window.innerWidth,
      height: window.innerHeight,
      streaming: false,
      isFlash: false,
      data: '',
      visiblePhoto: false
    }
  },
  beforeMount () {
    this.videoPlayer = document.querySelector('video')
    this.canvas = document.getElementById('canvas')
    this.photo = document.getElementById('photo')
    this.startbutton = document.getElementById('snap')
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.init()
  },
  created () {
    // alert('created')
    // this.init()
  },
  methods: {
    getConstraints (videowidth, videoheight) {
      const constraints = {
        facingMode: { exact: 'environment' },
        width: { min: videowidth, ideal: videowidth, max: videowidth },
        height: { min: videoheight, ideal: videoheight, max: videoheight },
        frameRate: { min: 5, max: 8 }
      }
      return constraints
    },
    init () {
      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        // navigator.mediaDevices.getUserMedia({ video: { width: { min: 1600, max: 1600 }, height: { min: 1200, max: 1200 }, facingMode: (this.front ? 'user' : 'environment') } }).then(stream => {
        navigator.mediaDevices.getUserMedia({ video: this.getConstraints(1600, 1200) }).then(stream => {
          const videoPlayer = document.querySelector('video')
          videoPlayer.srcObject = stream
          videoPlayer.play()
        }).catch(error => {
          console.log(error)
          this.$emit('close')
        })
        const videoPlayer = document.querySelector('video')
        if (videoPlayer) {
          videoPlayer.addEventListener('canplay', (ev) => {
            if (!this.streaming) {
              // this.width = window.innerWidth
              // const canvas = document.getElementById('canvas')
              // this.height = videoPlayer.videoHeight / (videoPlayer.videoWidth / this.width)
              console.log(this.width + ' ' + this.height)

              // videoPlayer.setAttribute('width', this.width)
              // videoPlayer.setAttribute('height', this.height)
              // canvas.setAttribute('width', this.width)
              // canvas.setAttribute('height', this.height)
              this.streaming = true
            }
          }, false)
        }
      } else {
        alert('cannot get Media Devices')
        this.$emit('close')
      }
    },
    save (isSave) {
      this.visiblePhoto = false
      if (isSave) {
        this.$emit('take', this.data)
      }
    },
    takepicture () {
      const canvas = document.getElementById('canvas')
      var context = canvas.getContext('2d')
      if (this.width && this.height) {
        canvas.width = 1600
        canvas.height = 1200
        const video = document.querySelector('video')
        context.drawImage(video, 0, 0, 1600, 1200)

        this.data = canvas.toDataURL('image/jpeg', 1)
        this.isFlash = true
        setTimeout(() => {
          this.isFlash = false
        }, 500)
        // this.$emit('take', this.data)
        this.visiblePhoto = true
        // const photo = document.getElementById('photo')
        // photo.setAttribute('src', this.data)
      } else {
        alert('clearphoto')
        // clearphoto()
      }
    }
  }
}
</script>

<style lang="scss">

@keyframes flash {
    from { opacity: 1;}
    to {opacity: 0;}
}
.taken-photo {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  #photo {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 998;
  }
  .btn1 {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 999;
    padding: 6px 10px;
    border: 3px solid #73AD21;
  }
  .btn2 {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 999;
    padding: 6px 10px;
    border: 3px solid #73AD21;
  }
}
.camera {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: red;
    top: 0;
    left: 0;
    z-index: 99;
    video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        object-fit: cover;
    }
    .icon {
        font-size: 20px;
        position: absolute;
        right: 5px;
        top: 5px;
    }
    #snap {
        position: absolute;
        height: 55px;
        width: 55px;
        left: 50%;
        top: 80%;
        transform: translate(-50%,-80%);
        background-color: #bbb;
        border-radius: 50%;
        display: inline-block;
    }
    .hidden {
        display: none;
    }
    .flash {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 100;
        background-color: white;
        animation-name: flash;
        animation-duration: 0.5s;
    }
}

</style>
