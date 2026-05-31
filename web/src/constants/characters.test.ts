import { describe, it, expect } from 'vitest'
import {
  CHARACTER_IDS,
  CHARACTER_NAMES,
  CHARACTER_ICONS,
  CHARACTER_COLORS,
  FEMALE_CHARACTERS,
  getCharacterName,
  getCharacterIcon,
  getCharacterColor,
  isFemaleCharacter
} from './characters'

describe('Characters Constants', () => {
  describe('CHARACTER_IDS', () => {
    it('should contain all character IDs', () => {
      expect(CHARACTER_IDS).toEqual(['tangxin', 'suqingyan', 'linwanxing', 'xuzhinan'])
    })

    it('should have 4 characters', () => {
      expect(CHARACTER_IDS).toHaveLength(4)
    })
  })

  describe('CHARACTER_NAMES', () => {
    it('should have names for all characters', () => {
      CHARACTER_IDS.forEach(id => {
        expect(CHARACTER_NAMES[id]).toBeDefined()
        expect(typeof CHARACTER_NAMES[id]).toBe('string')
      })
    })

    it('should have correct Chinese names', () => {
      expect(CHARACTER_NAMES.tangxin).toBe('唐鑫')
      expect(CHARACTER_NAMES.suqingyan).toBe('苏清颜')
      expect(CHARACTER_NAMES.linwanxing).toBe('林晚星')
      expect(CHARACTER_NAMES.xuzhinan).toBe('徐指南')
    })
  })

  describe('CHARACTER_ICONS', () => {
    it('should have icons for all characters', () => {
      CHARACTER_IDS.forEach(id => {
        expect(CHARACTER_ICONS[id]).toBeDefined()
      })
    })
  })

  describe('CHARACTER_COLORS', () => {
    it('should have colors for all characters', () => {
      CHARACTER_IDS.forEach(id => {
        expect(CHARACTER_COLORS[id]).toBeDefined()
        expect(CHARACTER_COLORS[id]).toMatch(/^#[0-9a-f]{6}$/i)
      })
    })
  })

  describe('FEMALE_CHARACTERS', () => {
    it('should contain female characters', () => {
      expect(FEMALE_CHARACTERS).toContain('suqingyan')
      expect(FEMALE_CHARACTERS).toContain('linwanxing')
    })

    it('should not contain male characters', () => {
      expect(FEMALE_CHARACTERS).not.toContain('tangxin')
      expect(FEMALE_CHARACTERS).not.toContain('xuzhinan')
    })
  })

  describe('Helper Functions', () => {
    describe('getCharacterName', () => {
      it('should return correct name for valid ID', () => {
        expect(getCharacterName('tangxin')).toBe('唐鑫')
        expect(getCharacterName('suqingyan')).toBe('苏清颜')
      })

      it('should return ID for unknown character', () => {
        expect(getCharacterName('unknown')).toBe('unknown')
      })
    })

    describe('getCharacterIcon', () => {
      it('should return correct icon for valid ID', () => {
        expect(getCharacterIcon('tangxin')).toBe('♂')
        expect(getCharacterIcon('suqingyan')).toBe('♀')
      })

      it('should return ? for unknown character', () => {
        expect(getCharacterIcon('unknown')).toBe('?')
      })
    })

    describe('getCharacterColor', () => {
      it('should return correct color for valid ID', () => {
        expect(getCharacterColor('tangxin')).toBe('#3498db')
        expect(getCharacterColor('suqingyan')).toBe('#fd79a8')
      })

      it('should return default color for unknown character', () => {
        expect(getCharacterColor('unknown')).toBe('#888')
      })
    })

    describe('isFemaleCharacter', () => {
      it('should return true for female characters', () => {
        expect(isFemaleCharacter('suqingyan')).toBe(true)
        expect(isFemaleCharacter('linwanxing')).toBe(true)
      })

      it('should return false for male characters', () => {
        expect(isFemaleCharacter('tangxin')).toBe(false)
        expect(isFemaleCharacter('xuzhinan')).toBe(false)
      })

      it('should return false for unknown characters', () => {
        expect(isFemaleCharacter('unknown')).toBe(false)
      })
    })
  })
})
