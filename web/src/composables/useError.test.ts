import { describe, it, expect, beforeEach } from 'vitest'
import { useError } from './useError'

describe('useError', () => {
  beforeEach(() => {
    // 清除错误
    const { clearErrors } = useError()
    clearErrors()
  })

  it('should initialize with empty errors', () => {
    const { errors } = useError()
    expect(errors.value).toEqual([])
  })

  it('should add error', () => {
    const { errors, addError } = useError()

    addError('Test error', 'error', 'Error details')

    expect(errors.value).toHaveLength(1)
    expect(errors.value[0].message).toBe('Test error')
    expect(errors.value[0].type).toBe('error')
    expect(errors.value[0].details).toBe('Error details')
  })

  it('should add warning', () => {
    const { errors, addWarning } = useError()

    addWarning('Test warning')

    expect(errors.value).toHaveLength(1)
    expect(errors.value[0].message).toBe('Test warning')
    expect(errors.value[0].type).toBe('warning')
  })

  it('should add info', () => {
    const { errors, addInfo } = useError()

    addInfo('Test info')

    expect(errors.value).toHaveLength(1)
    expect(errors.value[0].message).toBe('Test info')
    expect(errors.value[0].type).toBe('info')
  })

  it('should remove error by id', () => {
    const { errors, addError, removeError } = useError()

    addError('Error 1')
    addError('Error 2')

    expect(errors.value).toHaveLength(2)

    // 新错误在前面，所以 errors[0] 是 Error 2
    const errorId = errors.value[0].id
    removeError(errorId)

    expect(errors.value).toHaveLength(1)
    expect(errors.value[0].message).toBe('Error 1')
  })

  it('should clear all errors', () => {
    const { errors, addError, clearErrors } = useError()

    addError('Error 1')
    addError('Error 2')
    addError('Error 3')

    expect(errors.value).toHaveLength(3)

    clearErrors()

    expect(errors.value).toEqual([])
  })

  it('should limit error count', () => {
    const { errors, addError } = useError()

    for (let i = 0; i < 60; i++) {
      addError(`Error ${i}`)
    }

    expect(errors.value).toHaveLength(50)
    expect(errors.value[0].message).toBe('Error 59')
  })

  it('should generate unique ids', () => {
    const { addError, errors } = useError()

    addError('Error 1')
    addError('Error 2')

    expect(errors.value[0].id).not.toBe(errors.value[1].id)
  })

  it('should have timestamp', () => {
    const { addError, errors } = useError()

    const before = Date.now()
    addError('Test error')
    const after = Date.now()

    expect(errors.value[0].timestamp).toBeGreaterThanOrEqual(before)
    expect(errors.value[0].timestamp).toBeLessThanOrEqual(after)
  })

  it('should wrap async function with error handling', async () => {
    const { withErrorHandling, errors } = useError()

    const failingFn = async () => {
      throw new Error('Async error')
    }

    const wrappedFn = withErrorHandling(failingFn, 'Operation failed')

    await expect(wrappedFn()).rejects.toThrow('Async error')
    expect(errors.value).toHaveLength(1)
    expect(errors.value[0].message).toContain('Operation failed')
    expect(errors.value[0].message).toContain('Async error')
  })

  it('should wrap sync function with error handling', () => {
    const { withSyncErrorHandling, errors } = useError()

    const failingFn = () => {
      throw new Error('Sync error')
    }

    const wrappedFn = withSyncErrorHandling(failingFn, 'Operation failed')

    expect(() => wrappedFn()).toThrow('Sync error')
    expect(errors.value).toHaveLength(1)
    expect(errors.value[0].message).toContain('Operation failed')
    expect(errors.value[0].message).toContain('Sync error')
  })
})
