export default interface Challenge {
    id: string
    studentId: string
    name: string
    googleDriveFolder?: string
    gradingStatus: "UNSUBMITTED" | "SUBMITTED" | "GRADE_PASSED" | "GRADE_FAILED"
    grade?: number
    reviewerId?: string
}