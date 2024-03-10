import { useMemo } from 'react'
import { ThemeProvider, createTheme } from '@mui/material'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { baseTheme } from './themes/baseTheme'
import Home from './pages/Home'
import useStore from './store/useStore'
import Navigation from './components/Navigation'
import Download from './pages/Download'
import Features from './pages/Features'
import './App.css'
import TopBar from './components/TopBar'
import Dashboard from './pages/Dashboard'

function App() {
  const darkMode = useStore((s) => s.ui.darkMode)
  const theme = useMemo(
    () =>
      createTheme({
        ...baseTheme,
        palette: {
          ...baseTheme.palette,
          mode: darkMode ? 'dark' : 'light'
        }
      }),
    [darkMode]
  )

  return (
    <ThemeProvider theme={theme}>
      <HashRouter basename='/'>
        <main style={{ backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff', flexGrow: 1, width: '100%' }}>
          <TopBar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/dashboard' element={<Dashboard />} />
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
