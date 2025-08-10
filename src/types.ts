export type FieldType = 'text'|'number'|'textarea'|'select'|'radio'|'checkbox'|'date'

export type ValidationRule =
  | { type: 'notEmpty' }
  | { type: 'minLength'; value: number }
  | { type: 'maxLength'; value: number }
  | { type: 'email' }
  | { type: 'password'; min?: number; requireNumber?: boolean }

export type Field = {
  id: string
  type: FieldType
  label: string
  required?: boolean
  defaultValue?: any
  options?: string[] // for select/radio/checkbox
  validation?: ValidationRule[]
  derived?: {
    parents: string[]
    expression: string // simple JS expression where parent fields can be referenced as fields['id']
  } | null
}

export type FormSchema = {
  id: string
  name: string
  createdAt: string
  fields: Field[]
}
