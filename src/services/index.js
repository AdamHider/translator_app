import { Api } from './api.js'
import { CONFIG } from '../config.js'

export const api = new Api({
  baseUrl: `${CONFIG.API_HOST}/`
})
