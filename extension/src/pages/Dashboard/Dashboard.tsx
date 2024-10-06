import '../../globals.css'
import styles from './styles.module.css'
import ClassCard from '../../components/ClassCard/ClassCard.tsx'
import { useQuery } from '@tanstack/react-query'
import {getColors, getCourses, getFeed} from '../../canvas-api-util.ts'
import { useEffect, useMemo } from 'react'

export default function Dashboard() {
  // Courses query
  const { isPending: isCoursesPending, data: coursesData } = useQuery({
    queryKey: ['getCourses'],
    queryFn: getCourses,
  })

  // Colors query
  const { isPending: isColorsPending, data: colorsData } = useQuery({
    queryKey: ['getColors'],
    queryFn: getColors,
  })

  // Recent feedback query
  const { data: gradedAssignmentsData } = useQuery({
    queryKey: ['getGradedAssignments'],
    queryFn: getFeed,
  })

  // Get session storage and filter cards based on options
  const processedCards1 = useMemo(() => {
    if (isCoursesPending) return []
    const rawCards = Object.entries(window.sessionStorage).find(([key, val]) => {
      if (key.slice(0, 19) !== 'dashcards_for_user_') return false
      return true
    })?.[1] ?? '[]'
    const allowedCards: number[] = JSON.parse(rawCards).map((course) => parseInt(course.id))

    if (!coursesData) return []

    return coursesData.filter((course) => {
      return allowedCards.includes(course.id)
    })
  }, [coursesData, isCoursesPending])

  // Attach term to course objects
  const processedCards2 = useMemo(() => {
    if (isCoursesPending || !coursesData) return []
    const rawCards = Object.entries(window.sessionStorage).find(([key, _]) => {
      if (key.slice(0, 19) !== 'dashcards_for_user_') return false
      return true
    })?.[1] ?? '[]'
    const cards = JSON.parse(rawCards)

    return processedCards1.map((course) => {
      const newCourse = { ...course }
      newCourse.term = cards.find(
        (rawCourse) => parseInt(rawCourse.id) === course.id,
      )?.term ?? 'Unknown'
      return newCourse
    })
  }, [coursesData, isCoursesPending, processedCards1])

  if (!coursesData || !colorsData || !gradedAssignmentsData) return // Do not render if not ready

  return (
    <main className={styles.main}>
      <h2>Hello, User</h2>

      <div className={styles.classCards}>
        {processedCards2.map((course, i) => (
          <ClassCard
            key={course.id}
            course={course}
            color={colorsData[course.id]}
            gradedAssignments={gradedAssignmentsData[course.id] ?? []}
            index={i}
          />
        ))}
      </div>

    </main>
  )
}
