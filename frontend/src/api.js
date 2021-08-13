// @ts-check

import axios from 'axios'
// import app from './main'

const axiosInstance = axios.create({
  // @ts-ignore
  baseURL: process.env.VUE_APP_API_URL || `/api/`,
  withCredentials: true
})

export default {
  /**
   * @param {import('axios').Method} method
   * @param {string} resource
   * @param {object} [data]
   */
  async execute (method, resource, data) {
    // if (app) app.$Progress.start()

    const request = axiosInstance({
      method,
      url: resource,
      data,
      validateStatus: () => true
    })

    /* request.then(() => {
      if (app) app.$Progress.finish()
    }) */

    return request
  },

  /* AUTHENTICATION */
  /**
   * Creates new session
   * @param {object} data
   * @param {string} data.username
   * @param {string} data.password
   */
  login (data) {
    return this.execute('POST', `/login`, {
      username: data.username,
      password: data.password
    })
  },

  /** Gets current logged in user */
  getUser () {
    return this.execute('GET', `/user`)
  },

  /** Destroys current session */
  logout () {
    return this.execute('POST', `/logout`)
  },

  /**
   * Creates new user account
   * @param {object} data
   * @param {string} data.username
   * @param {string} data.email
   * @param {string} data.role
   */
  register (data) {
    return this.execute('POST', `/register`, {
      username: data.username,
      email: data.email,
      role: data.role
    })
  },

  /**
   * Creates new session
   * @param {object} data
   * @param {string} data.registrationNumber
   * @param {string} data.brand
   * @param {string} data.model
   * @param {string} data.classCar
   * @param {string} data.vin
   */
  insertCar (data) {
    return this.execute('POST', `/car`, {
      registrationNumber: data.registrationNumber,
      brand: data.brand,
      model: data.model,
      classCar: data.classCar,
      vin: data.vin
    })
  },

  listCars () {
    return this.execute('GET', `/cars`)
  },

  /**
   * Creates new session
   * @param {object} data
   * @param {string} data.errandNumber
   * @param {*} data.photos
   */
  insertPhotos (data) {
    return this.execute('POST', `/towingErrand`, {
      errandNumber: data.errandNumber,
      photos: data.photos
    })
  },

  /**
   * Creates new session
   * @param {object} data
   * @param {string} data.errandNumber
   * @param {string} data.carNumber
   * @param {string} data.tugNumber
   */
  insertTowingErrand (data) {
    return this.execute('POST', `/towingErrand1`, {
      errandNumber: data.errandNumber,
      carNumber: data.carNumber,
      tugNumber: data.tugNumber
    })
  },

  /**
   * Creates new session
   * @param {object} data
   * @param {string} data.errandId
   * @param {number} data.kilometers
   * @param {Date} data.date
   * @param {number} data.DMC
   * @param {string} data.incidentPlace
   * @param {object} data.transport
   * @param {string} data.description
   */
  updateTowingErrandDrive (data) {
    return this.execute('PATCH', `/towingErrand2`, {
      errandId: data.errandId,
      kilometers: data.kilometers,
      date: data.date,
      DMC: data.DMC,
      incidentPlace: data.incidentPlace,
      transport: data.transport,
      description: data.description
    })
  },

  /**
   * Creates new session
   * @param {object} data
   * @param {string} data.errandId
   * @param {number} data.kilometers
   * @param {Date} data.date
   * @param {string} data.destinationPlace
   * @param {string} data.handed
   * @param {string} data.description
   */
  updateTowingErrandTowing (data) {
    return this.execute('PATCH', `/towingErrand3`, {
      errandId: data.errandId,
      kilometers: data.kilometers,
      date: data.date,
      destinationPlace: data.destinationPlace,
      handed: data.handed,
      description: data.description
    })
  },

  /**
   * Creates new session
   * @param {object} data
   * @param {string} data.errandId
   * @param {number} data.kilometers
   * @param {Date} data.date
   * @param {number} data.surcharge
   * @param {string} data.description
   */
  updateTowingErrandReturn (data) {
    return this.execute('PATCH', `/towingErrand4`, {
      errandId: data.errandId,
      kilometers: data.kilometers,
      date: data.date,
      surcharge: data.surcharge,
      description: data.description
    })
  },

  /**
   * Creates new session
   * @param {object} data
   * @param {string} data.errandId
   * @param {string} data.status
   */
  updateStatus (data) {
    return this.execute('PATCH', `/finishTowingErrand`, {
      errandId: data.errandId,
      status: data.status
    })
  },

  /**
   * Creates new session
   * @param {object} data
   * @param {string} data.errandId
   * @param {string} data.image
   */
  addImage (data) {
    return this.execute('POST', `/addImage`, {
      errandId: data.errandId,
      img: data.image
    })
  },

  /**
   * Gets car data
   * @param {string} errandId
   */
  getImages (errandId) {
    return this.execute('GET', `/images/${errandId}`)
  },

  /**
   * Creates new session
   * @param {string} filterType
   * @param {object} data
   * @param {string} data.fromDate
   * @param {string} data.toDate
   */
  listTowingErrands (filterType, data) {
    return this.execute('POST', `/towingErrands/${filterType}`, {
      fromDate: data.fromDate,
      toDate: data.toDate
    })
  },

  /**
   * Gets car data
   * @param {string} towingErrandId
   */
  getErrand (towingErrandId) {
    return this.execute('GET', `/towingErrand/${towingErrandId}`)
  },

  /**
   * Creates new rent
   * @param {object} data
   * @param {string} data.carId
   * @param {string} data.name
   * @param {string} data.startDate
   * @param {string} data.endDate
   * @param {number} data.days
   * @param {string} data.planningReturnPlace
   * @param {string} data.phoneNumber
   */
  createRent (data) {
    return this.execute('POST', `/rent`, {
      carId: data.carId,
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      days: data.days,
      planningReturnPlace: data.planningReturnPlace,
      phoneNumber: data.phoneNumber
    })
  }

}
