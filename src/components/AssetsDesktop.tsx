import { Card, CardContent, Stack, useMediaQuery } from '@mui/material'
import Asset from './Asset'
import Win from './Os/Win'
import Mac from './Os/Mac'
import Linux from './Os/Linux'
import type { ReleaseType } from '../pages/Home'

const AssetsDesktop = ({ release }: { release: ReleaseType }) => {
  const mobile = useMediaQuery('(max-width: 600px)')
  return (
    <Card>
      <CardContent>
        <Stack direction={mobile ? 'column' : 'row'} justifyContent={'space-between'}>
          <Stack direction={mobile ? 'row' : 'column'} flex={1} alignItems={'center'}>
            <Win style={{ width: 100, height: 100, marginBottom: '1rem' }} />
            <Stack direction={'column'}>
              {release.assets
                .filter((as) => as.name.includes('exe') || as.name.includes('win'))
                .map((a) => (
                  <Asset key={a.name} asset={a} />
                ))}
            </Stack>
          </Stack>
          <Stack
            direction={mobile ? 'row' : 'column'}
            flex={1}
            alignItems={'center'}
            sx={{
              borderLeft: mobile ? 0 : '1px solid #999',
              borderRight: mobile ? 0 : '1px solid #999',
              borderTop: mobile ? '1px solid #999' : 0,
              borderBottom: mobile ? '1px solid #999' : 0
            }}
          >
            <Mac style={{ width: 100, height: 100, marginBottom: '1rem' }} />
            <Stack direction={'column'}>
              {release.assets
                .filter((as) => as.name.includes('dmg') || as.name.includes('mac'))
                .map((a) => (
                  <Asset key={a.name} asset={a} />
                ))}
            </Stack>
          </Stack>

          <Stack direction={mobile ? 'row' : 'column'} flex={1} alignItems={'center'}>
            <Linux style={{ width: 100, height: 100, marginBottom: '1rem' }} />
            <Stack direction={'column'}>
              {release.assets
                .filter((as) => as.name.includes('AppImage') || as.name.includes('snap'))
                .map((a) => (
                  <Asset key={a.name} asset={a} />
                ))}
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default AssetsDesktop
