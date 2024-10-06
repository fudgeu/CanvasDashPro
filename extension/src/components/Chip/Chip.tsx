import styles from './styles.module.css'

interface AssignmentProps {
  label: string,
  info: string,
  infoSize: string,
  goTo: string,
}

export default function Chip({ label, info, infoSize, goTo }: AssignmentProps) {
  return (
    <button
      className={styles.container}
      onClick={() => window.open(goTo, '_blank')}
    >
      <span className={styles.label}>{label}</span>
      <span
        className={styles.info}
        style={{ minWidth: infoSize }}
      >
        {info}
      </span>
    </button>
  )
}
