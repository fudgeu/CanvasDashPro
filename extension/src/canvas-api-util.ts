export const CANVAS_BASE_URL = 'https://webcourses.ucf.edu'

export async function getCourses(): Promise<Course[]> {
  // Get courses from Canvas API
  const params = new URLSearchParams({
    include: 'total_score',
    per_page: '100',
  })
  const rawResp = await fetch(`${CANVAS_BASE_URL}/api/v1/courses?${params}`)
  if (!rawResp.ok) throw new Error('Canvas courses API request failed')

  // Process as JSON
  const response: any[] = await rawResp.json()

  // Slim down to only the data we need
  const courses: Course[] = response.map((rawCourse) => {
    return {
      id: rawCourse?.id ?? 0,
      name: rawCourse?.name ?? 'Unknown',
      courseCode: rawCourse?.course_code ?? 'Unknown',
      grade: rawCourse?.enrollments?.[0]?.computed_current_score ?? 0,
      term: 'Unknown',
    }
  })

  return courses
}

export async function getColors(): Promise<{ [key: number]: string }> {
  // Get data from Canvas
  const rawResp = await fetch(`${CANVAS_BASE_URL}/api/v1/users/self/colors`)
  if (!rawResp.ok) throw new Error('Canvas colors API request failed')

  // Convert to json
  const response = await rawResp.json()

  // Parse
  const result: { [key: number]: string } = {}
  Object.entries(response?.custom_colors).forEach(([key, val]) => {
    if (key.slice(0, 7) !== 'course_') return
    result[parseInt(key.slice(7))] = val.toString()
  })

  return result
}

export async function getAssignments(id: number): Promise<Assignment[]> {
  // Get raw data from Canvas
  const rawResp = await fetch(`${CANVAS_BASE_URL}/api/v1/courses/${id}/assignments`)
  if (!rawResp.ok) throw new Error('Canvas assignment API request failed')

  // Convert to json
  const response = await rawResp.json()

  // Parse
  const result: Assignment[] = response.map((rawAssignment) => {
    return {
      name: rawAssignment?.name ?? 'Unknown',
      desc: rawAssignment?.description ?? 'Unknown',
      dueAt: rawAssignment?.due_at ?? '1900-01-01T00:00:01Z',
    }
  })

  return result
}
