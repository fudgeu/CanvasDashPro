import styles from './styles.module.css'

interface AssignmentPopupProps {
  score?: AssignmentScore,
  courseName: string,
  assignmentTitle: string,
}

export default function AssignmentPopup({ score, courseName, assignmentTitle }: AssignmentPopupProps) {
  if (!score) return

  return (
    <div className={styles.container}>
      <span>{courseName}</span>
      <h3>{assignmentTitle}</h3>

      <div className={styles.grid}>
        <span className={styles.gridHeader}>Difficulty score:</span>
        <span>{score.score}</span>
        <span className={styles.gridHeader}>Estimated time:</span>
        <span>{`${score.time}min`}</span>
        <span className={styles.gridHeader}>Reasoning:</span>
        <span>{score.reason}</span>
      </div>

    </div>
  )
}
