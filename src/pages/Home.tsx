import { useEffect, useState } from 'react'
import logo from '/logo.svg'
import { Device, DeviceInfo } from '@capacitor/device'
import { Button, Card, CardContent, Grid, Stack, Typography, useTheme } from '@mui/material'
import useStore from '../store/useStore'
import { ZeroConf, ZeroConfWatchResult } from 'capacitor-zeroconf'
import { repository } from '../../package.json'
import Releases from '../components/Releases'
import Badge from '../components/Badge'
import AssetsDesktop from '../components/AssetsDesktop'
import AssetsMobile from '../components/AssetsMobile'

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
function Home() {
  const theme = useTheme()
  const [releases, setReleases] = useState<ReleaseType[]>([])
  const darkMode = useStore((state) => state.darkMode)
  const setDarkMode = useStore((state) => state.setDarkMode)
  const bears = useStore((state) => state.bears)
  const setBears = useStore((state) => state.setBears)
  const [zeroconfLog, setZeroconfLog] = useState('')
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

  useEffect(() => {
    const get = async () => {
      const res = await fetch(`https://api.github.com/repos/${repository.url.replace('https://github.com/', '')}/releases`)
      const rel: ReleaseType[] = await res.json()
      // console.log(releases_with_pre)
      // const releases: ReleaseType[] = releases_with_pre.filter((r: ReleaseType) => r.prerelease === false)
      setReleases(rel)
    }
    get()
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
        {releases[0] && <AssetsDesktop release={releases[0]} />}
        {releases[0] && <AssetsMobile release={releases[0]} />}

        <Card sx={{ display: 'none' }}>
          <CardContent>
            <Typography variant='h6'>Zeroconf</Typography>
            <Typography>{zeroconfLog}</Typography>
          </CardContent>
        </Card>

        <Releases releases={releases} />
        <Stack direction={'row'} justifyContent={'center'} spacing={2}>
          <Button variant='contained' onClick={() => setBears(bears + 1)}>
            bears is {bears}
          </Button>
          <Button variant='contained' onClick={() => setDarkMode(!darkMode)}>
            {theme.palette.mode} mode
          </Button>
        </Stack>
      </Stack>
    </div>
  )
}

export default Home
