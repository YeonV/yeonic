import { Button, Card, CardContent, Stack, useMediaQuery } from '@mui/material'
import Asset from './Asset'
import Mac from '../Os/Mac'
import { Android } from '@mui/icons-material'
import type { ReleaseType } from '../../interfaces/ReleaseType'

const AssetsMobile = ({ release }: { release: ReleaseType }) => {
  const mobile = useMediaQuery('(max-width: 680px)')
  return (
    <Card>
      <CardContent>
        <Stack direction={mobile ? 'column' : 'row'} justifyContent={'space-between'}>
          <Stack
            direction={mobile ? 'row' : 'column'}
            flex={1}
            paddingLeft={2}
            paddingRight={2}
            alignItems={'center'}
            spacing={mobile ? 2 : 0}
            sx={{
              borderRight: mobile ? 0 : '1px solid #999',
              borderBottom: mobile ? '1px solid #999' : 0,
              paddingRight: mobile ? 0 : 2,
              paddingLeft: mobile ? 0 : 2
            }}
          >
            <Mac style={{ width: 80, height: 80, marginBottom: '0rem' }} />
            <Stack direction={'column'} width={'100%'}>
              {release.assets.filter((as) => as.name.includes('.ipa')).length > 0 ? (
                release.assets.filter((as) => as.name.includes('.ipa')).map((a) => <Asset asset={a} />)
              ) : (
                <Button variant='text' size='small' disabled>
                  No IPA yet
                </Button>
              )}
            </Stack>
          </Stack>

          <Stack
            direction={mobile ? 'row' : 'column'}
            flex={1}
            alignItems={'center'}
            spacing={mobile ? 2 : 0}
            sx={{
              paddingRight: mobile ? 0 : 2,
              paddingLeft: mobile ? 0 : 2
            }}
          >
            <Android style={{ width: 80, height: 80, marginBottom: '0rem' }} />
            <Stack direction={'column'} width={'100%'}>
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
