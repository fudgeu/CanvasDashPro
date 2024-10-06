type Course = {
  id: number,
  name: string,
  courseCode: string,
  grade: number,
  letterGrade: string,
  term: string,
}

type Assignment = {
  name: string,
  desc: string,
  dueAt: string,
  quiz: boolean,
  url: string,
  id: number,
  quizId: number,
}

type GradedAssignment = {
  name: string,
  gradedAt: string,
  points: number,
  pointsPossible: number,
  url: string,
}

type UserProfile = {
  name: string,
}

type AssignmentScore = {
  score: number,
  reason: string,
  time: number,
}
