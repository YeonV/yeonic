import type { ReleaseType } from './Home'
import { useEffect, useState } from 'react'
import { Stack, Typography, useTheme } from '@mui/material'
import { repository } from '../../package.json'
import Releases from '../components/Releases'
import AssetsDesktop from '../components/AssetsDesktop'
import AssetsMobile from '../components/AssetsMobile'
import logo from '/logo.svg'

function Download() {
  const theme = useTheme()
  const [releases, setReleases] = useState<ReleaseType[]>([])

  useEffect(() => {
    const get = async () => {
      const res = await fetch(`https://api.github.com/repos/${repository.url.replace('https://github.com/', '')}/releases`)
      const rel: ReleaseType[] = await res.json()
      setReleases(rel)
    }
    get()
  }, [])

  return (
    <div className='content'>
      <Stack direction={'column'} spacing={3}>
        <Stack direction={'column'} alignItems={'center'} spacing={2} color={theme.palette.text.primary}>
          <img src={logo} alt='logo' style={{ maxWidth: '90%', filter: theme.palette.mode === 'dark' ? 'invert(100%)' : '' }} />
          <Typography mt={0} variant='caption' fontSize={14}>
            Code in React Output to Web, Android, iOS, Windows, Mac, Linux
            <br />
          </Typography>
        </Stack>
        {releases[0] && <AssetsDesktop release={releases[0]} />}
        {releases[0] && <AssetsMobile release={releases[0]} />}

        <Releases releases={releases} />
      </Stack>
    </div>
  )
}

export default Download
