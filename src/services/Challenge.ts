import http from './common'

const getAll = () => {
  return http.get('/challenges')
}

const updateAssignee = (challengeId: string, reviewerId: string) => {
    return http.put(`/challenges/${challengeId}/reviewer`, { reviewerId })
}

const updateGrade = (challengeId: string, grade: string) => {
    return http.put(`/challenges/${challengeId}/grade`, { grade })
}


export default {
    getAll,
    updateAssignee,
    updateGrade
}