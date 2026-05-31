// 章节常量定义

export interface ChapterInfo {
  id: string
  number: number
  title: string
  volume: number
}

export const CHAPTERS: ChapterInfo[] = [
  { id: 'chapter_01', number: 1, title: '山城内耗与山野契机', volume: 1 },
  { id: 'chapter_02', number: 2, title: '缙云山初见，风里藏着心动的味道', volume: 1 },
  { id: 'chapter_03', number: 3, title: '咖啡香里的三束温柔', volume: 1 },
  { id: 'chapter_04', number: 4, title: '夜市烟火与心动试探', volume: 1 },
  { id: 'chapter_05', number: 5, title: '面试前夜的抉择', volume: 1 },
  { id: 'chapter_06', number: 6, title: '山野落幕', volume: 1 }
]

export const CHAPTER_MAP = new Map(CHAPTERS.map(ch => [ch.id, ch]))

export function getChapterTitle(chapterId: string): string {
  return CHAPTER_MAP.get(chapterId)?.title || chapterId
}

export function getChapterNumber(chapterId: string): number {
  return CHAPTER_MAP.get(chapterId)?.number || 0
}

export function getNextChapterId(chapterId: string): string | null {
  const num = getChapterNumber(chapterId)
  if (num >= CHAPTERS.length) return null
  return `chapter_${String(num + 1).padStart(2, '0')}`
}

export function getPreviousChapterId(chapterId: string): string | null {
  const num = getChapterNumber(chapterId)
  if (num <= 1) return null
  return `chapter_${String(num - 1).padStart(2, '0')}`
}
