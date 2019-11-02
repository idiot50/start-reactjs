import axios from 'axios';
import Config from './../config';

const apiMiddleware = {
  system: {
    client: axios.create({
      baseURL: Config.apiUrl,
      responseType: 'json'
    })
  },
  default: {
    client: axios.create({
      baseURL: Config.apiUrl,
      responseType: 'json'
    })
  },
  od: {
    client: axios.create({
      baseURL: Config.apiUrl + '/od-service',
      responseType: 'json'
    })
  },
  od_cat: {
    client: axios.create({
      baseURL: Config.apiUrl + '/od-category-service',
      responseType: 'json'
    })
  },
  pt: {
    client: axios.create({
      baseURL: Config.apiUrl + '/pt-service',
      responseType: 'json'
    })
  },
  pt_cat: {
    client: axios.create({
      baseURL: Config.apiUrl + '/pt-category-service',
      responseType: 'json'
    })
  },
  stream: {
    client: axios.create({
      baseURL: Config.apiUrl + '/common-stream-service',
      responseType: 'json'
    })
  },
  kedb: {
    client: axios.create({
      baseURL: Config.apiUrl + '/kedb-service',
      responseType: 'json'
    })
  },
  tt: {
    client: axios.create({
      baseURL: Config.apiUrl + '/tt-service',
      responseType: 'json'
    })
  },
  tt_cat: {
    client: axios.create({
      baseURL: Config.apiUrl + '/tt-category-service',
      responseType: 'json'
    })
  },
  cr_cat: {
    client: axios.create({
      baseURL: Config.apiUrl + '/cr-category-service',
      responseType: 'json'
    })
  },
  cr: {
    client: axios.create({
      baseURL: Config.apiUrl + '/cr-service',
      responseType: 'json'
    })
  },
  wo: {
    client: axios.create({
      baseURL: Config.apiUrl + '/wo-service',
      responseType: 'json'
    })
  },
  wo_cat: {
    client: axios.create({
      baseURL: Config.apiUrl + '/wo-category-service',
      responseType: 'json'
    })
  }
}

export default apiMiddleware;