import { Button, Card, CardContent, Stack, useMediaQuery } from '@mui/material'
import Asset from './Asset'
import Mac from './Os/Mac'
import { Android } from '@mui/icons-material'
import type { ReleaseType } from '../pages/Home'

const AssetsMobile = ({ release }: { release: ReleaseType }) => {
  const mobile = useMediaQuery('(max-width: 600px)')
  return (
    <Card>
      <CardContent>
        <Stack direction={mobile ? 'column' : 'row'} justifyContent={'space-between'}>
          <Stack
            direction={mobile ? 'row' : 'column'}
            flex={1}
            alignItems={'center'}
            sx={{
              borderRight: mobile ? 0 : '1px solid #999',
              borderBottom: mobile ? '1px solid #999' : 0
            }}
          >
            <Mac style={{ width: 80, height: 80, marginBottom: '0rem' }} />
            <Stack direction={'column'}>
              {release.assets.filter((as) => as.name.includes('.ipa')).length > 0 ? (
                release.assets.filter((as) => as.name.includes('.ipa')).map((a) => <Asset asset={a} />)
              ) : (
                <Button size='small' disabled>
                  No IPA yet
                </Button>
              )}
            </Stack>
          </Stack>

          <Stack direction={mobile ? 'row' : 'column'} flex={1} alignItems={'center'}>
            <Android style={{ width: 80, height: 80, marginBottom: '0rem' }} />
            <Stack direction={'column'}>
              {release.assets
                .filter((as) => as.name.includes('android'))
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

export default AssetsMobile
