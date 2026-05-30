// 故事数据模型 - 复用 Android 版本

export interface ChapterData {
  chapterId: string
  title: string
  volume: number
  number: number
  unlockCondition?: string
  scenes: SceneData[]
}

export interface SceneData {
  sceneId: string
  background: string
  bgm?: string
  characters: CharacterInScene[]
  dialogues: DialogueData[]
  choices?: ChoiceData[]
  unlockPhoto?: string
  bondChanges?: Record<string, number>
}

export interface CharacterInScene {
  characterId: string
  position: 'left' | 'center' | 'right'
  expression: string
}

export interface DialogueData {
  dialogueId: string
  speaker: string
  text: string
}

export interface ChoiceData {
  choiceId: string
  text: string
  nextSceneId: string
  bondChanges?: Record<string, number>
}

export enum CharacterEnum {
  TANG_XIN = 'tangxin',
  SU_QING_YAN = 'suqingyan',
  LIN_WAN_XING = 'linwanxing',
  XU_ZHI_NAN = 'xuzhinan'
}

export const CharacterNames: Record<CharacterEnum, string> = {
  [CharacterEnum.TANG_XIN]: '唐鑫',
  [CharacterEnum.SU_QING_YAN]: '苏清颜',
  [CharacterEnum.LIN_WAN_XING]: '林晚星',
  [CharacterEnum.XU_ZHI_NAN]: '许知楠'
}

export const BondLabels: Record<CharacterEnum, string> = {
  [CharacterEnum.TANG_XIN]: '自我值',
  [CharacterEnum.SU_QING_YAN]: '偏爱值',
  [CharacterEnum.LIN_WAN_XING]: '温柔值',
  [CharacterEnum.XU_ZHI_NAN]: '克制值'
}