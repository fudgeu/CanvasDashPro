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
