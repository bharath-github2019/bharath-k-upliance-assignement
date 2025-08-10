import React from 'react'
import { loadAll } from '../utils/storage'
import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function MyForms(){
  const forms = loadAll()
  const nav = useNavigate()
  if(forms.length===0) return <Typography>No saved forms</Typography>
  return (
    <Paper sx={{p:2}}>
      <List>
        {forms.map(f=>(
          <ListItem key={f.id} button onClick={()=>nav('/preview')}>
            <ListItemText primary={f.name} secondary={new Date(f.createdAt).toLocaleString()} />
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}
