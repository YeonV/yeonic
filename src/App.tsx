import { useMemo } from 'react'
import { ThemeProvider, createTheme } from '@mui/material'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import useStore from './store/useStore'
import Navigation from './Navigation'
import './App.css'
import Download from './pages/Download'
import Features from './pages/Features'

function App() {
  const darkMode = useStore((state) => state.darkMode)
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light'
        }
      }),
    [darkMode]
  )

  return (
    <ThemeProvider theme={theme}>
      <HashRouter basename='/'>
        <main style={{ backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff', flexGrow: 1, width: '100%' }}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/download' element={<Download />} />
            <Route path='/features' element={<Features />} />
          </Routes>
          <Navigation />
        </main>
      </HashRouter>
    </ThemeProvider>
  )
}

export default App
