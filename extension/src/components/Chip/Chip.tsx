import styles from './styles.module.css'

interface AssignmentProps {
  label: string,
  info: string,
  infoSize: string,
  goTo: string,
  score: number | null,
}

const colors = [
  '#00ff00',
  '#73ff00',
  '#b7ff00',
  '#ddff00',
  '#fff200',
  '#ffd500',
  '#ffa600',
  '#ff8000',
  '#ff5900',
  '#ff0000',
]

export default function Chip({ label, info, infoSize, goTo, score }: AssignmentProps) {
  let backgroundColor = 'unset'
  if (score) {
    backgroundColor = colors[score] ?? '#ffffff'
  }

  return (
    <button
      className={styles.container}
      onClick={() => window.open(goTo, '_blank')}
      style={{ background: `linear-gradient(90deg, ${backgroundColor}33, white)` }}
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
