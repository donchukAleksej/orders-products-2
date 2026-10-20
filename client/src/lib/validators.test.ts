import { describe, expect, it } from 'vitest'
import { compose, minLength, positiveNumber, required } from './validators'

describe('validators', () => {
  it('required', () => {
    expect(required('')).toEqual({ key: 'validation.required' })
    expect(required('x')).toBeNull()
  })

  it('minLength', () => {
    expect(minLength(3)('ab')).toEqual({ key: 'validation.min', values: { count: 3 } })
    expect(minLength(3)('abc')).toBeNull()
  })

  it('positiveNumber', () => {
    expect(positiveNumber('')).not.toBeNull()
    expect(positiveNumber('abc')).not.toBeNull()
    expect(positiveNumber('-1')).not.toBeNull()
    expect(positiveNumber('0')).toBeNull()
    expect(positiveNumber('12.5')).toBeNull()
  })

  it('compose returns the first error', () => {
    const validate = compose(required, minLength(3))
    expect(validate('')?.key).toBe('validation.required')
    expect(validate('ab')?.key).toBe('validation.min')
    expect(validate('abc')).toBeNull()
  })
})
