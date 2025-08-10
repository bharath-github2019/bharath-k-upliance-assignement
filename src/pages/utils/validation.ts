import { Field, ValidationRule } from '../types'

export function runValidations(field: Field, value: any){
  const errors: string[] = []
  const rules = field.validation || []
  if(field.required){
    if(value === undefined || value === null || value === '') errors.push('Field is required')
  }
  for(const r of rules){
    if(r.type === 'notEmpty'){
      if(value === '' || value === null || value === undefined) errors.push('Cannot be empty')
    } else if(r.type === 'minLength'){
      if(typeof value === 'string' && value.length < r.value) errors.push('Minimum length '+r.value)
    } else if(r.type === 'maxLength'){
      if(typeof value === 'string' && value.length > r.value) errors.push('Maximum length '+r.value)
    } else if(r.type === 'email'){
      const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
      if(typeof value === 'string' && !re.test(value)) errors.push('Invalid email')
    } else if(r.type === 'password'){
      if(typeof value === 'string'){
        if(r.min && value.length < r.min) errors.push('Password must be at least '+r.min+' chars')
        if(r.requireNumber && !/\d/.test(value)) errors.push('Password must contain a number')
      }
    }
  }
  return errors
}
