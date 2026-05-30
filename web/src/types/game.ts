// 游戏状态类型

export interface GameState {
  currentChapterId: string | null
  currentSceneId: string | null
  currentDialogueIndex: number
  bondPoints: Record<string, number>
  unlockedChapters: string[]
  photos: string[]
}

export interface SaveData {
  chapterId: string
  sceneId: string
  dialogueIndex: number
  bondPoints: Record<string, number>
  unlockedChapters: string[]
  photos: string[]
  timestamp: number
}