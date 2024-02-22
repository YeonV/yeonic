import type { ReleaseType } from '../interfaces/ReleaseType'
import { useEffect, useState } from 'react'
import { Alert, Stack } from '@mui/material'
import { repository, version } from '../../package.json'
import AllReleases from '../components/AllReleases'
import AssetsDesktop from '../components/Assets/AssetsDesktop'
import AssetsMobile from '../components/Assets/AssetsMobile'
import semver from 'semver'

function Download() {
  const [releases, setReleases] = useState<ReleaseType[]>([])

  useEffect(() => {
    const get = async () => {
      const res = await fetch(`https://api.github.com/repos/${repository.url.replace('https://github.com/', '')}/releases`)
      const rel: ReleaseType[] = await res.json()
      setReleases(rel)
    }
    get()
  }, [])

  if (releases.length === 0) return <div>Loading...</div>
  return (
    <div className='content'>
      {semver.lt(version, releases[0].tag_name) && (
        <>
          <Alert severity='info'>
            Update available. Version {releases[0].tag_name} is available. You are currently on {version}.
          </Alert>
        </>
      )}
      <Stack direction={'column'} spacing={3} paddingTop={3}>
        {releases[0] && <AssetsDesktop release={releases[0]} />}
        {releases[0] && <AssetsMobile release={releases[0]} />}

        <AllReleases releases={releases} />
      </Stack>
    </div>
  )
}

export default Download
