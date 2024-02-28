import { useEffect } from 'react'
import { Device } from '@capacitor/device'
import { Box, Grid, Stack, Typography, useTheme } from '@mui/material'
import { Capacitor } from '@capacitor/core'
import useStore from '../store/useStore'
import logo from '/logo.svg'
import Badge from '../components/Badge'

const techs = ['TypeScript', 'React', 'MaterialUI', 'Zustand', 'ReactRouter', 'Eslint', 'Vite', 'Electron', 'Capacitor']
const output = ['Web', 'Android', 'iOS', 'Windows', 'Mac', 'Linux']

const logDeviceInfo = async () => await Device.getInfo()

function Home() {
  const theme = useTheme()
  const info = useStore((state) => state.info)
  const setInfo = useStore((state) => state.setInfo)

  useEffect(() => {
    logDeviceInfo().then((i) => {
      setInfo(i)
    })
  }, [])

  return (
    <div className='content'>
      <Stack direction={'column'} spacing={3}>
        <Grid container justifyContent={'center'} spacing={1} maxWidth={550}>
          {techs.map((t) => (
            <Grid item key={t}>
              <Badge text={t} />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 2, marginBottom: 5 }}>
          <img src={logo} alt='logo' style={{ maxWidth: '90%', filter: theme.palette.mode === 'dark' ? 'invert(100%)' : '' }} />
        </Box>
        <Grid container justifyContent={'center'} spacing={1} maxWidth={550}>
          {output.map((t) => (
            <Grid item key={t}>
              <Badge text={t} icon={['iOS', 'Mac'].indexOf(t) > -1 ? 'Apple' : t === 'Web' ? 'GoogleChrome' : t} />
            </Grid>
          ))}
        </Grid>
        <Typography mt={0} p={1} variant='caption' fontSize={14}>
          <span style={{ color: '#999' }}>
            {Capacitor.isNativePlatform() ? 'native app on ' : 'web on '}
            {info.operatingSystem}!
          </span>
        </Typography>
      </Stack>
    </div>
  )
}

export default Home
