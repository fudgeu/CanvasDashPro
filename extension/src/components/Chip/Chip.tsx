import styles from './styles.module.css'
import {ReactNode, useEffect, useRef, useState} from "react";

interface AssignmentProps {
  label: string,
  info: string,
  infoSize: string,
  goTo: string,
  score: number | null,
  popup?: ReactNode,
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

export default function Chip({ label, info, infoSize, goTo, score, popup }: AssignmentProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [popupShow, setPopupShow] = useState(false)
  const popupTimeout = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    clearTimeout(popupTimeout.current)

    if (isHovered) {
      popupTimeout.current = setTimeout(() => {
        setPopupShow(true)
      }, 750)
    }

    return () => clearTimeout(popupTimeout.current)
  }, [isHovered])

  let backgroundColor = 'unset'
  if (score) {
    backgroundColor = colors[score] ?? '#ffffff'
  }

  return (
    <button
      className={styles.container}
      onClick={() => window.open(goTo, '_blank')}
      style={{ background: `linear-gradient(90deg, ${backgroundColor}22, white)` }}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => {
        setIsHovered(false)
        setPopupShow(false)
      }}
    >
      <span className={styles.label}>{label}</span>
      <span
        className={styles.info}
        style={{ minWidth: infoSize }}
      >
        {info}
      </span>

      {popupShow && popup}
    </button>
  )
}
