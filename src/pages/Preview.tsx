import React, { useEffect, useMemo, useState } from 'react'
import { loadAll, loadById } from '../utils/storage'
import { Box, Button, MenuItem, TextField, Typography, Paper, Grid } from '@mui/material'
import { runValidations } from '../utils/validation'
import { Field } from '../types'

function evaluateDerived(expr: string, fieldsMap: Record<string, any>){
  try{
    const fn = new Function('fields', 'with(fields){ return ('+expr+') }')
    return fn(fieldsMap)
  } catch(e){
    return ''
  }
}

export default function Preview(){
  const forms = loadAll()
  const [selected, setSelected] = useState(forms[0]?.id || '')
  const schema = useMemo(()=> forms.find(f=>f.id===selected), [forms, selected])
  const [values, setValues] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string,string[]>>({})

  useEffect(()=>{
    // init defaults
    if(schema){
      const map: Record<string, any> = {}
      schema.fields.forEach(f=> map[f.id] = f.defaultValue ?? '')
      setValues(map)
    }
  },[schema])

  useEffect(()=>{
    // recompute derived fields
    if(!schema) return
    const map = {...values}
    schema.fields.forEach(f=>{
      if(f.derived){
        map[f.id] = evaluateDerived(f.derived.expression, map)
      }
    })
    setValues(map)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[values && Object.keys(values).length]) // run when values change

  function onChange(id: string, val: any){
    setValues(prev=> ({...prev, [id]: val}))
    // validate single
    const f = schema?.fields.find(ff=>ff.id===id)
    if(f){
      const errs = runValidations(f, val)
      setErrors(prev=> ({...prev, [id]: errs}))
    }
  }

  if(forms.length===0) return <Typography>No forms saved yet. Create one first.</Typography>

  return (
    <Box>
      <TextField select label="Choose form" value={selected} onChange={(e)=>setSelected(e.target.value)}>
        {forms.map(f=> <MenuItem key={f.id} value={f.id}>{f.name} — {new Date(f.createdAt).toLocaleString()}</MenuItem>)}
      </TextField>

      {schema && (
        <Paper sx={{p:2, mt:2}}>
          <Typography variant="h6">{schema.name}</Typography>
          <Grid container spacing={2} sx={{mt:1}}>
            {schema.fields.map(f=>{
              const err = errors[f.id] || []
              const val = values[f.id] ?? ''
              return (
                <Grid item xs={12} key={f.id}>
                  {f.type==='text' && <TextField fullWidth label={f.label} value={val} onChange={(e)=>onChange(f.id, e.target.value)} helperText={err.join(', ')} error={err.length>0} />}
                  {f.type==='number' && <TextField fullWidth type="number" label={f.label} value={val} onChange={(e)=>onChange(f.id, e.target.value)} helperText={err.join(', ')} error={err.length>0} />}
                  {f.type==='textarea' && <TextField fullWidth multiline label={f.label} value={val} onChange={(e)=>onChange(f.id, e.target.value)} helperText={err.join(', ')} error={err.length>0} />}
                  {f.type==='date' && <TextField fullWidth type="date" label={f.label} value={val} onChange={(e)=>onChange(f.id, e.target.value)} InputLabelProps={{shrink:true}} helperText={err.join(', ')} error={err.length>0} />}
                  {(f.type==='select' || f.type==='radio') && <TextField select fullWidth label={f.label} value={val} onChange={(e)=>onChange(f.id, e.target.value)} helperText={err.join(', ')} error={err.length>0}>
                    {(f.options||[]).map(o=> <MenuItem key={o} value={o}>{o}</MenuItem>)}
                  </TextField>}
                  {f.type==='checkbox' && <div>
                    <label>
                      <input type="checkbox" checked={!!val} onChange={(e)=>onChange(f.id, e.target.checked)} /> {f.label}
                    </label>
                    {err.length>0 && <div style={{color:'red'}}>{err.join(', ')}</div>}
                  </div>}
                </Grid>
              )
            })}
          </Grid>
        </Paper>
      )}
    </Box>
  )
}
