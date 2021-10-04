import { createServer } from 'miragejs'
import faker from 'faker'

import Student from './types/Student'
import Challenge from './types/Challenge'

let challengesData: Challenge[] = []
let studentsData: Student[] = []

const generateChallengesData = (x: number, students: Student[]) => {
  return new Promise<Challenge[]>((resolve) => {
    let challengesData: Challenge[] = []
    while (challengesData.length < x) {
      challengesData.push({
        id: faker.datatype.uuid(),
        studentId: students[Math.round(Math.random() * students.length)].id,
        name: faker.name.jobTitle(),
        googleDriveFolder: undefined,
        gradingStatus: 'SUBMITTED',
        grade: undefined,
        reviewerId: undefined
      })
    }
    resolve(challengesData)
  })
}

const generateStudentData = (x: number) => {
  return new Promise<Student[]>((resolve) => {
    // let i = 0
    let studentsData: Student[] = []
    while (studentsData.length < x) {
      studentsData.push({
        id: faker.datatype.uuid(),
        name: faker.name.findName(),
        email: faker.internet.email()
      })
      // i++
    }
    resolve(studentsData)
  })
}

generateStudentData(10)
.then(students => {
  studentsData = students
  generateChallengesData(10, students)
  .then(challenges => {
    challengesData = challenges
  })
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

      this.put("/api/challenges/:challengeId/reviewer", (_schema, request) => {
        let challengeId = request.params.challengeId
        let data = JSON.parse(request.requestBody)
        let challenge = challengesData.find(cD => cD.id === challengeId)
        if (!challenge) {
          return {
            message: 'failed'
          }
        }
        challenge.reviewerId = data.reviewerId

        return {
          message: 'success'
        }
      })

      this.put("/api/challenges/:challengeId/grade", (_schema, request) => {
        let challengeId = request.params.challengeId
        let data = JSON.parse(request.requestBody)
        let challenge = challengesData.find(cD => cD.id === challengeId)
        if (!challenge) {
          return {
            message: 'failed'
          }
        }

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