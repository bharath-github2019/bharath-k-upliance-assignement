import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { CssBaseline, AppBar, Toolbar, Typography, Button, Container } from '@mui/material'
import FormBuilder from './pages/FormBuilder'
import Preview from './pages/Preview'
import MyForms from './pages/MyForms'

function App(){
  return (
    <BrowserRouter>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{flex:1}}>Dynamic Form Builder</Typography>
          <Button color="inherit" component={Link} to="/create">Create</Button>
          <Button color="inherit" component={Link} to="/preview">Preview</Button>
          <Button color="inherit" component={Link} to="/myforms">My Forms</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{mt:4}}>
        <Routes>
          <Route path="/" element={<FormBuilder/>} />
          <Route path="/create" element={<FormBuilder/>} />
          <Route path="/preview" element={<Preview/>} />
          <Route path="/myforms" element={<MyForms/>} />
          <Route path="*" element={<FormBuilder/>} />
        </Routes>
      </Container>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
