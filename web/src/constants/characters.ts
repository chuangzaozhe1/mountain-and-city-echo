// 角色常量定义

export const CHARACTER_IDS = ['tangxin', 'suqingyan', 'linwanxing', 'xuzhinan'] as const

export type CharacterId = typeof CHARACTER_IDS[number]

export const CHARACTER_NAMES: Record<CharacterId, string> = {
  tangxin: '唐鑫',
  suqingyan: '苏清颜',
  linwanxing: '林晚星',
  xuzhinan: '徐指南'
}

export const CHARACTER_ICONS: Record<CharacterId, string> = {
  tangxin: '♂',
  suqingyan: '♀',
  linwanxing: '✿',
  xuzhinan: '◆'
}

export const CHARACTER_COLORS: Record<CharacterId, string> = {
  tangxin: '#3498db',
  suqingyan: '#fd79a8',
  linwanxing: '#00b894',
  xuzhinan: '#636e72'
}

export const FEMALE_CHARACTERS: CharacterId[] = ['suqingyan', 'linwanxing']

export function getCharacterName(id: string): string {
  return CHARACTER_NAMES[id as CharacterId] || id
}

export function getCharacterIcon(id: string): string {
  return CHARACTER_ICONS[id as CharacterId] || '?'
}

export function getCharacterColor(id: string): string {
  return CHARACTER_COLORS[id as CharacterId] || '#888'
}

export function isFemaleCharacter(id: string): boolean {
  return FEMALE_CHARACTERS.includes(id as CharacterId)
}
