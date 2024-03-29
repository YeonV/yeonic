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
import { Capacitor } from '@capacitor/core'

function App() {
  const darkMode = useStore((s) => s.ui.darkMode)
  const theme = useMemo(
    () =>
      createTheme({
        ...baseTheme,
        palette: {
          ...baseTheme.palette,
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#005aa0'
          },
          secondary: {
            main: '#5475a0'
          }
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
            {!Capacitor.isNativePlatform() && <Route path='/' element={<Home />} />}
            {Capacitor.isNativePlatform() && <Route path='/' element={<Dashboard />} />}
            <Route path='/download' element={<Download />} />
            <Route path='/features' element={<Features />} />
            {Capacitor.isNativePlatform() && <Route path='/about' element={<Home />} />}
          </Routes>
          <Navigation />
        </main>
      </HashRouter>
    </ThemeProvider>
  )
}

export default App
