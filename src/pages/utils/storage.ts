import { FormSchema } from '../types'

const KEY = 'dynamic_forms_v1'

export function saveForm(schema: FormSchema){
  const all = loadAll()
  all.push(schema)
  localStorage.setItem(KEY, JSON.stringify(all))
}

export function loadAll(): FormSchema[] {
  const raw = localStorage.getItem(KEY)
  if(!raw) return []
  try { return JSON.parse(raw) as FormSchema[] } catch(e){ return [] }
}

export function loadById(id: string): FormSchema | undefined {
  return loadAll().find(s=>s.id===id)
}
