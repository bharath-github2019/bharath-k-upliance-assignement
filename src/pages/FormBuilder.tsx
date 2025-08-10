import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Box, Button, TextField, MenuItem, Grid, IconButton, Paper, Switch, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowUpward from '@mui/icons-material/ArrowUpward'
import ArrowDownward from '@mui/icons-material/ArrowDownward'
import { Field, FieldType, FormSchema } from '../types'
import { saveForm } from '../utils/storage'

const FIELD_TYPES: FieldType[] = ['text','number','textarea','select','radio','checkbox','date']

function blankField(type: FieldType): Field {
  return {
    id: uuidv4(),
    type,
    label: 'Untitled',
    required: false,
    defaultValue: '',
    options: type==='select' || type==='radio' ? ['Option 1','Option 2'] : undefined,
    validation: [],
    derived: null
  }
}

export default function FormBuilder(){
  const [fields, setFields] = useState<Field[]>([])
  const [nameOpen, setNameOpen] = useState(false)
  const [formName, setFormName] = useState('')

  function add(type: FieldType){
    setFields(prev=>[...prev, blankField(type)])
  }
  function remove(id: string){
    setFields(prev=>prev.filter(f=>f.id!==id))
  }
  function move(i: number, dir: -1|1){
    const j = i+dir
    if(j<0||j>=fields.length) return
    const copy = [...fields]
    const [item] = copy.splice(i,1)
    copy.splice(j,0,item)
    setFields(copy)
  }
  function updateField(id: string, patch: Partial<Field>){
    setFields(prev=>prev.map(f=> f.id===id ? {...f, ...patch} : f))
  }

  function save(){
    if(!formName) { alert('Provide form name'); return }
    const schema: FormSchema = {
      id: uuidv4(),
      name: formName,
      createdAt: new Date().toISOString(),
      fields
    }
    saveForm(schema)
    setNameOpen(false)
    setFormName('')
    alert('Saved to localStorage')
  }

  return (
    <Box>
      <Box sx={{mb:2}}>
        <TextField select label="Add Field" onChange={(e)=>add(e.target.value as FieldType)} value="">
          {FIELD_TYPES.map(t=> <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
        <Button sx={{ml:2}} variant="contained" onClick={()=>setNameOpen(true)} disabled={fields.length===0}>Save Form</Button>
      </Box>

      <Grid container spacing={2}>
        {fields.map((f, idx)=>(
          <Grid item xs={12} key={f.id}>
            <Paper sx={{p:2}}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={6}>
                  <TextField fullWidth label="Label" value={f.label} onChange={(e)=>updateField(f.id,{label:e.target.value})} />
                </Grid>
                <Grid item>
                  <FormControlLabel control={<Switch checked={!!f.required} onChange={(e)=>updateField(f.id,{required:e.target.checked})} />} label="Required" />
                </Grid>
                <Grid item>
                  <IconButton onClick={()=>move(idx,-1)}><ArrowUpward/></IconButton>
                </Grid>
                <Grid item>
                  <IconButton onClick={()=>move(idx,1)}><ArrowDownward/></IconButton>
                </Grid>
                <Grid item>
                  <IconButton color="error" onClick={()=>remove(f.id)}><DeleteIcon/></IconButton>
                </Grid>

                <Grid item xs={12} sx={{mt:1}}>
                  <TextField fullWidth label="Default value" value={f.defaultValue || ''} onChange={(e)=>updateField(f.id,{defaultValue:e.target.value})} />
                </Grid>

                <Grid item xs={12}>
                  <TextField fullWidth label="Options (comma separated, only for select/radio/checkbox)" value={(f.options||[]).join(',')} onChange={(e)=>updateField(f.id,{options: e.target.value.split(',').map(s=>s.trim())})} />
                </Grid>

                <Grid item xs={12}>
                  <TextField fullWidth label="Derived expression (JS) - reference parents as fields['id']" value={f.derived?.expression||''} onChange={(e)=>updateField(f.id,{derived: {...f.derived, expression: e.target.value}})} />
                </Grid>

                <Grid item xs={12}>
                  <TextField fullWidth label="Derived parents (comma separated IDs)" value={(f.derived?.parents||[]).join(',')} onChange={(e)=>updateField(f.id,{derived: {...f.derived, parents: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)}})} />
                </Grid>

              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={nameOpen} onClose={()=>setNameOpen(false)}>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Form name" value={formName} onChange={(e)=>setFormName(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setNameOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
