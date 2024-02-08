import { DeveloperMode, Download, Home } from '@mui/icons-material'
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Navigation = () => {
  const navigate = useNavigate()
  const [value, setValue] = useState(0)

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_event, newValue) => {
          setValue(newValue)
        }}
      >
        <BottomNavigationAction onClick={() => navigate('/')} label='Home' icon={<Home />} />
        <BottomNavigationAction onClick={() => navigate('/download')} label='Download' icon={<Download />} />
        <BottomNavigationAction onClick={() => navigate('/features')} label='Features' icon={<DeveloperMode />} />
      </BottomNavigation>
    </Paper>
  )
}

export default Navigation
