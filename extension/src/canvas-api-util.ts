export async function getCourses(): Promise<Course[]> {
  // Get courses from Canvas API
  const params = new URLSearchParams({
    include: 'total_scores',
    per_page: '100',
  })
  const rawResp = await fetch(`api/v1/courses?${params}`)
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
      letterGrade: rawCourse?.enrollments?.[0]?.computed_current_letter_grade ?? 0,
      term: 'Unknown',
    }
  })

  return courses
}

export async function getColors(): Promise<{ [key: number]: string }> {
  // Get data from Canvas
  const rawResp = await fetch(`api/v1/users/self/colors`)
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
  const params = new URLSearchParams({
    bucket: 'future',
  })
  const rawResp = await fetch(`api/v1/courses/${id}/assignments?${params}`)
  if (!rawResp.ok) throw new Error('Canvas assignment API request failed')

  // Convert to json
  const response = await rawResp.json()

  // Parse
  const result: Assignment[] = response.map((rawAssignment) => {
    return {
      name: rawAssignment?.name ?? 'Unknown',
      desc: rawAssignment?.description ?? 'Unknown',
      dueAt: rawAssignment?.due_at ?? '1900-01-01T00:00:01Z',
      quiz: false,
      url: rawAssignment?.html_url ?? '',
      id: rawAssignment?.id ?? -1,
      quizId: rawAssignment?.quiz_id ?? -1,
    }
  })

  return result
}

export async function getQuizzes(id: number): Promise<Assignment[]> {
  // Get raw data from Canvas
  const rawResp = await fetch(`api/v1/courses/${id}/quizzes`)
  if (!rawResp.ok) throw new Error('Canvas assignment API request failed')

  // Convert to json
  const response = await rawResp.json()

  // Parse
  const result: Assignment[] = response.map((rawAssignment) => {
    return {
      id: rawAssignment?.id ?? -1,
      name: rawAssignment?.title ?? 'Unknown',
      desc: rawAssignment?.description ?? 'Unknown',
      dueAt: rawAssignment?.due_at ?? '1900-01-01T00:00:01Z',
      url: rawAssignment?.html_url ?? '',
      quiz: true,
      quizId: rawAssignment?.id,
    }
  })

  return result
}

export async function getFeed(): Promise<{ [key: number]: GradedAssignment[] }> {
  // Get raw data from canvas
  const params = new URLSearchParams({
    per_page: '25',
  })
  const rawResp = await fetch(`api/v1/users/self/activity_stream?${params}`)
  if (!rawResp.ok) throw new Error('Canvas feed API request failed')

  // Convert to json
  const response = await rawResp.json()

  // Parse
  // Sort each feed object by class
  const results: { [key: number]: GradedAssignment[] } = {}

  response.forEach((feedObject) => {
    if (feedObject?.type !== 'Submission') return
    const gradedAssignment: GradedAssignment = {
      name: feedObject?.title ?? 'Unknown',
      gradedAt: feedObject?.graded_at ?? '1900-01-01T00:00:01Z',
      points: feedObject?.score ?? 0,
      pointsPossible: feedObject?.assignment?.points_possible ?? 0,
      url: feedObject?.assignment?.html_url ?? '',
    }
    if (!(feedObject.course_id in results)) {
      results[feedObject.course_id] = []
    }
    results[feedObject.course_id].push(gradedAssignment)
  })

  return results
}

export async function getUser(): Promise<UserProfile> {
  // Get raw data from Canvas
  const rawResp = await fetch('api/v1/users/self/profile')
  if (!rawResp.ok) throw new Error('Canvas user API request failed')

  // Get as json
  const response = await rawResp.json()

  // Parse
  return {
    name: response?.name ?? 'User',
  }
}
