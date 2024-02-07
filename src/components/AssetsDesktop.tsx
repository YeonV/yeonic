import { Card, CardContent, Stack } from '@mui/material'
import { ReleaseType } from '../App'
import Asset from './Asset'
import Win from './Os/Win'
import Mac from './Os/Mac'
import Linux from './Os/Linux'

const AssetsDesktop = ({ release }: { release: ReleaseType }) => {
   return (
    <Card>
      <CardContent>
    <Stack direction={'row'} justifyContent={'space-between'}>
    <Stack direction={'column'} flex={1} alignItems={'center'}>
      <Win style={{ width: 100, height: 100, marginBottom: '1rem' }} />
    {release.assets.filter((as) => as.name.includes('exe') || as.name.includes('win')).map((a) => (
      <Asset asset={a} />
    ))}
    </Stack>
    <Stack direction={'column'} flex={1} alignItems={'center'} sx={{ 
      borderLeft: '1px solid #999',
      borderRight: '1px solid #999',
    }}>
      <Mac style={{ width: 100, height: 100, marginBottom: '1rem' }} />
    {release.assets.filter((as) => as.name.includes('dmg') || as.name.includes('mac')).map((a) => (
      <Asset asset={a} />
    ))}
    </Stack>

    <Stack direction={'column'} flex={1} alignItems={'center'} >
      <Linux style={{ width: 100, height: 100, marginBottom: '1rem' }} />
    {release.assets.filter((as) => as.name.includes('AppImage') || as.name.includes('snap')).map((a) => (
      <Asset asset={a} />
    ))}
    </Stack>
  </Stack>
  </CardContent>
  </Card>
  )
}

export default AssetsDesktop
