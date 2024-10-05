import styles from './styles.module.css'
import { useQuery } from '@tanstack/react-query'
import { getAssignments } from '../../canvas-api-util.ts'
import {useMemo} from "react";

interface ClassCardProps {
  course: Course,
  color?: string,
  index: number,
}

export default function ClassCard({ course, color = '#aaaaaa', index }: ClassCardProps) {
  // Get assignments for class
  const { inProgress: assignmentsInProgress, data: assignmentsData } = useQuery({
    queryKey: ['getAssignments', course.id],
    queryFn: async () => await getAssignments(course.id),
  })

  const sortedAssignments = useMemo(() => {
    if (!assignmentsData) return []
    const now = new Date()
    const weekFromNow = new Date()
    weekFromNow.setDate(now.getDate() + 7)

    // Filter out due dates that have already passed
    let result = assignmentsData.filter((assignment) => {
      const assignmentDate = new Date(assignment.dueAt)
      return assignmentDate >= now && assignmentDate < weekFromNow
    })

    // Sort remaining due dates
    result = result.sort((assignmentA, assignmentB) => {
      return new Date(assignmentB.dueAt) - new Date(assignmentA.dueAt)
    })

    // Only display first 6
    return result.slice(0, 6)
  }, [assignmentsData])

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
        <h2>{course.name}</h2>
        <span className={styles.courseCode}>{course.courseCode}</span>
        <p className={styles.term}>{course.term}</p>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <h3>Grades</h3>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <h3>Assignments</h3>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <h3>Announcements</h3>
      </div>

    </div>
  )
}
