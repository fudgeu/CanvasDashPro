export const BACKEND_URL = 'http://127.0.0.1:5000'

export async function getAssignmentScore(course: Course, assignment: Assignment): Promise<AssignmentScore> {
  // Call backend API
  const rawResp = await fetch(`${BACKEND_URL}/assignment_analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      className: course.name,
      assignmentTitle: assignment.name,
      assignmentDesc: assignment.desc,
    }),
  })

  const result = await rawResp.json()
  return result as AssignmentScore
}

export async function getAnnouncementSummary(announcement: AnnouncementObj, courseTitle: string): Promise<String> {
  const rawResp = await fetch(`${BACKEND_URL}/announcement_keywords`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      author: '',
      timePosted: announcement.createdAt,
      course: courseTitle,
      announcementTitle: announcement.title,
      announcementBody: announcement.desc,
    }),
  })

  const result = await rawResp.json()

  return result?.body ?? 'Unknown'
}
