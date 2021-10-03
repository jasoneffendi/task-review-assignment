import { createServer } from 'miragejs'
import faker from 'faker'

let challengesData = []
let studentsData = []

const generateChallengesData = (x) => {
  return new Promise((resolve) => {
    let i = 0
    while (i < x) {
      challengesData.push({
        id: faker.datatype.uuid(),
        studentId: studentsData[Math.round(Math.random() * studentsData.length)].id,
        name: faker.name.jobTitle(),
        googleDriveFolder: null,
        gradingStatus: 'SUBMITTED',
        grade: null,
        reviewerId: null
      })
      i++
    }
    resolve()
  })
}

const generateStudentData = (x) => {
  return new Promise((resolve) => {
    let i = 0
    while (i < x) {
      studentsData.push({
        id: faker.datatype.uuid(),
        name: faker.name.findName(),
        email: faker.internet.email()
      })
      i++
    }
    resolve()
  })
}

generateStudentData(10)
.then(() => {
  generateChallengesData(10)
})

export default function makeServer({ environment = 'test' }) {
  return createServer({
    environment,
    routes() {
      this.get("/api/challenges", () => {
        return {
          data: challengesData,
          metadata: {
            items: challengesData.length
          }
        }
      })
      this.get("/api/students", () => ({
        data: studentsData,
        metadata: {
          items: studentsData.length
        }
      }))

      this.put("/api/challenges/:challengeId/reviewer", (schema, request) => {
        let challengeId = request.params.challengeId
        let data = JSON.parse(request.requestBody)
        let challenge = challengesData.find(cD => cD.id === challengeId)
        challenge.reviewerId = data.reviewerId

        return {
          message: 'success'
        }
      })

      this.put("/api/challenges/:challengeId/grade", (schema, request) => {
        let challengeId = request.params.challengeId
        let data = JSON.parse(request.requestBody)
        let challenge = challengesData.find(cD => cD.id === challengeId)
        challenge.grade = data.grade
        if (data.grade === '5') {
          challenge.gradingStatus = 'GRADE_FAILED'
        } else {
          challenge.gradingStatus = 'GRADE_PASSED'
        }

        return {
          message: 'success'
        }
      })
    },
  })
}