import { Dashboard, DeveloperMode, Download, Home } from '@mui/icons-material'
import { Badge, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { version, repository } from '../../package.json'
import semver from 'semver'
import { ReleaseType } from '../interfaces/ReleaseType'
import { Capacitor } from '@capacitor/core'

const Navigation = () => {
  const navigate = useNavigate()
  const [value, setValue] = useState(0)
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
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_event, newValue) => {
          setValue(newValue)
        }}
      >
        {!Capacitor.isNativePlatform() && <BottomNavigationAction onClick={() => navigate('/')} label='Home' icon={<Home />} />}
        {Capacitor.isNativePlatform() && (
          <BottomNavigationAction
            onClick={() => navigate('/')}
            label={'Dashboard'}
            icon={
              <Badge invisible={!releases[0] || !semver.lt(version, releases[0].tag_name)} badgeContent={'!'} color='primary'>
                <Dashboard />
              </Badge>
            }
          />
        )}
        {!Capacitor.isNativePlatform() && (
          <BottomNavigationAction
            onClick={() => navigate('/download')}
            label={!releases[0] || !semver.lt(version, releases[0].tag_name) ? 'Download' : 'Update'}
            icon={
              <Badge invisible={!releases[0] || !semver.lt(version, releases[0].tag_name)} badgeContent={'!'} color='primary'>
                <Download />
              </Badge>
            }
          />
        )}
        {Capacitor.isNativePlatform() && !(!releases[0] || !semver.lt(version, releases[0].tag_name)) && (
          <BottomNavigationAction
            onClick={() => navigate('/download')}
            label={'Update'}
            icon={
              <Badge badgeContent={'!'} color='primary'>
                <Download />
              </Badge>
            }
          />
        )}
        {!Capacitor.isNativePlatform() && <BottomNavigationAction onClick={() => navigate('/features')} label='Features' icon={<DeveloperMode />} />}
      </BottomNavigation>
    </Paper>
  )
}

export default Navigation
