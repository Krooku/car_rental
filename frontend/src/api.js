// @ts-check

import axios from 'axios'
// import app from './main'

const axiosInstance = axios.create({
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
   * @param {string} data.password
   */
  register (data) {
    return this.execute('POST', `/register`, {
      username: data.username,
      email: data.email,
      password: data.password
    })
  }
}
