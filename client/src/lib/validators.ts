export interface ValidationError {
  key: string
  values?: Record<string, unknown>
}
export type Validator = (value: string) => ValidationError | null

export const required: Validator = v => (v ? null : { key: 'validation.required' })

export const minLength =
  (count: number): Validator =>
  v =>
    v.length >= count ? null : { key: 'validation.min', values: { count } }

export const positiveNumber: Validator = v =>
  v !== '' && !Number.isNaN(Number(v)) && Number(v) >= 0 ? null : { key: 'validation.number' }

export const compose =
  (...validators: Validator[]): Validator =>
  v => {
    for (const validate of validators) {
      const error = validate(v)
      if (error) return error
    }
    return null
  }
