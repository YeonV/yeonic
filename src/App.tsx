import { useEffect, useMemo, useState } from 'react'
import logo from '/logo.svg'
import './App.css'
import { Device, DeviceInfo } from '@capacitor/device';
import { Button, Card, CardContent, List, ListItem, Stack, ThemeProvider, Typography, createTheme, useMediaQuery } from '@mui/material';
import { useBearStore } from './store/useStore';

const logDeviceInfo = async () => await Device.getInfo()

function App() {
  const bears = useBearStore((state) => state.bears);
  const setBears = useBearStore((state) => state.setBears);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode],
  );
  const [info, setInfo] = useState<DeviceInfo>({
    "model": "unknown",
    "platform": "web",
    "operatingSystem": "unknown",
    "osVersion": "unknown",
    "manufacturer": "unknown",
    "isVirtual": false,
    "webViewVersion": "121.0.0.0"
})

  useEffect(() => {
    logDeviceInfo().then((i) => {
      console.log('Device info:', i);
      setInfo(i);
    })
  }, []);

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const subline = (window as any).Capacitor.isNative ? `native app on ${info.operatingSystem}` : `${info.operatingSystem} on web`

  return (
    <ThemeProvider theme={theme}>
      <main style={{ backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff', flexGrow: 1}}>
      <Stack direction={'column'} alignItems={'center'} spacing={2} color={theme.palette.text.primary}>
        <img src={logo} alt="logo" style={{ maxWidth: '90%', filter: theme.palette.mode === 'dark' ? 'invert(100%)' : '' }} />
        <Typography  mt={2} variant='h6'>{subline}</Typography>
      </Stack>
      <Card>
        <CardContent>
          <Typography variant='h6'>Tech stack</Typography>
          <List>
            <ListItem>Vite + React + Typescript</ListItem>
            <ListItem>Mui + Zustand</ListItem>
            <ListItem>Electron + Capacitor</ListItem>
          </List>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant='h6'>Outputs</Typography>
          <List>
            <ListItem>Web</ListItem>
            <ListItem>Desktop: mac, windows & linux</ListItem>
            <ListItem>Mobile: ios & android</ListItem>
          </List>
        </CardContent>
      </Card>
      <Stack direction={'row'} justifyContent={'center'} spacing={2}>
        <Button variant='contained' onClick={() => setBears(bears + 1)}>
          bears is {bears}
        </Button>
        <Button variant='contained' onClick={() => setDarkMode(!darkMode)}>
        {theme.palette.mode} mode
        </Button>
        </Stack>
        </main>
      </ThemeProvider>
  )
}

export default App
