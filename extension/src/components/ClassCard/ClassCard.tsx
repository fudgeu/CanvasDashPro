import styles from './styles.module.css'
import {useQueries, useQuery} from '@tanstack/react-query'
import {getAssignments, getCourses, getQuizzes} from '../../canvas-api-util.ts'
import { useMemo } from 'react'
import Chip from '../Chip/Chip.tsx'
import {getAssignmentScore} from "../../ai-api-util.ts";

interface ClassCardProps {
  course: Course,
  color?: string,
  index: number,
  gradedAssignments: GradedAssignment[],
}

export default function ClassCard({ course, color = '#aaaaaa', index, gradedAssignments }: ClassCardProps) {
  // Get assignments for class
  const { data: assignmentsData } = useQuery({
    queryKey: ['getAssignments', course.id],
    queryFn: async () => await getAssignments(course.id),
    initialData: [],
  })

  const { data: quizzesData } = useQuery({
    queryKey: ['getQuizzes', course.id],
    queryFn: async () => await getQuizzes(course.id),
    initialData: [],
    retry: 1,
  })

  // Get all AI scores for assignments
  const assigmentScoreQueries = useQueries({
    queries: assignmentsData!.map((assignment: Assignment) => {
      return {
        queryKey: ['getAssignmentAiScore', assignment.url],
        queryFn: async () => await getAssignmentScore(course, assignment),
      }
    }),
  })

  // Process assignments
  const sortedAssignments: Assignment[] = useMemo(() => {
    if (!assignmentsData || !quizzesData) return []
    const combinedAssignments = [...quizzesData, ...assignmentsData]

    const now = new Date()
    const weekFromNow = new Date()
    weekFromNow.setDate(now.getDate() + 14)

    // Filter out due dates that have already passed
    let result = combinedAssignments.filter((assignment) => {
      const assignmentDate = new Date(assignment.dueAt)
      return assignmentDate >= now && assignmentDate < weekFromNow
    })

    // Sort remaining due dates
    result = result.sort((assignmentA, assignmentB) => {
      return new Date(assignmentB.dueAt) - new Date(assignmentA.dueAt)
    })

    // Only display first 6
    return result.reverse().slice(0, 6)
  }, [assignmentsData, quizzesData])

  // Process graded assignments
  const sortedGradedAssignments = useMemo(() => {
    let result = gradedAssignments.sort((assignmentA, assignmentB) => {
      return new Date(assignmentB.gradedAt) - new Date(assignmentA.gradedAt)
    })
    return result.slice(0, 6)
  }, [gradedAssignments])

  // Process grade
  const grade = `${Math.round(course.grade * 10) / 10}%`
  let letterGrade = null
  if (course.letterGrade.length <= 2) {
    letterGrade = course.letterGrade
  }

  return (
    <div
      className={styles.classCard}
      style={{
        background: `linear-gradient(120deg, ${color}18, transparent 15%)`,
        animationDelay: `${index * 20}ms`,
      }}
    >
      <div
        className={styles.accent}
        style={{ backgroundColor: color }}
      />

      <div className={styles.classHeader}>
        <a href={`courses/${course.id}`} target="_blank">
          <h2>{course.name}</h2>
        </a>
        <span className={styles.courseCode}>{course.courseCode}</span>
        <p className={styles.term}>{course.term}</p>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <h3>Assignments</h3>
        <div className={styles.chipContainer}>
          {sortedAssignments?.map((assignment) => {
            let formattedDate = new Date(assignment.dueAt).toLocaleDateString()
            formattedDate = formattedDate.slice(0, formattedDate.length - 5)
            return (
              <Chip
                label={assignment.name}
                info={formattedDate}
                infoSize="2.5rem"
                goTo={assignment.url}
              />
            )
          })}
        </div>
        {sortedAssignments.length === 0 && (
          <div className={styles.noItems}>
            No assignments due soon!
          </div>
        )}
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Grades</h3>
          <div className={styles.gradeContainer}>
            {letterGrade && <div className={styles.grade}>{letterGrade}</div>}
            <div className={styles.grade}>{grade}</div>
          </div>
        </div>
        <div className={styles.chipContainer}>
          {sortedGradedAssignments.map((assignment) => {
            return (
              <Chip
                label={assignment.name}
                info={`${assignment.points}/${assignment.pointsPossible}`}
                infoSize="3.5rem"
                goTo={assignment.url}
              />
            )
          })}
        </div>
        {sortedGradedAssignments.length === 0 && (
          <div className={styles.noItems}>
            No recent grades!
          </div>
        )}
      </div>

    </div>
  )
}
