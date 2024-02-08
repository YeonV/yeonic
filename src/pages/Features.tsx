import { useEffect, useState } from 'react'
import { Device, DeviceInfo } from '@capacitor/device'
import { Button, Card, CardContent, Grid, Stack, TextField, Typography, useTheme } from '@mui/material'
import { ZeroConf, ZeroConfWatchResult } from 'capacitor-zeroconf'
import { Toast } from '@capacitor/toast'
import useStore from '../store/useStore'
import Badge from '../components/Badge'
import logo from '/logo.svg'
import Notify from 'react-desktop-notify'

const showHelloToast = async (text: string) => {
  await Toast.show({
    text: text
  })
}
const techs = ['TypeScript', 'React', 'MaterialUI', 'Zustand', 'ReactRouter', 'Eslint', 'Vite', 'Electron', 'Capacitor']
// const techs = ['React', 'Electron', 'Zustand', 'MaterialUI', 'TypeScript', 'Storybook', 'Eslint', 'Capacitor', 'Vite']

const logDeviceInfo = async () => await Device.getInfo()
export type ReleaseType = {
  name: string
  assets: {
    browser_download_url: string
    name: string
  }[]
  tag_name: string
  prerelease: boolean
}

const notify = async (title: string, text: string, icon: string) => {
  const notifyObject = new Notify()
  const permissionGranted = await notifyObject.requestPermission()
  if (permissionGranted) {
    notifyObject.setTitle(title).setText(text).setIcon(icon).show()
  }
}

function Features() {
  const theme = useTheme()
  const darkMode = useStore((state) => state.darkMode)
  const setDarkMode = useStore((state) => state.setDarkMode)
  const bears = useStore((state) => state.bears)
  const setBears = useStore((state) => state.setBears)
  const [zeroconfLog, setZeroconfLog] = useState('')
  const [noteTitle, setNoteTitle] = useState('Yeonic Notification')
  const [noteText, setNoteText] = useState('Hello world')
  const [noteIcon, setNoteIcon] = useState('https://raw.githubusercontent.com/YeonV/yeonic/main/icons/icon-512.webp')
  const [info, setInfo] = useState<DeviceInfo>({
    model: 'unknown',
    platform: 'web',
    operatingSystem: 'unknown',
    osVersion: 'unknown',
    manufacturer: 'unknown',
    isVirtual: false,
    webViewVersion: '121.0.0.0'
  })

  useEffect(() => {
    logDeviceInfo().then((i) => {
      // console.log('Device info:', i)
      setInfo(i)
    })
    console.log('ZeroConf.watch')
    ZeroConf.watch(
      {
        type: '_http._tcp.',
        domain: 'local.'
      },
      (res) => {
        console.log('watch', res)
        setZeroconfLog((z) => z + JSON.stringify(res))
      }
    ).then((res) => console.log('watched', res))
    ZeroConf.addListener('discover', (result: ZeroConfWatchResult) => console.log(result))
  }, [])

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const subline = (window as any).Capacitor.isNative ? `native app on ${info.operatingSystem}` : `${info.operatingSystem} on web`

  return (
    <div className='content'>
      <Stack direction={'column'} spacing={3}>
        <Stack direction={'column'} alignItems={'center'} spacing={2} color={theme.palette.text.primary}>
          <img src={logo} alt='logo' style={{ maxWidth: '90%', filter: theme.palette.mode === 'dark' ? 'invert(100%)' : '' }} />
          <Typography mt={0} variant='caption' fontSize={14}>
            Code in React Output to Web, Android, iOS, Windows, Mac, Linux
            <br />
            <span style={{ color: '#999' }}>running on {subline}</span>
          </Typography>
        </Stack>
        <Grid container justifyContent={'center'} spacing={1} maxWidth={550}>
          {techs.map((t) => (
            <Grid item key={t}>
              <Badge text={t} />
            </Grid>
          ))}
        </Grid>

        <Card>
          <CardContent>
            <Typography variant='h6'>Zeroconf</Typography>
            <Typography>{zeroconfLog}</Typography>
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
        <Card>
          <CardContent>
            <Stack direction={'column'} spacing={2}>
              <TextField label='Title' variant='outlined' value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} />
              <TextField label='Text' variant='outlined' value={noteText} onChange={(e) => setNoteText(e.target.value)} />
              <TextField label='Icon-URL' variant='outlined' value={noteIcon} onChange={(e) => setNoteIcon(e.target.value)} />
              <Stack direction={'row'} justifyContent={'center'} spacing={2}>
                <Button variant='contained' onClick={() => notify(noteTitle, noteText, noteIcon)}>
                  Web Desktop Notification
                </Button>
                <Button variant='contained' onClick={() => showHelloToast(noteTitle + ' - ' + noteText)}>
                  Mobile Toast
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </div>
  )
}

export default Features
