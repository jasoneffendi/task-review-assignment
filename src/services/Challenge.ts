import http from './common'
import Challenge from '../types/Challenge'

interface GetAllResponse {
    data: Challenge[],
    metadata: Object
}

const getAll = () => {
  return http.get<GetAllResponse>('/challenges')
}

const updateAssignee = (challengeId: string, reviewerId: string) => {
    return http.put<Object>(`/challenges/${challengeId}/reviewer`, { reviewerId })
}

const updateGrade = (challengeId: string, grade: string) => {
    return http.put<Object>(`/challenges/${challengeId}/grade`, { grade })
}


export default {
    getAll,
    updateAssignee,
    updateGrade
}