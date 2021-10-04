import http from './common'

import Student from '../types/Student'

interface GetAllResponse {
    data: Student[],
    metadata: Object
}

const getAll = () => {
  return http.get<GetAllResponse>('/students')
}


export default {
    getAll
}