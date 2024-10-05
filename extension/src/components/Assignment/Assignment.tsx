import styles from './styles.module.css'

interface AssignmentProps {
  assignment: Assignment,
}

export default function Assignment({ assignment }: AssignmentProps) {
  return (
    <div className={styles.container}>
      <span>{assignment.name}</span>
    </div>
  )
}
