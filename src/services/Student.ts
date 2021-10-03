import http from './common'

const getAll = () => {
  return http.get('/students')
}


export default {
    getAll
}