export const BACKEND_URL = 'http://localhost:5000'

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

  console.log("sdfsdfsdf")
  const result = await rawResp.json()
  console.log(result)
  return result as AssignmentScore
}
