import { useEffect } from 'react'
import logo from '/logo.svg'
import { Device } from '@capacitor/device'
import { Box, Grid, Stack, Typography, useTheme } from '@mui/material'
import useStore from '../store/useStore'
import { ZeroConf, ZeroConfWatchResult } from 'capacitor-zeroconf'
import Badge from '../components/Badge'
import { ArrowDownward } from '@mui/icons-material'

const techs = ['TypeScript', 'React', 'MaterialUI', 'Zustand', 'ReactRouter', 'Eslint', 'Vite', 'Electron', 'Capacitor']
const output = ['Web', 'Android', 'iOS', 'Windows', 'Mac', 'Linux']
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

  const info = useStore((state) => state.info)
  const setInfo = useStore((state) => state.setInfo)
  const addService = useStore((state) => state.addService)

  useEffect(() => {
    logDeviceInfo().then((i) => {
      setInfo(i)
    })
    console.log('ZeroConf.watch')
    ZeroConf.watch(
      {
        type: '_http._tcp.',
        domain: 'local.'
      },
      (res) => {
        console.log('watch YYY', res)
        if (res.action === 'resolved') addService(res.service)
      }
    ).then((res) => console.log('watched', res))
    ZeroConf.addListener('discover', (result: ZeroConfWatchResult) => console.log(result))
  }, [])

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const subline = (window as any).Capacitor.isNative ? `native app on ${info.operatingSystem}` : `${info.operatingSystem} on web`

  return (
    <div className='content'>
      <Stack direction={'column'} spacing={3}>
        <Stack direction={'column'} alignItems={'center'} spacing={4} color={theme.palette.text.primary}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 2, marginBottom: 5 }}>
            <img src={logo} alt='logo' style={{ maxWidth: '90%', filter: theme.palette.mode === 'dark' ? 'invert(100%)' : '' }} />
          </Box>
          <Typography mt={0} variant='caption' fontSize={14}>
            Code in React Output to Web, Android, iOS, Windows, Mac, Linux
            <br />
            <span style={{ color: '#999' }}>running in {subline}</span>
          </Typography>
        </Stack>
        <Grid container justifyContent={'center'} spacing={1} maxWidth={550}>
          {techs.map((t) => (
            <Grid item key={t}>
              <Badge text={t} />
            </Grid>
          ))}
        </Grid>
        <ArrowDownward style={{ width: 70, height: 70, margin: '2rem auto 0', color: theme.palette.text.secondary }} />
        <Grid container justifyContent={'center'} spacing={1} maxWidth={550}>
          {output.map((t) => (
            <Grid item key={t}>
              <Badge text={t} icon={['iOS', 'Mac'].indexOf(t) > -1 ? 'Apple' : t === 'Web' ? 'Chrome' : t} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </div>
  )
}

export default Home
