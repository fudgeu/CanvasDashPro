import styles from './styles.module.css'
import {useQuery} from "@tanstack/react-query";
import {getAnnouncementSummary} from "../../ai-api-util.ts";

interface AnnouncementProps {
  announcement: AnnouncementObj,
  classTitle: string,
}

export default function Announcement({ announcement, classTitle }: AnnouncementProps) {
  const { data } = useQuery({
    queryKey: ['getAnnouncement', announcement.title],
    staleTime: Infinity,
    queryFn: async () => await getAnnouncementSummary(announcement, classTitle),
    retry: 1,
  })

  return (
    <div className={styles.container}>
      <span className={styles.class}>{classTitle}</span>
      <a href={announcement.url} target="_blank">
        <h4 className={styles.title}>
          {announcement.title}
        </h4>
      </a>
      <span className={styles.desc}>{data ?? 'Loading...'}</span>
      <span className={styles.date}>
        {new Date(announcement.createdAt).toLocaleString('en-US', { timeStyle: 'short', dateStyle: 'short' })}
      </span>
    </div>
  )
}
