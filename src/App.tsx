import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import Input from '@mui/material/Input'

import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import challengesService from './services/Challenge'
import studentsService from './services/Student'

import Challenge from './types/Challenge'
import Student from './types/Student'

interface ChallengesData {
  data: Challenge[],
  metadata: Object
}

interface StudentsData {
  data: Student[],
  metadata: Object
}

interface StudentsMap {
  [p: string]: Student
}

export default function App() {
  const [challengesData, setChallengesData] = useState<ChallengesData|null>(null)
  const [studentsData, setStudentsData] = useState<StudentsData|null>(null)
  const [studentsMap, setStudentsMap] = useState<StudentsMap|undefined>({})

  useEffect(() => {
    challengesService.getAll()
    .then(response => {
      setChallengesData(response.data)
    })
    .catch(err => {
      console.error(err)
    })

    studentsService.getAll()
    .then(response => {
      setStudentsData(response.data)
      // move to helper to resolve
      const remappedStudents = response?.data?.data.reduce((acc: Object, curr: Student) => ({ ...acc, [curr.id]: curr }), {})
      setStudentsMap(remappedStudents)
      console.log(remappedStudents)
    })
    .catch(err => {
      console.error(err)
    })

  }, [])

  const studentOptions = studentsData && studentsData?.data.map(std => (
    <MenuItem key={std.id} value={std.id}>
      {std.name}
    </MenuItem>
  ))

  const handleReviewerChange = (rowId: string, studentId: string) => {
    challengesService.updateAssignee(rowId, studentId)
    .then(() => {
      challengesService.getAll()
      .then(response => {
        setChallengesData(response.data)
      })
      .catch(err => {
        console.error(err)
      })
    })
    .catch(err => {
      console.error(err)
    })
  }

  const handleGradeChange = (rowId: string, score: string) => {
    challengesService.updateGrade(rowId, score)
    .then(() => {
      challengesService.getAll()
      .then(response => {
        setChallengesData(response.data)
      })
      .catch(err => {
        console.error(err)
      })
    })
    .catch(err => {
      console.error(err)
    })
  }

  return (
    <Container maxWidth='xl'>
      <Box sx={{ my: 4 }}>
        <Typography variant='h4' component='h1' gutterBottom>
         Assignment
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align='center'>Challenge Name</TableCell>
              <TableCell align='center'>Grading Status</TableCell>
              <TableCell align='center'>Grade</TableCell>
              <TableCell align='center'>Student</TableCell>
              <TableCell align='center'>Reviewer</TableCell>
              <TableCell align='center'>View</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {challengesData && challengesData?.data.map(row => (
              <TableRow key={row.id}>
                <TableCell align='left'>
                  {row.name}
                </TableCell>
                <TableCell align='center'>
                  {row.gradingStatus}
                </TableCell>
                <TableCell align='center'>
                  <Select
                    value={row.grade}
                    onChange={(e) => handleGradeChange(row.id, String(e.target.value))}
                    name='grade'
                  >
                    <MenuItem key={1} value='1'>
                      1
                    </MenuItem>
                    <MenuItem key={1} value='2'>
                      2
                    </MenuItem>
                    <MenuItem key={1} value='3'>
                      3
                    </MenuItem>
                    <MenuItem key={1} value='4'>
                      4
                    </MenuItem>
                    <MenuItem key={1} value='5'>
                      5
                    </MenuItem>
                  </Select>
                </TableCell>
                <TableCell align='center'>
                  {studentsMap && studentsMap[row.studentId]?.name || '-'}
                </TableCell>
                <TableCell align='center'>
                  <Select
                    value={row.reviewerId}
                    onChange={(e) => handleReviewerChange(row.id, e.target.value)}
                    name='reviewer'
                  >
                    {studentOptions}
                  </Select>
                </TableCell>
                <TableCell align='center'>
                  <Button variant='contained' disabled={!row.googleDriveFolder}>
                    View Drive
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Container>
  )
}
