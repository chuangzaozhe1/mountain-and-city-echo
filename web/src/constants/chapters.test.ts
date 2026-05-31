import { describe, it, expect } from 'vitest'
import {
  CHAPTERS,
  CHAPTER_MAP,
  getChapterTitle,
  getChapterNumber,
  getNextChapterId,
  getPreviousChapterId
} from './chapters'

describe('Chapters Constants', () => {
  describe('CHAPTERS', () => {
    it('should have 6 chapters', () => {
      expect(CHAPTERS).toHaveLength(6)
    })

    it('should have correct chapter structure', () => {
      CHAPTERS.forEach(chapter => {
        expect(chapter).toHaveProperty('id')
        expect(chapter).toHaveProperty('number')
        expect(chapter).toHaveProperty('title')
        expect(chapter).toHaveProperty('volume')
      })
    })

    it('should have sequential chapter numbers', () => {
      CHAPTERS.forEach((chapter, index) => {
        expect(chapter.number).toBe(index + 1)
      })
    })

    it('should have correct chapter IDs', () => {
      expect(CHAPTERS[0].id).toBe('chapter_01')
      expect(CHAPTERS[1].id).toBe('chapter_02')
      expect(CHAPTERS[5].id).toBe('chapter_06')
    })
  })

  describe('CHAPTER_MAP', () => {
    it('should be a Map', () => {
      expect(CHAPTER_MAP).toBeInstanceOf(Map)
    })

    it('should contain all chapters', () => {
      expect(CHAPTER_MAP.size).toBe(CHAPTERS.length)
    })

    it('should map chapter IDs to chapter info', () => {
      const chapter = CHAPTER_MAP.get('chapter_01')
      expect(chapter).toBeDefined()
      expect(chapter?.title).toBe('山城内耗与山野契机')
    })
  })

  describe('Helper Functions', () => {
    describe('getChapterTitle', () => {
      it('should return correct title for valid chapter ID', () => {
        expect(getChapterTitle('chapter_01')).toBe('山城内耗与山野契机')
        expect(getChapterTitle('chapter_06')).toBe('山野落幕')
      })

      it('should return chapter ID for unknown chapter', () => {
        expect(getChapterTitle('chapter_99')).toBe('chapter_99')
      })
    })

    describe('getChapterNumber', () => {
      it('should return correct number for valid chapter ID', () => {
        expect(getChapterNumber('chapter_01')).toBe(1)
        expect(getChapterNumber('chapter_06')).toBe(6)
      })

      it('should return 0 for unknown chapter', () => {
        expect(getChapterNumber('chapter_99')).toBe(0)
      })
    })

    describe('getNextChapterId', () => {
      it('should return next chapter ID', () => {
        expect(getNextChapterId('chapter_01')).toBe('chapter_02')
        expect(getNextChapterId('chapter_05')).toBe('chapter_06')
      })

      it('should return null for last chapter', () => {
        expect(getNextChapterId('chapter_06')).toBeNull()
      })
    })

    describe('getPreviousChapterId', () => {
      it('should return previous chapter ID', () => {
        expect(getPreviousChapterId('chapter_02')).toBe('chapter_01')
        expect(getPreviousChapterId('chapter_06')).toBe('chapter_05')
      })

      it('should return null for first chapter', () => {
        expect(getPreviousChapterId('chapter_01')).toBeNull()
      })
    })
  })
})
